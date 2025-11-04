import { useEffect, useMemo, useState } from 'react';
import { fetchHistory } from '../api/client';
import { useAppStore } from '../store/useAppStore';

export default function Timeline() {
	const { symbol, start, end, simDate, setSimDate } = useAppStore();
	const [dates, setDates] = useState<string[]>([]);
	const [idx, setIdx] = useState(0);

	useEffect(() => {
		let mounted = true;
		(async () => {
			const res = await fetchHistory({ symbol, start, end, interval: '1d' });
			const d = res.records.map((r) => r.date);
			if (mounted) {
				setDates(d);
				const i = Math.max(0, d.indexOf(simDate));
				setIdx(i);
			}
		})();
		return () => { mounted = false };
	}, [symbol, start, end]);

	useEffect(() => {
		if (dates.length) {
			const i = Math.max(0, dates.indexOf(simDate));
			setIdx(i);
		}
	}, [simDate, dates]);

	function onChange(e: React.ChangeEvent<HTMLInputElement>) {
		const i = Number(e.target.value);
		setIdx(i);
		if (dates[i]) setSimDate(dates[i]);
	}

	if (!dates.length) return <div>타임라인 로딩 중...</div>;

	return (
		<div style={{ display: 'grid', gap: 6 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<span>시뮬레이션 날짜: {dates[idx]}</span>
				<span>총 {dates.length}일</span>
			</div>
			<input type="range" min={0} max={dates.length - 1} value={idx} onChange={onChange} />
			<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280' }}>
				<span>{dates[0]}</span>
				<span>{dates[dates.length - 1]}</span>
			</div>
		</div>
	);
}









