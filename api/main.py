from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional

from .pricing import black_scholes_price_and_greeks
from .schemas import BSRequest, BSResponse, HistoryResponse, PnLExpiryRequest, PnLExpiryResponse, PnLExpiryPoint, PnLMTMRequest, PnLMTMResponse
from .pnl import portfolio_payoff_expiry, portfolio_mtm

import yfinance as yf


app = FastAPI(title="Options Simulator API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/history", response_model=HistoryResponse)
def get_history(
    symbol: str = Query(..., description="예: AAPL, MSFT, 005930.KS"),
    start: str = Query(..., description="YYYY-MM-DD"),
    end: str = Query(..., description="YYYY-MM-DD"),
    interval: str = Query("1d", description="1d/1h/1wk 등"),
):
    start_dt = datetime.strptime(start, "%Y-%m-%d")
    end_dt = datetime.strptime(end, "%Y-%m-%d")

    data = yf.download(symbol, start=start_dt, end=end_dt, interval=interval, progress=False)
    data = data.reset_index()

    records = []
    for _, row in data.iterrows():
        # yfinance는 Date 또는 Datetime 컬럼명을 상황에 따라 다르게 둘 수 있어 대응
        date_value = row.get("Date", None) or row.get("Datetime", None)
        records.append({
            "date": (date_value.to_pydatetime() if hasattr(date_value, "to_pydatetime") else date_value).strftime("%Y-%m-%d"),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": int(row.get("Volume", 0) or 0),
        })

    return {"symbol": symbol, "records": records}


@app.post("/bs_price", response_model=BSResponse)
def bs_price(req: BSRequest):
    result = black_scholes_price_and_greeks(
        is_call=req.is_call,
        spot=req.spot,
        strike=req.strike,
        rate=req.rate,
        vol=req.vol,
        ttm_years=req.ttm_years,
        div_yield=req.div_yield,
    )
    return result


@app.post("/pnl/expiry", response_model=PnLExpiryResponse)
def pnl_expiry(req: PnLExpiryRequest):
    points = [
        PnLExpiryPoint(price=float(px), payoff=float(portfolio_payoff_expiry(req.positions, float(px))))
        for px in req.price_grid
    ]
    return {"points": points}


@app.post("/pnl/mtm", response_model=PnLMTMResponse)
def pnl_mtm(req: PnLMTMRequest):
    total, legs = portfolio_mtm(
        req.positions,
        spot=req.spot,
        rate=req.rate,
        vol=req.vol,
        ttm_years=req.ttm_years,
        div_yield=req.div_yield,
    )
    return {"total_pnl": float(total), "legs": [float(x) for x in legs]}


def create_app():
    return app


