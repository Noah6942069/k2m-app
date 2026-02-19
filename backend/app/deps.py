from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
import firebase_admin
import os
from dotenv import load_dotenv

# Load .env from backend root (two levels up: app/ -> backend/)
_base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(_base_dir, ".env"))

# auto_error=False so we get None instead of 403 when no token is sent
security = HTTPBearer(auto_error=False)

# Set DISABLE_AUTH=true in .env to skip token verification for local dev
DISABLE_AUTH = os.getenv("DISABLE_AUTH", "false").lower() == "true"

# K2M team emails — always get admin role regardless of Firebase claims
ADMIN_EMAILS = [
    "noahk2m@gmail.com",
    "noahkaya0024@gmail.com",
    "kusak@mkprod.cz",
]

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    """
    Validates the Firebase ID Token in the Authorization header.
    Returns a user dict with uid, email, company_id, and role.
    Set DISABLE_AUTH=true in .env to skip verification for local development.
    """
    if DISABLE_AUTH:
        print("WARN: Auth is disabled (DISABLE_AUTH=true). Do not use in production.")
        return {"uid": "dev-user", "email": "dev@local.test", "company_id": "nexus-demo-001", "role": "admin"}

    if token is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authenticated",
        )

    try:
        try:
            firebase_admin.get_app()
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Firebase not initialized on server."
            )

        decoded_token = auth.verify_id_token(token.credentials)

        email = decoded_token.get("email", "")
        # Read company_id and role from Firebase custom claims (set via /admin/assign-company)
        company_id = decoded_token.get("company_id", "nexus-demo-001")
        role = decoded_token.get("role", "client")

        # K2M admin emails always get admin role, regardless of claims
        if email in ADMIN_EMAILS or email.endswith("@k2m-analytics.com"):
            role = "admin"

        return {
            "uid": decoded_token["uid"],
            "email": email,
            "company_id": company_id,
            "role": role,
        }

    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.RevokedIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        print(f"Auth Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )
