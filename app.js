/* =====================================================
   IRON NORTH — app.js v2
   Fully personalized: AI-generated daily tasks,
   coach messages, and challenges based on deep
   user profile built during onboarding.
   ===================================================== */

// ─── TIERS ────────────────────────────────────────────────
const TIERS = [
  { name:'Bronze',   color:'#cd7f32', xpNeeded:300   },
  { name:'Silver',   color:'#a8a8a8', xpNeeded:600   },
  { name:'Gold',     color:'#d4a017', xpNeeded:900   },
  { name:'Platinum', color:'#e0dede', xpNeeded:1500  },
  { name:'Diamond',  color:'#7dd3fc', xpNeeded:2400  },
  { name:'Champion', color:'#f87171', xpNeeded:4000  },
  { name:'Olympian', color:'#facc15', xpNeeded:99999 },
];
const DIVS = ['I','II','III'];

// ─── SKILL TREES ──────────────────────────────────────────
const SKILL_TREES = {
  Physical: {
    icon: '⚡',
    nodes: [
      { id:'ph1', name:'First 5',        desc:'Complete 5 workouts total',        xp:30,  req:null },
      { id:'ph2', name:'Iron Will',      desc:'Complete 15 workouts total',       xp:50,  req:'ph1' },
      { id:'ph3', name:'Consistency',    desc:'Complete 30 workouts total',       xp:80,  req:'ph2' },
      { id:'ph4', name:'Elite Standard', desc:'Complete 60 workouts total',       xp:150, req:'ph3' },
      { id:'ph5', name:'Forged Body',    desc:'Complete 100 workouts total',      xp:300, req:'ph4' },
    ]
  },
  Discipline: {
    icon: '🔥',
    nodes: [
      { id:'di1', name:'First Strike',  desc:'Complete your first full task day', xp:20,  req:null },
      { id:'di2', name:'Week Forged',   desc:'Reach a 7-day streak',              xp:60,  req:'di1' },
      { id:'di3', name:'Iron Habit',    desc:'Reach a 21-day streak',             xp:120, req:'di2' },
      { id:'di4', name:'Unbreakable',   desc:'Reach a 45-day streak',             xp:200, req:'di3' },
      { id:'di5', name:'Olympian Mind', desc:'Reach a 90-day streak',             xp:400, req:'di4' },
    ]
  },
  Communication: {
    icon: '🗣️',
    nodes: [
      { id:'co1', name:'Eye Contact', desc:'Hold eye contact in 3 conversations',   xp:20,  req:null },
      { id:'co2', name:'First Words', desc:'Start a conversation with a stranger',   xp:30,  req:'co1' },
      { id:'co3', name:'The Floor',   desc:'Lead a group discussion',                xp:50,  req:'co2' },
      { id:'co4', name:'Presenter',   desc:'Give a short public presentation',       xp:80,  req:'co3' },
      { id:'co5', name:'Influencer',  desc:'Teach someone a skill you have',         xp:120, req:'co4' },
    ]
  },
  Knowledge: {
    icon: '📖',
    nodes: [
      { id:'kn1', name:'Reader',      desc:'Read for 7 consecutive days',              xp:30,  req:null },
      { id:'kn2', name:'Deep Work',   desc:'Complete a 2-hour no-distraction session', xp:40,  req:'kn1' },
      { id:'kn3', name:'Scholar',     desc:'Finish an entire book',                    xp:80,  req:'kn2' },
      { id:'kn4', name:'Builder',     desc:'Apply something you learned to a project', xp:120, req:'kn3' },
      { id:'kn5', name:'Synthesizer', desc:'Teach back a complex concept to someone',  xp:180, req:'kn4' },
    ]
  },
  Resilience: {
    icon: '🛡️',
    nodes: [
      { id:'re1', name:'Cold Start',  desc:'Cold shower 7 days straight',                   xp:40,  req:null },
      { id:'re2', name:'Discomfort',  desc:'Do something uncomfortable 5 times',             xp:50,  req:'re1' },
      { id:'re3', name:'Hard Day',    desc:'Finish a full task day when you wanted to quit', xp:70,  req:'re2' },
      { id:'re4', name:'Steel Frame', desc:'Bounce back strong after a broken streak',       xp:100, req:'re3' },
      { id:'re5', name:'Unshaken',    desc:'30-day zero complaints challenge',                xp:200, req:'re4' },
    ]
  },
  Spiritual: {
    icon: '✝️',
    nodes: [
      { id:'sp1', name:'Daily Word',  desc:'Read Scripture 7 consecutive days',       xp:30,  req:null },
      { id:'sp2', name:'Still Voice', desc:'Pray intentionally for 14 days straight', xp:50,  req:'sp1' },
      { id:'sp3', name:'Gratitude',   desc:'Write 3 gratitudes per day for 10 days',  xp:60,  req:'sp2' },
      { id:'sp4', name:'Service',     desc:'Serve someone without recognition',        xp:80,  req:'sp3' },
      { id:'sp5', name:'Grounded',    desc:'Memorize 5 passages of Scripture',         xp:120, req:'sp4' },
    ]
  },
};

// ─── WEEKLY MISSIONS ──────────────────────────────────────
const WEEKLY_MISSIONS = [
  { title:'Complete 3 full workouts this week',              xp:150 },
  { title:'Read every single day this week',                 xp:120 },
  { title:'Wake up before 7am for 5 consecutive days',       xp:130 },
  { title:'Have 3 meaningful conversations with new people', xp:140 },
  { title:'Go one full week with zero complaints',           xp:160 },
  { title:'Complete every daily task set this week',         xp:200 },
  { title:'No social media for 5 straight days',             xp:150 },
  { title:'Journal or reflect every day this week',          xp:110 },
];

// ─── REFLECTION PROMPTS ───────────────────────────────────
const REFLECT_PROMPTS = [
  'What was the hardest thing you did today — and did you finish it?',
  'Where did your discipline break down today? Be specific.',
  'What did you do today that your future self will thank you for?',
  'Name one thing you avoided today that you know you should have done.',
  'Who did you show up for today — and who did you let down?',
  'What would you do differently if you could run today over again?',
  'Name one moment where you chose comfort over growth.',
  'What truth or Scripture held you together today?',
  'What emotion drove your worst decision today?',
  'Did your actions today reflect the person you\'re trying to become?',
];

