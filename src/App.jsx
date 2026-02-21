import { useState, useRef } from "react";

// ── CONSTANTS ──
const USERS = [
  { id:1, name:"Dr. Anand Krishnan", email:"admin@mcthrissur.ac.in", role:"admin", department:"General Surgery", avatar:"AK", password:"launchpad2026" },
  { id:2, name:"Meera Nair", email:"meera@student.mcthrissur.ac.in", role:"student", department:"Pediatrics", avatar:"MN", password:"student123" },
  { id:3, name:"Rahul Thomas", email:"rahul@student.mcthrissur.ac.in", role:"student", department:"Orthopedics", avatar:"RT", password:"student123" },
  { id:4, name:"Dr. Priya Menon", email:"priya@mcthrissur.ac.in", role:"mentor", department:"Biomedical Engineering", avatar:"PM", password:"mentor123" },
  { id:5, name:"Suresh Kumar", email:"suresh@medtech.in", role:"industry", department:"MedTech Solutions", avatar:"SK", password:"industry123" },
];
const SPECIALTIES = ["General Surgery","Pediatrics","Orthopedics","Cardiology","Neurology","Obstetrics & Gynecology","Ophthalmology","ENT","Dermatology","Psychiatry","Radiology","Anesthesiology","Emergency Medicine"];
const STAGES = ["submitted","incubating","prototyping","validating","complete"];
const SC = { submitted:{bg:"#E3F2FD",t:"#1565C0",b:"#1565C0"}, incubating:{bg:"#FFF3E0",t:"#E65100",b:"#E65100"}, prototyping:{bg:"#E0F2F1",t:"#00695C",b:"#00695C"}, validating:{bg:"#F3E5F5",t:"#6A1B9A",b:"#6A1B9A"}, complete:{bg:"#E8F5E9",t:"#2E7D32",b:"#2E7D32"} };
const IC = { Critical:"#D32F2F", High:"#E65100", Medium:"#F9A825", Low:"#43A047" };
const FR = { needs_work:{l:"Needs Work",c:"#D32F2F",bg:"#FDECEA"}, on_track:{l:"On Track",c:"#E65100",bg:"#FFF3E0"}, excellent:{l:"Excellent",c:"#2E7D32",bg:"#E8F5E9"} };

// ── SEED DATA ──
const seedProblems = [
  { id:1, title:"Neonatal Transport Temperature Monitoring Gap", specialty:"Pediatrics", bottleneck:"During inter-hospital neonatal transport, continuous temperature monitoring is unavailable. Nurses rely on intermittent manual checks every 30 minutes, missing critical hypothermia episodes.", workaround:"Manual temperature checks every 30 min", whyImportedFails:"Imported monitors cost ₹2.5L+ and incompatible with local incubators", patientImpact:"Critical", costBurden:12.5, submittedBy:2, status:"validated", createdAt:"2026-01-15" },
  { id:2, title:"Surgical Retractor Fatigue in Long Procedures", specialty:"General Surgery", bottleneck:"During 4+ hour surgeries, assistants experience hand fatigue leading to instrument slippage. No affordable self-retaining system exists for varied anatomy.", workaround:"Rotating assistants every 45 min, towel padding", whyImportedFails:"Self-retaining systems cost ₹80K-₹2L per set", patientImpact:"High", costBurden:4.2, submittedBy:1, status:"open", createdAt:"2026-01-22" },
  { id:3, title:"Geriatric Fall Detection in Wards", specialty:"Orthopedics", bottleneck:"Elderly patients fall during unsupervised periods. Current nurse-call systems require conscious activation, useless during falls. Detection time: 15-45 min.", workaround:"Increased night rounds, bed rails, family attendants", whyImportedFails:"Commercial systems require ₹15L WiFi upgrades per ward", patientImpact:"High", costBurden:8.0, submittedBy:3, status:"open", createdAt:"2026-02-01" },
  { id:4, title:"Blood Sample Hemolysis During Transport", specialty:"Emergency Medicine", bottleneck:"Blood samples frequently hemolyze during pneumatic tube transport, requiring repeat collection and delaying critical results by 30-60 minutes.", workaround:"Manual hand-carry to lab, adding 15 min delay", whyImportedFails:"Tube cushioning systems cost ₹5L per station", patientImpact:"High", costBurden:3.5, submittedBy:2, status:"open", createdAt:"2026-02-08" },
  { id:5, title:"Post-Op Wound Infection Early Detection", specialty:"General Surgery", bottleneck:"Surgical site infections detected only during scheduled follow-ups (5-7 days), by which time infection has progressed significantly.", workaround:"Patient education on warning signs, phone follow-ups", whyImportedFails:"Smart wound dressings cost ₹3000-5000 per use", patientImpact:"Medium", costBurden:6.0, submittedBy:1, status:"open", createdAt:"2026-02-12" },
];

const seedProjects = [
  { id:1, title:"NeoTherm — Neonatal Transport Monitor", description:"Low-cost continuous temperature monitoring patch for neonatal transport incubators. Uses flexible thermistor array with BLE connectivity to a nurse's phone app.", problemId:1, stage:"prototyping", specialty:"Pediatrics", leadId:2, mentorId:4, readinessScore:72, createdAt:"2026-01-20",
    milestones:[ {id:1,title:"Literature Review & Patent Search",status:"completed",dueDate:"2026-01-25"}, {id:2,title:"Thermistor Array Design",status:"completed",dueDate:"2026-02-05"}, {id:3,title:"BLE Firmware Development",status:"in_progress",dueDate:"2026-02-20"}, {id:4,title:"Prototype Assembly",status:"pending",dueDate:"2026-03-05"}, {id:5,title:"Clinical Validation Trial",status:"pending",dueDate:"2026-03-25"} ],
    tasks:[ {id:1,title:"Source flexible thermistors",assignedTo:2,status:"done",priority:"high"}, {id:2,title:"Design PCB layout in KiCAD",assignedTo:3,status:"done",priority:"high"}, {id:3,title:"Write BLE GATT service code",assignedTo:3,status:"todo",priority:"high"}, {id:4,title:"Build companion app",assignedTo:2,status:"todo",priority:"medium"}, {id:5,title:"Draft clinical trial protocol",assignedTo:4,status:"todo",priority:"medium"} ],
    members:[{userId:2,role:"Lead"},{userId:3,role:"Hardware Engineer"},{userId:4,role:"Mentor"}],
    files:[ {id:1,name:"thermistor_datasheet.pdf",type:"pdf",size:"2.4 MB",uploadedBy:2,category:"Reference",createdAt:"2026-01-22"}, {id:2,name:"pcb_layout_v2.kicad",type:"cad",size:"1.8 MB",uploadedBy:3,category:"CAD",createdAt:"2026-02-06"}, {id:3,name:"ble_protocol_spec.pdf",type:"pdf",size:"890 KB",uploadedBy:3,category:"Documentation",createdAt:"2026-02-10"} ],
    feedback:[ {id:1,mentorId:4,rating:"excellent",text:"Strong literature review. Patent landscape is clear — no blocking patents. Thermistor array design is innovative and cost-effective. Proceed to firmware with confidence.",createdAt:"2026-02-02"}, {id:2,mentorId:4,rating:"on_track",text:"PCB layout looks good but needs thermal simulation. Consider redundant sensors for clinical-grade accuracy. BLE range testing should happen in actual ambulance.",createdAt:"2026-02-12"} ]
  },
  { id:2, title:"ErgoRetract — Adaptive Self-Retaining System", description:"3D-printed modular self-retaining surgical retractor designed for Indian patient anatomy. Uses adjustable arms with ratcheting locks.", problemId:2, stage:"incubating", specialty:"General Surgery", leadId:3, mentorId:4, readinessScore:35, createdAt:"2026-02-03",
    milestones:[ {id:6,title:"Surgeon Interviews & Requirements",status:"completed",dueDate:"2026-02-10"}, {id:7,title:"CAD Design — First Iteration",status:"in_progress",dueDate:"2026-02-25"}, {id:8,title:"3D Print & Test Prototype",status:"pending",dueDate:"2026-03-15"} ],
    tasks:[ {id:6,title:"Interview 5 surgeons on pain points",assignedTo:3,status:"done",priority:"high"}, {id:7,title:"Create CAD model in Fusion 360",assignedTo:3,status:"todo",priority:"high"}, {id:8,title:"Identify biocompatible 3D print material",assignedTo:2,status:"todo",priority:"medium"} ],
    members:[{userId:3,role:"Lead"},{userId:2,role:"Design Engineer"},{userId:4,role:"Mentor"}],
    files:[ {id:4,name:"surgeon_interview_notes.docx",type:"doc",size:"340 KB",uploadedBy:3,category:"Research",createdAt:"2026-02-11"} ],
    feedback:[ {id:3,mentorId:4,rating:"on_track",text:"Surgeon interviews are comprehensive. CAD design should prioritize the ratcheting mechanism. Consider consulting IIT Palakkad for material selection.",createdAt:"2026-02-14"} ]
  },
  { id:3, title:"GuardBand — Smart Wearable Fall Detector", description:"Low-cost wrist-worn fall detection for geriatric ward patients using accelerometer + gyroscope. Sends BLE alert within 3 seconds. Target: ₹800/unit.", problemId:3, stage:"submitted", specialty:"Orthopedics", leadId:2, mentorId:null, readinessScore:10, createdAt:"2026-02-16",
    milestones:[{id:9,title:"Screening Review",status:"pending",dueDate:"2026-02-28"}], tasks:[], members:[{userId:2,role:"Lead"}], files:[], feedback:[]
  },
];

