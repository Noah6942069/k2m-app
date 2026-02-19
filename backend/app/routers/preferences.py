from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
import json
from datetime import datetime
from ..database import get_session
from ..models import DashboardPreference
from ..schemas import DashboardPreferenceBase, DashboardPreferenceRead
from ..deps import get_current_user

router = APIRouter(
    prefix="/preferences",
    tags=["preferences"],
)

# Default widget configuration
DEFAULT_WIDGETS = {
    "kpi_revenue": True,
    "kpi_growth": True,
    "kpi_health": True,
    "kpi_transactions": True,
    "kpi_categories": True,
    "kpi_best_month": True,
    "chart_sales_trend": True,
    "chart_category_distribution": True,
    "chart_horizontal_ranking": True,
    "list_top_products": True,
    "insights_bar": True,
}


@router.get("/dashboard/{user_email}", response_model=DashboardPreferenceRead)
def get_dashboard_preferences(user_email: str, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    """Get dashboard widget preferences for a user (users can only access their own)"""
    # Users can only fetch their own preferences; admins can fetch any
    if current_user.get("role") != "admin" and current_user.get("email") != user_email:
        raise HTTPException(status_code=403, detail="Access denied")
    statement = select(DashboardPreference).where(DashboardPreference.user_email == user_email)
    pref = session.exec(statement).first()
    
    if not pref:
        # Return defaults if no preferences saved
        return DashboardPreferenceRead(
            user_email=user_email,
            widget_config=DEFAULT_WIDGETS,
            layout_order=list(DEFAULT_WIDGETS.keys())
        )
    
    try:
        widget_config = json.loads(pref.widget_config)
        layout_order = json.loads(pref.layout_order) if pref.layout_order else list(DEFAULT_WIDGETS.keys())
    except:
        widget_config = DEFAULT_WIDGETS
        layout_order = list(DEFAULT_WIDGETS.keys())
    
    return DashboardPreferenceRead(
        user_email=user_email,
        widget_config=widget_config,
        layout_order=layout_order
    )


@router.put("/dashboard/{user_email}", response_model=DashboardPreferenceRead)
def save_dashboard_preferences(
    user_email: str,
    preferences: DashboardPreferenceBase,
    session: Session = Depends(get_session),
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "admin" and current_user.get("email") != user_email:
        raise HTTPException(status_code=403, detail="Access denied")
    """Save dashboard widget preferences for a user"""
    statement = select(DashboardPreference).where(DashboardPreference.user_email == user_email)
    existing = session.exec(statement).first()
    
    widget_config_json = json.dumps(preferences.widget_config)
    layout_order_json = json.dumps(preferences.layout_order) if preferences.layout_order else None
    
    if existing:
        existing.widget_config = widget_config_json
        existing.layout_order = layout_order_json
        existing.updated_at = datetime.utcnow()
        session.add(existing)
    else:
        new_pref = DashboardPreference(
            user_email=user_email,
            widget_config=widget_config_json,
            layout_order=layout_order_json,
            updated_at=datetime.utcnow()
        )
        session.add(new_pref)
    
    session.commit()
    
    return DashboardPreferenceRead(
        user_email=user_email,
        widget_config=preferences.widget_config,
        layout_order=preferences.layout_order
    )


@router.post("/dashboard/{user_email}/reset", response_model=DashboardPreferenceRead)
def reset_dashboard_preferences(user_email: str, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin" and current_user.get("email") != user_email:
        raise HTTPException(status_code=403, detail="Access denied")
    """Reset dashboard preferences to defaults"""
    statement = select(DashboardPreference).where(DashboardPreference.user_email == user_email)
    existing = session.exec(statement).first()
    
    if existing:
        session.delete(existing)
        session.commit()
    
    return DashboardPreferenceRead(
        user_email=user_email,
        widget_config=DEFAULT_WIDGETS,
        layout_order=list(DEFAULT_WIDGETS.keys())
    )
