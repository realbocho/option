import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export type HistoryRecord = {
	date: string;
	open: number;
	high: number;
	low: number;
	close: number;
	volume: number;
};

export async function fetchHistory(params: {
	symbol: string;
	start: string;
	end: string;
	interval?: string;
}): Promise<{ symbol: string; records: HistoryRecord[] }> {
	const { symbol, start, end, interval = '1d' } = params;
	const res = await axios.get(`${API_BASE}/history`, {
		params: { symbol, start, end, interval },
	});
	return res.data;
}

export async function fetchBSPrice(body: {
	is_call: boolean;
	spot: number;
	strike: number;
	rate: number;
	vol: number;
	ttm_years: number;
	div_yield?: number;
}): Promise<{
	price: number;
	delta: number;
	gamma: number;
	theta: number;
	vega: number;
	rho: number;
	d1: number;
	d2: number;
}> {
	const res = await axios.post(`${API_BASE}/bs_price`, body);
	return res.data;
}









