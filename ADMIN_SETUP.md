# Admin Panel Setup Guide

## Admin Access Instructions

### Test Admin Credentials

- **Imэйл (Email):** `admin@deersdrone.mn`
- **URL:** `http://localhost:3001`

### Setting Up Admin Account in Supabase

1. **Open Supabase Console:**
   - Go to: `https://app.supabase.com`
   - Project: `deer-drone`

2. **Create Admin User:**
   - Navigate to: **Authentication** → **Users**
   - Click **Add user**
   - Enter email: `admin@deersdrone.mn`
   - Create a strong password
   - Click **Create User**

3. **Verify Admin Email is Configured:**
   - The app automatically checks for email in `ADMIN_EMAILS` environment variable
   - Current admin emails: `admin@deersdrone.mn, admin@deer.mn`
   - These are configured in: `apps/admin/.env`

4. **Access Admin Panel:**
   - Open: `http://localhost:3001`
   - Login with email: `admin@deersdrone.mn`
   - Use the password you set in Supabase
   - You should be redirected to the admin dashboard

### Admin Features Available

- **Dashboard:** View metrics, recent orders, new leads
- **Products:** Create, read, update, delete products
- **Orders:** View order status, update order status
- **Chatbot:** Monitor chatbot interactions

### Development Notes

- Admin middleware checks user email against `ADMIN_EMAILS` list
- Only users with authorized emails can access admin pages
- All admin emails are case-insensitive
- API endpoints also require admin authentication

### Adding Additional Admin Users

Edit `apps/admin/.env`:

```
ADMIN_EMAILS=admin@deersdrone.mn,admin@deer.mn,your-email@example.com
```

Then create the user in Supabase following the steps above.

### Troubleshooting

- **"Cannot find module" errors:** Run `npm install` in workspace root
- **Redirect to login:** Check if your email is in `ADMIN_EMAILS` list
- **Password reset:** Use Supabase console to reset user password
- **Environment not loading:** Restart dev server with `npm run dev`