// ─── STATE ────────────────────────────────────────────────
const DEFAULT = {
  onboarded: false,
  // Basic profile
  name: '',
  age: '',           // '13-15' | '16-18' | '19-22' | '23+'
  areas: [],
  // Physical profile
  fitnessLevel: '',  // 'beginner' | 'intermediate' | 'advanced' | 'athlete'
  sport: '',         // free text e.g. "competitive swimming"
  trainingDays: '',  // '1-2' | '3-4' | '5+'
  // Life situation
  timePerDay: '',    // '10-15min' | '20-30min' | '30-60min' | '60min+'
  biggestStruggle: '',// 'consistency' | 'motivation' | 'focus' | 'confidence' | 'purpose'
  environment: '',   // 'school' | 'work' | 'both' | 'neither'
  // Goals
  topGoal: '',       // free text — what do they want in 6 months
  // Progression
  xp: 0,
  tier: 0,
  division: 0,
  streak: 0,
  forgedDays: 0,
  lastForgedDate: null,
  tasksCompleted: [],
  aiDailyTasks: null,     // { date, tasks[] }
  skillProgress: {},
  weekMission: null,
  reflections: [],
  streakBonusesClaimed: [],
  joinDate: null,
};

let S = {};

function save() { try { localStorage.setItem('in_v3', JSON.stringify(S)); } catch(e) {} }
function load() {
  try {
    const raw = localStorage.getItem('in_v3');
    // Migrate from v2
    if (!raw) {
      const old = localStorage.getItem('in_v2');
      S = old ? { ...DEFAULT, ...JSON.parse(old) } : { ...DEFAULT };
    } else {
      S = { ...DEFAULT, ...JSON.parse(raw) };
    }
  } catch(e) { S = { ...DEFAULT }; }
}

// ─── HELPERS ──────────────────────────────────────────────
function today() { return new Date().toISOString().split('T')[0]; }
function weekKey() {
  const d = new Date(), jan1 = new Date(d.getFullYear(),0,1);
  return `${d.getFullYear()}-W${Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7)}`;
}
function dayOfWeek() { return new Date().getDay(); }
function getTierObj() { return TIERS[S.tier]; }
function getTierColor() { return getTierObj().color; }
function getTierLabel() {
  const t = getTierObj();
  if (S.tier >= 5) return t.name;
  return `${t.name} ${DIVS[S.division]}`;
}
function getXPNeeded() { return getTierObj().xpNeeded; }
function getXPPercent() { return Math.min(100, Math.round(S.xp / getXPNeeded() * 100)); }

// Build a rich profile string for AI prompts
function profileContext() {
  const parts = [
    `Name: ${S.name || 'User'}`,
    S.age ? `Age range: ${S.age}` : '',
    `Focus areas: ${S.areas.join(', ')}`,
    S.fitnessLevel ? `Fitness level: ${S.fitnessLevel}` : '',
    S.sport ? `Sport/activity: ${S.sport}` : '',
    S.trainingDays ? `Training days/week: ${S.trainingDays}` : '',
    S.timePerDay ? `Available time/day: ${S.timePerDay}` : '',
    S.biggestStruggle ? `Biggest struggle: ${S.biggestStruggle}` : '',
    S.topGoal ? `6-month goal: ${S.topGoal}` : '',
    `Tier: ${getTierLabel()}`,
    `Streak: ${S.streak} days`,
    `Forged days: ${S.forgedDays}`,
  ];
  return parts.filter(Boolean).join('\n');
}

// ─── XP & TIER ────────────────────────────────────────────
function addXP(amount) {
  S.xp += amount;
  checkTierUp();
  save();
  showToast(`+${amount} XP`, '⚡');
  animXP();
  refreshXPBar();
}

function checkTierUp() {
  if (S.xp < getXPNeeded()) return false;
  if (S.tier >= TIERS.length - 1) { S.xp = getXPNeeded(); return false; }
  S.xp -= getXPNeeded();
  if (S.tier < 5) {
    S.division++;
    if (S.division > 2) { S.division = 0; S.tier++; }
  } else {
    S.tier = Math.min(S.tier + 1, TIERS.length - 1);
    S.division = 0;
  }
  save();
  showLevelUp();
  return true;
}

function refreshXPBar() {
  const fill = document.getElementById('xp-fill');
  if (fill) fill.style.width = getXPPercent() + '%';
  const lbl = document.getElementById('xp-lbl');
  if (lbl) lbl.textContent = `${S.xp} / ${getXPNeeded()} XP`;
  const badge = document.getElementById('tier-badge-home');
  if (badge) { badge.textContent = getTierLabel(); badge.style.color = getTierColor(); badge.style.borderColor = getTierColor() + '40'; }
}

function animXP() {
  const el = document.getElementById('xp-fill');
  if (el) { el.classList.remove('xp-pop'); void el.offsetWidth; el.classList.add('xp-pop'); }
}

// ─── STREAK ───────────────────────────────────────────────
function markForgedDay() {
  const t = today();
  if (S.lastForgedDate === t) return;
  const prev = new Date(); prev.setDate(prev.getDate() - 1);
  const prevKey = prev.toISOString().split('T')[0];
  S.streak = S.lastForgedDate === prevKey ? S.streak + 1 : 1;
  S.lastForgedDate = t;
  S.forgedDays++;
  checkStreakBonus();
  save();
}

function checkStreakBonus() {
  const milestones = { 7:50, 21:120, 45:200, 90:400 };
  for (const [days, bonus] of Object.entries(milestones)) {
    if (S.streak == parseInt(days) && !S.streakBonusesClaimed.includes(days.toString())) {
      S.streakBonusesClaimed.push(days.toString());
      setTimeout(() => { addXP(bonus); showToast(`${days}-DAY STREAK BONUS  +${bonus} XP`, '🔥'); }, 600);
    }
  }
}

// ─── TASKS ────────────────────────────────────────────────
function isDoneToday(type, idx) {
  return S.tasksCompleted.includes(`${today()}_${type}${idx}`);
}

function completeTask(type, idx, xp) {
  const key = `${today()}_${type}${idx}`;
  if (S.tasksCompleted.includes(key)) return;
  S.tasksCompleted.push(key);
  markForgedDay();
  addXP(xp);
  save();
  renderHome();
}

