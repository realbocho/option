import { create } from 'zustand';

export type OptionSide = 'CALL' | 'PUT';

export type Position = {
	id: string;
	symbol: string;
	side: OptionSide;
	strike: number;
	expiry: string; // YYYY-MM-DD
	qty: number; // + 매수, - 매도
	premium: number; // 체결 프리미엄(원)
	delta?: number;
	theta?: number;
	gamma?: number;
	vega?: number;
	rho?: number;
};

type AppState = {
	symbol: string;
	start: string; // YYYY-MM-DD
	end: string; // YYYY-MM-DD
	simDate: string; // 시뮬레이션 현재 날짜
	rate: number;
	vol: number;
	divYield: number;
	positions: Position[];
	cash: number;
	setSymbol: (s: string) => void;
	setDateRange: (start: string, end: string) => void;
	setSimDate: (d: string) => void;
	setMarketParams: (p: { rate?: number; vol?: number; divYield?: number }) => void;
	addPosition: (p: Position) => void;
	closePosition: (id: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
	symbol: '005930.KS',
	start: '2023-07-01',
	end: '2023-08-31',
	simDate: '2023-07-01',
	rate: 0.035,
	vol: 0.25,
	divYield: 0.01,
	positions: [],
	cash: 10000000,
	setSymbol: (s) => set({ symbol: s }),
	setDateRange: (start, end) => set({ start, end }),
	setSimDate: (d) => set({ simDate: d }),
	setMarketParams: (p) => set((prev) => ({ ...prev, ...p })),
	addPosition: (p) => set((prev) => ({ positions: [p, ...prev.positions], cash: prev.cash - p.premium * p.qty })),
	closePosition: (id) => set((prev) => ({ positions: prev.positions.filter((x) => x.id !== id) })),
}));


