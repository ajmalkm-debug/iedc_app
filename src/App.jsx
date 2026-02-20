import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

// ─── Data & Context ───────────────────────────────────────────────
const AuthContext = createContext(null);
const NotifContext = createContext(null);

const USERS = [
  { id: 1, name: "Dr. Anand Krishnan", email: "admin@mcthrissur.ac.in", role: "admin", department: "General Surgery", avatar: "AK", password: "launchpad2026" },
  { id: 2, name: "Meera Nair", email: "meera@student.mcthrissur.ac.in", role: "student", department: "Pediatrics", avatar: "MN", password: "student123" },
  { id: 3, name: "Rahul Thomas", email: "rahul@student.mcthrissur.ac.in", role: "student", department: "Orthopedics", avatar: "RT", password: "student123" },
  { id: 4, name: "Dr. Priya Menon", email: "priya@mcthrissur.ac.in", role: "mentor", department: "Biomedical Engineering", avatar: "PM", password: "mentor123" },
  { id: 5, name: "Suresh Kumar", email: "suresh@medtech.in", role: "industry", department: "MedTech Solutions", avatar: "SK", password: "industry123" },
];

const SPECIALTIES = [
  "General Surgery", "Pediatrics", "Orthopedics", "Cardiology", "Neurology",
  "Obstetrics & Gynecology", "Ophthalmology", "ENT", "Dermatology",
  "Psychiatry", "Radiology", "Anesthesiology", "Emergency Medicine"
];

const STAGES = ["submitted", "incubating", "prototyping", "validating", "complete"];
const STAGE_COLORS = {
  submitted: { bg: "#E3F2FD", text: "#1565C0", border: "#1565C0" },
  incubating: { bg: "#FFF3E0", text: "#E65100", border: "#E65100" },
  prototyping: { bg: "#E0F2F1", text: "#00695C", border: "#00695C" },
  validating: { bg: "#F3E5F5", text: "#6A1B9A", border: "#6A1B9A" },
  complete: { bg: "#E8F5E9", text: "#2E7D32", border: "#2E7D32" },
};
const IMPACT_COLORS = { Critical: "#D32F2F", High: "#E65100", Medium: "#F9A825", Low: "#43A047" };

const initialProblems = [
  { id: 1, title: "Neonatal Transport Temperature Monitoring Gap", specialty: "Pediatrics", bottleneck: "During inter-hospital neonatal transport, continuous temperature monitoring is unavailable in existing transport incubators used in Kerala government hospitals. Nurses rely on intermittent manual checks every 30 minutes, missing critical hypothermia episodes.", workaround: "Manual temperature checks every 30 min during transport", whyImportedFails: "Imported continuous monitors cost ₹2.5L+ per unit and are not compatible with locally available transport incubators", patientImpact: "Critical", costBurden: 12.5, submittedBy: 2, status: "validated", createdAt: "2026-01-15" },
  { id: 2, title: "Surgical Retractor Fatigue in Long Procedures", specialty: "General Surgery", bottleneck: "During 4+ hour surgeries, assistants holding retractors experience significant hand fatigue leading to instrument slippage and compromised surgical field exposure. No affordable self-retaining system exists for the varied anatomy encountered.", workaround: "Rotating assistants every 45 minutes, using towel padding on retractor handles", whyImportedFails: "Self-retaining systems from Medtronic/J&J cost ₹80K-₹2L per set and don't adapt to Indian patient anatomy variations", patientImpact: "High", costBurden: 4.2, submittedBy: 1, status: "open", createdAt: "2026-01-22" },
  { id: 3, title: "Geriatric Fall Detection in Wards", specialty: "Orthopedics", bottleneck: "Elderly patients in orthopedic wards fall during unsupervised periods (night shifts, bathroom visits). Current nurse-call systems require conscious activation, useless during falls. Average detection time is 15-45 minutes.", workaround: "Increased night rounds, bed rails (which patients climb over), family attendants", whyImportedFails: "Commercial fall detection systems require Wi-Fi infrastructure upgrades (₹15L per ward) not budgeted in government hospitals", patientImpact: "High", costBurden: 8.0, submittedBy: 3, status: "open", createdAt: "2026-02-01" },
];

const initialProjects = [
  { id: 1, title: "NeoTherm — Neonatal Transport Monitor", description: "Low-cost continuous temperature monitoring patch for neonatal transport incubators. Uses flexible thermistor array with BLE connectivity to a nurse's phone app, alerting on hypothermia/hyperthermia with 0.1°C accuracy.", problemId: 1, stage: "prototyping", specialty: "Pediatrics", leadId: 2, mentorId: 4, readinessScore: 72, createdAt: "2026-01-20",
    milestones: [
      { id: 1, title: "Literature Review & Patent Search", status: "completed", dueDate: "2026-01-25" },
      { id: 2, title: "Thermistor Array Design", status: "completed", dueDate: "2026-02-05" },
      { id: 3, title: "BLE Firmware Development", status: "in_progress", dueDate: "2026-02-20" },
      { id: 4, title: "Prototype Assembly", status: "pending", dueDate: "2026-03-05" },
      { id: 5, title: "Clinical Validation Trial", status: "pending", dueDate: "2026-03-25" },
    ],
    tasks: [
      { id: 1, title: "Source flexible thermistors from supplier", assignedTo: 2, status: "done", priority: "high" },
      { id: 2, title: "Design PCB layout in KiCAD", assignedTo: 3, status: "done", priority: "high" },
      { id: 3, title: "Write BLE GATT service code", assignedTo: 3, status: "todo", priority: "high" },
      { id: 4, title: "Build React Native companion app", assignedTo: 2, status: "todo", priority: "medium" },
      { id: 5, title: "Draft clinical trial protocol", assignedTo: 4, status: "todo", priority: "medium" },
    ],
    members: [
      { userId: 2, role: "Lead" },
      { userId: 3, role: "Hardware Engineer" },
      { userId: 4, role: "Mentor" },
    ]
  },
  { id: 2, title: "ErgoRetract — Adaptive Self-Retaining System", description: "3D-printed modular self-retaining surgical retractor system designed for Indian patient anatomy. Uses adjustable arms with ratcheting locks, sterilizable polymer construction, cost target under ₹5000 per set.", problemId: 2, stage: "incubating", specialty: "General Surgery", leadId: 3, mentorId: 4, readinessScore: 35, createdAt: "2026-02-03",
    milestones: [
      { id: 6, title: "Surgeon Interviews & Requirements", status: "completed", dueDate: "2026-02-10" },
      { id: 7, title: "CAD Design — First Iteration", status: "in_progress", dueDate: "2026-02-25" },
      { id: 8, title: "3D Print & Test Prototype", status: "pending", dueDate: "2026-03-15" },
    ],
    tasks: [
      { id: 6, title: "Interview 5 surgeons on retractor pain points", assignedTo: 3, status: "done", priority: "high" },
      { id: 7, title: "Create CAD model in Fusion 360", assignedTo: 3, status: "todo", priority: "high" },
      { id: 8, title: "Identify biocompatible 3D print material", assignedTo: 2, status: "todo", priority: "medium" },
    ],
    members: [
      { userId: 3, role: "Lead" },
      { userId: 2, role: "Design Engineer" },
      { userId: 4, role: "Mentor" },
    ]
  },
];

