# Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key from Settings > API
3. Run the SQL script from `scripts/setup-db.sql` in your Supabase SQL editor

### 3. Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CRON_SECRET=your_random_secret_key
```

### 4. Run the App
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start using the app!

## 📱 Features Ready to Use

- ✅ User login with name selection
- ✅ Dashboard with chore overview
- ✅ Detailed chore management with subtasks
- ✅ Real-time completion tracking
- ✅ Late chore warnings
- ✅ Quality check ratings (Mondays only)
- ✅ Mobile-responsive design
- ✅ PWA support for app installation

## 🔄 Automatic Features

The app includes API endpoints for automatic chore rotation:
- `/api/rotate-chores` - Rotates chores every Tuesday
- `/api/mark-late` - Marks overdue chores every Sunday

Set up cron jobs or use Vercel's built-in cron support (see `vercel.json`).

## 🎯 Next Steps

1. Customize chores and users in Supabase
2. Deploy to Vercel for production use
3. Set up cron jobs for automatic rotation
4. Add more features like chore streaks or leaderboards

Happy chore tracking! 🧹✨
