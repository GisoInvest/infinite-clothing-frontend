# INF!NITE C107HING - Deployment Guide

## Overview
This guide will help you deploy your e-commerce website to production using:
- **Frontend**: Netlify (infiniteclothingstore.co.uk)
- **Backend**: Render
- **Database**: TiDB Cloud (already configured)

## Prerequisites
- GitHub account
- Netlify account
- Render account
- Domain: infiniteclothingstore.co.uk (already registered)

## Step 1: Push to GitHub

1. Initialize Git repository (if not already done):
```bash
cd /home/ubuntu/infinite-clothing-store
git init
git add .
git commit -m "Initial commit: INF!NITE C107HING e-commerce website"
```

2. Create a new repository on GitHub named `infinite-clothing-store`

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/infinite-clothing-store.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `infinite-clothing-backend`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install`
   - **Start Command**: `pnpm start`
   - **Plan**: Free (or paid for better performance)

5. Add Environment Variables:
   ```
   DATABASE_URL=<your-tidb-connection-string>
   JWT_SECRET=<generate-random-32-char-string>
   STRIPE_SECRET_KEY=<your-stripe-secret-key>
   VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
   SENDGRID_API_KEY=<your-sendgrid-api-key>
   SENDGRID_FROM_EMAIL=orders@infiniteclothingstore.co.uk
   OAUTH_SERVER_URL=https://api.manus.im
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   VITE_APP_ID=<your-manus-app-id>
   VITE_APP_TITLE=INF!NITE C107HING
   VITE_APP_LOGO=https://infiniteclothingstore.co.uk/logo.png
   OWNER_OPEN_ID=<your-manus-open-id>
   OWNER_NAME=<your-name>
   BUILT_IN_FORGE_API_URL=<manus-forge-url>
   BUILT_IN_FORGE_API_KEY=<manus-forge-key>
   ```

6. Deploy and note your backend URL (e.g., `https://infinite-clothing-backend.onrender.com`)

## Step 3: Deploy Frontend to Netlify

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure:
   - **Build command**: `pnpm build`
   - **Publish directory**: `client/dist`
   - **Base directory**: (leave empty)

5. Add Environment Variables:
   ```
   VITE_API_URL=https://infinite-clothing-backend.onrender.com
   VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
   VITE_APP_TITLE=INF!NITE C107HING
   VITE_APP_LOGO=/logo.png
   VITE_OAUTH_PORTAL_URL=https://portal.manus.im
   VITE_APP_ID=<your-manus-app-id>
   ```

6. Deploy the site

## Step 4: Configure Custom Domain

1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Enter `infiniteclothingstore.co.uk`
4. Follow Netlify's instructions to update your DNS records:
   - Add A record pointing to Netlify's IP
   - OR add CNAME record pointing to your Netlify subdomain
5. Enable HTTPS (Netlify does this automatically)

## Step 5: Update CORS Settings

Update your backend to allow requests from your domain:

In `server/_core/index.ts`, update CORS configuration:
```typescript
app.use(cors({
  origin: [
    'https://infiniteclothingstore.co.uk',
    'https://www.infiniteclothingstore.co.uk',
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

## Step 6: Test Your Deployment

1. Visit `https://infiniteclothingstore.co.uk`
2. Test key features:
   - Browse products
   - Add items to cart
   - Complete checkout (use Stripe test card: 4242 4242 4242 4242)
   - Check email notifications
   - Login as admin and test dashboard

## Step 7: Switch to Live Stripe Keys

When ready to accept real payments:

1. In Stripe Dashboard, activate your account
2. Get your live keys from https://dashboard.stripe.com/apikeys
3. Update environment variables in Render and Netlify:
   - Replace `sk_test_...` with `sk_live_...`
   - Replace `pk_test_...` with `pk_live_...`
4. Redeploy both services

## Step 8: Add ShipEngine for Shipping Labels (Optional)

1. Sign up at https://www.shipengine.com/
2. Get your API key
3. Add to Render environment variables:
   ```
   SHIPENGINE_API_KEY=<your-shipengine-api-key>
   ```
4. Implement shipping label generation in admin dashboard

## Maintenance

### Adding Products
1. Login as admin at `/admin/products`
2. Click "Add Product"
3. Fill in details and upload images/videos
4. Mark as "Featured" to show on homepage

### Managing Orders
1. Go to `/admin/orders`
2. Update order status as you process them
3. Customers receive email notifications automatically

### Background Audio
1. Go to `/admin/audio`
2. Upload ambient tracks (MP3, WAV, OGG)
3. Tracks will shuffle automatically on the website

## Troubleshooting

### Payment not working
- Check Stripe keys are correct
- Verify STRIPE_SECRET_KEY is set in Render
- Check browser console for errors

### Emails not sending
- Verify SENDGRID_API_KEY is correct
- Check sender email is verified in SendGrid
- Look at Render logs for error messages

### Database connection issues
- Verify DATABASE_URL is correct
- Check TiDB Cloud firewall allows Render's IPs
- Run `pnpm db:push` to ensure schema is up to date

## Support

For issues or questions:
- Check Render logs: https://dashboard.render.com/
- Check Netlify deploy logs: https://app.netlify.com/
- Review browser console for frontend errors

## Next Steps

1. Set up Google Analytics (optional)
2. Configure SEO meta tags
3. Add product reviews feature
4. Implement wishlist functionality
5. Set up automated backups for database
6. Configure monitoring and alerts

---

**Congratulations!** Your INF!NITE C107HING e-commerce store is now live! 🎉

