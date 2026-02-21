# IEDC LaunchPad — Clinical Innovation Command Centre

Progressive Web App for the Innovation & Entrepreneurship Development Centre at Govt. Medical College, Thrissur, Kerala.

## Quick Start

```bash
npm install
npm run dev
```

Opens at **http://localhost:3000**

## Login Credentials

| Role     | Email                              | Password       |
|----------|------------------------------------|----------------|
| Admin    | admin@mcthrissur.ac.in             | launchpad2026  |
| Student  | meera@student.mcthrissur.ac.in     | student123     |
| Student  | rahul@student.mcthrissur.ac.in     | student123     |
| Mentor   | priya@mcthrissur.ac.in             | mentor123      |
| Industry | suresh@medtech.in                  | industry123    |

## Features

- **Dashboard** — Stats, active projects, upcoming events, quick actions
- **Problem Registry** — Search/filter clinical problems, submit new ones
- **Projects Pipeline** — Stage-filtered cards (Submitted → Complete)
- **Project Detail** — Milestones, tasks, team view, readiness score
- **File Uploads** — Drag & drop file upload per project (PDF, DOCX, CAD, images)
- **Mentor Feedback** — Structured feedback with ratings (Needs Work / On Track / Excellent)
- **Events Timeline** — Visual timeline with hackathon/exhibition/visit events
- **Analytics Dashboard** — Pipeline funnel, specialty distribution, monthly trends, project health (Admin only)
- **Role-based Access** — Admin can advance stages, mentors can give feedback
- **Notifications** — Bell icon with unread count
- **Responsive** — Works on mobile, tablet, and desktop

## Supabase Integration (Optional)

To persist data with Supabase, create a `.env` file:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Without these, the app runs in local mode with seed data.

## Documents

The `/docs` folder contains:

- **MOU_Template.md** — Partnership MOU template
- **NDA_Template.md** — Non-Disclosure Agreement for industry partners
- **Hackathon_Rules.md** — Rules & judging criteria for April 9 hackathon
- **Idea_Submission_Guide.md** — Student guide for submitting ideas

## Deploy to Vercel

```bash
git add . && git commit -m "Update" && git push
```

On Vercel, set:
- **Build Command:** `npx --yes vite build`
- **Output Directory:** `dist`

## Tech Stack

- React 18 + Vite
- Pure CSS with DM Sans + DM Serif Display
- Supabase-ready architecture (REST API client built in)
