# K2M - Multi-Tenant Business Intelligence Platform

## Project Overview
K2M is a secure, multi-tenant business intelligence platform that helps companies analyze risks, view analytics, and interact with AI assistance. Multiple companies will use this platform, each with their own isolated data and customized dashboards.

## 🔐 CRITICAL: Security First
**THIS APP HANDLES SENSITIVE COMPANY DATA - SECURITY IS THE TOP PRIORITY**

- All company data must be isolated (multi-tenant architecture)
- Never log sensitive data or API responses
- All database queries must filter by company ID
- Firebase security rules must be strict
- Be extremely careful with authentication and authorization
- Test all security changes thoroughly
- Never commit credentials or API keys

## Current Status
- **50% built in Antigravity** (using Gemini) - now migrated to Claude Code
- **Firebase authentication is CONNECTED and WORKING** - do not modify auth config
- **Google Cloud is CONNECTED** - do not change cloud config files
- **Data ingestion method not yet determined** - this is planned for future development

## Tech Stack

- **Authentication:** Firebase Auth (already configured)
- **Cloud Services:** Google Cloud (already configured)
- **Languages:** Czech (primary) + English (toggle)

## Key Features
1. **Risk Analysis Page** - Company risk assessment and visualization
2. **Analytics Dashboard** - Business intelligence and data visualization
3. **AI Chat** - AI-powered assistant for data queries
4. **Multi-Company Support** - Each company has isolated data and custom dashboards
5. **Admin Panel** - K2M team can view all companies and manage the platform
6. **Language Toggle** - Czech ↔ English switching


## Design Guidelines
- **Primary Color:** Dark Purple (already in half built app)
- **UI must support both Czech and English**
- **Design should look professional** - this is for businesses
- **Mobile responsive** - clients may access on various devices

## Multi-Tenant Architecture
**EXTREMELY IMPORTANT:**
- Each company must have a unique company_id
- ALL database queries must filter by company_id
- Users can only access data from their own company
- Admin users (K2M team) can see all companies
- Never mix data between companies
- Test data isolation thoroughly

## Dashboard Types
- **Standard Client Dashboard** - Default view for company users
- **Custom Client Dashboards** - Tailored views for specific clients
- **Admin Dashboard** - K2M team view of all companies and system health

## Files That Must NOT Be Auto-Modified
🚫 **DO NOT CHANGE THESE WITHOUT EXPLICIT PERMISSION:**
- Firebase configuration files
- Google Cloud credential files
- Any files in `/config/` folder
- `.env` files or environment variables
- `firebase.json` or `firebaserc`
- Authentication setup files
- Any file with "credentials" or "secrets" in the name

## Coding Standards
- **Comments:** Add comments for complex business logic
- **Security:** Always validate user input
- **Multi-tenant:** Always filter by company_id in queries
- **i18n:** All user-facing text must support Czech and English
- **Error Handling:** Proper error messages (never expose system details to users)
- **Logging:** Log actions but never log sensitive data

## Data Handling (In Progress)
⚠️ **Data ingestion method is NOT YET DETERMINED**
- Do not build data import features without discussion
- When we figure out how data gets into the system, this section will be updated
- Currently unknown: file uploads? API integration? Manual entry? TBD

## API Guidelines
- All APIs must authenticate users via Firebase
- All APIs must verify company_id matches the user's company
- Rate limiting should be considered for AI chat features
- API responses should not leak data about other companies

## Language/i18n
- Primary language: Czech (cs-CZ)
- Secondary language: English (en-US)
- All UI text must have both translations
- Use proper i18n library (e.g., react-i18next, next-i18next)
- Date/number formats should adapt to language

## Firebase Auth (Already Working)
✅ **Firebase authentication is already connected**
- Login system is functional
- Do not modify auth configuration unless explicitly asked
- User management is handled through Firebase
- Multi-factor authentication may be added later

## Common Tasks
**When adding new features:**
1. Check if it needs to be multi-tenant (probably yes)
2. Add Czech + English translations
3. Ensure proper authentication/authorization
4. Test data isolation between companies
5. Follow existing code patterns

**When working with data:**
1. Always filter by company_id
2. Validate all inputs
3. Never expose sensitive information in logs
4. Use Firebase security rules as first line of defense

## Testing Checklist
Before accepting any changes, verify:
- [ ] Multi-tenant isolation works (users can't see other companies' data)
- [ ] Both Czech and English translations are present
- [ ] Authentication is enforced
- [ ] No sensitive data in logs
- [ ] Code follows existing patterns
- [ ] Firebase/Google Cloud configs are unchanged

## What Claude Should Know
1. **Security is more important than features** - if in doubt, be more restrictive
2. **This app was partially built with Gemini** - some code may need refactoring
3. **Data architecture is still being planned** - don't make assumptions about how data enters the system
4. **Multiple companies will use this** - everything must be isolated by company
5. **This is a production business app** - code quality and reliability matter

## Current Focus Areas
- Completing features started in Antigravity
- Ensuring multi-tenant security is bulletproof
- Finalizing data ingestion strategy
- Building out the admin dashboard
- Polishing the risk analysis and analytics pages

## Questions to Ask Before Making Changes
- "Does this properly isolate data between companies?"
- "Are there Czech and English versions of this text?"
- "Could this expose sensitive information?"
- "Am I modifying any Firebase or Google Cloud configuration?"
- "Is this following the existing code patterns?"

---

**When in doubt, ASK before making changes to:**
- Authentication/authorization logic
- Database queries (especially those without company_id filters)
- Firebase or Google Cloud configurations
- Security-related code
- Multi-tenant data access