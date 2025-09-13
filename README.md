# Chore Tracker App

A Next.js application for managing weekly rotating chores among roommates. Built with TypeScript, TailwindCSS, shadcn/ui, and Supabase. The app is currently deployed via Vercel at monastery-chores.vercel.app.

## Features

- **User Authentication**: Simple name-based login with localStorage session management
- **Dashboard**: Overview of current week's chores with progress tracking
- **Chore Management**: Detailed chore cards with subtask checklists
- **Real-time Updates**: Live synchronization with Supabase database
- **Deadline Tracking**: Automatic late marking for overdue chores
- **Quality Check**: Monday-only rating system for completed chores
- **Mobile-First Design**: Responsive UI optimized for mobile devices
- **PWA Support**: Installable as a mobile app

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Styling**: TailwindCSS with custom design system
- **Icons**: Lucide React
- **PWA**: next-pwa

## Database Schema

### Tables

1. **users** - Roommate information
   - `id` (UUID, Primary Key)
   - `name` (Text, Unique)

2. **chores** - Available chores with subtasks
   - `id` (UUID, Primary Key)
   - `name` (Text)
   - `subtasks` (JSONB array)

3. **assignments** - Weekly chore assignments
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key to users)
   - `chore_id` (UUID, Foreign Key to chores)
   - `week_start_date` (Date)
   - `completed` (Boolean, default false)
   - `late` (Boolean, default false)
   - `subtasks_completed` (JSONB array)

4. **ratings** - Quality check ratings
   - `id` (UUID, Primary Key)
   - `rater_id` (UUID, Foreign Key to users)
   - `ratee_id` (UUID, Foreign Key to users)
   - `chore_id` (UUID, Foreign Key to chores)
   - `week_start_date` (Date)
   - `rating` (Integer, 1-5)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd chore-app
npm install
```

### 2. Set Up Supabase

1. Create a new Supabase project
2. Run the following SQL in your Supabase SQL editor:

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

-- Create chores table
CREATE TABLE chores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subtasks JSONB NOT NULL
);

-- Create assignments table
CREATE TABLE assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  chore_id UUID REFERENCES chores(id),
  week_start_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  late BOOLEAN DEFAULT FALSE,
  subtasks_completed JSONB DEFAULT '[]'::jsonb
);

-- Create ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID REFERENCES users(id),
  ratee_id UUID REFERENCES users(id),
  chore_id UUID REFERENCES chores(id),
  week_start_date DATE NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5)
);

-- Insert sample data
INSERT INTO users (name) VALUES 
  ('Alice'),
  ('Bob'),
  ('Charlie'),
  ('Diana');

INSERT INTO chores (name, subtasks) VALUES 
  ('Kitchen', '["Clean microwave", "Wash sink", "Clean stove", "Organize drying rack"]'),
  ('Bathroom', '["Clean toilet", "Wipe sink", "Mop floor", "Restock supplies"]'),
  ('Living Room', '["Vacuum carpet", "Dust surfaces", "Organize cushions", "Empty trash"]'),
  ('Shower', '["Scrub walls", "Clean drain", "Wipe door", "Replace shower curtain"]');
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
CRON_SECRET=your_cron_secret_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Weekly Logic

### Tuesday @ 12:00 AM - Chore Rotation
- Chores rotate between the 4 roommates
- Shower cleaning rotates separately
- New assignments are created for the upcoming week

### Sunday @ 11:59 PM - Late Marking
- Any uncompleted assignments are marked as late
- Users see red warnings on next login

### Monday - Quality Check
- Users can rate completed chores from the previous week
- 1-5 star rating system
- Only available on Mondays

## Cron Job Setup

To set up automatic chore rotation and late marking, you can use Vercel Cron Jobs or external services like cron-job.org.

### Vercel Cron Jobs (recommended)

Add to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/rotate-chores",
      "schedule": "0 0 * * 2"
    },
    {
      "path": "/api/mark-late",
      "schedule": "59 23 * * 0"
    }
  ]
}
```

### External Cron Service

Set up cron jobs to call these endpoints:
- `POST /api/rotate-chores` - Every Tuesday at 12:00 AM
- `POST /api/mark-late` - Every Sunday at 11:59 PM

Include the `Authorization: Bearer your_cron_secret` header.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Project Structure

```
/app
  /api                    # API routes for cron jobs
  /dashboard              # Main dashboard page
  /chores                 # Detailed chores page
  /quality-check          # Quality rating page
  globals.css             # Global styles
  layout.tsx              # Root layout
  page.tsx                # Home page with auth
/components
  /ui                     # shadcn/ui components
  ChoreCard.tsx           # Individual chore display
  Checklist.tsx           # Subtask management
  Navbar.tsx              # Navigation component
  UserSelect.tsx          # User login component
/lib
  supabaseClient.ts       # Supabase configuration
  rotation.ts             # Chore rotation logic
  dates.ts                # Date utilities
  utils.ts                # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
