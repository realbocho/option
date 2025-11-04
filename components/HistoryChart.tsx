import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { fetchHistory, HistoryRecord } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export default function HistoryChart() {
	const { symbol, start, end } = useAppStore();
	const [data, setData] = useState<HistoryRecord[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetchHistory({ symbol, start, end, interval: '1d' });
				if (mounted) setData(res.records);
			} catch (e: any) {
				if (mounted) setError(e?.message || 'failed to load');
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [symbol, start, end]);

	if (loading) return <div>차트 로딩 중...</div>;
	if (error) return <div>에러: {error}</div>;
	if (!data.length) return <div>데이터 없음</div>;

	return (
		<div style={{ width: '100%', height: 320 }}>
			<ResponsiveContainer>
				<LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" minTickGap={24} />
					<YAxis dataKey="close" domain={['auto', 'auto']} />
					<Tooltip />
					<Line type="monotone" dataKey="close" stroke="#3b82f6" dot={false} strokeWidth={2} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
}









