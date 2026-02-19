"""
K2M Admin Router
================
Protected endpoints for K2M team only.
Allows assigning Firebase users to companies and listing user assignments.
"""

from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import auth
from pydantic import BaseModel
from ..deps import get_current_user, ADMIN_EMAILS

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)


def require_admin(current_user: dict = Depends(get_current_user)):
    """Dependency — blocks anyone who is not a K2M admin."""
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="K2M admin access required")
    return current_user


class AssignCompanyRequest(BaseModel):
    email: str        # The client's email address (must already exist in Firebase)
    company_id: str   # e.g. "nexus-demo-001" or "acme-corp-002"
    role: str = "client"  # "client" or "admin"


@router.post("/assign-company")
def assign_company(
    request: AssignCompanyRequest,
    current_user: dict = Depends(require_admin)
):
    """
    Assign a Firebase user to a company by stamping custom claims onto their token.

    The user must already have a Firebase account (they must have registered/logged in at least once).
    After calling this, the user needs to log out and log back in for the change to take effect.
    """
    # Validate role value
    if request.role not in ("client", "admin"):
        raise HTTPException(status_code=400, detail="Role must be 'client' or 'admin'")

    try:
        # Look up the user in Firebase by email
        firebase_user = auth.get_user_by_email(request.email)

        # Stamp the company_id and role onto their token (Firebase custom claims)
        auth.set_custom_user_claims(firebase_user.uid, {
            "company_id": request.company_id,
            "role": request.role,
        })

        return {
            "success": True,
            "message": (
                f"User '{request.email}' has been assigned to company '{request.company_id}' "
                f"with role '{request.role}'. "
                f"They must log out and log back in for changes to take effect."
            ),
            "uid": firebase_user.uid,
            "email": request.email,
            "company_id": request.company_id,
            "role": request.role,
        }

    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=404,
            detail=f"No Firebase account found for '{request.email}'. They must log in to the app at least once first."
        )
    except Exception as e:
        print(f"Admin assign-company error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to assign company: {str(e)}")


@router.get("/users")
def list_users(current_user: dict = Depends(require_admin)):
    """
    List all Firebase users and their current company assignments.
    Limited to 500 users.
    """
    try:
        result = []
        page = auth.list_users()
        for user in page.iterate_all():
            claims = user.custom_claims or {}
            result.append({
                "uid": user.uid,
                "email": user.email or "(no email)",
                "company_id": claims.get("company_id", "not assigned"),
                "role": claims.get("role", "not assigned"),
                "is_k2m_admin": user.email in ADMIN_EMAILS,
            })
        return {"users": result, "total": len(result)}

    except Exception as e:
        print(f"Admin list-users error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list users: {str(e)}")


class VerifyEmailRequest(BaseModel):
    email: str


@router.post("/verify-email")
def force_verify_email(
    request: VerifyEmailRequest,
    current_user: dict = Depends(require_admin)
):
    """
    Force-verify a Firebase user's email address (admin only).
    Useful for demo/test accounts where you can't click the verification link.
    """
    try:
        firebase_user = auth.get_user_by_email(request.email)
        auth.update_user(firebase_user.uid, email_verified=True)
        return {
            "success": True,
            "message": f"Email '{request.email}' has been marked as verified. The user can now enroll 2FA.",
        }
    except auth.UserNotFoundError:
        raise HTTPException(status_code=404, detail=f"No Firebase account found for '{request.email}'.")
    except Exception as e:
        print(f"Admin verify-email error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to verify email: {str(e)}")


@router.get("/companies")
def list_companies(current_user: dict = Depends(require_admin)):
    """
    List all distinct company IDs that have been assigned to users.
    """
    try:
        company_ids = set()
        page = auth.list_users()
        for user in page.iterate_all():
            claims = user.custom_claims or {}
            cid = claims.get("company_id")
            if cid:
                company_ids.add(cid)
        return {"companies": sorted(company_ids), "total": len(company_ids)}

    except Exception as e:
        print(f"Admin list-companies error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to list companies: {str(e)}")
