# Production Rollout

## Required Environment Variables

### Shared
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Admin
- `ADMIN_EMAILS`

### Web
- `CHATBOT_SERVICE_URL`
- `CHATBOT_SERVICE_SECRET`

### Chatbot Service
- `CHATBOT_SERVICE_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Before Deploy

1. Run `supabase-schema.sql`.
2. Run `supabase-orders-schema.sql`.
3. Run `supabase-storage-setup.sql`.
4. Rotate any leaked `NEXT_PUBLIC_SUPABASE_SUPABASE_SERVICE_ROLE_KEY` secrets and stop using that name.
5. Set `ADMIN_EMAILS` to the comma-separated allowlist for the admin app.
6. Point `CHATBOT_SERVICE_URL` to the deployed `/chat` endpoint and set the same `CHATBOT_SERVICE_SECRET` in both services.

## Verification

1. Run `npm run typecheck`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Log in to the admin app and confirm product image upload works.
5. Place a checkout as a signed-in user and confirm the order appears under `/account` and `/account/orders`.
6. Confirm stock decreases only once per paid checkout.

## Deployment Notes

- Product uploads now go through the admin API and rely on the service role key.
- Public product APIs now use Supabase instead of mock catalog data.
- Checkout uses server-side stock reservation helpers; apply the SQL before rolling out.
- Chatbot traffic should go through the web app proxy route instead of calling the chatbot service directly from the browser.