const initialEvents = [
  { id: 1, title: "Ideation Hackathon Thrissur", type: "hackathon", date: "2026-04-09", venue: "IEDC Lab, Block C, Govt. Medical College Thrissur", description: "24-hour hackathon for clinical innovation ideas. Open to all health science students in Kerala. Top 10 ideas get incubation support.", status: "upcoming" },
  { id: 2, title: "MedTech Innovation Exhibition", type: "exhibition", date: "2026-04-11", venue: "College Auditorium, Govt. Medical College Thrissur", description: "Showcase of prototypes and ongoing projects to faculty, industry partners, and DME officials. Live demonstrations and poster presentations.", status: "upcoming" },
  { id: 3, title: "Kochi MedTech Factory Visit", type: "visit", date: "2026-04-18", venue: "Agappe Diagnostics, Ernakulam", description: "Factory visit to Agappe Diagnostics to understand medical device manufacturing pipeline, quality standards, and commercialization pathway.", status: "upcoming" },
];

const initialNotifications = [
  { id: 1, userId: 1, text: "New problem submitted: Geriatric Fall Detection in Wards", read: false, createdAt: "2026-02-01T10:00:00" },
  { id: 2, userId: 1, text: "NeoTherm project advanced to Prototyping stage", read: false, createdAt: "2026-02-15T14:30:00" },
  { id: 3, userId: 2, text: "Dr. Priya Menon assigned as mentor to NeoTherm", read: true, createdAt: "2026-01-22T09:00:00" },
  { id: 4, userId: 1, text: "Hackathon Thrissur event created for April 9", read: true, createdAt: "2026-02-10T16:00:00" },
  { id: 5, userId: 3, text: "ErgoRetract milestone 'Surgeon Interviews' completed", read: false, createdAt: "2026-02-12T11:00:00" },
  { id: 6, userId: 1, text: "New idea submitted: ErgoRetract — Adaptive Self-Retaining System", read: true, createdAt: "2026-02-03T08:45:00" },
];

// ─── Icons (inline SVG) ──────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const s = { width: size, height: size, flexShrink: 0 };
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    problems: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    projects: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    events: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    back: <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    award: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    pin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></>,
    close: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    chevron: <><polyline points="9 18 15 12 9 6" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    file: <><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></>,
  };
  return (
    <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
};

// ─── Utility ──────────────────────────────────────────────────────
const daysUntil = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date("2026-02-19");
  return Math.ceil((d - now) / 86400000);
};
const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const getUserById = (id) => USERS.find(u => u.id === id);
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ─── Styles ───────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display&display=swap');

:root {
  --blue-900: #0A1929;
  --blue-800: #0F3D5E;
  --blue-700: #1A5276;
  --teal-600: #00897B;
  --teal-500: #00A8A8;
  --teal-400: #26C6DA;
  --surface: #F6F8FB;
  --white: #FFFFFF;
  --gray-50: #F8FAFC;
  --gray-100: #F1F5F9;
  --gray-200: #E2E8F0;
  --gray-300: #CBD5E1;
  --gray-400: #94A3B8;
  --gray-500: #64748B;
  --gray-600: #475569;
  --gray-700: #334155;
  --gray-800: #1E293B;
  --radius: 4px;
  --sidebar-width: 240px;
  --topbar-height: 60px;
  --font-heading: 'DM Serif Display', serif;
  --font-body: 'DM Sans', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body, html, #root {
  font-family: var(--font-body);
  background: var(--surface);
  color: var(--gray-800);
  height: 100%;
  -webkit-font-smoothing: antialiased;
}

.serif { font-family: var(--font-heading); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--gray-300); border-radius: 3px; }

/* Login Page */
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--blue-900) 0%, var(--blue-800) 50%, #0D2F47 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}
.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(0,137,123,0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0,168,168,0.06) 0%, transparent 50%),
    repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px),
    repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.015) 60px, rgba(255,255,255,0.015) 61px);
}
.login-card {
  background: var(--white);
  border-radius: var(--radius);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  box-shadow: 0 25px 60px rgba(0,0,0,0.3);
}
.login-card h1 { font-family: var(--font-heading); font-size: 26px; color: var(--blue-900); margin-bottom: 4px; }
.login-card .subtitle { color: var(--gray-500); font-size: 13px; margin-bottom: 28px; letter-spacing: 0.5px; text-transform: uppercase; }
.login-logo {
  width: 56px; height: 56px; border-radius: var(--radius);
  background: linear-gradient(135deg, var(--teal-600), var(--teal-500));
  display: flex; align-items: center; justify-content: center;
  color: white; font-family: var(--font-heading); font-size: 22px; font-weight: 700;
  margin-bottom: 20px;
}

/* Form */
.form-group { margin-bottom: 16px; }
.form-label { display: block; font-size: 13px; font-weight: 500; color: var(--gray-600); margin-bottom: 6px; }
.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: var(--font-body);
  color: var(--gray-800);
  background: var(--white);
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: var(--teal-500);
  box-shadow: 0 0 0 3px rgba(0,168,168,0.1);
}
.form-textarea { resize: vertical; min-height: 80px; }
.form-error { color: #D32F2F; font-size: 12px; margin-top: 4px; }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  border: none; border-radius: var(--radius);
  font-size: 14px; font-weight: 500; font-family: var(--font-body);
  cursor: pointer; transition: all 0.15s;
  text-decoration: none;
}
.btn-primary {
  background: linear-gradient(135deg, var(--teal-600), var(--teal-500));
  color: white;
}
.btn-primary:hover { box-shadow: 0 4px 12px rgba(0,137,123,0.3); transform: translateY(-1px); }
.btn-secondary { background: var(--gray-100); color: var(--gray-700); }
.btn-secondary:hover { background: var(--gray-200); }
.btn-ghost { background: transparent; color: var(--gray-600); padding: 8px 12px; }
.btn-ghost:hover { background: var(--gray-100); }
.btn-sm { padding: 6px 14px; font-size: 13px; }
.btn-full { width: 100%; justify-content: center; }
.btn-danger { background: #FDECEA; color: #D32F2F; }

/* TopBar */
.topbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--topbar-height);
  background: linear-gradient(135deg, var(--blue-900), var(--blue-800));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
}
.topbar-left { display: flex; align-items: center; gap: 12px; }
.topbar-brand { display: flex; align-items: center; gap: 10px; }
.topbar-logo {
  width: 36px; height: 36px; border-radius: var(--radius);
  background: linear-gradient(135deg, var(--teal-600), var(--teal-500));
  display: flex; align-items: center; justify-content: center;
  color: white; font-family: var(--font-heading); font-size: 15px; font-weight: 700;
}
.topbar-title { color: white; font-family: var(--font-heading); font-size: 18px; line-height: 1.1; }
.topbar-subtitle { color: rgba(255,255,255,0.5); font-size: 11px; }
.topbar-right { display: flex; align-items: center; gap: 16px; }
.topbar-bell {
  position: relative;
  background: none; border: none; cursor: pointer; padding: 6px;
  color: rgba(255,255,255,0.7);
  transition: color 0.15s;
}
.topbar-bell:hover { color: white; }
.bell-badge {
  position: absolute; top: 2px; right: 2px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #EF5350; color: white;
  font-size: 10px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
.topbar-user {
  display: flex; align-items: center; gap: 8px; cursor: pointer;
  background: none; border: none; color: white;
}
.topbar-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: white;
}
.topbar-name { font-size: 13px; font-weight: 500; }
.topbar-role {
  font-size: 10px; padding: 2px 6px; border-radius: 2px;
  background: rgba(0,168,168,0.2); color: var(--teal-400);
  text-transform: uppercase; letter-spacing: 0.5px;
}
.hamburger { display: none; background: none; border: none; color: rgba(255,255,255,0.8); cursor: pointer; padding: 4px; }

