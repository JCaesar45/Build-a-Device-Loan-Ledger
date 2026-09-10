from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
import jwt
from datetime import datetime
from typing import Annotated

app = FastAPI(title="Aurelia Vault Gateway", version="1.0.0")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")
JWT_SECRET = "0x9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0"

class AllocationRequest(BaseModel):
    asset_id: str = Field(..., min_length=12, max_length=64)
    fraction_volume: float = Field(..., gt=0)
    fiat_denomination: str = Field("USD", pattern="^[A-Z]{3}$")

class LedgerReceipt(BaseModel):
    tx_hash: str
    state_root: str
    timestamp: int

def validate_session(token: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("exp") < datetime.utcnow().timestamp():
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired")
        return payload
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid cryptographic signature")

@app.post("/api/v1/ledger/allocate", response_model=LedgerReceipt, status_code=status.HTTP_201_CREATED)
async def allocate_fraction(
    request: AllocationRequest, 
    session: dict = Depends(validate_session)
):
    return LedgerReceipt(
        tx_hash="0x" + "a" * 64,
        state_root="0x" + "b" * 64,
        timestamp=int(datetime.utcnow().timestamp())
    )
