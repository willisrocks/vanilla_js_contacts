import re
import typing

from pydantic import BaseModel, ValidationError, validator


class ContactNotFound(Exception):
    pass

class DuplicateContact(Exception):
    pass


class Contact(BaseModel):
    """
    A contact entity including custom validation for email property
    """
    id: typing.Optional[int]
    name: str
    email: str
    note: str = ""

    @validator("email")
    def validate_email(cls, v):
        regex = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
        if re.fullmatch(regex, v):
            return v
        raise ValidationError("must be a valid email address")
