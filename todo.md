# Project TODO

## Completed Features
- [x] Full-stack e-commerce website built
- [x] Database schema with products, orders, users, audio tracks
- [x] Futuristic UI with cyan/dark theme
- [x] Product catalog with categories
- [x] Shopping cart and checkout
- [x] Stripe payment integration
- [x] SendGrid email notifications
- [x] Admin dashboard
- [x] Deployed to production (Netlify + Render)
- [x] OAuth authentication fixes
- [x] DNS issues resolved

## New Features to Implement
- [x] Add file upload support for audio tracks in Audio Manager (instead of URL input)
- [x] Add file upload support for product images in Product Manager (instead of URL input)
- [x] Automatically upload files to S3 and generate URLs


- [x] Fix OAuth redirect pointing to portal.manus.im instead of live website


- [x] Fix "Failed to add audio" error when uploading audio files in admin panel


-- [x] Fix admin password not working - set via environment variable
- [x] Fix audio upload still failing after authentication fix
- [x] Update product upload to support multiple images (for different angles of clothing))


- [x] Add color options field to product admin (support multiple color selections)
- [ ] Display color options on product detail page for customers to select


- [x] Create interactive promotional banner for Early Christmas sale
- [x] Add wave animation effect to promotional banner
- [x] Add discount field to product admin form (percentage discount)
- [x] Show original price with strikethrough and discounted price on product pages
- [x] Calculate and display final price after discount


- [x] Fix product add failing in admin panel (ran database migration to add colors and discount columns)

## Bugs to Fix

- [x] Second product fails to add (added colors and discount fields to Zod validation schema in routers.ts)



## New Issues to Fix

- [x] Cart shows original price instead of discounted price (discount not applied during checkout)
- [x] Add size selector to product detail page (S, M, L, XL, 2XL)
- [x] Show selected size in cart and checkout
- [x] Change shipping cost from £5 to £3
- [x] Remove VAT from checkout (set to £0)




## Critical Bugs - URGENT

- [x] Site redirecting to portal.manus.im/app-auth instead of staying on domain (AudioPlayer using admin endpoint)
- [ ] Product discounts in database were reset to 0 after schema update



- [x] Remove login button from public navigation (breaks site with OAuth redirect)
- [x] Fix admin page showing 404 error (created simple password-based admin login system)

