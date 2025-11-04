from pydantic import BaseModel, Field
from typing import List


class BSRequest(BaseModel):
    is_call: bool = Field(..., description="콜이면 true, 풋이면 false")
    spot: float = Field(..., description="기초자산 현재가")
    strike: float = Field(..., description="행사가")
    rate: float = Field(..., description="무위험이자율(연율, 예: 0.035)")
    vol: float = Field(..., description="연율 변동성(예: 0.25)")
    ttm_years: float = Field(..., description="만기까지의 시간(년 단위)")
    div_yield: float = Field(0.0, description="배당수익률(연율)")


class BSResponse(BaseModel):
    price: float
    delta: float
    gamma: float
    theta: float
    vega: float
    rho: float
    d1: float
    d2: float


class HistoryRecord(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int


class HistoryResponse(BaseModel):
    symbol: str
    records: List[HistoryRecord]


class PositionIn(BaseModel):
    symbol: str
    side: str  # 'CALL' | 'PUT'
    strike: float
    expiry: str  # YYYY-MM-DD
    qty: int  # 매수 +, 매도 -
    premium: float  # 체결 프리미엄


class PnLExpiryRequest(BaseModel):
    positions: List[PositionIn]
    price_grid: List[float]


class PnLExpiryPoint(BaseModel):
    price: float
    payoff: float


class PnLExpiryResponse(BaseModel):
    points: List[PnLExpiryPoint]


class PnLMTMRequest(BaseModel):
    positions: List[PositionIn]
    spot: float
    rate: float
    vol: float
    ttm_years: float
    div_yield: float = 0.0


class PnLMTMResponse(BaseModel):
    total_pnl: float
    legs: List[float]


