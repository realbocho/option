import { useAppStore } from '../store/useAppStore';

export default function PnLPanel() {
	const { positions, cash } = useAppStore();

	return (
		<div style={{ display: 'grid', gap: 8 }}>
			<div style={{ fontWeight: 600 }}>현금 잔액: {cash.toLocaleString()} 원</div>
			<div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>내 포지션</div>
			<div style={{ display: 'grid', gap: 6 }}>
				{positions.length === 0 && <div>포지션 없음</div>}
				{positions.map((p) => (
					<div key={p.id} style={{ padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span>{p.symbol} {p.side} K={p.strike} 만기 {p.expiry}</span>
							<span>수량 {p.qty} / 프리미엄 {p.premium.toFixed(2)}</span>
						</div>
						<div style={{ fontSize: 12, color: '#374151' }}>Δ {p.delta?.toFixed(3)} Θ {p.theta?.toFixed(3)} Γ {p.gamma?.toFixed(3)} Vega {p.vega?.toFixed(2)} Rho {p.rho?.toFixed(2)}</div>
					</div>
				))}
			</div>
		</div>
	);
}









