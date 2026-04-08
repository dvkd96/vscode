# 🚀 Subsync - Full Stack Application Setup Guide

## Project Overview

Subsync is a production-ready full-stack web application built with:

- **Frontend:** Next.js 14 + React 18 + Tailwind CSS + Framer Motion
- **Backend:** Next.js API Routes + Node.js
- **Database:** PostgreSQL
- **Authentication:** JWT + bcryptjs  
- **Payments:** Razorpay integration (ready)
- **UI Library:** Custom-built components with animations

---

## 📁 Project Structure

```
subsync/
├── app/                           # Next.js App Directory
│   ├── api/                       # API Routes
│   │   ├── auth/                  # Authentication endpoints
│   │   │   ├── signup/route.ts
│   │   │   └── login/route.ts
│   │   ├── subscriptions/         # Subscriptions endpoints
│   │   ├── groups/                # Groups endpoints
│   │   └── [...]
│   ├── login/page.tsx             # Login page
│   ├── signup/page.tsx            # Signup page
│   ├── dashboard/page.tsx         # Dashboard page
│   ├── layout.tsx                 # Root layout
│   └── globals.css                # Global styles
│
├── components/                    # React Components
│   ├── ui/                        # UI components (Button, Card, etc.)
│   ├── auth/                      # Auth components
│   ├── navbar.tsx                 # Navigation bar
│   └── [...]
│
├── lib/                           # Utility Functions
│   ├── db.ts                      # Database connection pool
│   ├── schema.ts                  # PostgreSQL schema
│   ├── auth.ts                    # Authentication utilities
│   ├── api.ts                     # API helpers & response handlers
│   └── middleware.ts              # Auth middleware
│
├── types/                         # TypeScript Type Definitions
│   └── index.ts                   # All types
│
├── public/                        # Static assets
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── tailwind.config.js             # Tailwind configuration
├── next.config.js                 # Next.js configuration
└── .env.example                   # Environment template
```

---

## 🛠️ Prerequisites

- **Node.js:** 18.17+
- **npm or yarn**
- **PostgreSQL:** 12+ (can use online services like Render, Neon, or Railway)
- **Git**

---

## 📦 Installation & Setup

### Step 1: Clone & Install Dependencies

```bash
cd /workspaces/vscode
npm install
```

### Step 2: Setup Database

#### Option A: Local PostgreSQL (Recommended for development)

```bash
# Install PostgreSQL if not already installed
# macOS
brew install postgresql

# Linux
sudo apt-get install postgresql

# Windows - Download from https://www.postgresql.org/download/windows/

# Create database
createdb subsync_db

# Set password for postgres user (when prompted earlier during install)
psql -U postgres -c "ALTER USER postgres PASSWORD 'your_password';"
```

#### Option B: Cloud Database (Recommended for production)

- **Render:** https://render.com (free tier available)
- **Neon:** https://neon.tech (generous free tier)
- **Railway:** https://railway.app (free credits)
- **PlanetScale:** https://planetscale.com (MySQL, but similar)

For cloud setup, get your `DATABASE_URL` from provider and paste in `.env.local`

### Step 3: Environment Variables

```bash
# Copy example to .env.local
cp .env.example .env.local

# Edit .env.local with your values
nano .env.local
```

**Required variables:**

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/subsync_db

# JWT Secret - Generate a strong one:
# openssl rand -base64 32
JWT_SECRET=your_generated_secret_key_here

# Optional - Razorpay (test keys first)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=rzp_test_secret_xxxxx
```

### Step 4: Initialize Database Schema

The database will auto-initialize on first API call. To manually set it up:

```bash
# Create a script file
cat > scripts/setupDb.js << 'EOF'
const { query } = require('../lib/db');
const { DATABASE_SCHEMA } = require('../lib/schema');

async function setup() {
  try {
    console.log('Setting up database...');
    // Split schema into individual statements
    const statements = DATABASE_SCHEMA.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement);
      }
    }
    
    console.log('✓ Database setup complete');
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setup();
EOF

# Run setup
npm run db:setup
```

### Step 5: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Free Tier)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts for environment variables
```

### Option 2: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login & deploy
railway login
railway up
```

### Option 3: Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new "Web Service"
4. Connect GitHub repository
5. Add environment variables
6. Deploy

### Option 4: Self-hosted (VPS)

```bash
# On your VPS
git clone <your-repo>
cd subsync
npm install

# Install PM2 for process management
npm i -g pm2

# Build for production
npm run build

# Start with PM2
pm2 start npm --name "subsync" -- start

# Setup Nginx as reverse proxy (optional but recommended)
```

---

## 💾 Database Setup (Detailed)

### Manual Schema Creation

If auto-setup fails, manually create tables:

```sql
-- Connect to your database
psql -U postgres -d subsync_db

-- Paste the entire schema from lib/schema.ts
-- The DATABASE_SCHEMA constant contains all CREATE TABLE statements
```

### Seed Sample Data

```sql
-- Add sample subscriptions
INSERT INTO subscriptions (name, description, icon, category, type, features) VALUES
('ChatGPT Pro', 'AI-powered assistant for writing and coding', '🤖', 'ai', 'both', ARRAY['GPT-4', 'Advanced features']),
('Spotify Premium', 'Ad-free music streaming', '🎵', 'music', 'both', ARRAY['Ad-free', 'High quality']),
('Netflix', 'Movies, shows, and entertainment', '🎬', 'ott', 'both', ARRAY['4K', 'Multiple screens']);
```

---

## 🔑 Authentication Flow

### Signup Flow

```
User fills signup form
    ↓