/* Sidebar */
.sidebar {
  position: fixed;
  top: var(--topbar-height); left: 0;
  width: var(--sidebar-width);
  height: calc(100vh - var(--topbar-height));
  background: var(--white);
  border-right: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  z-index: 90;
  transition: transform 0.25s ease;
}
.sidebar-nav { flex: 1; padding: 12px 0; }
.sidebar-item {
  display: flex; align-items: center; gap: 12px;
  padding: 11px 20px;
  font-size: 14px; font-weight: 500;
  color: var(--gray-500);
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.15s;
  text-decoration: none;
}
.sidebar-item:hover { background: var(--gray-50); color: var(--gray-700); }
.sidebar-item.active {
  border-left-color: var(--teal-500);
  color: var(--teal-600);
  background: rgba(0,168,168,0.05);
}
.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid var(--gray-200);
  font-size: 11px;
  color: var(--gray-400);
  line-height: 1.5;
}
.sidebar-backdrop {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 89;
}

/* Main */
.main {
  margin-top: var(--topbar-height);
  margin-left: var(--sidebar-width);
  padding: 28px 32px;
  min-height: calc(100vh - var(--topbar-height));
}
.main-inner { max-width: 1100px; }

/* Notification dropdown */
.notif-dropdown {
  position: absolute;
  top: calc(100% + 8px); right: 0;
  width: 340px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border: 1px solid var(--gray-200);
  z-index: 200;
  max-height: 400px;
  overflow-y: auto;
}
.notif-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-100);
  font-size: 13px; font-weight: 600; color: var(--gray-700);
}
.notif-item {
  padding: 12px 16px;
  border-bottom: 1px solid var(--gray-50);
  font-size: 13px;
  color: var(--gray-600);
  line-height: 1.5;
  cursor: default;
}
.notif-item.unread { background: rgba(0,168,168,0.03); border-left: 3px solid var(--teal-500); }
.notif-time { font-size: 11px; color: var(--gray-400); margin-top: 4px; }

/* User menu */
.user-menu {
  position: absolute;
  top: calc(100% + 8px); right: 0;
  width: 200px;
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border: 1px solid var(--gray-200);
  z-index: 200;
  padding: 8px;
}
.user-menu-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; border-radius: var(--radius);
  font-size: 13px; color: var(--gray-600);
  cursor: pointer; border: none; background: none; width: 100%;
  text-align: left; font-family: var(--font-body);
}
.user-menu-item:hover { background: var(--gray-50); }

/* Dashboard */
.dash-greeting h1 { font-family: var(--font-heading); font-size: 28px; color: var(--blue-900); margin-bottom: 2px; }
.dash-greeting p { color: var(--gray-500); font-size: 14px; margin-bottom: 24px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}
.stat-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  transition: all 0.15s;
}
.stat-card:hover { border-color: var(--gray-300); box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.stat-icon {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px;
}
.stat-number { font-family: var(--font-heading); font-size: 32px; color: var(--blue-900); }
.stat-label { font-size: 13px; color: var(--gray-500); margin-top: 2px; }

.dash-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}
.dash-section {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  overflow: hidden;
}
.dash-section-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-700);
}
.dash-row {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px;
  border-bottom: 1px solid var(--gray-50);
  cursor: pointer;
  transition: background 0.1s;
}
.dash-row:hover { background: var(--gray-50); }
.dash-row:last-child { border-bottom: none; }
.dash-row-title { font-size: 14px; font-weight: 500; color: var(--gray-800); flex: 1; }
.progress-bar-bg {
  height: 6px; border-radius: 3px; background: var(--gray-100);
  width: 80px; overflow: hidden;
}
.progress-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.progress-text { font-size: 11px; color: var(--gray-400); min-width: 32px; text-align: right; }

.quick-actions { display: flex; gap: 12px; }

/* Stage badge */
.stage-badge {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 2px;
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
}

/* Impact badge */
.impact-badge {
  display: inline-flex; align-items: center;
  padding: 3px 10px; border-radius: 2px;
  font-size: 11px; font-weight: 600;
  color: white;
}

/* Event type badge */
.event-type { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; }
.days-badge {
  display: inline-flex; padding: 2px 8px; border-radius: 2px;
  font-size: 11px; font-weight: 600;
}

/* Cards */
.card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 20px;
}

/* Page headers */
.page-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
}
.page-title { font-family: var(--font-heading); font-size: 24px; color: var(--blue-900); }
.page-count { font-size: 14px; color: var(--gray-400); margin-left: 8px; font-family: var(--font-body); }

/* Filter bar */
.filter-bar {
  display: flex; gap: 12px; margin-bottom: 20px; align-items: center;
  flex-wrap: wrap;
}
.search-box {
  display: flex; align-items: center; gap: 8px;
  background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius); padding: 8px 12px;
  flex: 1; min-width: 200px;
}
.search-box input {
  border: none; outline: none; font-size: 14px;
  font-family: var(--font-body); color: var(--gray-800);
  width: 100%; background: transparent;
}
.filter-select {
  padding: 8px 12px; border: 1px solid var(--gray-200);
  border-radius: var(--radius); font-size: 13px;
  font-family: var(--font-body); background: var(--white);
  color: var(--gray-700); cursor: pointer; outline: none;
}

/* Stage pills */
.stage-pills {
  display: flex; gap: 8px; margin-bottom: 20px;
  overflow-x: auto; padding-bottom: 4px;
}
.stage-pill {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 16px; border-radius: 20px;
  font-size: 13px; font-weight: 500;
  cursor: pointer; border: 1.5px solid var(--gray-200);
  background: var(--white); color: var(--gray-500);
  white-space: nowrap; transition: all 0.15s;
}
.stage-pill.active { font-weight: 600; }