function getAIDailyTasks() {
  if (S.aiDailyTasks && S.aiDailyTasks.date === today()) return S.aiDailyTasks.tasks;
  return null;
}

// ─── WEEKLY MISSION ───────────────────────────────────────
function ensureWeekMission() {
  const wk = weekKey();
  if (!S.weekMission || S.weekMission.weekKey !== wk) {
    S.weekMission = {
      weekKey: wk,
      missionIdx: S.forgedDays % WEEKLY_MISSIONS.length,
      days: [false,false,false,false,false,false,false],
      rewarded: false
    };
    save();
  }
}

function logMissionDay() {
  ensureWeekMission();
  const dow = dayOfWeek();
  if (S.weekMission.days[dow]) { showToast('Already logged today', '✓'); return; }
  S.weekMission.days[dow] = true;
  save();
  if (S.weekMission.days.every(Boolean) && !S.weekMission.rewarded) {
    S.weekMission.rewarded = true; save();
    addXP(WEEKLY_MISSIONS[S.weekMission.missionIdx].xp);
    showToast('WEEKLY MISSION COMPLETE', '🏆');
  } else {
    showToast('Day logged', '✓');
  }
  renderHome();
}

// ─── SKILL TREES ──────────────────────────────────────────
function canUnlock(node) {
  return !node.req || S.skillProgress[node.req] === 'done';
}

function claimNode(nodeId, xp) {
  const all = Object.values(SKILL_TREES).flatMap(t => t.nodes);
  const node = all.find(n => n.id === nodeId);
  if (!node || !canUnlock(node) || S.skillProgress[nodeId] === 'done') return;
  S.skillProgress[nodeId] = 'done';
  addXP(xp);
  save();
  renderSkills();
  showToast(`Milestone: ${node.name}`, '🛡️');
}

// ─── REFLECTION ───────────────────────────────────────────
function getTodayReflect() { return S.reflections.find(r => r.date === today()); }

function saveReflection(text) {
  if (!text.trim()) return;
  const idx = S.reflections.findIndex(r => r.date === today());
  if (idx >= 0) { S.reflections[idx].text = text; }
  else { S.reflections.push({ date: today(), text }); addXP(10); showToast('Reflection saved  +10 XP', '✍️'); }
  save();
}

// ─── AI CALLS ─────────────────────────────────────────────
let aiCoachCache = null;

async function callAI(system, userMsg, maxTokens = 200) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system,
      messages: [{ role: 'user', content: userMsg }]
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.content?.[0]?.text?.trim() || '';
}

async function getAICoachMessage(forceRefresh = false) {
  if (!forceRefresh && aiCoachCache && aiCoachCache.date === today()) return aiCoachCache.message;
  const fallback = getStaticCoachMessage();
  try {
    const msg = await callAI(
      `You are the Iron North AI Coach — a firm, wise older-brother mentor for young men building discipline and character. You know this user personally based on their profile. Speak directly to them. No filler, no cheerleading. Max 2 sentences. Sound like a real person, not an app.`,
      `User profile:\n${profileContext()}\n\nGive them their daily message. Today: ${today()}.`
    );
    if (!msg) return fallback;
    aiCoachCache = { date: today(), message: msg };
    return msg;
  } catch(e) { return fallback; }
}

function renderTaskList(tasks) {
  return tasks.map((t, i) => {
    const done = isDoneToday('a', i);
    return `
      <div class="task ${done ? 'done' : ''}" onclick="completeTask('a',${i},${t.xp})">
        <div class="task-check"><svg class="task-check-icon" viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg></div>
        <div style="flex:1;min-width:0">
          <div class="task-label">${t.label}</div>
          <div class="task-cat">${t.cat}</div>
        </div>
        <div class="task-xp">+${t.xp}</div>
      </div>`;
  }).join('') + `
    <div style="margin:8px 16px 0;text-align:right">
      <button onclick="refreshAITasks()" style="background:none;border:none;font-family:var(--ff-ui);font-size:11px;color:var(--text-3);cursor:pointer;letter-spacing:0.06em;padding:4px 0">↺ Regenerate tasks</button>
    </div>`;
}