const seedEvents = [
  { id:1, title:"Ideation Hackathon Thrissur", type:"hackathon", date:"2026-04-09", venue:"IEDC Lab, Block C, Govt. Medical College Thrissur", description:"24-hour hackathon for clinical innovation ideas. Open to all health science students in Kerala. Prizes: ₹10,000 / ₹7,000 / ₹5,000." },
  { id:2, title:"MedTech Innovation Exhibition", type:"exhibition", date:"2026-04-11", venue:"College Auditorium, Govt. Medical College Thrissur", description:"Showcase of prototypes to faculty, industry, and DME officials. Live demonstrations and poster presentations." },
  { id:3, title:"Kochi MedTech Factory Visit", type:"visit", date:"2026-04-18", venue:"Agappe Diagnostics, Ernakulam", description:"Factory visit to understand medical device manufacturing, quality standards, and commercialization." },
  { id:4, title:"IEDC Orientation & Team Formation", type:"exhibition", date:"2026-02-05", venue:"Seminar Hall, Block A", description:"Orientation for new members. Introduction to innovation pipeline and team formation." },
];

const seedNotifs = [
  { id:1, userId:1, text:"New problem: Geriatric Fall Detection in Wards", read:false, createdAt:"2026-02-01T10:00:00" },
  { id:2, userId:1, text:"NeoTherm advanced to Prototyping stage", read:false, createdAt:"2026-02-15T14:30:00" },
  { id:3, userId:2, text:"Dr. Priya Menon assigned as mentor to NeoTherm", read:true, createdAt:"2026-01-22T09:00:00" },
  { id:4, userId:1, text:"New idea: GuardBand Fall Detector submitted", read:false, createdAt:"2026-02-16T08:45:00" },
  { id:5, userId:3, text:"ErgoRetract milestone 'Surgeon Interviews' completed", read:false, createdAt:"2026-02-12T11:00:00" },
  { id:6, userId:2, text:"New feedback from Dr. Priya on NeoTherm", read:false, createdAt:"2026-02-12T15:00:00" },
];

// ── UTILS ──
const daysUntil = d => Math.ceil((new Date(d) - new Date("2026-02-20")) / 86400000);
const fmtDate = d => new Date(d).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"});
const getUser = id => USERS.find(u => u.id === id);
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
const catColor = c => ({Reference:"#1565C0",CAD:"#6A1B9A",Documentation:"#00695C",Research:"#E65100",Prototype:"#D32F2F",Other:"#546E7A"}[c]||"#546E7A");