/* Problem cards */
.problem-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
.problem-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 20px;
  transition: all 0.15s;
  cursor: default;
}
.problem-card:hover { border-color: var(--gray-300); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
.problem-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
.problem-card h3 { font-size: 15px; font-weight: 600; color: var(--gray-800); }
.problem-meta { display: flex; gap: 16px; margin-top: 10px; font-size: 13px; color: var(--gray-500); flex-wrap: wrap; }
.problem-meta span { display: flex; align-items: center; gap: 4px; }

/* Project cards grid */
.project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.project-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.project-card:hover { box-shadow: 0 6px 16px rgba(0,0,0,0.06); transform: translateY(-2px); }
.project-card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.project-card h3 { font-size: 16px; font-weight: 600; color: var(--gray-800); margin-bottom: 6px; }
.project-card p { font-size: 13px; color: var(--gray-500); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 14px; }
.project-card-footer { display: flex; justify-content: space-between; align-items: center; }
.project-card-people { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--gray-500); }
.mini-avatar {
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--gray-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600; color: var(--gray-500);
}
.project-progress { display: flex; align-items: center; gap: 8px; }

/* Project detail */
.detail-back {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--gray-500);
  margin-bottom: 16px; cursor: pointer;
  background: none; border: none; font-family: var(--font-body);
}
.detail-back:hover { color: var(--teal-600); }
.detail-header {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 24px;
  margin-bottom: 20px;
}
.detail-header h1 { font-family: var(--font-heading); font-size: 24px; color: var(--blue-900); margin-bottom: 8px; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.detail-desc { font-size: 14px; color: var(--gray-600); line-height: 1.6; margin-bottom: 16px; }
.detail-meta { display: flex; gap: 24px; font-size: 13px; color: var(--gray-500); flex-wrap: wrap; }
.detail-meta-item { display: flex; align-items: center; gap: 6px; }
.detail-meta-label { font-weight: 600; color: var(--gray-600); }

.detail-tabs {
  display: flex; gap: 0; border-bottom: 2px solid var(--gray-200);
  margin-bottom: 20px;
}
.detail-tab {
  padding: 12px 24px;
  font-size: 14px; font-weight: 500;
  color: var(--gray-500);
  cursor: pointer;
  border: none; background: none;
  font-family: var(--font-body);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.15s;
}
.detail-tab:hover { color: var(--gray-700); }
.detail-tab.active { color: var(--teal-600); border-bottom-color: var(--teal-600); }

.overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.readiness-ring {
  width: 120px; height: 120px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}
.readiness-inner {
  width: 96px; height: 96px; border-radius: 50%;
  background: white;
  display: flex; align-items: center; justify-content: center;
  flex-direction: column;
}
.readiness-score { font-family: var(--font-heading); font-size: 28px; color: var(--blue-900); }
.readiness-label { font-size: 11px; color: var(--gray-500); }

.milestone-item, .task-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--gray-100);
}
.milestone-item:last-child, .task-item:last-child { border-bottom: none; }
.check-circle, .check-square {
  width: 22px; height: 22px;
  border: 2px solid var(--gray-300);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0;
  transition: all 0.15s;
}
.check-circle { border-radius: 50%; }
.check-square { border-radius: 3px; }
.check-circle.checked, .check-square.checked {
  background: var(--teal-500); border-color: var(--teal-500);
}
.item-content { flex: 1; }
.item-title { font-size: 14px; font-weight: 500; color: var(--gray-800); }
.item-title.done { text-decoration: line-through; color: var(--gray-400); }
.item-meta { font-size: 12px; color: var(--gray-400); margin-top: 2px; display: flex; gap: 12px; }
.priority-badge {
  font-size: 10px; font-weight: 600; padding: 1px 6px;
  border-radius: 2px; text-transform: uppercase;
}

/* Events timeline */
.timeline { position: relative; padding-left: 60px; }
.timeline::before {
  content: '';
  position: absolute;
  left: 27px; top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, var(--teal-500), var(--teal-400), var(--gray-200));
}
.timeline-item { position: relative; margin-bottom: 24px; }
.timeline-dot {
  position: absolute;
  left: -60px; top: 0;
  width: 40px; height: 40px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 1;
}
.timeline-card {
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius);
  padding: 20px;
  transition: all 0.15s;
}
.timeline-card.past { opacity: 0.6; }
.timeline-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.timeline-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; flex-wrap: wrap; }
.timeline-card h3 { font-size: 16px; font-weight: 600; color: var(--gray-800); }
.timeline-card p { font-size: 13px; color: var(--gray-500); line-height: 1.5; margin-bottom: 10px; }
.timeline-venue { font-size: 13px; color: var(--gray-500); display: flex; align-items: center; gap: 4px; }

/* Linked problem box */
.linked-problem {
  background: #FFF8E1;
  border: 1px solid #FFE082;
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-top: 12px;
  font-size: 13px;
  color: #F57F17;
  display: flex; align-items: center; gap: 8px;
}

/* Team list */
.team-list { display: flex; flex-direction: column; gap: 8px; }
.team-member {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 0;
}
.team-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--gray-100);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; color: var(--gray-500);
}
.team-info { flex: 1; }
.team-name { font-size: 14px; font-weight: 500; color: var(--gray-800); }
.team-role { font-size: 12px; color: var(--gray-400); }

