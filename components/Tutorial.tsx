import { useState } from 'react';

const steps = [
	{ title: '옵션이란?', body: '옵션은 미래의 특정 시점에 특정 가격으로 매수/매도할 권리입니다. 콜=매수권, 풋=매도권.' },
	{ title: '콜/풋 선택', body: '콜은 상승 베팅, 풋은 하락 베팅입니다. 예) 콜 K=72,000: S>72,000이면 가치 보유.' },
	{ title: '만기일 설정', body: '남은만기↓ → 시간가치(Θ) 감소↑. 타임라인으로 시뮬레이션 날짜를 이동하세요.' },
	{ title: '포지션 진입', body: '프리미엄 지불(매수) 또는 수취(매도). 수량 부호는 자동 반영됩니다.' },
	{ title: '손익 확인', body: '우측 손익구조(만기)와 프리미엄 계산 시 Greeks(Δ,Γ,Θ,Vega,Rho)를 확인하세요.' },
];

export default function Tutorial() {
	const [idx, setIdx] = useState(0);
	const s = steps[idx];
	return (
		<div style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
			<div style={{ fontWeight: 600, marginBottom: 6 }}>튜토리얼</div>
			<div style={{ fontSize: 16 }}>{s.title}</div>
			<div style={{ fontSize: 14, color: '#374151', marginTop: 4 }}>{s.body}</div>
			<ul style={{ marginTop: 6, paddingLeft: 18, color: '#4b5563', fontSize: 13 }}>
				{idx === 1 && (
					<>
						<li>콜 만기손익: max(0, S−K) − 프리미엄</li>
						<li>풋 만기손익: max(0, K−S) − 프리미엄</li>
					</>
				)}
				{idx === 4 && (
					<>
						<li>Δ: S 1단위 변화 시 옵션가 변화</li>
						<li>Θ: 하루 경과 시 옵션가 감소(대체로 음수)</li>
					</>
				)}
			</ul>
			<div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
				<button onClick={() => setIdx((p) => Math.max(0, p - 1))} disabled={idx === 0}>이전</button>
				<button onClick={() => setIdx((p) => Math.min(steps.length - 1, p + 1))}>{idx === steps.length - 1 ? '완료' : '다음 단계로 이동'}</button>
			</div>
		</div>
	);
}


