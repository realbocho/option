from math import log, sqrt, exp
from typing import Dict

import numpy as np
from scipy.stats import norm


def black_scholes_price_and_greeks(
    *,
    is_call: bool,
    spot: float,
    strike: float,
    rate: float,
    vol: float,
    ttm_years: float,
    div_yield: float = 0.0,
) -> Dict[str, float]:
    if ttm_years <= 0 or vol <= 0 or spot <= 0 or strike <= 0:
        # 간단 방어: 만기 도달 또는 비정상 입력 시 즉시 평가값
        intrinsic = max(0.0, spot - strike) if is_call else max(0.0, strike - spot)
        sign = 1.0 if is_call else -1.0
        return {
            "price": intrinsic,
            "delta": 1.0 if (is_call and spot > strike) else (-1.0 if (not is_call and spot < strike) else 0.0),
            "gamma": 0.0,
            "theta": 0.0,
            "vega": 0.0,
            "rho": sign * ttm_years * intrinsic,
            "d1": 0.0,
            "d2": 0.0,
        }

    sqrt_t = sqrt(ttm_years)
    d1 = (log(spot / strike) + (rate - div_yield + 0.5 * vol * vol) * ttm_years) / (vol * sqrt_t)
    d2 = d1 - vol * sqrt_t

    Nd1 = norm.cdf(d1)
    Nd2 = norm.cdf(d2)
    Nnd1 = norm.cdf(-d1)
    Nnd2 = norm.cdf(-d2)

    disc_r = exp(-rate * ttm_years)
    disc_q = exp(-div_yield * ttm_years)

    if is_call:
        price = spot * disc_q * Nd1 - strike * disc_r * Nd2
        delta = disc_q * Nd1
        rho = ttm_years * strike * disc_r * Nd2
    else:
        price = strike * disc_r * Nnd2 - spot * disc_q * Nnd1
        delta = disc_q * (Nd1 - 1.0)
        rho = -ttm_years * strike * disc_r * Nnd2

    pdf_d1 = norm.pdf(d1)
    gamma = disc_q * pdf_d1 / (spot * vol * sqrt_t)
    vega = spot * disc_q * pdf_d1 * sqrt_t
    # 연 단위 theta (하루 단위로 보고 싶으면 /365)
    if is_call:
        theta = (
            -spot * disc_q * pdf_d1 * vol / (2 * sqrt_t)
            - rate * strike * disc_r * Nd2
            + div_yield * spot * disc_q * Nd1
        )
    else:
        theta = (
            -spot * disc_q * pdf_d1 * vol / (2 * sqrt_t)
            + rate * strike * disc_r * Nnd2
            - div_yield * spot * disc_q * Nnd1
        )

    return {
        "price": float(price),
        "delta": float(delta),
        "gamma": float(gamma),
        "theta": float(theta),
        "vega": float(vega),
        "rho": float(rho),
        "d1": float(d1),
        "d2": float(d2),
    }









