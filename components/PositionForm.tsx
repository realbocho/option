import { useMemo, useState } from 'react';
import { fetchBSPrice } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export default function PositionForm() {
    const { symbol, rate, vol, divYield, simDate, setMarketParams, addPosition } = useAppStore();
	const [side, setSide] = useState<'CALL' | 'PUT'>('CALL');
	const [strike, setStrike] = useState<number>(70000);
	const [expiry, setExpiry] = useState<string>('2023-08-31');
	const [qty, setQty] = useState<number>(1);
	const [spot, setSpot] = useState<number>(70000);
	const [loading, setLoading] = useState(false);
	const [premium, setPremium] = useState<number | null>(null);
	const [greeks, setGreeks] = useState<any | null>(null);

    const ttmYears = useMemo(() => {
        const now = new Date(simDate);
        const exp = new Date(expiry);
        const days = Math.max(0, (exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return days / 365;
    }, [expiry, simDate]);

	async function priceOnce() {
		setLoading(true);
		try {
			const res = await fetchBSPrice({
				is_call: side === 'CALL',
				spot,
				strike,
				rate: rate,
				vol: vol,
				ttm_years: ttmYears,
				div_yield: divYield,
			});
			setPremium(res.price);
			setGreeks(res);
		} finally {
			setLoading(false);
		}
	}

	function submitPosition() {
		if (premium == null) return;
		addPosition({
			id: `${Date.now()}`,
			symbol,
			side,
			strike,
			expiry,
			qty,
			premium,
			delta: greeks?.delta,
			theta: greeks?.theta,
			gamma: greeks?.gamma,
			vega: greeks?.vega,
			rho: greeks?.rho,
		});
	}

	return (
		<div style={{ display: 'grid', gap: 12 }}>
			<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
				<label title="기초자산 현재가. 프리미엄 계산의 S로 사용">
					기초가격(spot)
					<input value={spot} onChange={(e) => setSpot(Number(e.target.value) || 0)} type="number" />
				</label>
				<label title="행사가(K). 콜은 S>K, 풋은 S<K에서 내재가치 존재">
					행사가(strike)
					<input value={strike} onChange={(e) => setStrike(Number(e.target.value) || 0)} type="number" />
				</label>
				<label title="만기일. 타임라인의 시뮬레이션 날짜와의 차이로 TTM 산출">
					만기(expiry)
					<input value={expiry} onChange={(e) => setExpiry(e.target.value)} type="date" />
				</label>
				<label>
					수량(qty)
					<input value={qty} onChange={(e) => setQty(Number(e.target.value) || 0)} type="number" />
				</label>
				<label title="콜=상승 베팅, 풋=하락 베팅">
					사이드
					<select value={side} onChange={(e) => setSide(e.target.value as any)}>
						<option value="CALL">콜 매수</option>
						<option value="PUT">풋 매수</option>
					</select>
				</label>
				<label title="연율 변동성(%)">
					변동성(vol)
					<input value={vol} onChange={(e) => setMarketParams({ vol: Number(e.target.value) || 0 })} type="number" step="0.01" />
				</label>
				<label title="연 이자율(%)">
					무위험이자율(rate)
					<input value={rate} onChange={(e) => setMarketParams({ rate: Number(e.target.value) || 0 })} type="number" step="0.001" />
				</label>
				<label title="연 배당수익률(%)">
					배당수익률(div)
					<input value={divYield} onChange={(e) => setMarketParams({ divYield: Number(e.target.value) || 0 })} type="number" step="0.001" />
				</label>
			</div>

			<div style={{ display: 'flex', gap: 8 }}>
				<button onClick={priceOnce} disabled={loading}>프리미엄 계산</button>
				<button onClick={submitPosition} disabled={premium == null}>포지션 진입</button>
			</div>

			{premium != null && (
				<div style={{ fontSize: 14 }}>
					프리미엄: {premium.toFixed(2)} / Δ={greeks?.delta?.toFixed(3)} Θ={greeks?.theta?.toFixed(3)} Γ={greeks?.gamma?.toFixed(3)} Vega={greeks?.vega?.toFixed(2)} Rho={greeks?.rho?.toFixed(2)}
				</div>
			)}
		</div>
	);
}


