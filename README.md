# 🎓 Subsync - Student Subscription Sharing Platform

> A modern, full-stack web application for students to share and manage subscriptions affordably.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Quick Demo

Watch how Subsync works:

1. **Sign Up** → Verify college email
2. **Browse Groups** → Find active subscription groups
3. **Join or Create** → Share costs with other students
4. **Pay Securely** → Razorpay integration
5. **Access Immediately** → Get login credentials

---

## ✨ Key Features

### 🔐 Authentication
- Email/password signup & login
- JWT token-based security
- Password strength validation
- College email verification

### 🏪 Peer Marketplace
- List subscriptions you want to share
- Browse available listings
- Request to join groups
- Owner approval/rejection

### 👥 Managed Groups
- Platform creates curated groups
- Automatic member matching
- Full group management
- Waitlist support

### 💳 Payments (Razorpay Ready)
- Secure payment processing
- Transaction history
- Refund handling
- Payment tracking

### 📊 Dashboard
- Active subscriptions
- Payment history
- Group status
- Upcoming expirations

### 🎨 UI/UX
- Responsive design (mobile-first)
- Smooth animations (Framer Motion)
- Dark mode support (coming soon)
- Accessibility-first approach

---

## 🛠️ Tech Stack

**Frontend:** Next.js 14 + React 18 + TypeScript  
**Styling:** Tailwind CSS + Framer Motion  
**Backend:** Node.js + Express (via Next.js API routes)  
**Database:** PostgreSQL  
**Auth:** JWT + bcryptjs  
**Payments:** Razorpay  

---

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local

# 3. Create database
createdb subsync_db

# 4. Update .env.local with database URL
DATABASE_URL=postgresql://user:password@localhost:5432/subsync_db
JWT_SECRET=your_secret_key

# 5. Start dev server
npm run dev
```

Visit **http://localhost:3000** and sign up!

See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

---

## 📖 Documentation

| Document | Contents |
|----------|----------|
| [QUICKSTART.md](./QUICKSTART.md) | Get running in 5 minutes |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Complete installation & deployment |
| [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) | API reference with examples |
| [README_WEBSITE.md](./README_WEBSITE.md) | Static website docs |

---

## 🔌 API Highlights

```
POST   /api/auth/signup          Register account
POST   /api/auth/login           Login
GET    /api/subscriptions        List subscriptions
GET    /api/groups               List groups
POST   /api/groups               Create group
POST   /api/groups/:id/join      Join group
POST   /api/payments             Create payment
GET    /api/dashboard/stats      Dashboard stats
```

Full API reference: [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 📁 Project Structure

```
subsync/
├── app/
│   ├── api/              # Backend API routes
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── dashboard/        # Dashboard
│   └── layout.tsx        # Root layout
├── components/           # React components
├── lib/                  # Utilities (DB, Auth, API)
├── types/                # TypeScript types
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 🌟 Features Implemented

✅ User authentication (JWT)  
✅ Database design (PostgreSQL)  
✅ API routes (all core endpoints)  
✅ UI components (Button, Card, Badge, Toast)  
✅ Responsive design  
✅ Framer Motion animations  
✅ Error handling  
✅ Rate limiting  
✅ Password validation  
✅ TypeScript support  

⏳ Coming Soon:
- Dashboard improvements
- Marketplace launch
- Payment integration
- Email notifications
- Admin panel

---

## 🚀 Deployment

### Vercel (Easiest)
```bash
npm i -g vercel
vercel
```

### Railway
```bash
npm i -g @railway/cli
railway login && railway up
```

### Self-hosted
See [SETUP_GUIDE.md](./SETUP_GUIDE.md#self-hosted-vps)

---

## 🔐 Security

- ✅ JWT authentication
- ✅ Bcryptjs password hashing
- ✅ Input validation
- ✅ Rate limiting
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ Secure credential storage

---

## 📊 Business Model

**Revenue Streams:**
1. Commission per transaction (10-15%)
2. Premium features (₹30-100/month)
3. Vendor partnerships (bulk licensing)

**Unit Economics:**
- 100 users × ₹500 avg transaction × 12% commission = ₹6,000/month

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push & create pull request

---

## 📝 License

MIT License - use freely!

---

## 🆘 Support

**Issues?**
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Check [QUICKSTART.md](./QUICKSTART.md)
- Review code comments
- Check browser console

---

## 🎯 Next Steps

1. ✅ Run locally
2. 👉 Test authentication
3. 👉 Explore API
4. 👉 Customize UI
5. 👉 Deploy to production

---

**Built with ❤️ for students. Happy sharing! 🎉**

**[Get Started Now →](./QUICKSTART.md)**