Validate email format
    ↓
Check password strength (8+ chars, upper, lower, number)
    ↓
Hash password with bcrypt
    ↓
Save to database
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Store token in localStorage
```

### Login Flow

```
User enters email + password
    ↓
Find user by email
    ↓
Compare password hash
    ↓
If valid, generate JWT token
    ↓
Return token + user data
```

### Protected Routes

```
Request with Authorization header
    ↓
Extract JWT from "Bearer <token>"
    ↓
Verify JWT signature
    ↓
Fetch user from database
    ↓
Attach user to request
    ↓
Proceed with protected action
```

---

## 💳 Payment Integration

### Razorpay Setup

1. **Create account:** https://razorpay.com
2. **Get API keys:**
   - Log in to dashboard
   - Settings → API Keys
   - Copy "Key ID" and "Key Secret"
3. **Add to .env.local:**

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=rzp_test_secret_xxx
```

4. **Test with Razorpay test cards:**

```
Card: 4111 1111 1111 1111
Exp: Any future date
CVV: Any 3 digits
```

---

## 📊 API Endpoints

### Authentication

```
POST   /api/auth/signup      - Create account
POST   /api/auth/login       - Login to account
```

### Subscriptions

```
GET    /api/subscriptions                - List all subscriptions
GET    /api/subscriptions?category=ai    - Filter by category
```

### Groups (Protected)

```
GET    /api/groups                       - List groups
GET    /api/groups?status=recruiting     - Filter groups
POST   /api/groups                       - Create new group (auth required)
GET    /api/groups/[id]                  - Get group details
POST   /api/groups/[id]/join             - Join a group
```

### Payments (Protected)

```
POST   /api/payments                     - Create payment
GET    /api/payments                     - Get user payments
PUT    /api/payments/[id]/verify         - Verify payment
```

---

## 🧪 Testing

### Test Auth Endpoints

```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.edu",
    "name": "Test User",
    "college": "Test College",
    "password": "TestPass123",
    "confirmPassword": "TestPass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@college.edu",
    "password": "TestPass123"
  }'
```

### Test Protected Endpoints

```bash
# Replace TOKEN with actual JWT from login response

curl http://localhost:3000/api/groups \
  -H "Authorization: Bearer TOKEN"
```

---

## 🐛 Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
- Check PostgreSQL is running: `psql --version`
- Verify DATABASE_URL in .env.local
- Start PostgreSQL: `brew services start postgresql` (macOS)

### Token Validation Failed

```
Error: Invalid token
```

**Solutions:**
- Check JWT_SECRET is set correctly
- Token might be expired (set JWT_EXPIRE in .env)
- Add "Bearer " prefix in Authorization header

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solutions:**
```bash
# Kill process on port 3000
npx kill-port 3000
# Or change port
npm run dev -- -p 3001
```

### Database Schema Issues

```
Error: relation "users" does not exist
```

**Solutions:**
```bash
# Recreate database
dropdb subsync_db
createdb subsync_db

# Run setup again
npm run db:setup
```

---

## 📚 Key Files Explanation

### `lib/db.ts`
- PostgreSQL connection pool management
- Query execution with logging
- Transaction support

### `lib/auth.ts`
- JWT token generation/verification
- Password hashing & comparison
- Credential encryption
- Email validation
- Password strength checking

### `lib/middleware.ts`
- Auth middleware for protected routes
- Admin route protection
- Rate limiting

### `app/api/auth/signup/route.ts`
- User registration endpoint
- Input validation
- Password hashing
- Token generation

### `components/ui/index.tsx`
- Reusable UI components
- Button, Card, Badge, Toast
- Framer Motion animations

### `components/navbar.tsx`
- Responsive navigation
- User authentication status display
- Mobile menu toggle

---

## 🎨 Customization

### Change Color Scheme

Edit `tailwind.config.js` primary colors:

```js
colors: {
  'primary': {
    50: '#e0f7ff',
    600: '#00a3ff',
    // ... change these values
  }
}
```

### Add New API Endpoint

1. Create file: `app/api/[resource]/route.ts`
2. Define GET/POST/PUT/DELETE functions
3. Use `withAuth()` for protected routes
4. Return `successResponse()` or `errorResponse()`

### Add New Page

1. Create folder: `app/[page-name]`
2. Create `page.tsx`
3. Add to navbar links
4. Create corresponding component

---

## 📖 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Guide](https://jwt.io/introduction)
- [Razorpay API Docs](https://razorpay.com/docs)

---

## 🚨 Important Notes

1. **Never commit .env files** - Add to .gitignore
2. **Change JWT_SECRET in production** - Use strong, random value
3. **Enable HTTPS** - Required for payment processing
4. **Rate limiting** - Already implemented but adjust to your needs
5. **CORS** - Configure for production domain
6. **Database backups** - Set up automated backups
7. **Logs** - Monitor error logs regularly

---

## 🤝 Next Steps

1. ✅ Install dependencies
2. ✅ Setup database
3. ✅ Run development server
4. ✅ Test authentication
5. ⏭️ Build dashboard pages
6. ⏭️ Add marketplace features
7. ⏭️ Integrate payments
8. ⏭️ Deploy to production

---

**Happy coding! 🎉**

For questions or issues, check the troubleshooting section or create an issue on GitHub.
