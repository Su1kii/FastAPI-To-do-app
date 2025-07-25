from typing import Annotated

import models
from database import SessionLocal
from fastapi import APIRouter, Depends, HTTPException, status
from passlib.context import CryptContext
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from .auth import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["user"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]
bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserVerification(BaseModel):
    password: str
    new_password: str = Field(min_length=6)


@router.get("/", status_code=status.HTTP_200_OK)
async def get_user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return db.query(models.Users).filter(models.Users.id == user.get("id")).first()


@router.put("/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    user: user_dependency, db: db_dependency, user_verification: UserVerification
):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_model = (
        db.query(models.Users).filter(models.Users.id == user.get("id")).first()
    )
    if not bcrypt_context.verify(
        user_verification.password, user_model.hashed_password  # type: ignore
    ):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_model.hashed_password = bcrypt_context.hash(user_verification.new_password)  # type: ignore
    db.add(user_model)
    db.commit()