async function generateAIDailyTasks() {
  const area = document.getElementById('ai-tasks-area');
  if (area) area.innerHTML = `
    <div class="coach" style="margin:7px 16px 0">
      <div class="coach-lbl">Building your challenges...</div>
      <div class="coach-loading"><div class="coach-dot"></div><div class="coach-dot"></div><div class="coach-dot"></div></div>
    </div>`;
  try {
    const raw = await callAI(
      `You are Iron North's AI Challenge Engine. You generate highly personalized daily challenges for young men based on their exact profile. Every challenge must be specific to this individual — reference their sport, their struggle, their goal, their age. Never write generic advice. Return ONLY valid JSON, no markdown, no explanation.`,
      `User profile:
${profileContext()}

Generate exactly 4 personalized daily challenges for today (${today()}).
Rules:
- Each challenge must be completable in under 30 minutes
- Reference specific details from their profile (e.g. their sport, their goal, their struggle)
- Vary the categories across their chosen focus areas
- Make difficulty appropriate for their fitness level and tier
- Sound like a coach who knows them, not a generic app

Return ONLY this JSON array:
[{"label":"specific challenge text","cat":"category","xp":20}]
XP range 10-40. Categories from: Physical, Discipline, Communication, Knowledge, Resilience, Spiritual.`,
      700
    );
    const clean = raw.replace(/\`\`\`json|\`\`\`/g, '').trim();
    const tasks = JSON.parse(clean);
    if (!Array.isArray(tasks) || tasks.length === 0) throw new Error('empty');
    S.aiDailyTasks = { date: today(), tasks };
    save();
    const a = document.getElementById('ai-tasks-area');
    if (a) a.innerHTML = renderTaskList(tasks);
    // Update today counter
    const stat = document.querySelector('.stat-val[data-today]');
    if (stat) stat.textContent = `0/${tasks.length}`;
  } catch(e) {
    const a = document.getElementById('ai-tasks-area');
    if (a) a.innerHTML = `
      <div style="margin:8px 16px 0;padding:14px;background:var(--bg-surface);border:1px solid var(--line);border-radius:var(--r-lg)">
        <div style="font-family:var(--ff-ui);font-size:13px;color:var(--text-2);margin-bottom:10px">Couldn't reach AI. Check your Vercel API key setup.</div>
        <button onclick="generateAIDailyTasks()" class="btn-sm">Try again</button>
      </div>`;
  }
}

async function refreshAITasks() {
  S.aiDailyTasks = null;
  save();
  await generateAIDailyTasks();
}

function getStaticCoachMessage() {
  const msgs = [
    `You're ${getXPNeeded() - S.xp} XP from your next rank. Every task today closes that gap.`,
    `${S.streak > 1 ? `${S.streak}-day streak. ` : ''}Discipline is built in moments like this one.`,
    `The person you're becoming is built one decision at a time.`,
    `Consistency beats intensity. Show up again today.`,
    `No one is coming to motivate you. You either do it or you don't.`,
    `The gap between who you are and who you want to be is filled with exactly this.`,
    `Your character is being forged. The heat is uncomfortable for a reason.`,
  ];
  return msgs[new Date().getDate() % msgs.length];
}

// ─── RENDER: HOME ─────────────────────────────────────────
async function renderHome() {
  const el = document.getElementById('page-home');
  if (!el) return;
  ensureWeekMission();

  const aiTasks = getAIDailyTasks();
  const reflect = getTodayReflect();
  const promptIdx = new Date().getDate() % REFLECT_PROMPTS.length;
  const mission = WEEKLY_MISSIONS[S.weekMission.missionIdx];
  const completedCount = (aiTasks || []).filter((_,i) => isDoneToday('a',i)).length;

  el.innerHTML = `
    <div class="ph">
      <div class="ph-left">
        <div class="ph-eyebrow">Daily Forge</div>
        <div class="ph-title">Iron North</div>
      </div>
      <div style="text-align:right">
        <span class="tier-badge" id="tier-badge-home" style="color:${getTierColor()};border-color:${getTierColor()}40">${getTierLabel()}</span>
        <div style="font-family:var(--ff-ui);font-size:11px;color:var(--text-3);margin-top:5px">${S.forgedDays} days forged</div>
      </div>
    </div>

    <div class="card" style="margin-top:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px">
        <span style="font-family:var(--ff-ui);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3)">Experience</span>
        <span id="xp-lbl" style="font-family:var(--ff-ui);font-size:12px;font-weight:700;color:var(--ember)">${S.xp} / ${getXPNeeded()} XP</span>
      </div>
      <div class="xp-track"><div class="xp-fill xp-pop" id="xp-fill" style="width:${getXPPercent()}%"></div></div>
    </div>

    <div class="stats-row">
      <div class="stat"><div class="stat-val" style="color:var(--ember)">${S.streak}</div><div class="stat-lbl">Streak</div></div>
      <div class="stat"><div class="stat-val">${S.forgedDays}</div><div class="stat-lbl">Forged</div></div>
      <div class="stat"><div class="stat-val">${completedCount}/${aiTasks ? aiTasks.length : '—'}</div><div class="stat-lbl">Today</div></div>
    </div>

    <div id="coach-area" class="coach">
      <div class="coach-lbl">AI Coach — ${S.name || 'Warrior'}</div>
      <div class="coach-loading"><div class="coach-dot"></div><div class="coach-dot"></div><div class="coach-dot"></div></div>
    </div>

    <div class="sec-lbl">Today's Forge</div>
    <div id="ai-tasks-area">
      ${aiTasks ? renderTaskList(aiTasks) : `
        <div style="margin:8px 16px 0">
          <div class="coach" style="margin:0 0 0">
            <div class="coach-lbl">Building your challenges...</div>
            <div class="coach-loading"><div class="coach-dot"></div><div class="coach-dot"></div><div class="coach-dot"></div></div>
          </div>
        </div>`}
    </div>

    <div class="sec-lbl">Weekly Mission</div>
    <div class="mission">
      <div class="mission-hd">
        <span class="mission-hd-lbl">Active Mission</span>
        <span class="mission-hd-xp">+${mission.xp} XP</span>
      </div>
      <div class="mission-bd">
        <div class="mission-title">${mission.title}</div>
        <div class="mission-days">
          ${['S','M','T','W','T','F','S'].map((d,i) => {
            const done = S.weekMission.days[i];
            return `<div class="m-day ${done?'done':''}">${done?'<svg viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg>':d}</div>`;
          }).join('')}
          <button class="mission-log-btn" onclick="logMissionDay()" ${S.weekMission.days[dayOfWeek()]?'disabled':''}>
            ${S.weekMission.days[dayOfWeek()]?'Logged ✓':'Log Today'}
          </button>
        </div>
      </div>
    </div>

    <div class="sec-lbl">Daily Reflection</div>
    <div class="card-ember" style="margin-bottom:4px">
      <div class="reflect-prompt">${REFLECT_PROMPTS[promptIdx]}</div>
      <textarea class="reflect-input" id="reflect-input" placeholder="Write honestly..." rows="3">${reflect ? reflect.text : ''}</textarea>
      <button onclick="saveReflectionUI()" class="btn-primary" style="margin-top:10px;font-size:17px;padding:13px">Save Reflection (+10 XP)</button>
    </div>
  `;

  getAICoachMessage().then(msg => {
    const ca = document.getElementById('coach-area');
    if (ca) ca.innerHTML = `<div class="coach-lbl">AI Coach — ${S.name || 'Warrior'}</div><div class="coach-text">${msg}</div>`;
  });

  // Auto-generate AI tasks if none exist for today
  if (!getAIDailyTasks()) {
    generateAIDailyTasks();
  }
}

function saveReflectionUI() {
  saveReflection(document.getElementById('reflect-input')?.value || '');
}

// ─── RENDER: SKILLS ───────────────────────────────────────
let activeSkillTab = Object.keys(SKILL_TREES)[0];

function renderSkills() {
  const el = document.getElementById('page-skills');
  if (!el) return;
  el.innerHTML = `
    <div class="ph" style="padding-top:max(20px,env(safe-area-inset-top))">
      <div><div class="ph-eyebrow">Character</div><div class="ph-title">Skill Trees</div></div>
    </div>
    <div class="skill-tabs">
      ${Object.keys(SKILL_TREES).map(a =>
        `<button class="skill-tab ${a===activeSkillTab?'active':''}" onclick="switchTab('${a}')">${a}</button>`
      ).join('')}
    </div>
    <div class="skill-list" id="skill-list">${renderSkillNodes(activeSkillTab)}</div>
    <div style="margin:14px 16px 0;font-family:var(--ff-ui);font-size:11px;color:var(--text-3);line-height:1.6">
      Complete challenges in real life, then tap to claim XP. Iron North runs on honesty.
    </div>`;
}

function renderSkillNodes(area) {
  return SKILL_TREES[area].nodes.map(node => {
    const done = S.skillProgress[node.id]==='done';
    const available = canUnlock(node) && !done;
    const locked = !canUnlock(node) && !done;
    return `
      <div class="skill-node ${done?'done':available?'available':'locked'}" onclick="${available?`claimNode('${node.id}',${node.xp})`:''}">
        <div class="skill-icon">${done?'✅':locked?'🔒':SKILL_TREES[area].icon}</div>
        <div class="skill-info">
          <div class="skill-name">${node.name}</div>
          <div class="skill-desc">${node.desc}</div>
        </div>
        <div class="skill-badge ${done?'badge-done':available?'badge-available':'badge-locked'}">
          ${done?'DONE':available?`+${node.xp} XP`:'LOCKED'}
        </div>
      </div>`;
  }).join('');
}

function switchTab(area) {
  activeSkillTab = area;
  document.querySelectorAll('.skill-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  const list = document.getElementById('skill-list');
  if (list) list.innerHTML = renderSkillNodes(area);
}

// ─── RENDER: PROGRESS ─────────────────────────────────────
function renderProgress() {
  const el = document.getElementById('page-progress');
  if (!el) return;
  const last28 = Array.from({length:28},(_,i) => {
    const d = new Date(); d.setDate(d.getDate()-(27-i));
    return S.tasksCompleted.some(k => k.startsWith(d.toISOString().split('T')[0]));
  });

  el.innerHTML = `
    <div class="ph" style="padding-top:max(20px,env(safe-area-inset-top))">
      <div><div class="ph-eyebrow">Your Journey</div><div class="ph-title">Progress</div></div>
    </div>
    <div class="card-ember" style="margin-top:14px">
      <div class="tier-hero">
        <div class="tier-emblem" style="border:1px solid ${getTierColor()}30;color:${getTierColor()}">${getTierObj().name[0]}</div>
        <div class="tier-meta">
          <div class="tier-name-big" style="color:${getTierColor()}">${getTierLabel()}</div>
          <div class="tier-xp-label">${S.xp} / ${getXPNeeded()} XP to next rank</div>
          <div class="xp-track" style="margin-top:8px"><div class="xp-fill" style="width:${getXPPercent()}%"></div></div>
        </div>
      </div>
    </div>
    <div class="stats-row">
      <div class="stat"><div class="stat-val" style="color:var(--ember)">${S.streak}</div><div class="stat-lbl">Streak</div></div>
      <div class="stat"><div class="stat-val">${S.forgedDays}</div><div class="stat-lbl">Days</div></div>
      <div class="stat"><div class="stat-val">${Object.values(S.skillProgress).filter(v=>v==='done').length}</div><div class="stat-lbl">Skills</div></div>
    </div>
    <div class="sec-lbl">Last 28 Days</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>`<div style="flex:1;text-align:center;font-family:var(--ff-ui);font-size:9px;font-weight:700;color:var(--text-3)">${d}</div>`).join('')}
      </div>
      <div class="cal-grid">
        ${last28.map((f,i)=>`<div class="cal-day ${f?'forged':''} ${i===27?'today':''}"></div>`).join('')}
      </div>
    </div>
    <div class="sec-lbl">Skill Progress</div>
    <div class="skill-bar-list">
      ${Object.entries(SKILL_TREES).map(([area,tree]) => {
        const done = tree.nodes.filter(n=>S.skillProgress[n.id]==='done').length;
        const pct = Math.round(done/tree.nodes.length*100);
        return `
          <div class="skill-bar-row" onclick="switchSkillTab('${area}')">
            <div class="skill-bar-icon">${tree.icon}</div>
            <div class="skill-bar-info">
              <div class="skill-bar-name">${area}<span class="skill-bar-count">${done}/${tree.nodes.length}</span></div>
              <div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div>
            </div>
          </div>`;
      }).join('')}
    </div>
    <div class="sec-lbl">Streak Milestones</div>
    <div class="card">
      ${[7,21,45,90].map(days => {
        const earned = S.streakBonusesClaimed.includes(days.toString());
        const bonus = {7:50,21:120,45:200,90:400}[days];
        return `
          <div class="milestone-row">
            <div class="milestone-icon" style="background:${earned?'var(--ember-faint)':'var(--bg-raised)'};border:1px solid ${earned?'var(--ember-border)':'var(--line)'};color:${earned?'var(--ember)':'var(--text-3)'}">
              ${days}
            </div>
            <div class="milestone-label" style="color:${earned?'var(--text-1)':'var(--text-3)'}">${days}-Day Streak</div>
            <div class="milestone-status" style="color:${earned?'var(--ember)':'var(--text-3)'}">
              ${earned?`EARNED  +${bonus}`:`+${bonus} XP`}
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function switchSkillTab(area) { activeSkillTab = area; navigate('skills'); }

// ─── RENDER: PROFILE ──────────────────────────────────────
function renderProfile() {
  const el = document.getElementById('page-profile');
  if (!el) return;
  const since = S.joinDate ? new Date(S.joinDate).toLocaleDateString('en-CA',{year:'numeric',month:'long'}) : 'Recently';

  el.innerHTML = `
    <div class="profile-hero">
      <div class="avatar">⚡</div>
      <div class="profile-name">${S.name || 'Warrior'}</div>
      <div class="profile-since">Member since ${since}</div>
      <div style="margin-top:10px">
        <span class="tier-badge" style="color:${getTierColor()};border-color:${getTierColor()}40">${getTierLabel()}</span>
      </div>
      <div class="profile-chips">
        ${S.areas.map(a=>`<span class="chip chip-ember">${a}</span>`).join('')}
      </div>
    </div>
    ${S.fitnessLevel || S.sport || S.topGoal ? `
    <div class="sec-lbl">Your Profile</div>
    <div class="card" style="font-family:var(--ff-ui);font-size:13px;line-height:2">
      ${S.age ? `<div><span style="color:var(--text-3)">Age range  </span>${S.age}</div>` : ''}
      ${S.fitnessLevel ? `<div><span style="color:var(--text-3)">Fitness  </span>${S.fitnessLevel}</div>` : ''}
      ${S.sport ? `<div><span style="color:var(--text-3)">Sport  </span>${S.sport}</div>` : ''}
      ${S.timePerDay ? `<div><span style="color:var(--text-3)">Time/day  </span>${S.timePerDay}</div>` : ''}
      ${S.biggestStruggle ? `<div><span style="color:var(--text-3)">Working on  </span>${S.biggestStruggle}</div>` : ''}
      ${S.topGoal ? `<div><span style="color:var(--text-3)">Goal  </span>${S.topGoal}</div>` : ''}
    </div>` : ''}
    <div class="sec-lbl">Settings</div>
    <div class="menu-list">
      <button class="menu-item" onclick="showEditProfile()">
        Edit Profile
        <svg class="menu-chevron" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg>
      </button>
      <button class="menu-item" onclick="exportData()">
        Export My Data
        <svg class="menu-chevron" viewBox="0 0 16 16"><path d="M8 3v8M4 7l4 4 4-4"/></svg>
      </button>
      <button class="menu-item danger" onclick="confirmReset()">
        Reset All Progress
      </button>
    </div>
    <div style="text-align:center;padding:32px 0 8px;font-family:var(--ff-ui);font-size:10px;color:var(--text-3);letter-spacing:0.12em;text-transform:uppercase">
      Iron North v2.0
    </div>`;
}

function showEditProfile() {
  openSheet(`
    <div class="sheet-title">Edit Profile</div>
    <div class="ob-step-label" style="margin-bottom:6px">Name</div>
    <input type="text" id="edit-name" value="${S.name}" class="ob-name-input" style="font-size:22px;margin-bottom:14px" />
    <div class="ob-step-label" style="margin-bottom:6px">Focus Areas</div>
    <div class="area-grid" id="edit-areas" style="margin-bottom:14px">
      ${Object.keys(SKILL_TREES).map(area => `
        <button class="area-btn ${S.areas.includes(area)?'sel':''}" onclick="this.classList.toggle('sel')">
          <span class="ai">${SKILL_TREES[area].icon}</span><span>${area}</span>
        </button>`).join('')}
    </div>
    <div class="ob-step-label" style="margin-bottom:6px">6-Month Goal</div>
    <input type="text" id="edit-goal" value="${S.topGoal||''}" placeholder="What do you want to achieve?" style="width:100%;padding:12px;background:var(--bg-raised);border:1px solid var(--line-2);border-radius:var(--r-md);color:var(--text-1);font-family:var(--ff-body);font-size:14px;outline:none;margin-bottom:16px;-webkit-appearance:none" />
    <button class="btn-primary" onclick="saveEditProfile()">Save Changes</button>
  `);
}

function saveEditProfile() {
  const name = document.getElementById('edit-name')?.value?.trim();
  const areas = Array.from(document.querySelectorAll('#edit-areas .area-btn.sel')).map(b=>b.querySelector('span:last-child').textContent.trim());
  const goal = document.getElementById('edit-goal')?.value?.trim();
  if (name) S.name = name;
  if (areas.length > 0) S.areas = areas;
  if (goal) S.topGoal = goal;
  // Reset AI cache so next visit regenerates with new profile
  S.aiDailyTasks = null;
  aiCoachCache = null;
  save(); closeSheet(); renderProfile(); showToast('Profile updated', '✓');
}

function exportData() {
  const blob = new Blob([JSON.stringify(S,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=`iron-north-${today()}.json`; a.click();
  URL.revokeObjectURL(url);
}

function confirmReset() {
  openSheet(`
    <div class="sheet-title" style="color:#f87171">Reset Progress?</div>
    <p style="font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:20px">This permanently deletes all XP, streaks, skills, and reflections. No undo.</p>
    <button class="btn-primary" style="background:#f87171;margin-bottom:10px" onclick="resetApp()">Yes, Reset Everything</button>
    <button class="btn-ghost" onclick="closeSheet()">Cancel</button>
  `);
}

function resetApp() { localStorage.removeItem('in_v3'); localStorage.removeItem('in_v2'); location.reload(); }

// ─── SHEET ────────────────────────────────────────────────
function openSheet(html) {
  const bd = document.getElementById('sheet-backdrop');
  const ct = document.getElementById('sheet-content');
  if (!bd || !ct) return;
  ct.innerHTML = html; bd.classList.add('open');
}
function closeSheet() { document.getElementById('sheet-backdrop')?.classList.remove('open'); }

// ─── TOAST / LEVELUP ──────────────────────────────────────
let toastTimer;
function showToast(msg, icon='⚡') {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(toastTimer);
  el.textContent = `${icon}  ${msg}`; el.classList.add('show');
  toastTimer = setTimeout(()=>el.classList.remove('show'), 2600);
}

function showLevelUp() {
  const el = document.getElementById('lvlup');
  if (!el) return;
  el.innerHTML = `<div class="lvlup-tier" style="color:${getTierColor()}">${getTierLabel()}</div><div class="lvlup-label">Tier Achieved</div>`;
  el.classList.add('show');
  setTimeout(()=>el.classList.remove('show'), 2900);
}

// ─── NAVIGATION ───────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(n=>n.classList.remove('active'));
  document.getElementById('page-'+page)?.classList.add('active');
  document.getElementById('nav-'+page)?.classList.add('active');
  if (page==='home')     renderHome();
  if (page==='skills')   renderSkills();
  if (page==='progress') renderProgress();
  if (page==='profile')  renderProfile();
  window.scrollTo(0,0);
}

// ─── ONBOARDING ───────────────────────────────────────────
let obStep = 0;
let ob = {}; // temp onboarding data

const OB_STEPS = [
  'welcome', 'name', 'age', 'areas', 'fitness',
  'sport', 'time', 'struggle', 'goal', 'ready'
];

function renderOnboard() {
  document.getElementById('app').innerHTML = `<div class="onboard" id="ob-wrap">${obContent()}</div>`;
}

function obContent() {
  const step = OB_STEPS[obStep];

  if (step === 'welcome') return `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:max(80px,env(safe-area-inset-top))">
      <div style="font-family:var(--ff-ui);font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--ember);margin-bottom:14px">Welcome to</div>
      <div class="ob-logo">IRON<br>NORTH</div>
      <div class="ob-tagline">Forge yourself. Every day.</div>
      <div style="margin-top:28px;font-size:15px;color:var(--text-2);line-height:1.75">
        This isn't a productivity app.<br>
        This is a system for building the kind of man you want to become — one forged day at a time.<br><br>
        Answer a few questions so the AI can build your personal path.
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="obNext()">BEGIN</button>
    </div>`;

  if (step === 'name') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('1 / 8')}
      <div class="ob-step-title">What do they<br>call you?</div>
      <div class="ob-desc">Your name in the forge.</div>
      <input type="text" class="ob-name-input" id="ob-name" placeholder="Your name" value="${ob.name||''}" oninput="ob.name=this.value" autocomplete="given-name" />
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="ob.name=document.getElementById('ob-name').value.trim();ob.name?obNext():showToast('Enter your name','⚠️')">NEXT</button>
    </div>`;

  if (step === 'age') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('2 / 8')}
      <div class="ob-step-title">How old<br>are you?</div>
      <div class="ob-desc">The AI adjusts your challenges based on your age and stage of life.</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[['13-15','Young warrior — high school early'],['16-18','High school — building foundations'],['19-22','Young adult — forming identity'],['23+','Adult — full accountability']].map(([val,desc])=>`
          <button class="area-btn ${ob.age===val?'sel':''}" onclick="ob.age='${val}';renderOnboard()" style="flex-direction:row;align-items:center;gap:12px;padding:14px">
            <div style="flex:1;text-align:left">
              <div style="font-size:14px;font-weight:700">${val}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:2px">${desc}</div>
            </div>
            ${ob.age===val?'<div style="color:var(--ember);font-size:18px">✓</div>':''}
          </button>`).join('')}
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="ob.age?obNext():showToast('Select your age range','⚠️')">NEXT</button>
    </div>`;

  if (step === 'areas') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('3 / 8')}
      <div class="ob-step-title">What do you<br>want to forge?</div>
      <div class="ob-desc">Pick the areas you genuinely need to grow in — not the ones that sound good.</div>
      <div class="area-grid">
        ${[
          {id:'Physical',icon:'⚡',label:'Physical Strength'},
          {id:'Discipline',icon:'🔥',label:'Discipline'},
          {id:'Communication',icon:'🗣️',label:'Communication'},
          {id:'Knowledge',icon:'📖',label:'Knowledge'},
          {id:'Resilience',icon:'🛡️',label:'Resilience'},
          {id:'Spiritual',icon:'✝️',label:'Spiritual Depth'},
        ].map(a=>`
          <button class="area-btn ${(ob.areas||[]).includes(a.id)?'sel':''}" onclick="obToggleArea('${a.id}')">
            <span class="ai">${a.icon}</span><span>${a.label}</span>
          </button>`).join('')}
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="(ob.areas||[]).length?obNext():showToast('Pick at least one area','⚠️')">NEXT</button>
    </div>`;

  if (step === 'fitness') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('4 / 8')}
      <div class="ob-step-title">What's your<br>fitness level?</div>
      <div class="ob-desc">This shapes the physical challenges you get. Be honest.</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[
          ['Beginner','Little to no current training'],
          ['Intermediate','Training consistently 1-3x/week'],
          ['Advanced','Training hard 4-5x/week'],
          ['Athlete','Competitive sport, high training load'],
        ].map(([val,desc])=>`
          <button class="area-btn ${ob.fitnessLevel===val?'sel':''}" onclick="ob.fitnessLevel='${val}';renderOnboard()" style="flex-direction:row;align-items:center;gap:12px;padding:14px">
            <div style="flex:1;text-align:left">
              <div style="font-size:14px;font-weight:700">${val}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:2px">${desc}</div>
            </div>
            ${ob.fitnessLevel===val?'<div style="color:var(--ember);font-size:18px">✓</div>':''}
          </button>`).join('')}
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="ob.fitnessLevel?obNext():showToast('Select your fitness level','⚠️')">NEXT</button>
    </div>`;

  if (step === 'sport') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('5 / 8')}
      <div class="ob-step-title">What's your<br>sport or activity?</div>
      <div class="ob-desc">The AI uses this to make your physical challenges relevant. If you don't have one, just write "general fitness".</div>
      <input type="text" class="ob-name-input" id="ob-sport" placeholder="e.g. swimming, basketball..." value="${ob.sport||''}" oninput="ob.sport=this.value" style="font-size:20px" />
      <div style="margin-top:14px;font-family:var(--ff-ui);font-size:11px;color:var(--text-3)">Training days per week:</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        ${['1-2','3-4','5-6','7'].map(v=>`
          <button onclick="ob.trainingDays='${v}';renderOnboard()" style="flex:1;padding:12px 0;font-family:var(--ff-ui);font-size:13px;font-weight:700;border-radius:var(--r-md);border:1.5px solid ${ob.trainingDays===v?'var(--ember)':'var(--line-2)'};background:${ob.trainingDays===v?'var(--ember-faint)':'var(--bg-surface)'};color:${ob.trainingDays===v?'var(--ember)':'var(--text-2)'};cursor:pointer;-webkit-appearance:none">${v}</button>`).join('')}
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="ob.sport=document.getElementById('ob-sport').value.trim()||'general fitness';obNext()">NEXT</button>
    </div>`;

  if (step === 'time') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('6 / 8')}
      <div class="ob-step-title">How much time<br>can you commit?</div>
      <div class="ob-desc">Per day for self-improvement work outside your normal training. Be realistic.</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[['10-15 min','Tight schedule — keep it short'],['20-30 min','Standard daily investment'],['30-60 min','Serious commitment'],['60+ min','All in']].map(([val,desc])=>`
          <button class="area-btn ${ob.timePerDay===val?'sel':''}" onclick="ob.timePerDay='${val}';renderOnboard()" style="flex-direction:row;align-items:center;gap:12px;padding:14px">
            <div style="flex:1;text-align:left">
              <div style="font-size:14px;font-weight:700">${val}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:2px">${desc}</div>
            </div>
            ${ob.timePerDay===val?'<div style="color:var(--ember);font-size:18px">✓</div>':''}
          </button>`).join('')}
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="ob.timePerDay?obNext():showToast('Select your time','⚠️')">NEXT</button>
    </div>`;

  if (step === 'struggle') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('7 / 8')}
      <div class="ob-step-title">What's your<br>biggest struggle?</div>
      <div class="ob-desc">The one that actually holds you back. Be honest — the AI uses this to challenge you where it matters most.</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${[
          ['Staying consistent','I start strong but fall off'],
          ['Staying focused','Distractions constantly pull me away'],
          ['Self-confidence','I doubt myself and hold back'],
          ['Finding purpose','I don\'t know what I\'m building toward'],
          ['Controlling emotions','Anger, anxiety, or fear get in the way'],
          ['Spiritual discipline','My faith isn\'t consistent'],
        ].map(([val,desc])=>`
          <button class="area-btn ${ob.biggestStruggle===val?'sel':''}" onclick="ob.biggestStruggle='${val}';renderOnboard()" style="flex-direction:row;align-items:center;gap:12px;padding:12px">
            <div style="flex:1;text-align:left">
              <div style="font-size:13px;font-weight:700">${val}</div>
              <div style="font-size:11px;color:var(--text-3);margin-top:2px">${desc}</div>
            </div>
            ${ob.biggestStruggle===val?'<div style="color:var(--ember);font-size:18px">✓</div>':''}
          </button>`).join('')}
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="ob.biggestStruggle?obNext():showToast('Select your struggle','⚠️')">NEXT</button>
    </div>`;

  if (step === 'goal') return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      ${obLabel('8 / 8')}
      <div class="ob-step-title">What do you want<br>in 6 months?</div>
      <div class="ob-desc">Write one specific thing. Not "be better" — something real. This becomes the north star the AI coaches you toward.</div>
      <textarea id="ob-goal" rows="3" placeholder="e.g. Make the varsity team and have real confidence talking to people..." style="width:100%;padding:14px;background:var(--bg-surface);border:1px solid var(--line-2);border-radius:var(--r-lg);color:var(--text-1);font-family:var(--ff-body);font-size:15px;line-height:1.6;outline:none;resize:none;-webkit-appearance:none;margin-top:4px">${ob.topGoal||''}</textarea>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="ob.topGoal=document.getElementById('ob-goal').value.trim();ob.topGoal?obNext():showToast('Write your goal','⚠️')">NEXT</button>
    </div>`;

  if (step === 'ready') return `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:max(60px,env(safe-area-inset-top))">
      <div style="font-family:var(--ff-ui);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--ember);margin-bottom:14px">You're set</div>
      <div class="ob-logo" style="font-size:48px">THE<br>FORGE<br>AWAITS</div>
      <div style="margin-top:24px;font-size:15px;color:var(--text-2);line-height:1.75">
        Your path has been built.<br>
        The AI knows your profile, your goals, and your struggles.<br><br>
        Every challenge you receive from here is built specifically for <strong style="color:var(--text-1)">${ob.name||'you'}</strong>.
      </div>
    </div>
    <div class="ob-footer">
      ${obDots()}
      <button class="btn-primary" onclick="obFinish()">ENTER THE FORGE</button>
    </div>`;
}

function obLabel(text) {
  return `<div class="ob-step-label">${text}</div>`;
}

function obDots() {
  const total = OB_STEPS.length;
  return `<div class="ob-dots">${OB_STEPS.map((_,i)=>`<div class="ob-dot ${i===obStep?'active':''}"></div>`).join('')}</div>`;
}

function obNext() { obStep++; renderOnboard(); if (OB_STEPS[obStep]==='name') setTimeout(()=>document.getElementById('ob-name')?.focus(),100); }
function obToggleArea(id) {
  if (!ob.areas) ob.areas = [];
  const i = ob.areas.indexOf(id);
  if (i>=0) ob.areas.splice(i,1); else ob.areas.push(id);
  renderOnboard();
}

function obFinish() {
  S.onboarded = true;
  S.name = ob.name || 'Warrior';
  S.age = ob.age || '';
  S.areas = ob.areas?.length ? ob.areas : ['Physical','Discipline'];
  S.fitnessLevel = ob.fitnessLevel || '';
  S.sport = ob.sport || '';
  S.trainingDays = ob.trainingDays || '';
  S.timePerDay = ob.timePerDay || '';
  S.biggestStruggle = ob.biggestStruggle || '';
  S.topGoal = ob.topGoal || '';
  S.joinDate = new Date().toISOString();
  ensureWeekMission();
  save();
  buildApp();
  navigate('home');
}

// ─── APP SHELL ────────────────────────────────────────────
function buildApp() {
  document.getElementById('app').innerHTML = `
    <div id="page-home"     class="page"></div>
    <div id="page-skills"   class="page"></div>
    <div id="page-progress" class="page"></div>
    <div id="page-profile"  class="page"></div>
    <nav class="nav">
      <button class="nav-btn active" id="nav-home"     onclick="navigate('home')">
        <svg viewBox="0 0 24 24"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M9 21V12h6v9" fill="none"/></svg>
        <span>Forge</span>
      </button>
      <button class="nav-btn" id="nav-skills"   onclick="navigate('skills')">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>
        <span>Skills</span>
      </button>
      <button class="nav-btn" id="nav-progress" onclick="navigate('progress')">
        <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        <span>Progress</span>
      </button>
      <button class="nav-btn" id="nav-profile"  onclick="navigate('profile')">
        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Profile</span>
      </button>
    </nav>
    <div class="sheet-backdrop" id="sheet-backdrop" onclick="if(event.target===this)closeSheet()">
      <div class="sheet"><div class="sheet-handle"></div><div id="sheet-content"></div></div>
    </div>
    <div id="lvlup"></div>
    <div id="toast"></div>`;
}

// ─── INIT ─────────────────────────────────────────────────
function init() {
  load();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
  if (!S.onboarded) { document.getElementById('app').innerHTML=''; renderOnboard(); return; }
  ensureWeekMission();
  buildApp();
  navigate('home');
}

document.addEventListener('DOMContentLoaded', init);
