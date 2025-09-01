#!/bin/bash

echo "🚀 Setting up Chore Tracker App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "✅ Dependencies installed successfully!"

echo ""
echo "🔧 Next steps:"
echo "1. Create a Supabase project at https://supabase.com"
echo "2. Run the SQL script from scripts/setup-db.sql in your Supabase SQL editor"
echo "3. Copy your Supabase URL and anon key from the project settings"
echo "4. Create a .env.local file with your Supabase credentials:"
echo "   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
echo "   CRON_SECRET=your_random_secret"
echo "5. Run 'npm run dev' to start the development server"
echo ""
echo "📚 For more details, see the README.md file"
echo ""
echo "🎉 Happy chore tracking!"