/* Toast */
.toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 500; }
.toast {
  background: var(--blue-900);
  color: white;
  padding: 12px 20px;
  border-radius: var(--radius);
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  animation: slideUp 0.3s ease;
  margin-top: 8px;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive */
@media (max-width: 1024px) {
  .hamburger { display: block; }
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .sidebar-backdrop.open { display: block; }
  .main { margin-left: 0; padding: 20px 16px; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-grid { grid-template-columns: 1fr; }
  .overview-grid { grid-template-columns: 1fr; }
  .notif-dropdown { width: 300px; right: -40px; }
  .topbar-name { display: none; }
}
@media (max-width: 640px) {
  .stage-pills { gap: 6px; }
  .project-grid { grid-template-columns: 1fr; }
  .detail-meta { gap: 12px; }
  .quick-actions { flex-direction: column; }
  .quick-actions .btn { width: 100%; justify-content: center; }
  .filter-bar { flex-direction: column; }
  .search-box { min-width: 100%; }
  .page-header { flex-direction: column; align-items: flex-start; }
}
`;

// ─── COMPONENTS ───────────────────────────────────────────────────

// Toast system
const ToastContainer = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => <div key={t.id} className="toast">{t.text}</div>)}
  </div>
);

// ─── Login Page ───────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("admin@mcthrissur.ac.in");
  const [password, setPassword] = useState("launchpad2026");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) onLogin(user);
    else setError("Invalid credentials. Try admin@mcthrissur.ac.in / launchpad2026");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">LP</div>
        <h1>IEDC LaunchPad</h1>
        <div className="subtitle">Clinical Innovation Command Centre</div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 4, padding: "12px 20px" }}>Sign In</button>
        </form>
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--gray-200)", textAlign: "center", fontSize: 11, color: "var(--gray-400)", lineHeight: 1.6 }}>
          Govt. Medical College Thrissur · CSDT · KDISC<br />
          Directorate of Medical Education, Kerala
        </div>
      </div>
    </div>
  );
};

// ─── TopBar ───────────────────────────────────────────────────────
const TopBar = ({ user, onLogout, onToggleSidebar, notifications, onMarkAllRead }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.read && n.userId === user.id).length;
  const userNotifs = notifications.filter(n => n.userId === user.id).slice(0, 6);

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="hamburger" onClick={onToggleSidebar}>
          <Icon name="menu" size={22} />
        </button>
        <div className="topbar-brand">
          <div className="topbar-logo">LP</div>
          <div>
            <div className="topbar-title">IEDC LaunchPad</div>
            <div className="topbar-subtitle">Medical College Thrissur</div>
          </div>
        </div>
      </div>
      <div className="topbar-right">
        <div style={{ position: "relative" }}>
          <button className="topbar-bell" onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}>
            <Icon name="bell" size={20} />
            {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
          </button>
          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                <button className="btn btn-ghost btn-sm" style={{ padding: "4px 8px", fontSize: 12 }} onClick={() => { onMarkAllRead(); }}>Mark all read</button>
              </div>
              {userNotifs.map(n => (
                <div key={n.id} className={`notif-item ${!n.read ? "unread" : ""}`}>
                  {n.text}
                  <div className="notif-time">{formatDate(n.createdAt)}</div>
                </div>
              ))}
              {userNotifs.length === 0 && <div className="notif-item" style={{ color: "var(--gray-400)" }}>No notifications</div>}
            </div>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <button className="topbar-user" onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}>
            <div className="topbar-avatar">{user.avatar}</div>
            <div style={{ textAlign: "left" }}>
              <div className="topbar-name">{user.name}</div>
              <div className="topbar-role">{user.role}</div>
            </div>
          </button>
          {showUserMenu && (
            <div className="user-menu">
              <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--gray-400)", borderBottom: "1px solid var(--gray-100)", marginBottom: 4 }}>
                {user.email}
              </div>
              <button className="user-menu-item" onClick={onLogout}>
                <Icon name="logout" size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────
const Sidebar = ({ active, onNavigate, isOpen, onClose }) => {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: "dashboard" },
    { key: "problems", label: "Problem Registry", icon: "problems" },
    { key: "projects", label: "Projects", icon: "projects" },
    { key: "events", label: "Events", icon: "events" },
  ];
  return (
    <>
      <div className={`sidebar-backdrop ${isOpen ? "open" : ""}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-nav">
          {items.map(it => (
            <div key={it.key} className={`sidebar-item ${active === it.key ? "active" : ""}`}
              onClick={() => { onNavigate(it.key); onClose(); }}>
              <Icon name={it.icon} size={20} />
              {it.label}
            </div>
          ))}
        </div>
        <div className="sidebar-footer">
          IEDC — CSDT Thrissur<br />
          Govt. Medical College<br />
          Dept. of Medical Education, Kerala
        </div>
      </div>
    </>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────
const Dashboard = ({ problems, projects, events, onNavigate }) => {
  const stats = [
    { label: "Clinical Problems", count: problems.length, color: "#E65100", bg: "#FFF3E0", icon: "problems" },
    { label: "Active Projects", count: projects.length, color: "#00897B", bg: "#E0F2F1", icon: "projects" },
    { label: "In Prototyping", count: projects.filter(p => p.stage === "prototyping").length, color: "#1565C0", bg: "#E3F2FD", icon: "file" },
    { label: "Upcoming Events", count: events.filter(e => daysUntil(e.date) >= 0).length, color: "#6A1B9A", bg: "#F3E5F5", icon: "events" },
  ];
  const navKeys = ["problems", "projects", "projects", "events"];

  return (
    <div className="main-inner">
      <div className="dash-greeting">
        <h1 className="serif">Command Centre</h1>
        <p>Innovation & Entrepreneurship Development Centre · Govt. Medical College Thrissur</p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card" onClick={() => onNavigate(navKeys[i])}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <Icon name={s.icon} size={20} color={s.color} />
            </div>
            <div className="stat-number">{s.count}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <div className="dash-section">
          <div className="dash-section-header">Active Projects</div>
          {projects.map(p => {
            const done = p.milestones.filter(m => m.status === "completed").length;
            const total = p.milestones.length;
            const sc = STAGE_COLORS[p.stage];
            return (
              <div key={p.id} className="dash-row" onClick={() => onNavigate("project-detail", p.id)}>
                <div className="dash-row-title">{p.title}</div>
                <span className="stage-badge" style={{ background: sc.bg, color: sc.text }}>{capitalize(p.stage)}</span>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${(done / total) * 100}%`, background: sc.border }} />
                </div>
                <div className="progress-text">{done}/{total}</div>
              </div>
            );
          })}
        </div>
        <div className="dash-section">
          <div className="dash-section-header">Upcoming Events</div>
          {events.filter(e => daysUntil(e.date) >= 0).map(ev => {
            const d = daysUntil(ev.date);
            const typeColors = { hackathon: { bg: "#FFF3E0", color: "#E65100" }, exhibition: { bg: "#E3F2FD", color: "#1565C0" }, visit: { bg: "#F3E5F5", color: "#6A1B9A" } };
            const tc = typeColors[ev.type];
            return (
              <div key={ev.id} className="dash-row" onClick={() => onNavigate("events")}>
                <div className="dash-row-title">{ev.title}</div>
                <span className="event-type" style={{ color: tc.color }}>{capitalize(ev.type)}</span>
                <span className="days-badge" style={{ background: d < 14 ? "#FFF3E0" : "#E8F5E9", color: d < 14 ? "#E65100" : "#2E7D32" }}>
                  {d === 0 ? "Today!" : `${d}d`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => onNavigate("new-problem")}>
          <Icon name="plus" size={18} color="white" /> Submit Clinical Problem
        </button>
        <button className="btn btn-secondary" onClick={() => onNavigate("new-project")}>
          <Icon name="plus" size={18} /> Submit Innovation Idea
        </button>
      </div>
    </div>
  );
};

// ─── Problem Registry ─────────────────────────────────────────────
const ProblemRegistry = ({ problems, onNavigate }) => {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const filtered = problems.filter(p =>
    (specialty === "All" || p.specialty === specialty) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()) || p.bottleneck.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="main-inner">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <h1 className="page-title serif">Clinical Problem Registry</h1>
          <span className="page-count">({problems.length})</span>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate("new-problem")}>
          <Icon name="plus" size={18} color="white" /> Report Problem
        </button>
      </div>
      <div className="filter-bar">
        <div className="search-box">
          <Icon name="search" size={18} color="var(--gray-400)" />
          <input placeholder="Search problems..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={specialty} onChange={e => setSpecialty(e.target.value)}>
          <option>All</option>
          {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="problem-grid">
        {filtered.map(p => {
          const submitter = getUserById(p.submittedBy);
          return (
            <div key={p.id} className="problem-card">
              <div className="problem-card-header">
                <h3>{p.title}</h3>
                <span className="impact-badge" style={{ background: IMPACT_COLORS[p.patientImpact] }}>{p.patientImpact}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--gray-500)", lineHeight: 1.6, marginBottom: 8 }}>{p.bottleneck}</p>
              <div className="problem-meta">
                <span style={{ background: "var(--gray-100)", padding: "2px 8px", borderRadius: 2 }}>{p.specialty}</span>
                <span>Submitted by {submitter?.name}</span>
                {p.costBurden && <span>₹{p.costBurden}L annual cost</span>}
                <span style={{ background: p.status === "validated" ? "#E8F5E9" : "#E3F2FD", color: p.status === "validated" ? "#2E7D32" : "#1565C0", padding: "2px 8px", borderRadius: 2, fontWeight: 600, fontSize: 11 }}>
                  {capitalize(p.status)}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--gray-400)" }}>No problems match your filters.</div>
        )}
      </div>
    </div>
  );
};

// ─── New Problem Form ─────────────────────────────────────────────
const NewProblemForm = ({ onNavigate, onSubmit }) => {
  const [form, setForm] = useState({ title: "", specialty: "", patientImpact: "", bottleneck: "", workaround: "", whyImportedFails: "", costBurden: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.specialty) e.specialty = "Required";
    if (!form.patientImpact) e.patientImpact = "Required";
    if (!form.bottleneck.trim()) e.bottleneck = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, costBurden: form.costBurden ? parseFloat(form.costBurden) : null });
    onNavigate("problems");
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="main-inner" style={{ maxWidth: 640 }}>
      <button className="detail-back" onClick={() => onNavigate("problems")}><Icon name="back" size={18} /> Back to Registry</button>
      <h1 className="page-title serif" style={{ marginBottom: 20 }}>Report Clinical Problem</h1>
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Problem Title *</label>
          <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Brief, descriptive title" />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Clinical Specialty *</label>
            <select className="form-select" value={form.specialty} onChange={e => set("specialty", e.target.value)}>
              <option value="">Select...</option>
              {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
            </select>
            {errors.specialty && <div className="form-error">{errors.specialty}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Patient Impact *</label>
            <select className="form-select" value={form.patientImpact} onChange={e => set("patientImpact", e.target.value)}>
              <option value="">Select...</option>
              {["Critical", "High", "Medium", "Low"].map(i => <option key={i}>{i}</option>)}
            </select>
            {errors.patientImpact && <div className="form-error">{errors.patientImpact}</div>}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Clinical Bottleneck *</label>
          <textarea className="form-textarea" rows={4} value={form.bottleneck} onChange={e => set("bottleneck", e.target.value)} placeholder="Describe the core clinical problem..." maxLength={500} />
          <div style={{ fontSize: 11, color: "var(--gray-400)", marginTop: 4, textAlign: "right" }}>{form.bottleneck.length}/500</div>
          {errors.bottleneck && <div className="form-error">{errors.bottleneck}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Current Workaround</label>
          <textarea className="form-textarea" rows={2} value={form.workaround} onChange={e => set("workaround", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Why Imported Technology Fails</label>
          <textarea className="form-textarea" rows={2} value={form.whyImportedFails} onChange={e => set("whyImportedFails", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Annual Cost Burden (₹ Lakhs)</label>
          <input className="form-input" type="number" step="0.1" value={form.costBurden} onChange={e => set("costBurden", e.target.value)} placeholder="e.g. 5.0" />
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate("problems")}>Cancel</button>
          <button type="submit" className="btn btn-primary">Submit Problem</button>
        </div>
      </form>
    </div>
  );
};

// ─── Projects List ────────────────────────────────────────────────
const ProjectsList = ({ projects, onNavigate }) => {
  const [stageFilter, setStageFilter] = useState("all");
  const filtered = stageFilter === "all" ? projects : projects.filter(p => p.stage === stageFilter);
  const counts = { all: projects.length };
  STAGES.forEach(s => { counts[s] = projects.filter(p => p.stage === s).length; });

  return (
    <div className="main-inner">
      <div className="page-header">
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <h1 className="page-title serif">Innovation Projects</h1>
          <span className="page-count">({projects.length})</span>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate("new-project")}>
          <Icon name="plus" size={18} color="white" /> New Idea
        </button>
      </div>
      <div className="stage-pills">
        {[{ key: "all", label: "All" }, ...STAGES.map(s => ({ key: s, label: capitalize(s) }))].map(pill => {
          const sc = pill.key === "all" ? { bg: "var(--gray-100)", text: "var(--gray-700)", border: "var(--gray-400)" } : STAGE_COLORS[pill.key];
          const isActive = stageFilter === pill.key;
          return (
            <button key={pill.key} className={`stage-pill ${isActive ? "active" : ""}`}
              style={isActive ? { background: sc.bg, color: sc.text, borderColor: sc.border } : {}}
              onClick={() => setStageFilter(pill.key)}>
              {pill.label}
              <span style={{ fontSize: 11, opacity: 0.7 }}>{counts[pill.key]}</span>
            </button>
          );
        })}
      </div>
      <div className="project-grid">
        {filtered.map(p => {
          const sc = STAGE_COLORS[p.stage];
          const done = p.milestones.filter(m => m.status === "completed").length;
          const total = p.milestones.length;
          const lead = getUserById(p.leadId);
          const mentor = getUserById(p.mentorId);
          return (
            <div key={p.id} className="project-card" onClick={() => onNavigate("project-detail", p.id)}>
              <div className="project-card-top">
                <span className="stage-badge" style={{ background: sc.bg, color: sc.text }}>{capitalize(p.stage)}</span>
                <span style={{ fontSize: 12, color: "var(--gray-400)" }}>{p.specialty}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="project-progress" style={{ marginBottom: 12 }}>
                <div className="progress-bar-bg" style={{ flex: 1 }}>
                  <div className="progress-bar-fill" style={{ width: `${(done / total) * 100}%`, background: sc.border }} />
                </div>
                <span className="progress-text">{done}/{total} milestones</span>
              </div>
              <div className="project-card-footer">
                <div className="project-card-people">
                  <div className="mini-avatar">{lead?.avatar}</div>
                  <span>{lead?.name}</span>
                </div>
                {mentor && <div style={{ fontSize: 12, color: "var(--gray-400)" }}>Mentor: {mentor.name.split(" ")[0]}</div>}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--gray-400)", gridColumn: "1 / -1" }}>No projects in this stage.</div>
        )}
      </div>
    </div>
  );
};

// ─── New Project Form ─────────────────────────────────────────────
const NewProjectForm = ({ problems, onNavigate, onSubmit }) => {
  const [form, setForm] = useState({ title: "", specialty: "", problemId: "", description: "" });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.specialty) e.specialty = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(form);
    onNavigate("projects");
  };
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="main-inner" style={{ maxWidth: 640 }}>
      <button className="detail-back" onClick={() => onNavigate("projects")}><Icon name="back" size={18} /> Back to Projects</button>
      <h1 className="page-title serif" style={{ marginBottom: 20 }}>Submit Innovation Idea</h1>
      <form className="card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Idea Title *</label>
          <input className="form-input" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Name your innovation" />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Clinical Specialty *</label>
          <select className="form-select" value={form.specialty} onChange={e => set("specialty", e.target.value)}>
            <option value="">Select...</option>
            {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
          </select>
          {errors.specialty && <div className="form-error">{errors.specialty}</div>}
        </div>
        <div className="form-group">
          <label className="form-label">Linked Clinical Problem</label>
          <select className="form-select" value={form.problemId} onChange={e => set("problemId", e.target.value)}>
            <option value="">None — standalone idea</option>
            {problems.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea className="form-textarea" rows={5} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Describe your innovation idea in detail..." />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 8 }}>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate("projects")}>Cancel</button>
          <button type="submit" className="btn btn-primary">Submit Idea</button>
        </div>
      </form>
    </div>
  );
};

// ─── Project Detail ───────────────────────────────────────────────
const ProjectDetail = ({ project, problems, user, onNavigate, onToggleMilestone, onToggleTask, onAdvanceStage }) => {
  const [tab, setTab] = useState("overview");
  if (!project) return <div className="main-inner"><p>Project not found.</p></div>;

  const sc = STAGE_COLORS[project.stage];
  const lead = getUserById(project.leadId);
  const mentor = getUserById(project.mentorId);
  const linkedProblem = problems.find(p => p.id === project.problemId);
  const completedM = project.milestones.filter(m => m.status === "completed").length;
  const totalM = project.milestones.length;
  const completedT = project.tasks.filter(t => t.status === "done").length;
  const totalT = project.tasks.length;
  const stageIdx = STAGES.indexOf(project.stage);
  const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : null;

  const ringPct = project.readinessScore;
  const ringStyle = {
    background: `conic-gradient(var(--teal-500) 0deg, var(--teal-500) ${ringPct * 3.6}deg, var(--gray-100) ${ringPct * 3.6}deg)`
  };

  return (
    <div className="main-inner">
      <button className="detail-back" onClick={() => onNavigate("projects")}><Icon name="back" size={18} /> Back to Projects</button>
      <div className="detail-header">
        <h1>
          {project.title}
          <span className="stage-badge" style={{ background: sc.bg, color: sc.text, fontSize: 13 }}>{capitalize(project.stage)}</span>
        </h1>
        <p className="detail-desc">{project.description}</p>
        <div className="detail-meta">
          <div className="detail-meta-item"><span className="detail-meta-label">Lead:</span> {lead?.name}</div>
          <div className="detail-meta-item"><span className="detail-meta-label">Mentor:</span> {mentor?.name}</div>
          <div className="detail-meta-item"><span className="detail-meta-label">Specialty:</span> {project.specialty}</div>
          <div className="detail-meta-item"><span className="detail-meta-label">Team:</span> {project.members.length} members</div>
        </div>
        {user.role === "admin" && nextStage && (
          <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => onAdvanceStage(project.id)}>
            Advance Stage → {capitalize(nextStage)}
          </button>
        )}
        {linkedProblem && (
          <div className="linked-problem">
            <Icon name="problems" size={16} color="#F57F17" />
            Linked Problem: {linkedProblem.title}
          </div>
        )}
      </div>

      <div className="detail-tabs">
        {["overview", "milestones", "tasks"].map(t => (
          <button key={t} className={`detail-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {capitalize(t)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="overview-grid">
          <div className="card">
            <div className="readiness-ring" style={ringStyle}>
              <div className="readiness-inner">
                <div className="readiness-score">{project.readinessScore}</div>
                <div className="readiness-label">Readiness</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--blue-900)" }}>{completedM}/{totalM}</div>
                <div style={{ fontSize: 12, color: "var(--gray-400)" }}>Milestones</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-heading)", fontSize: 22, color: "var(--blue-900)" }}>{completedT}/{totalT}</div>
                <div style={{ fontSize: 12, color: "var(--gray-400)" }}>Tasks</div>
              </div>
            </div>
          </div>
          <div className="card">
            <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--gray-700)", marginBottom: 16 }}>Team Members</h3>
            <div className="team-list">
              {project.members.map(m => {
                const u = getUserById(m.userId);
                return (
                  <div key={m.userId} className="team-member">
                    <div className="team-avatar">{u?.avatar}</div>
                    <div className="team-info">
                      <div className="team-name">{u?.name}</div>
                      <div className="team-role">{m.role} · {u?.department}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === "milestones" && (
        <div className="card">
          {project.milestones.map(m => {
            const isCompleted = m.status === "completed";
            const statusColor = { completed: "#2E7D32", in_progress: "#E65100", pending: "var(--gray-400)" };
            return (
              <div key={m.id} className="milestone-item">
                <div className={`check-circle ${isCompleted ? "checked" : ""}`}
                  onClick={() => onToggleMilestone(project.id, m.id)}>
                  {isCompleted && <Icon name="check" size={14} color="white" />}
                </div>
                <div className="item-content">
                  <div className={`item-title ${isCompleted ? "done" : ""}`}>{m.title}</div>
                  <div className="item-meta">
                    <span style={{ color: statusColor[m.status] }}>{capitalize(m.status.replace("_", " "))}</span>
                    <span>Due: {formatDate(m.dueDate)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "tasks" && (
        <div className="card">
          {project.tasks.map(t => {
            const isDone = t.status === "done";
            const assignee = getUserById(t.assignedTo);
            const prColors = { high: { bg: "#FDECEA", color: "#D32F2F" }, medium: { bg: "#FFF8E1", color: "#F57F17" } };
            const pc = prColors[t.priority] || prColors.medium;
            return (
              <div key={t.id} className="task-item">
                <div className={`check-square ${isDone ? "checked" : ""}`}
                  onClick={() => onToggleTask(project.id, t.id)}>
                  {isDone && <Icon name="check" size={14} color="white" />}
                </div>
                <div className="item-content">
                  <div className={`item-title ${isDone ? "done" : ""}`}>{t.title}</div>
                  <div className="item-meta">
                    <span className="priority-badge" style={{ background: pc.bg, color: pc.color }}>{capitalize(t.priority)}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span className="mini-avatar" style={{ width: 18, height: 18, fontSize: 8 }}>{assignee?.avatar}</span>
                      {assignee?.name.split(" ")[0]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Events Timeline ──────────────────────────────────────────────
const EventsPage = ({ events, onNavigate }) => {
  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const typeConfig = {
    hackathon: { bg: "#FFF3E0", color: "#E65100", icon: "award" },
    exhibition: { bg: "#E3F2FD", color: "#1565C0", icon: "target" },
    visit: { bg: "#F3E5F5", color: "#6A1B9A", icon: "users" },
  };

  return (
    <div className="main-inner">
      <h1 className="page-title serif" style={{ marginBottom: 24 }}>Events & Activities</h1>
      <div className="timeline">
        {sorted.map(ev => {
          const tc = typeConfig[ev.type];
          const d = daysUntil(ev.date);
          const isPast = d < 0;
          return (
            <div key={ev.id} className="timeline-item">
              <div className="timeline-dot" style={{ background: tc.bg }}>
                <Icon name={tc.icon} size={18} color={tc.color} />
              </div>
              <div className={`timeline-card ${isPast ? "past" : ""}`}>
                <div className="timeline-card-header">
                  <div>
                    <span className="event-type" style={{ color: tc.color }}>{capitalize(ev.type)}</span>
                    <span style={{ fontSize: 13, color: "var(--gray-400)", marginLeft: 8 }}>{formatDate(ev.date)}</span>
                  </div>
                  <span className="days-badge" style={{
                    background: isPast ? "var(--gray-100)" : d < 14 ? "#FFF3E0" : "#E8F5E9",
                    color: isPast ? "var(--gray-400)" : d < 14 ? "#E65100" : "#2E7D32"
                  }}>
                    {isPast ? "Completed" : d === 0 ? "Today!" : `${d} days`}
                  </span>
                </div>
                <h3>{ev.title}</h3>
                <p>{ev.description}</p>
                <div className="timeline-venue">
                  <Icon name="pin" size={14} /> {ev.venue}
                </div>
                {ev.type === "hackathon" && !isPast && (
                  <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => onNavigate("new-project")}>
                    Submit Idea
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [pageParam, setPageParam] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Data state
  const [problems, setProblems] = useState(initialProblems);
  const [projects, setProjects] = useState(initialProjects);
  const [events] = useState(initialEvents);
  const [notifications, setNotifications] = useState(initialNotifications);

  const addToast = (text) => {
    const id = Date.now();
    setToasts(t => [...t, { id, text }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const navigate = (p, param = null) => { setPage(p); setPageParam(param); window.scrollTo(0, 0); };

  const handleLogin = (u) => { setUser(u); addToast(`Welcome, ${u.name.split(" ")[0]}!`); };
  const handleLogout = () => { setUser(null); setPage("dashboard"); };

  const markAllRead = () => {
    setNotifications(ns => ns.map(n => n.userId === user.id ? { ...n, read: true } : n));
  };

  const submitProblem = (data) => {
    const newP = { ...data, id: problems.length + 1, submittedBy: user.id, status: "open", createdAt: new Date().toISOString().split("T")[0] };
    setProblems(ps => [...ps, newP]);
    setNotifications(ns => [{ id: ns.length + 1, userId: 1, text: `New problem submitted: ${data.title}`, read: false, createdAt: new Date().toISOString() }, ...ns]);
    addToast("Problem submitted successfully!");
  };

  const submitProject = (data) => {
    const newP = {
      id: projects.length + 1, title: data.title, description: data.description,
      problemId: data.problemId ? parseInt(data.problemId) : null,
      stage: "submitted", specialty: data.specialty, leadId: user.id, mentorId: null,
      readinessScore: 5, createdAt: new Date().toISOString().split("T")[0],
      milestones: [{ id: 100, title: "Screening Review", status: "pending", dueDate: "2026-03-15" }],
      tasks: [],
      members: [{ userId: user.id, role: "Lead" }],
    };
    setProjects(ps => [...ps, newP]);
    setNotifications(ns => [{ id: ns.length + 1, userId: 1, text: `New idea submitted: ${data.title}`, read: false, createdAt: new Date().toISOString() }, ...ns]);
    addToast("Innovation idea submitted!");
  };

  const toggleMilestone = (projectId, milestoneId) => {
    setProjects(ps => ps.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, milestones: p.milestones.map(m => {
        if (m.id !== milestoneId) return m;
        const next = m.status === "completed" ? "pending" : "completed";
        return { ...m, status: next };
      })};
    }));
  };

  const toggleTask = (projectId, taskId) => {
    setProjects(ps => ps.map(p => {
      if (p.id !== projectId) return p;
      return { ...p, tasks: p.tasks.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, status: t.status === "done" ? "todo" : "done" };
      })};
    }));
  };

  const advanceStage = (projectId) => {
    setProjects(ps => ps.map(p => {
      if (p.id !== projectId) return p;
      const idx = STAGES.indexOf(p.stage);
      if (idx >= STAGES.length - 1) return p;
      const nextStage = STAGES[idx + 1];
      addToast(`Project advanced to ${capitalize(nextStage)}`);
      return { ...p, stage: nextStage, readinessScore: Math.min(100, p.readinessScore + 15) };
    }));
  };

  if (!user) return <><style>{CSS}</style><LoginPage onLogin={handleLogin} /><ToastContainer toasts={toasts} /></>;

  const currentProject = page === "project-detail" ? projects.find(p => p.id === pageParam) : null;
  const activePage = ["new-problem"].includes(page) ? "problems" : ["new-project", "project-detail"].includes(page) ? "projects" : page;

  return (
    <>
      <style>{CSS}</style>
      <TopBar user={user} onLogout={handleLogout} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        notifications={notifications} onMarkAllRead={markAllRead} />
      <Sidebar active={activePage} onNavigate={navigate} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main">
        {page === "dashboard" && <Dashboard problems={problems} projects={projects} events={events} onNavigate={navigate} />}
        {page === "problems" && <ProblemRegistry problems={problems} onNavigate={navigate} />}
        {page === "new-problem" && <NewProblemForm onNavigate={navigate} onSubmit={submitProblem} />}
        {page === "projects" && <ProjectsList projects={projects} onNavigate={navigate} />}
        {page === "new-project" && <NewProjectForm problems={problems} onNavigate={navigate} onSubmit={submitProject} />}
        {page === "project-detail" && <ProjectDetail project={currentProject} problems={problems} user={user}
          onNavigate={navigate} onToggleMilestone={toggleMilestone} onToggleTask={toggleTask} onAdvanceStage={advanceStage} />}
        {page === "events" && <EventsPage events={events} onNavigate={navigate} />}
      </div>
      <ToastContainer toasts={toasts} />
    </>
  );
}
