# Render Environment Variables

Copy and paste these environment variables into Render when setting up your backend.

## Required Variables

### Database
```
DATABASE_URL=<your-tidb-connection-string>
```
**Where to find**: Your TiDB Cloud dashboard → Connect → Standard Connection
**Format**: `mysql://username:password@host:4000/database_name?ssl={"rejectUnauthorized":true}`

---

### Stripe Payment (Use the keys you provided earlier)
```
STRIPE_SECRET_KEY=<your-stripe-secret-key>
```
**Starts with**: `sk_test_...` (test mode) or `sk_live_...` (production)
**Where to find**: https://dashboard.stripe.com/test/apikeys

```
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```
**Starts with**: `pk_test_...` (test mode) or `pk_live_...` (production)
**Where to find**: https://dashboard.stripe.com/test/apikeys

---

### SendGrid Email (Use the keys you provided earlier)
```
SENDGRID_API_KEY=<your-sendgrid-api-key>
```
**Starts with**: `SG.`
**Where to find**: https://app.sendgrid.com/settings/api_keys

```
SENDGRID_FROM_EMAIL=orders@infiniteclothingstore.co.uk
```
**Note**: This email must be verified in SendGrid
**Where to verify**: https://app.sendgrid.com/settings/sender_auth

---

### JWT & Security
```
JWT_SECRET=<generate-a-random-32-character-string>
```
**Example**: `a8f5f167f44f4964e6c998dee827110c`
**Generate one**: Use this command or any random string generator
```bash
openssl rand -hex 32
```

---

### Manus OAuth (Already configured in your project)
```
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=<your-manus-app-id>
OWNER_OPEN_ID=<your-manus-open-id>
OWNER_NAME=<your-name>
```
**Note**: These should already be set from your Manus project

---

### Manus Built-in APIs (Already configured)
```
BUILT_IN_FORGE_API_URL=<manus-forge-url>
BUILT_IN_FORGE_API_KEY=<manus-forge-key>
```
**Note**: These are automatically provided by Manus

---

### App Configuration
```
VITE_APP_TITLE=INFINITE C107HING
VITE_APP_LOGO=https://infiniteclothingstore.co.uk/logo.png
```

---

### Node Environment
```
NODE_ENV=production
PORT=3000
```

---

## Optional Variables (Can add later)

### ShipEngine (For shipping labels)
```
SHIPENGINE_API_KEY=<your-shipengine-api-key>
```
**Where to get**: https://www.shipengine.com/
**Note**: Free for up to 50 labels/month

---

## How to Add in Render

1. Go to your Render dashboard
2. Click on your web service (after creating it)
3. Go to "Environment" tab
4. Click "Add Environment Variable"
5. Add each variable one by one:
   - **Key**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The actual value (e.g., your connection string)
6. Click "Save Changes"
7. Render will automatically redeploy with new variables

---

## Important Notes

⚠️ **Never commit these values to GitHub**
⚠️ **Use TEST keys for Stripe initially, switch to LIVE when ready**
⚠️ **Verify your SendGrid sender email before going live**
⚠️ **Keep your JWT_SECRET secure and never share it**

---

## Need Help Finding Values?

If you don't have some of these values, let me know which ones and I'll help you retrieve or generate them.

