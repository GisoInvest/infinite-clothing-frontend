# Netlify Environment Variables

Add these environment variables to Netlify for your frontend deployment.

## Required Variables

### Backend API URL
```
VITE_API_URL=https://infinite-clothing-backend-dwea.onrender.com
```

### Stripe (Frontend needs publishable key only)
```
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```
**Starts with**: `pk_test_...` (test mode) or `pk_live_...` (production)

### Manus OAuth
```
VITE_APP_ID=2ikumxMtkpq6y45BuCae8B
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
```

### App Config
```
VITE_APP_TITLE=INFINITE C107HING
VITE_APP_LOGO=/logo.png
```

---

## How to Add in Netlify

1. Go to your Netlify site dashboard
2. Click **"Site settings"** → **"Environment variables"**
3. Click **"Add a variable"**
4. Add each variable:
   - **Key**: The variable name (e.g., `VITE_API_URL`)
   - **Value**: The actual value
   - **Scopes**: Select "All scopes" or "Production"
5. Click **"Create variable"**
6. After adding all variables, trigger a new deploy

---

## Complete List for Copy/Paste

```
VITE_API_URL=https://infinite-clothing-backend-dwea.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
VITE_APP_ID=2ikumxMtkpq6y45BuCae8B
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=INFINITE C107HING
VITE_APP_LOGO=/logo.png
```

---

## Important Notes

⚠️ All frontend environment variables MUST start with `VITE_` to be accessible in the browser
⚠️ Never put secret keys (like STRIPE_SECRET_KEY) in frontend environment variables
⚠️ The backend URL must match your Render deployment URL exactly

