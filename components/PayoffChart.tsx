import { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { fetchHistory } from '../api/client';
import { useAppStore } from '../store/useAppStore';

type Point = { price: number; payoff: number };

export default function PayoffChart() {
	const { symbol, start, end, positions } = useAppStore();
	const [lastClose, setLastClose] = useState<number | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const res = await fetchHistory({ symbol, start, end, interval: '1d' });
			const last = res.records.at(-1)?.close ?? null;
			if (mounted) setLastClose(last);
		})();
		return () => { mounted = false };
	}, [symbol, start, end]);

	const data: Point[] = useMemo(() => {
		const center = lastClose ?? 50000;
		const min = Math.max(1, Math.floor(center * 0.6));
		const max = Math.floor(center * 1.4);
		const xs: number[] = [];
		const steps = 60;
		for (let i = 0; i <= steps; i++) {
			xs.push(min + ((max - min) * i) / steps);
		}

		function payoffAtExpiry(S: number): number {
			return positions.reduce((acc, p) => {
				const isCall = p.side === 'CALL';
				const intrinsic = isCall ? Math.max(0, S - p.strike) : Math.max(0, p.strike - S);
				const pnlPerUnit = intrinsic - p.premium; // 매수 기준. qty<0이면 자동으로 반영
				return acc + pnlPerUnit * p.qty;
			}, 0);
		}

		return xs.map((x) => ({ price: x, payoff: payoffAtExpiry(x) }));
	}, [positions, lastClose]);

	return (
		<div style={{ width: '100%', height: 260 }}>
			<ResponsiveContainer>
				<LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="price" domain={[data[0]?.price ?? 0, data.at(-1)?.price ?? 0]} type="number" />
					<YAxis dataKey="payoff" domain={[ 'auto', 'auto' ]} />
					<Tooltip />
					<ReferenceLine y={0} stroke="#9ca3af" />
					{lastClose && <ReferenceLine x={lastClose} stroke="#f59e0b" label="현재가" />}
					<Line type="monotone" dataKey="payoff" stroke="#10b981" dot={false} strokeWidth={2} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}









