# INF!NITE C107HING - Frontend

Modern React frontend for INF!NITE C107HING e-commerce store.

## Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TailwindCSS 4** - Styling
- **tRPC** - Type-safe API client
- **Wouter** - Routing
- **shadcn/ui** - UI components

## Environment Variables

Create a `.env` file with:

```
VITE_API_URL=https://infinite-clothing-backend-dwea.onrender.com
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_APP_ID=2ikumxMtkpq6y45BuCae8B
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=INFINITE C107HING
VITE_APP_LOGO=/logo.png
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Deployment

This frontend is deployed on **Netlify**.

### Deploy to Netlify

1. Connect this repository to Netlify
2. Set build command: `pnpm build`
3. Set publish directory: `dist`
4. Add environment variables from `.env` example above
5. Deploy!

## Features

- 🛍️ Product catalog with categories
- 🛒 Shopping cart
- 💳 Stripe checkout integration
- 🎨 Futuristic cyan/dark theme
- 📱 Fully responsive design
- 🎵 Background audio player
- 🔐 Manus OAuth authentication
- 📄 Privacy & Return policies

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
│   └── admin/      # Admin dashboard pages
├── contexts/       # React contexts (Cart, Theme)
├── hooks/          # Custom hooks
├── lib/            # Utilities and tRPC client
└── App.tsx         # Main app with routing
```

## License

© 2024 INF!NITE C107HING. All rights reserved.

