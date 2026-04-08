# ⚡ Quick Start Guide - Subsync

Get Subsync running in 5 minutes!

## Prerequisites

- Node.js 18+
- PostgreSQL (or cloud database)
- Git

## Option 1: Local Setup (Easiest for Development)

### Step 1: Setup Database

```bash
# Create database
createdb subsync_db

# Set DATABASE_URL in .env.local
# DATABASE_URL=postgresql://username:password@localhost:5432/subsync_db
```

### Step 2: Copy Environment File

```bash
cp .env.example .env.local
```

### Step 3: Edit .env.local

```env
# Minimum required
DATABASE_URL=postgresql://user:password@localhost:5432/subsync_db
JWT_SECRET=your_secret_key_#123!@
```

### Step 4: Install & Run

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

---

## Option 2: Using Cloud Database (Recommended)

### 1. Create Free Database

**Neon (Recommended):** https://neon.tech
- Sign up → Create project
- Copy connection string
- Paste in `.env.local` as `DATABASE_URL`

**Or Railway:** https://railway.app
- Create PostgreSQL database
- Copy connection string

### 2. Setup Env File

```bash
cp .env.example .env.local
```

Paste your database URL:

```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=generate_a_strong_key
```

Generate strong JWT secret:

```bash
# macOS/Linux
openssl rand -base64 32

# Windows (PowerShell)
[Convert]::ToBase64String((1..32|%{[byte](Get-Random -Maximum 256)}))
```

### 3. Run Application

```bash
npm install
npm run dev
```

---

## Testing the App

### 1. Sign Up

1. Go to http://localhost:3000/signup
2. Fill in form:
   - Email: `test@college.edu`
   - Name: `Test User`
   - College: `Test College`
   - Password: `SecurePass123`
3. Click "Create Account"

### 2. Login

1. Go to http://localhost:3000/login
2. Use credentials from signup
3. Should redirect to dashboard

### 3. API Testing (curl)

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.edu",
    "name": "Test",
    "college": "College",
    "password": "Pass123456",
    "confirmPassword": "Pass123456"
  }'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.edu",
    "password": "Pass123456"
  }'

# Copy the token from response
# Test protected endpoint
curl http://localhost:3000/api/subscriptions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## File Structure Summary

```
/workspaces/vscode/
├── app/                    # Next.js pages & API routes
├── components/             # React components
├── lib/                    # Utilities (DB, Auth, etc.)
├── types/                  # TypeScript types
├── public/                 # Static files
├── package.json
├── tailwind.config.js
├── next.config.js
└── SETUP_GUIDE.md          # Detailed setup
```

---

## Common Issues & Fixes

### "Cannot find module" error

```bash
npm install
```

### Database connection error

Check `.env.local`:
```env
DATABASE_URL=postgresql://localhost/subsync_db
```

Verify PostgreSQL is running:
```bash
psql -U postgres -c "SELECT 1"
```

### Port 3000 already in use

```bash
# Kill process or use different port
npm run dev -- -p 3001
```

### Authentication not working

1. Check `JWT_SECRET` in `.env.local`
2. Clear browser localStorage
3. Restart dev server

---

## Next Steps

1. ✅ App running locally
2. 👉 Explore UI components in `components/`
3. 👉 Review API routes in `app/api/`
4. 👉 Read `SETUP_GUIDE.md` for detailed info
5. 👉 Read `API_DOCUMENTATION.md` for API details
6. 👉 Run survey with your college students
7. 👉 Deploy to production (Vercel recommended)

---

## Deployment (When Ready)

### To Vercel (Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow setup wizard
# Add environment variables
# Done!
```

Your app will be live at `your-project.vercel.app`

---

## Features Currently Implemented

✅ Authentication (signup/login)
✅ JWT token management
✅ PostgreSQL database
✅ Subscriptions listing
✅ Groups management (basic)
✅ Responsive design
✅ Framer Motion animations
✅ TypeScript support
✅ Tailwind CSS styling

## Features to Implement

⏳ Dashboard page with stats
⏳ Marketplace (peer sharing)
⏳ Payment integration
⏳ Notifications system
⏳ Admin panel
⏳ Ratings & reviews
⏳ Email notifications
⏳ Dark mode

---

## Support

- Documentation: See `SETUP_GUIDE.md` and `API_DOCUMENTATION.md`
- Issues: Check error logs in terminal
- Questions: Check code comments for explanations

---

**Happy coding! 🚀**

Next, follow `SETUP_GUIDE.md` for advanced configuration or get started with the UI at http://localhost:3000
