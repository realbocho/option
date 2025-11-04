from typing import List

from .pricing import black_scholes_price_and_greeks


def payoff_at_expiry(*, side: str, strike: float, premium: float, qty: int, spot: float) -> float:
    is_call = side.upper() == 'CALL'
    intrinsic = max(0.0, spot - strike) if is_call else max(0.0, strike - spot)
    pnl_per_unit = intrinsic - premium  # 매수 기준: qty 부호로 매도 반영
    return pnl_per_unit * qty


def portfolio_payoff_expiry(positions: List[dict], spot: float) -> float:
    return sum(
        payoff_at_expiry(
            side=p["side"], strike=float(p["strike"]), premium=float(p["premium"]), qty=int(p["qty"]), spot=spot
        )
        for p in positions
    )


def mtm_leg(*, side: str, strike: float, premium: float, qty: int, spot: float, rate: float, vol: float, ttm_years: float, div_yield: float) -> float:
    # 현재 옵션 이론가 - 체결 프리미엄 = 1계약 손익, 수량으로 확대 (수량 부호 포함)
    is_call = side.upper() == 'CALL'
    price = black_scholes_price_and_greeks(
        is_call=is_call, spot=spot, strike=strike, rate=rate, vol=vol, ttm_years=ttm_years, div_yield=div_yield
    )["price"]
    pnl_per_unit = price - premium
    return pnl_per_unit * qty


def portfolio_mtm(positions: List[dict], *, spot: float, rate: float, vol: float, ttm_years: float, div_yield: float):
    legs = [
        mtm_leg(
            side=p["side"], strike=float(p["strike"]), premium=float(p["premium"]), qty=int(p["qty"]),
            spot=spot, rate=rate, vol=vol, ttm_years=ttm_years, div_yield=div_yield
        )
        for p in positions
    ]
    return sum(legs), legs