// ── ICON ──
const I = ({n,s=20,c="currentColor"}) => {
  const d = {
    dashboard:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    problems:<><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    projects:<><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>,
    events:<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    analytics:<><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    bell:<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    menu:<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    plus:<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    back:<><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>,
    check:<><polyline points="20 6 9 17 4 12"/></>,
    award:<><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    target:<><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    users:<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></>,
    pin:<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    search:<><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    close:<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    logout:<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    clock:<><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    file:<><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></>,
    upload:<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    message:<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>,
    trending:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    pie:<><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    doc:<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  };
  return <svg style={{width:s,height:s,flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d[n]||null}</svg>;
};

// ── CSS ──
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap');
:root{--b9:#0A1929;--b8:#0F3D5E;--t6:#00897B;--t5:#00A8A8;--t4:#26C6DA;--sf:#F6F8FB;--w:#FFF;--g0:#F8FAFC;--g1:#F1F5F9;--g2:#E2E8F0;--g3:#CBD5E1;--g4:#94A3B8;--g5:#64748B;--g6:#475569;--g7:#334155;--g8:#1E293B;--r:4px;--sw:240px;--th:60px;--fh:'DM Serif Display',serif;--fb:'DM Sans',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}body,html,#root{font-family:var(--fb);background:var(--sf);color:var(--g8);height:100%;-webkit-font-smoothing:antialiased}
.serif{font-family:var(--fh)}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:var(--g3);border-radius:3px}
.lp{min-height:100vh;background:linear-gradient(135deg,var(--b9),var(--b8),#0D2F47);display:flex;align-items:center;justify-content:center;padding:20px;position:relative}
.lp::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 80%,rgba(0,137,123,.08),transparent 50%),radial-gradient(circle at 80% 20%,rgba(0,168,168,.06),transparent 50%),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.015) 60px,rgba(255,255,255,.015) 61px),repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.015) 60px,rgba(255,255,255,.015) 61px)}
.lc{background:var(--w);border-radius:var(--r);padding:40px;width:100%;max-width:400px;position:relative;z-index:1;box-shadow:0 25px 60px rgba(0,0,0,.3)}
.lc h1{font-family:var(--fh);font-size:26px;color:var(--b9);margin-bottom:4px}.lc .sub{color:var(--g5);font-size:13px;margin-bottom:28px;letter-spacing:.5px;text-transform:uppercase}
.logo{width:56px;height:56px;border-radius:var(--r);background:linear-gradient(135deg,var(--t6),var(--t5));display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--fh);font-size:22px;font-weight:700;margin-bottom:20px}
.fg{margin-bottom:16px}.fl{display:block;font-size:13px;font-weight:500;color:var(--g6);margin-bottom:6px}
.fi,.fs,.ft{width:100%;padding:10px 12px;border:1px solid var(--g2);border-radius:var(--r);font-size:14px;font-family:var(--fb);color:var(--g8);background:var(--w);transition:border .15s,box-shadow .15s;outline:none}
.fi:focus,.fs:focus,.ft:focus{border-color:var(--t5);box-shadow:0 0 0 3px rgba(0,168,168,.1)}.ft{resize:vertical;min-height:80px}.fe{color:#D32F2F;font-size:12px;margin-top:4px}
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border:none;border-radius:var(--r);font-size:14px;font-weight:500;font-family:var(--fb);cursor:pointer;transition:all .15s}
.bp{background:linear-gradient(135deg,var(--t6),var(--t5));color:#fff}.bp:hover{box-shadow:0 4px 12px rgba(0,137,123,.3);transform:translateY(-1px)}
.bs{background:var(--g1);color:var(--g7)}.bs:hover{background:var(--g2)}.bg{background:transparent;color:var(--g6);padding:8px 12px}.bg:hover{background:var(--g1)}
.bsm{padding:6px 14px;font-size:13px}.bf{width:100%;justify-content:center}
.tb{position:fixed;top:0;left:0;right:0;height:var(--th);background:linear-gradient(135deg,var(--b9),var(--b8));display:flex;align-items:center;justify-content:space-between;padding:0 20px;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.15)}
.tbl{display:flex;align-items:center;gap:12px}.tbr{display:flex;align-items:center;gap:16px}
.tblogo{width:36px;height:36px;border-radius:var(--r);background:linear-gradient(135deg,var(--t6),var(--t5));display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--fh);font-size:15px;font-weight:700}
.tbt{color:#fff;font-family:var(--fh);font-size:18px;line-height:1.1}.tbs{color:rgba(255,255,255,.5);font-size:11px}
.tbb{position:relative;background:none;border:none;cursor:pointer;padding:6px;color:rgba(255,255,255,.7)}.tbb:hover{color:#fff}
.bellb{position:absolute;top:2px;right:2px;width:16px;height:16px;border-radius:50%;background:#EF5350;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center}
.tbu{display:flex;align-items:center;gap:8px;cursor:pointer;background:none;border:none;color:#fff}
.tbav{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
.tbnm{font-size:13px;font-weight:500}.tbrl{font-size:10px;padding:2px 6px;border-radius:2px;background:rgba(0,168,168,.2);color:var(--t4);text-transform:uppercase;letter-spacing:.5px}
.ham{display:none;background:none;border:none;color:rgba(255,255,255,.8);cursor:pointer;padding:4px}
.sb{position:fixed;top:var(--th);left:0;width:var(--sw);height:calc(100vh - var(--th));background:var(--w);border-right:1px solid var(--g2);display:flex;flex-direction:column;z-index:90;transition:transform .25s}
.sbnav{flex:1;padding:12px 0}.sbft{padding:16px 20px;border-top:1px solid var(--g2);font-size:11px;color:var(--g4);line-height:1.5}
.sbi{display:flex;align-items:center;gap:12px;padding:11px 20px;font-size:14px;font-weight:500;color:var(--g5);cursor:pointer;border-left:3px solid transparent;transition:all .15s}
.sbi:hover{background:var(--g0);color:var(--g7)}.sbi.act{border-left-color:var(--t5);color:var(--t6);background:rgba(0,168,168,.05)}
.sbbd{display:none;position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:89}
.mn{margin-top:var(--th);margin-left:var(--sw);padding:28px 32px;min-height:calc(100vh - var(--th))}.mi{max-width:1100px}
.nd{position:absolute;top:calc(100% + 8px);right:0;width:340px;background:var(--w);border-radius:var(--r);box-shadow:0 10px 40px rgba(0,0,0,.15);border:1px solid var(--g2);z-index:200;max-height:400px;overflow-y:auto}
.ndh{display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid var(--g1);font-size:13px;font-weight:600;color:var(--g7)}
.ndi{padding:12px 16px;border-bottom:1px solid var(--g0);font-size:13px;color:var(--g6);line-height:1.5}.ndi.ur{background:rgba(0,168,168,.03);border-left:3px solid var(--t5)}
.ndt{font-size:11px;color:var(--g4);margin-top:4px}
.um{position:absolute;top:calc(100% + 8px);right:0;width:200px;background:var(--w);border-radius:var(--r);box-shadow:0 10px 40px rgba(0,0,0,.15);border:1px solid var(--g2);z-index:200;padding:8px}
.umi{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:var(--r);font-size:13px;color:var(--g6);cursor:pointer;border:none;background:none;width:100%;font-family:var(--fb)}.umi:hover{background:var(--g0)}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px}
.sc{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:20px;cursor:pointer;transition:all .15s}.sc:hover{border-color:var(--g3);box-shadow:0 2px 8px rgba(0,0,0,.05)}
.si{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin-bottom:12px}
.sn{font-family:var(--fh);font-size:32px;color:var(--b9)}.sl{font-size:13px;color:var(--g5);margin-top:2px}
.dg{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
.ds{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);overflow:hidden}
.dsh{padding:16px 20px;border-bottom:1px solid var(--g1);font-size:15px;font-weight:600;color:var(--g7)}
.dr{display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--g0);cursor:pointer;transition:background .1s}.dr:hover{background:var(--g0)}.dr:last-child{border-bottom:none}
.drt{font-size:14px;font-weight:500;color:var(--g8);flex:1}
.pb{height:6px;border-radius:3px;background:var(--g1);overflow:hidden}.pf{height:100%;border-radius:3px;transition:width .3s}
.pt{font-size:11px;color:var(--g4);min-width:32px;text-align:right}
.stb{display:inline-flex;padding:3px 10px;border-radius:2px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
.ib{display:inline-flex;padding:3px 10px;border-radius:2px;font-size:11px;font-weight:600;color:#fff}
.et{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.3px}
.db{display:inline-flex;padding:2px 8px;border-radius:2px;font-size:11px;font-weight:600}
.cd{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:20px}
.ph{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px}
.ptl{font-family:var(--fh);font-size:24px;color:var(--b9)}.pc{font-size:14px;color:var(--g4);margin-left:8px;font-family:var(--fb)}
.fb{display:flex;gap:12px;margin-bottom:20px;align-items:center;flex-wrap:wrap}
.sbx{display:flex;align-items:center;gap:8px;background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:8px 12px;flex:1;min-width:200px}
.sbx input{border:none;outline:none;font-size:14px;font-family:var(--fb);color:var(--g8);width:100%;background:transparent}
.fsl{padding:8px 12px;border:1px solid var(--g2);border-radius:var(--r);font-size:13px;font-family:var(--fb);background:var(--w);color:var(--g7);cursor:pointer;outline:none}
.sp{display:flex;gap:8px;margin-bottom:20px;overflow-x:auto;padding-bottom:4px}
.spl{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--g2);background:var(--w);color:var(--g5);white-space:nowrap;transition:all .15s}.spl.act{font-weight:600}
.prc{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:20px;transition:all .15s;margin-bottom:12px}.prc:hover{border-color:var(--g3);box-shadow:0 4px 12px rgba(0,0,0,.04)}
.prch{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px}.prc h3{font-size:15px;font-weight:600;color:var(--g8)}
.prm{display:flex;gap:16px;margin-top:10px;font-size:13px;color:var(--g5);flex-wrap:wrap}.prm span{display:flex;align-items:center;gap:4px}
.pjg{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}
.pjc{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:20px;cursor:pointer;transition:all .2s}.pjc:hover{box-shadow:0 6px 16px rgba(0,0,0,.06);transform:translateY(-2px)}
.pjt{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.pjc h3{font-size:16px;font-weight:600;color:var(--g8);margin-bottom:6px}
.pjc p{font-size:13px;color:var(--g5);line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:14px}
.pjf{display:flex;justify-content:space-between;align-items:center}
.pjp{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--g5)}
.mav{width:24px;height:24px;border-radius:50%;background:var(--g1);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:var(--g5)}
.dtb{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--g5);margin-bottom:16px;cursor:pointer;background:none;border:none;font-family:var(--fb)}.dtb:hover{color:var(--t6)}
.dth{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:24px;margin-bottom:20px}
.dth h1{font-family:var(--fh);font-size:24px;color:var(--b9);margin-bottom:8px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.dtd{font-size:14px;color:var(--g6);line-height:1.6;margin-bottom:16px}
.dtm{display:flex;gap:24px;font-size:13px;color:var(--g5);flex-wrap:wrap}.dml{font-weight:600;color:var(--g6)}
.tabs{display:flex;gap:0;border-bottom:2px solid var(--g2);margin-bottom:20px;overflow-x:auto}
.tab{padding:12px 20px;font-size:14px;font-weight:500;color:var(--g5);cursor:pointer;border:none;background:none;font-family:var(--fb);border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .15s;display:flex;align-items:center;gap:6px;white-space:nowrap}
.tab:hover{color:var(--g7)}.tab.act{color:var(--t6);border-bottom-color:var(--t6)}
.ovg{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.rr{width:120px;height:120px;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}
.ri{width:96px;height:96px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column}
.rs{font-family:var(--fh);font-size:28px;color:var(--b9)}.rl{font-size:11px;color:var(--g5)}
.mli,.tki{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid var(--g1)}.mli:last-child,.tki:last-child{border-bottom:none}
.cc,.cq{width:22px;height:22px;border:2px solid var(--g3);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:all .15s}
.cc{border-radius:50%}.cq{border-radius:3px}.cc.chk,.cq.chk{background:var(--t5);border-color:var(--t5)}
.ic{flex:1}.it{font-size:14px;font-weight:500;color:var(--g8)}.it.dn{text-decoration:line-through;color:var(--g4)}
.im{font-size:12px;color:var(--g4);margin-top:2px;display:flex;gap:12px}
.prb{font-size:10px;font-weight:600;padding:1px 6px;border-radius:2px;text-transform:uppercase}
.tl{position:relative;padding-left:60px}.tl::before{content:'';position:absolute;left:27px;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,var(--t5),var(--t4),var(--g2))}
.tli{position:relative;margin-bottom:24px}
.tld{position:absolute;left:-60px;top:0;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.1);z-index:1}
.tlc{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:20px;transition:all .15s}.tlc.past{opacity:.6}.tlc:hover{box-shadow:0 4px 12px rgba(0,0,0,.05)}
.tlch{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:8px;flex-wrap:wrap}
.tlc h3{font-size:16px;font-weight:600;color:var(--g8)}.tlc p{font-size:13px;color:var(--g5);line-height:1.5;margin-bottom:10px}
.tlv{font-size:13px;color:var(--g5);display:flex;align-items:center;gap:4px}
.lpr{background:#FFF8E1;border:1px solid #FFE082;border-radius:var(--r);padding:12px 16px;margin-top:12px;font-size:13px;color:#F57F17;display:flex;align-items:center;gap:8px}
.tma{width:36px;height:36px;border-radius:50%;background:var(--g1);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--g5)}
.tmn{font-size:14px;font-weight:500;color:var(--g8)}.tmr{font-size:12px;color:var(--g4)}
.uz{border:2px dashed var(--g3);border-radius:var(--r);padding:32px;text-align:center;cursor:pointer;transition:all .15s;margin-bottom:16px}
.uz:hover,.uz.drg{border-color:var(--t5);background:rgba(0,168,168,.03)}
.uz p{font-size:14px;color:var(--g5);margin-top:8px}.uz span{font-size:12px;color:var(--g4)}
.fli{display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--g0);border-radius:var(--r);margin-bottom:8px;transition:all .15s}.fli:hover{background:var(--g1)}
.flic{width:40px;height:40px;border-radius:var(--r);display:flex;align-items:center;justify-content:center}
.fln{font-size:14px;font-weight:500;color:var(--g8)}.flm{font-size:12px;color:var(--g4);display:flex;gap:12px;margin-top:2px}
.flcat{font-size:10px;font-weight:600;padding:2px 8px;border-radius:2px;text-transform:uppercase;letter-spacing:.3px}
.fbi{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:20px;margin-bottom:12px}
.fbih{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:8px}
.fbi p{font-size:14px;color:var(--g6);line-height:1.6}
.fbrb{display:inline-flex;padding:3px 10px;border-radius:2px;font-size:11px;font-weight:600}
.ag{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px}
.ac{background:var(--w);border:1px solid var(--g2);border-radius:var(--r);padding:20px;overflow:hidden}
.ac h3{font-size:15px;font-weight:600;color:var(--g7);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.funnel{display:flex;flex-direction:column;gap:6px}
.frow{display:flex;align-items:center;gap:12px}
.fbar{height:32px;border-radius:var(--r);display:flex;align-items:center;padding:0 12px;font-size:12px;font-weight:600;color:#fff;transition:width .5s}
.flbl{font-size:12px;color:var(--g5);min-width:80px;text-align:right}
.dwrap{display:flex;align-items:center;gap:20px;flex-wrap:wrap}
.donut{width:140px;height:140px;border-radius:50%;position:relative;flex-shrink:0}
.dcenter{position:absolute;inset:20%;background:var(--w);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--fh);font-size:22px;color:var(--b9)}
.dli{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--g6);margin-bottom:6px}
.ddot{width:10px;height:10px;border-radius:2px;flex-shrink:0}
.trow{display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--g1)}.trow:last-child{border-bottom:none}
.tmon{font-size:13px;font-weight:500;color:var(--g7);min-width:60px}
.tbar{flex:1;height:8px;background:var(--g1);border-radius:4px;overflow:hidden}
.tfill{height:100%;border-radius:4px;transition:width .5s}
.tval{font-size:13px;font-weight:600;color:var(--g7);min-width:24px;text-align:right}
.bchart{display:flex;align-items:flex-end;gap:16px;height:140px}
.bcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bar{border-radius:3px 3px 0 0;width:100%;min-width:32px;transition:height .5s}
.bval{font-size:12px;font-weight:600;color:var(--g7)}.blbl{font-size:11px;color:var(--g5)}
.tc{position:fixed;bottom:24px;right:24px;z-index:500}
.toast{background:var(--b9);color:#fff;padding:12px 20px;border-radius:var(--r);font-size:14px;box-shadow:0 8px 24px rgba(0,0,0,.2);animation:su .3s ease;margin-top:8px}
@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:1024px){.ham{display:block}.sb{transform:translateX(-100%)}.sb.op{transform:translateX(0)}.sbbd.op{display:block}.mn{margin-left:0;padding:20px 16px}.sg{grid-template-columns:repeat(2,1fr)}.dg,.ovg,.ag{grid-template-columns:1fr}.nd{width:300px;right:-40px}.tbnm{display:none}}
@media(max-width:640px){.sp{gap:6px}.pjg{grid-template-columns:1fr}.ph{flex-direction:column;align-items:flex-start}.fb{flex-direction:column}.sbx{min-width:100%}}
`;

// ── COMPONENTS ──
const Toast = ({toasts}) => <div className="tc">{toasts.map(t=><div key={t.id} className="toast">{t.text}</div>)}</div>;

const Login = ({onLogin}) => {
  const [e,sE]=useState("admin@mcthrissur.ac.in"),[p,sP]=useState("launchpad2026"),[err,sErr]=useState("");
  const go = ev => { ev.preventDefault(); const u=USERS.find(u=>u.email===e&&u.password===p); u?onLogin(u):sErr("Invalid credentials. Try admin@mcthrissur.ac.in / launchpad2026"); };
  return <div className="lp"><div className="lc"><div className="logo">LP</div><h1>IEDC LaunchPad</h1><div className="sub">Clinical Innovation Command Centre</div>
    <form onSubmit={go}><div className="fg"><label className="fl">Email</label><input className="fi" type="email" value={e} onChange={x=>sE(x.target.value)}/></div>
    <div className="fg"><label className="fl">Password</label><input className="fi" type="password" value={p} onChange={x=>sP(x.target.value)}/></div>
    {err&&<div className="fe" style={{marginBottom:12}}>{err}</div>}<button type="submit" className="btn bp bf" style={{padding:"12px 20px"}}>Sign In</button></form>
    <div style={{marginTop:24,paddingTop:16,borderTop:"1px solid var(--g2)",textAlign:"center",fontSize:11,color:"var(--g4)",lineHeight:1.6}}>Govt. Medical College Thrissur · CSDT · KDISC<br/>Directorate of Medical Education, Kerala</div></div></div>;
};

const TopBar = ({user:u,onLogout,onToggle,notifs,onRead}) => {
  const [sN,setSN]=useState(false),[sM,setSM]=useState(false);
  const unread=notifs.filter(n=>!n.read&&n.userId===u.id).length, uN=notifs.filter(n=>n.userId===u.id).slice(0,8);
  return <div className="tb"><div className="tbl"><button className="ham" onClick={onToggle}><I n="menu" s={22}/></button>
    <div style={{display:"flex",alignItems:"center",gap:10}}><div className="tblogo">LP</div><div><div className="tbt">IEDC LaunchPad</div><div className="tbs">Medical College Thrissur</div></div></div></div>
    <div className="tbr"><div style={{position:"relative"}}><button className="tbb" onClick={()=>{setSN(!sN);setSM(false)}}><I n="bell" s={20}/>{unread>0&&<span className="bellb">{unread}</span>}</button>
    {sN&&<div className="nd"><div className="ndh"><span>Notifications</span><button className="btn bg bsm" style={{padding:"4px 8px",fontSize:12}} onClick={onRead}>Mark all read</button></div>
    {uN.map(n=><div key={n.id} className={`ndi ${!n.read?"ur":""}`}>{n.text}<div className="ndt">{fmtDate(n.createdAt)}</div></div>)}
    {!uN.length&&<div className="ndi" style={{color:"var(--g4)"}}>No notifications</div>}</div>}</div>
    <div style={{position:"relative"}}><button className="tbu" onClick={()=>{setSM(!sM);setSN(false)}}><div className="tbav">{u.avatar}</div><div style={{textAlign:"left"}}><div className="tbnm">{u.name}</div><div className="tbrl">{u.role}</div></div></button>
    {sM&&<div className="um"><div style={{padding:"8px 12px",fontSize:12,color:"var(--g4)",borderBottom:"1px solid var(--g1)",marginBottom:4}}>{u.email}</div><button className="umi" onClick={onLogout}><I n="logout" s={16}/> Sign Out</button></div>}</div></div></div>;
};

const SideBar = ({active,nav,isOpen,onClose,role}) => {
  const items=[{k:"dashboard",l:"Dashboard",i:"dashboard"},{k:"problems",l:"Problem Registry",i:"problems"},{k:"projects",l:"Projects",i:"projects"},{k:"events",l:"Events",i:"events"},...(role==="admin"?[{k:"analytics",l:"Analytics",i:"analytics"}]:[])];
  return <><div className={`sbbd ${isOpen?"op":""}`} onClick={onClose}/><div className={`sb ${isOpen?"op":""}`}><div className="sbnav">{items.map(x=><div key={x.k} className={`sbi ${active===x.k?"act":""}`} onClick={()=>{nav(x.k);onClose()}}><I n={x.i} s={20}/>{x.l}</div>)}</div>
  <div className="sbft">IEDC — CSDT Thrissur<br/>Govt. Medical College<br/>Dept. of Medical Education, Kerala</div></div></>;
};

// ── DASHBOARD ──
const Dash = ({probs,projs,evts,nav}) => {
  const stats=[{l:"Clinical Problems",c:probs.length,cl:"#E65100",bg:"#FFF3E0",i:"problems"},{l:"Active Projects",c:projs.length,cl:"#00897B",bg:"#E0F2F1",i:"projects"},{l:"In Prototyping",c:projs.filter(p=>p.stage==="prototyping").length,cl:"#1565C0",bg:"#E3F2FD",i:"file"},{l:"Upcoming Events",c:evts.filter(e=>daysUntil(e.date)>=0).length,cl:"#6A1B9A",bg:"#F3E5F5",i:"events"}];
  const nk=["problems","projects","projects","events"];
  return <div className="mi"><div style={{marginBottom:24}}><h1 className="serif" style={{fontSize:28,color:"var(--b9)",marginBottom:2}}>Command Centre</h1><p style={{color:"var(--g5)",fontSize:14}}>Innovation & Entrepreneurship Development Centre · Govt. Medical College Thrissur</p></div>
    <div className="sg">{stats.map((s,i)=><div key={i} className="sc" onClick={()=>nav(nk[i])}><div className="si" style={{background:s.bg}}><I n={s.i} s={20} c={s.cl}/></div><div className="sn">{s.c}</div><div className="sl">{s.l}</div></div>)}</div>
    <div className="dg"><div className="ds"><div className="dsh">Active Projects</div>{projs.map(p=>{const d=p.milestones.filter(m=>m.status==="completed").length,t=p.milestones.length,s=SC[p.stage];return <div key={p.id} className="dr" onClick={()=>nav("project-detail",p.id)}><div className="drt">{p.title}</div><span className="stb" style={{background:s.bg,color:s.t}}>{cap(p.stage)}</span><div className="pb" style={{width:80}}><div className="pf" style={{width:`${t?(d/t)*100:0}%`,background:s.b}}/></div><div className="pt">{d}/{t}</div></div>})}</div>
    <div className="ds"><div className="dsh">Upcoming Events</div>{evts.filter(e=>daysUntil(e.date)>=0).map(ev=>{const d=daysUntil(ev.date),tc={hackathon:{bg:"#FFF3E0",c:"#E65100"},exhibition:{bg:"#E3F2FD",c:"#1565C0"},visit:{bg:"#F3E5F5",c:"#6A1B9A"}}[ev.type];return <div key={ev.id} className="dr" onClick={()=>nav("events")}><div className="drt">{ev.title}</div><span className="et" style={{color:tc.c}}>{cap(ev.type)}</span><span className="db" style={{background:d<14?"#FFF3E0":"#E8F5E9",color:d<14?"#E65100":"#2E7D32"}}>{d===0?"Today!":`${d}d`}</span></div>})}</div></div>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><button className="btn bp" onClick={()=>nav("new-problem")}><I n="plus" s={18} c="#fff"/> Submit Clinical Problem</button><button className="btn bs" onClick={()=>nav("new-project")}><I n="plus" s={18}/> Submit Innovation Idea</button></div></div>;
};

// ── PROBLEMS ──
const Problems = ({probs,nav}) => {
  const [q,sQ]=useState(""),[sp,sSp]=useState("All");
  const fl=probs.filter(p=>(sp==="All"||p.specialty===sp)&&(!q||p.title.toLowerCase().includes(q.toLowerCase())||p.bottleneck.toLowerCase().includes(q.toLowerCase())));
  return <div className="mi"><div className="ph"><div style={{display:"flex",alignItems:"baseline"}}><h1 className="ptl serif">Clinical Problem Registry</h1><span className="pc">({probs.length})</span></div><button className="btn bp" onClick={()=>nav("new-problem")}><I n="plus" s={18} c="#fff"/> Report Problem</button></div>
    <div className="fb"><div className="sbx"><I n="search" s={18} c="var(--g4)"/><input placeholder="Search problems..." value={q} onChange={e=>sQ(e.target.value)}/></div><select className="fsl" value={sp} onChange={e=>sSp(e.target.value)}><option>All</option>{SPECIALTIES.map(s=><option key={s}>{s}</option>)}</select></div>
    <div>{fl.map(p=>{const sub=getUser(p.submittedBy);return <div key={p.id} className="prc"><div className="prch"><h3>{p.title}</h3><span className="ib" style={{background:IC[p.patientImpact]}}>{p.patientImpact}</span></div><p style={{fontSize:13,color:"var(--g5)",lineHeight:1.6,marginBottom:8}}>{p.bottleneck}</p><div className="prm"><span style={{background:"var(--g1)",padding:"2px 8px",borderRadius:2}}>{p.specialty}</span><span>By {sub?.name}</span>{p.costBurden&&<span>₹{p.costBurden}L/yr</span>}<span style={{background:p.status==="validated"?"#E8F5E9":"#E3F2FD",color:p.status==="validated"?"#2E7D32":"#1565C0",padding:"2px 8px",borderRadius:2,fontWeight:600,fontSize:11}}>{cap(p.status)}</span></div></div>})}
    {!fl.length&&<div style={{textAlign:"center",padding:40,color:"var(--g4)"}}>No problems match your filters.</div>}</div></div>;
};

const NewProblem = ({nav,onSubmit}) => {
  const [f,sF]=useState({title:"",specialty:"",patientImpact:"",bottleneck:"",workaround:"",whyImportedFails:"",costBurden:""}),[err,sE]=useState({});
  const v=()=>{const e={};if(!f.title.trim())e.title="Required";if(!f.specialty)e.specialty="Required";if(!f.patientImpact)e.patientImpact="Required";if(!f.bottleneck.trim())e.bottleneck="Required";sE(e);return!Object.keys(e).length};
  const set=(k,v)=>sF(x=>({...x,[k]:v}));
  return <div className="mi" style={{maxWidth:640}}><button className="dtb" onClick={()=>nav("problems")}><I n="back" s={18}/> Back to Registry</button><h1 className="ptl serif" style={{marginBottom:20}}>Report Clinical Problem</h1>
    <form className="cd" onSubmit={e=>{e.preventDefault();if(!v())return;onSubmit({...f,costBurden:f.costBurden?parseFloat(f.costBurden):null});nav("problems")}}>
    <div className="fg"><label className="fl">Problem Title *</label><input className="fi" value={f.title} onChange={e=>set("title",e.target.value)} placeholder="Brief, descriptive title"/>{err.title&&<div className="fe">{err.title}</div>}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><div className="fg"><label className="fl">Clinical Specialty *</label><select className="fs" value={f.specialty} onChange={e=>set("specialty",e.target.value)}><option value="">Select...</option>{SPECIALTIES.map(s=><option key={s}>{s}</option>)}</select>{err.specialty&&<div className="fe">{err.specialty}</div>}</div>
    <div className="fg"><label className="fl">Patient Impact *</label><select className="fs" value={f.patientImpact} onChange={e=>set("patientImpact",e.target.value)}><option value="">Select...</option>{["Critical","High","Medium","Low"].map(i=><option key={i}>{i}</option>)}</select>{err.patientImpact&&<div className="fe">{err.patientImpact}</div>}</div></div>
    <div className="fg"><label className="fl">Clinical Bottleneck *</label><textarea className="ft" rows={4} value={f.bottleneck} onChange={e=>set("bottleneck",e.target.value)} maxLength={500}/><div style={{fontSize:11,color:"var(--g4)",textAlign:"right",marginTop:4}}>{f.bottleneck.length}/500</div>{err.bottleneck&&<div className="fe">{err.bottleneck}</div>}</div>
    <div className="fg"><label className="fl">Current Workaround</label><textarea className="ft" rows={2} value={f.workaround} onChange={e=>set("workaround",e.target.value)}/></div>
    <div className="fg"><label className="fl">Why Imported Technology Fails</label><textarea className="ft" rows={2} value={f.whyImportedFails} onChange={e=>set("whyImportedFails",e.target.value)}/></div>
    <div className="fg"><label className="fl">Annual Cost Burden (₹ Lakhs)</label><input className="fi" type="number" step="0.1" value={f.costBurden} onChange={e=>set("costBurden",e.target.value)}/></div>
    <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:8}}><button type="button" className="btn bs" onClick={()=>nav("problems")}>Cancel</button><button type="submit" className="btn bp">Submit Problem</button></div></form></div>;
};

// ── PROJECTS ──
const Projects = ({projs,nav}) => {
  const [sf,sSf]=useState("all");const fl=sf==="all"?projs:projs.filter(p=>p.stage===sf);
  const cts={all:projs.length};STAGES.forEach(s=>{cts[s]=projs.filter(p=>p.stage===s).length});
  return <div className="mi"><div className="ph"><div style={{display:"flex",alignItems:"baseline"}}><h1 className="ptl serif">Innovation Projects</h1><span className="pc">({projs.length})</span></div><button className="btn bp" onClick={()=>nav("new-project")}><I n="plus" s={18} c="#fff"/> New Idea</button></div>
    <div className="sp">{[{k:"all",l:"All"},...STAGES.map(s=>({k:s,l:cap(s)}))].map(pill=>{const s=pill.k==="all"?{bg:"var(--g1)",t:"var(--g7)",b:"var(--g4)"}:SC[pill.k];const a=sf===pill.k;return <button key={pill.k} className={`spl ${a?"act":""}`} style={a?{background:s.bg,color:s.t,borderColor:s.b}:{}} onClick={()=>sSf(pill.k)}>{pill.l} <span style={{fontSize:11,opacity:.7}}>{cts[pill.k]}</span></button>})}</div>
    <div className="pjg">{fl.map(p=>{const s=SC[p.stage],d=p.milestones.filter(m=>m.status==="completed").length,t=p.milestones.length,ld=getUser(p.leadId),mt=getUser(p.mentorId);return <div key={p.id} className="pjc" onClick={()=>nav("project-detail",p.id)}><div className="pjt"><span className="stb" style={{background:s.bg,color:s.t}}>{cap(p.stage)}</span><span style={{fontSize:12,color:"var(--g4)"}}>{p.specialty}</span></div><h3>{p.title}</h3><p>{p.description}</p><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><div className="pb" style={{flex:1}}><div className="pf" style={{width:`${t?(d/t)*100:0}%`,background:s.b}}/></div><span className="pt">{d}/{t}</span></div><div className="pjf"><div className="pjp"><div className="mav">{ld?.avatar}</div><span>{ld?.name}</span></div>{mt&&<div style={{fontSize:12,color:"var(--g4)"}}>Mentor: {mt.name.split(" ")[0]}</div>}</div></div>})}
    {!fl.length&&<div style={{textAlign:"center",padding:40,color:"var(--g4)",gridColumn:"1/-1"}}>No projects in this stage.</div>}</div></div>;
};

const NewProject = ({probs,nav,onSubmit}) => {
  const [f,sF]=useState({title:"",specialty:"",problemId:"",description:""}),[err,sE]=useState({});
  const v=()=>{const e={};if(!f.title.trim())e.title="Required";if(!f.specialty)e.specialty="Required";if(!f.description.trim())e.description="Required";sE(e);return!Object.keys(e).length};
  const set=(k,v)=>sF(x=>({...x,[k]:v}));
  return <div className="mi" style={{maxWidth:640}}><button className="dtb" onClick={()=>nav("projects")}><I n="back" s={18}/> Back to Projects</button><h1 className="ptl serif" style={{marginBottom:20}}>Submit Innovation Idea</h1>
    <form className="cd" onSubmit={e=>{e.preventDefault();if(!v())return;onSubmit(f);nav("projects")}}>
    <div className="fg"><label className="fl">Idea Title *</label><input className="fi" value={f.title} onChange={e=>set("title",e.target.value)} placeholder="Name your innovation"/>{err.title&&<div className="fe">{err.title}</div>}</div>
    <div className="fg"><label className="fl">Clinical Specialty *</label><select className="fs" value={f.specialty} onChange={e=>set("specialty",e.target.value)}><option value="">Select...</option>{SPECIALTIES.map(s=><option key={s}>{s}</option>)}</select>{err.specialty&&<div className="fe">{err.specialty}</div>}</div>
    <div className="fg"><label className="fl">Linked Problem</label><select className="fs" value={f.problemId} onChange={e=>set("problemId",e.target.value)}><option value="">None</option>{probs.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
    <div className="fg"><label className="fl">Description *</label><textarea className="ft" rows={5} value={f.description} onChange={e=>set("description",e.target.value)} placeholder="Describe your idea..."/>{err.description&&<div className="fe">{err.description}</div>}</div>
    <div style={{display:"flex",gap:12,justifyContent:"flex-end",marginTop:8}}><button type="button" className="btn bs" onClick={()=>nav("projects")}>Cancel</button><button type="submit" className="btn bp">Submit Idea</button></div></form></div>;
};

// ── PROJECT DETAIL ──
const Detail = ({p,probs,user,nav,toggleM,toggleT,advance,addFile,addFb}) => {
  const [tab,sTab]=useState("overview"),[fbf,sFbf]=useState({rating:"on_track",text:""}),[drag,sDrag]=useState(false);
  const fRef=useRef(null);
  if(!p) return <div className="mi"><p>Project not found.</p></div>;
  const s=SC[p.stage],ld=getUser(p.leadId),mt=getUser(p.mentorId),lp=probs.find(x=>x.id===p.problemId);
  const cM=p.milestones.filter(m=>m.status==="completed").length,tM=p.milestones.length;
  const cT=p.tasks.filter(t=>t.status==="done").length,tT=p.tasks.length;
  const si=STAGES.indexOf(p.stage),ns=si<STAGES.length-1?STAGES[si+1]:null;
  const canFb=user.role==="mentor"||user.role==="admin";
  const tabL=["overview","milestones","tasks","files",...(canFb||p.feedback?.length?["feedback"]:[])];
  const handleFile=e=>{e.preventDefault();sDrag(false);const files=e.dataTransfer?.files||e.target?.files;if(files?.[0]){const f=files[0];const ext=f.name.split('.').pop().toLowerCase();const tm={pdf:"pdf",doc:"doc",docx:"doc",png:"image",jpg:"image",kicad:"cad",stl:"cad",zip:"zip"};addFile(p.id,{name:f.name,type:tm[ext]||"file",size:f.size>1048576?`${(f.size/1048576).toFixed(1)} MB`:`${Math.round(f.size/1024)} KB`,category:"Other"})}};

  return <div className="mi"><button className="dtb" onClick={()=>nav("projects")}><I n="back" s={18}/> Back to Projects</button>
    <div className="dth"><h1>{p.title}<span className="stb" style={{background:s.bg,color:s.t,fontSize:13}}>{cap(p.stage)}</span></h1><p className="dtd">{p.description}</p>
    <div className="dtm"><div style={{display:"flex",gap:6}}><span className="dml">Lead:</span>{ld?.name}</div>{mt&&<div style={{display:"flex",gap:6}}><span className="dml">Mentor:</span>{mt.name}</div>}<div style={{display:"flex",gap:6}}><span className="dml">Specialty:</span>{p.specialty}</div><div style={{display:"flex",gap:6}}><span className="dml">Team:</span>{p.members.length}</div></div>
    {user.role==="admin"&&ns&&<button className="btn bp bsm" style={{marginTop:16}} onClick={()=>advance(p.id)}>Advance Stage → {cap(ns)}</button>}
    {lp&&<div className="lpr"><I n="problems" s={16} c="#F57F17"/>Linked: {lp.title}</div>}</div>

    <div className="tabs">{tabL.map(t=><button key={t} className={`tab ${tab===t?"act":""}`} onClick={()=>sTab(t)}>
      {t==="files"&&<I n="file" s={16}/>}{t==="feedback"&&<I n="message" s={16}/>}{cap(t)}
      {t==="files"&&p.files?.length?<span style={{fontSize:11,opacity:.6}}>({p.files.length})</span>:null}
      {t==="feedback"&&p.feedback?.length?<span style={{fontSize:11,opacity:.6}}>({p.feedback.length})</span>:null}
    </button>)}</div>

    {tab==="overview"&&<div className="ovg"><div className="cd">
      <div className="rr" style={{background:`conic-gradient(var(--t5) 0deg,var(--t5) ${p.readinessScore*3.6}deg,var(--g1) ${p.readinessScore*3.6}deg)`}}><div className="ri"><div className="rs">{p.readinessScore}</div><div className="rl">Readiness</div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:8}}><div style={{textAlign:"center"}}><div style={{fontFamily:"var(--fh)",fontSize:22,color:"var(--b9)"}}>{cM}/{tM}</div><div style={{fontSize:12,color:"var(--g4)"}}>Milestones</div></div><div style={{textAlign:"center"}}><div style={{fontFamily:"var(--fh)",fontSize:22,color:"var(--b9)"}}>{cT}/{tT}</div><div style={{fontSize:12,color:"var(--g4)"}}>Tasks</div></div></div></div>
      <div className="cd"><h3 style={{fontSize:15,fontWeight:600,color:"var(--g7)",marginBottom:16}}>Team Members</h3>{p.members.map(m=>{const u=getUser(m.userId);return <div key={m.userId} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0"}}><div className="tma">{u?.avatar}</div><div><div className="tmn">{u?.name}</div><div className="tmr">{m.role} · {u?.department}</div></div></div>})}</div></div>}

    {tab==="milestones"&&<div className="cd">{p.milestones.map(m=>{const dn=m.status==="completed",sc={completed:"#2E7D32",in_progress:"#E65100",pending:"var(--g4)"};return <div key={m.id} className="mli"><div className={`cc ${dn?"chk":""}`} onClick={()=>toggleM(p.id,m.id)}>{dn&&<I n="check" s={14} c="#fff"/>}</div><div className="ic"><div className={`it ${dn?"dn":""}`}>{m.title}</div><div className="im"><span style={{color:sc[m.status]}}>{cap(m.status.replace("_"," "))}</span><span>Due: {fmtDate(m.dueDate)}</span></div></div></div>})}</div>}

    {tab==="tasks"&&<div className="cd">{p.tasks.map(t=>{const dn=t.status==="done",a=getUser(t.assignedTo),pc={high:{bg:"#FDECEA",c:"#D32F2F"},medium:{bg:"#FFF8E1",c:"#F57F17"}}[t.priority]||{bg:"#FFF8E1",c:"#F57F17"};return <div key={t.id} className="tki"><div className={`cq ${dn?"chk":""}`} onClick={()=>toggleT(p.id,t.id)}>{dn&&<I n="check" s={14} c="#fff"/>}</div><div className="ic"><div className={`it ${dn?"dn":""}`}>{t.title}</div><div className="im"><span className="prb" style={{background:pc.bg,color:pc.c}}>{cap(t.priority)}</span><span style={{display:"flex",alignItems:"center",gap:4}}><span className="mav" style={{width:18,height:18,fontSize:8}}>{a?.avatar}</span>{a?.name.split(" ")[0]}</span></div></div></div>)}
    {!p.tasks.length&&<p style={{color:"var(--g4)",textAlign:"center",padding:20}}>No tasks yet.</p>}</div>}

    {tab==="files"&&<div>
      <div className={`uz ${drag?"drg":""}`} onDragOver={e=>{e.preventDefault();sDrag(true)}} onDragLeave={()=>sDrag(false)} onDrop={handleFile} onClick={()=>fRef.current?.click()}>
        <I n="upload" s={32} c="var(--g4)"/><p>Drag & drop files here or click to browse</p><span>PDF, DOCX, Images, CAD files, ZIP</span>
        <input ref={fRef} type="file" style={{display:"none"}} onChange={handleFile} accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.stl,.step,.kicad,.zip"/></div>
      {(p.files||[]).map(f=>{const cc=catColor(f.category);return <div key={f.id} className="fli"><div className="flic" style={{background:cc+"15"}}><I n="file" s={20} c={cc}/></div><div style={{flex:1}}><div className="fln">{f.name}</div><div className="flm"><span>{f.size}</span><span>{getUser(f.uploadedBy)?.name}</span><span>{fmtDate(f.createdAt)}</span></div></div><span className="flcat" style={{background:cc+"15",color:cc}}>{f.category}</span></div>})}
      {!p.files?.length&&<p style={{color:"var(--g4)",textAlign:"center",padding:20}}>No files uploaded yet.</p>}</div>}

    {tab==="feedback"&&<div>
      {canFb&&<div className="cd" style={{marginBottom:20}}><h3 style={{fontSize:15,fontWeight:600,color:"var(--g7)",marginBottom:12}}>Add Feedback</h3>
        <div style={{display:"flex",gap:8,marginBottom:12}}>{Object.entries(FR).map(([k,v])=><button key={k} className="btn bsm" style={{background:fbf.rating===k?v.bg:"var(--g0)",color:fbf.rating===k?v.c:"var(--g5)",border:`1.5px solid ${fbf.rating===k?v.c:"var(--g2)"}`}} onClick={()=>sFbf(x=>({...x,rating:k}))}>{v.l}</button>)}</div>
        <textarea className="ft" rows={3} placeholder="Write structured feedback..." value={fbf.text} onChange={e=>sFbf(x=>({...x,text:e.target.value}))}/>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:8}}><button className="btn bp bsm" onClick={()=>{if(!fbf.text.trim())return;addFb(p.id,{rating:fbf.rating,text:fbf.text});sFbf({rating:"on_track",text:""})}}>Submit Feedback</button></div></div>}
      {(p.feedback||[]).slice().reverse().map(fb=>{const m=getUser(fb.mentorId),r=FR[fb.rating];return <div key={fb.id} className="fbi"><div className="fbih"><div style={{display:"flex",alignItems:"center",gap:8}}><div className="tma" style={{width:28,height:28,fontSize:11}}>{m?.avatar}</div><span style={{fontSize:14,fontWeight:500,color:"var(--g7)"}}>{m?.name}</span><span className="fbrb" style={{background:r.bg,color:r.c}}>{r.l}</span></div><span style={{fontSize:12,color:"var(--g4)"}}>{fmtDate(fb.createdAt)}</span></div><p>{fb.text}</p></div>})}
      {!p.feedback?.length&&!canFb&&<p style={{color:"var(--g4)",textAlign:"center",padding:20}}>No feedback yet.</p>}</div>}
  </div>;
};

// ── EVENTS ──
const Events = ({evts,nav}) => {
  const sorted=[...evts].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const tc={hackathon:{bg:"#FFF3E0",c:"#E65100",i:"award"},exhibition:{bg:"#E3F2FD",c:"#1565C0",i:"target"},visit:{bg:"#F3E5F5",c:"#6A1B9A",i:"users"}};
  return <div className="mi"><h1 className="ptl serif" style={{marginBottom:24}}>Events & Activities</h1>
    <div className="tl">{sorted.map(ev=>{const c=tc[ev.type],d=daysUntil(ev.date),past=d<0;return <div key={ev.id} className="tli"><div className="tld" style={{background:c.bg}}><I n={c.i} s={18} c={c.c}/></div>
      <div className={`tlc ${past?"past":""}`}><div className="tlch"><div><span className="et" style={{color:c.c}}>{cap(ev.type)}</span><span style={{fontSize:13,color:"var(--g4)",marginLeft:8}}>{fmtDate(ev.date)}</span></div>
      <span className="db" style={{background:past?"var(--g1)":d<14?"#FFF3E0":"#E8F5E9",color:past?"var(--g4)":d<14?"#E65100":"#2E7D32"}}>{past?"Completed":d===0?"Today!":`${d} days`}</span></div>
      <h3>{ev.title}</h3><p>{ev.description}</p><div className="tlv"><I n="pin" s={14}/> {ev.venue}</div>
      {ev.type==="hackathon"&&!past&&<button className="btn bp bsm" style={{marginTop:12}} onClick={()=>nav("new-project")}>Submit Idea</button>}</div></div>})}</div></div>;
};

// ── ANALYTICS ──
const Analytics = ({probs,projs}) => {
  const stageCts=STAGES.map(s=>({s,c:projs.filter(p=>p.stage===s).length}));const mx=Math.max(...stageCts.map(x=>x.c),1);
  const specCts={};projs.forEach(p=>{specCts[p.specialty]=(specCts[p.specialty]||0)+1});const specD=Object.entries(specCts).sort((a,b)=>b[1]-a[1]);
  const sColors=["#00897B","#1565C0","#E65100","#6A1B9A","#D32F2F","#F57F17"];
  let dg="",acc=0;const tot=projs.length||1;specD.forEach(([,c],i)=>{const pct=(c/tot)*100;dg+=`${sColors[i%sColors.length]} ${acc}% ${acc+pct}%,`;acc+=pct});dg=dg.slice(0,-1);
  const months=["Jan","Feb","Mar"];const mp=months.map((m,i)=>({m,c:probs.filter(p=>new Date(p.createdAt).getMonth()===i).length}));const mxP=Math.max(...mp.map(x=>x.c),1);
  const onTrack=projs.filter(p=>p.milestones.filter(m=>m.status==="in_progress").every(m=>daysUntil(m.dueDate)>=0)).length;
  const impCts={};probs.forEach(p=>{impCts[p.patientImpact]=(impCts[p.patientImpact]||0)+1});

  return <div className="mi"><h1 className="ptl serif" style={{marginBottom:4}}>Analytics Dashboard</h1><p style={{color:"var(--g5)",fontSize:14,marginBottom:24}}>Innovation pipeline metrics & insights</p>
    <div className="ag">
      <div className="ac"><h3><I n="trending" s={18} c="var(--t6)"/> Pipeline Funnel</h3><div className="funnel">{stageCts.map(x=>{const sc=SC[x.s];return <div key={x.s} className="frow"><div className="flbl">{cap(x.s)}</div><div className="fbar" style={{width:`${Math.max((x.c/mx)*100,15)}%`,background:sc.b}}>{x.c}</div></div>})}</div></div>
      <div className="ac"><h3><I n="pie" s={18} c="var(--t6)"/> Specialty Distribution</h3><div className="dwrap"><div className="donut" style={{background:`conic-gradient(${dg||"var(--g2) 0% 100%"})`}}><div className="dcenter">{projs.length}</div></div><div>{specD.map(([n,c],i)=><div key={n} className="dli"><div className="ddot" style={{background:sColors[i%sColors.length]}}/>{n} ({c})</div>)}</div></div></div>
      <div className="ac"><h3><I n="analytics" s={18} c="var(--t6)"/> Monthly Problem Submissions</h3>{mp.map(x=><div key={x.m} className="trow"><div className="tmon">{x.m} '26</div><div className="tbar"><div className="tfill" style={{width:`${(x.c/mxP)*100}%`,background:"var(--t5)"}}/></div><div className="tval">{x.c}</div></div>)}</div>
      <div className="ac"><h3><I n="clock" s={18} c="var(--t6)"/> Project Health</h3>
        <div className="bchart"><div className="bcol"><div className="bval">{onTrack}</div><div className="bar" style={{height:`${projs.length?(onTrack/projs.length)*100:0}%`,background:"#2E7D32",minHeight:4}}/><div className="blbl">On Track</div></div>
        <div className="bcol"><div className="bval">{projs.length-onTrack}</div><div className="bar" style={{height:`${projs.length?((projs.length-onTrack)/projs.length)*100:0}%`,background:"#E65100",minHeight:4}}/><div className="blbl">Delayed</div></div></div>
        <div style={{marginTop:16}}><h4 style={{fontSize:13,fontWeight:600,color:"var(--g6)",marginBottom:8}}>Patient Impact</h4>
        {["Critical","High","Medium","Low"].map(imp=><div key={imp} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span className="ib" style={{background:IC[imp],minWidth:60,justifyContent:"center"}}>{imp}</span><div className="pb" style={{flex:1}}><div className="pf" style={{width:`${((impCts[imp]||0)/probs.length)*100}%`,background:IC[imp]}}/></div><span style={{fontSize:13,fontWeight:600,color:"var(--g7)",minWidth:20}}>{impCts[imp]||0}</span></div>)}</div></div>
    </div></div>;
};

// ── MAIN APP ──
export default function App() {
  const [user,setUser]=useState(null),[page,setPage]=useState("dashboard"),[param,setParam]=useState(null),[sbOpen,setSb]=useState(false),[toasts,setToasts]=useState([]);
  const [probs,setProbs]=useState(seedProblems),[projs,setProjs]=useState(seedProjects),[evts]=useState(seedEvents),[notifs,setNotifs]=useState(seedNotifs);

  const toast=t=>{const id=Date.now();setToasts(x=>[...x,{id,text:t}]);setTimeout(()=>setToasts(x=>x.filter(y=>y.id!==id)),3000)};
  const nav=(p,pr=null)=>{setPage(p);setParam(pr);window.scrollTo(0,0)};
  const markRead=()=>setNotifs(ns=>ns.map(n=>n.userId===user.id?{...n,read:true}:n));

  const subProb=d=>{setProbs(ps=>[...ps,{...d,id:ps.length+1,submittedBy:user.id,status:"open",createdAt:new Date().toISOString().split("T")[0]}]);setNotifs(ns=>[{id:Date.now(),userId:1,text:`New problem: ${d.title}`,read:false,createdAt:new Date().toISOString()},...ns]);toast("Problem submitted!")};
  const subProj=d=>{setProjs(ps=>[...ps,{id:ps.length+1,title:d.title,description:d.description,problemId:d.problemId?parseInt(d.problemId):null,stage:"submitted",specialty:d.specialty,leadId:user.id,mentorId:null,readinessScore:5,createdAt:new Date().toISOString().split("T")[0],milestones:[{id:Date.now(),title:"Screening Review",status:"pending",dueDate:"2026-03-15"}],tasks:[],members:[{userId:user.id,role:"Lead"}],files:[],feedback:[]}]);setNotifs(ns=>[{id:Date.now(),userId:1,text:`New idea: ${d.title}`,read:false,createdAt:new Date().toISOString()},...ns]);toast("Idea submitted!")};
  const toggleM=(pid,mid)=>setProjs(ps=>ps.map(p=>p.id!==pid?p:{...p,milestones:p.milestones.map(m=>m.id!==mid?m:{...m,status:m.status==="completed"?"pending":"completed"})}));
  const toggleT=(pid,tid)=>setProjs(ps=>ps.map(p=>p.id!==pid?p:{...p,tasks:p.tasks.map(t=>t.id!==tid?t:{...t,status:t.status==="done"?"todo":"done"})}));
  const advance=pid=>setProjs(ps=>ps.map(p=>{if(p.id!==pid)return p;const i=STAGES.indexOf(p.stage);if(i>=STAGES.length-1)return p;toast(`Advanced to ${cap(STAGES[i+1])}`);return{...p,stage:STAGES[i+1],readinessScore:Math.min(100,p.readinessScore+15)}}));
  const addFile=(pid,fd)=>{setProjs(ps=>ps.map(p=>p.id!==pid?p:{...p,files:[...(p.files||[]),{...fd,id:Date.now(),uploadedBy:user.id,createdAt:new Date().toISOString().split("T")[0]}]}));toast(`File "${fd.name}" uploaded!`)};
  const addFb=(pid,fd)=>{setProjs(ps=>ps.map(p=>p.id!==pid?p:{...p,feedback:[...(p.feedback||[]),{...fd,id:Date.now(),mentorId:user.id,createdAt:new Date().toISOString().split("T")[0]}]}));const proj=projs.find(p=>p.id===pid);setNotifs(ns=>[{id:Date.now(),userId:proj?.leadId||1,text:`New feedback from ${user.name} on ${proj?.title}`,read:false,createdAt:new Date().toISOString()},...ns]);toast("Feedback submitted!")};

  if(!user) return <><style>{CSS}</style><Login onLogin={u=>{setUser(u);toast(`Welcome, ${u.name.split(" ")[0]}!`)}}/><Toast toasts={toasts}/></>;

  const curProj=page==="project-detail"?projs.find(p=>p.id===param):null;
  const actPage=["new-problem"].includes(page)?"problems":["new-project","project-detail"].includes(page)?"projects":page;

  return <><style>{CSS}</style>
    <TopBar user={user} onLogout={()=>{setUser(null);setPage("dashboard")}} onToggle={()=>setSb(!sbOpen)} notifs={notifs} onRead={markRead}/>
    <SideBar active={actPage} nav={nav} isOpen={sbOpen} onClose={()=>setSb(false)} role={user.role}/>
    <div className="mn">
      {page==="dashboard"&&<Dash probs={probs} projs={projs} evts={evts} nav={nav}/>}
      {page==="problems"&&<Problems probs={probs} nav={nav}/>}
      {page==="new-problem"&&<NewProblem nav={nav} onSubmit={subProb}/>}
      {page==="projects"&&<Projects projs={projs} nav={nav}/>}
      {page==="new-project"&&<NewProject probs={probs} nav={nav} onSubmit={subProj}/>}
      {page==="project-detail"&&<Detail p={curProj} probs={probs} user={user} nav={nav} toggleM={toggleM} toggleT={toggleT} advance={advance} addFile={addFile} addFb={addFb}/>}
      {page==="events"&&<Events evts={evts} nav={nav}/>}
      {page==="analytics"&&<Analytics probs={probs} projs={projs}/>}
    </div>
    <Toast toasts={toasts}/></>;
}
