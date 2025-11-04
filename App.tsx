import './App.css'
import HistoryChart from './components/HistoryChart'
import PositionForm from './components/PositionForm'
import PnLPanel from './components/PnLPanel'
import Tutorial from './components/Tutorial'
import Timeline from './components/Timeline'
import PayoffChart from './components/PayoffChart'
import { useAppStore } from './store/useAppStore'

function App() {
  const { symbol, setSymbol, start, end, setDateRange } = useAppStore()

  return (
    <div style={{ padding: 16, display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>옵션 거래 시뮬레이터</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label>
            종목
            <input value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="005930.KS" />
          </label>
          <label>
            시작일
            <input type="date" value={start} onChange={(e) => setDateRange(e.target.value, end)} />
          </label>
          <label>
            종료일
            <input type="date" value={end} onChange={(e) => setDateRange(start, e.target.value)} />
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
        <div>
          <HistoryChart />
          <div style={{ marginTop: 12 }}>
            <Tutorial />
          </div>
          <div style={{ marginTop: 12 }}>
            <Timeline />
          </div>
        </div>
        <div>
          <PositionForm />
        </div>
        <div>
          <PnLPanel />
          <div style={{ marginTop: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>손익구조 그래프(만기)</div>
            <PayoffChart />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
