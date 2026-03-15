/* =====================================================
   IRON NORTH — app.js
   Full PWA: onboarding, daily forge, skill trees,
   progress tracking, AI coach, tier system, reflections
   ===================================================== */

// ─── CONSTANTS ────────────────────────────────────────────

const TIERS = [
  { name:'Bronze',   color:'#cd7f32', xpNeeded: 300  },
  { name:'Silver',   color:'#a8a8a8', xpNeeded: 600  },
  { name:'Gold',     color:'#d4a017', xpNeeded: 900  },
  { name:'Platinum', color:'#e0dede', xpNeeded: 1500 },
  { name:'Diamond',  color:'#7dd3fc', xpNeeded: 2400 },
  { name:'Champion', color:'#f87171', xpNeeded: 4000 },
  { name:'Olympian', color:'#facc15', xpNeeded: 99999 },
];
const DIVS = ['I','II','III'];

const SKILL_TREES = {
  Physical: {
    icon: '⚡',
    nodes: [
      { id:'ph1', name:'First 5',       desc:'Complete 5 workouts total',          xp:30,  req:null },
      { id:'ph2', name:'Iron Will',     desc:'Complete 15 workouts total',         xp:50,  req:'ph1' },
      { id:'ph3', name:'Consistency',   desc:'Complete 30 workouts total',         xp:80,  req:'ph2' },
      { id:'ph4', name:'Elite Standard',desc:'Complete 60 workouts total',         xp:150, req:'ph3' },
      { id:'ph5', name:'Forged Body',   desc:'Complete 100 workouts total',        xp:300, req:'ph4' },
    ]
  },
  Discipline: {
    icon: '🔥',
    nodes: [
      { id:'di1', name:'First Strike',   desc:'Complete your first full task day', xp:20,  req:null },
      { id:'di2', name:'Week Forged',    desc:'Reach a 7-day streak',              xp:60,  req:'di1' },
      { id:'di3', name:'Iron Habit',     desc:'Reach a 21-day streak',             xp:120, req:'di2' },
      { id:'di4', name:'Unbreakable',    desc:'Reach a 45-day streak',             xp:200, req:'di3' },
      { id:'di5', name:'Olympian Mind',  desc:'Reach a 90-day streak',             xp:400, req:'di4' },
    ]
  },
  Communication: {
    icon: '🗣️',
    nodes: [
      { id:'co1', name:'Eye Contact',  desc:'Hold eye contact in 3 conversations',    xp:20,  req:null },
      { id:'co2', name:'First Words',  desc:'Start a conversation with a stranger',    xp:30,  req:'co1' },
      { id:'co3', name:'The Floor',    desc:'Lead a group discussion',                 xp:50,  req:'co2' },
      { id:'co4', name:'Presenter',    desc:'Give a short public presentation',        xp:80,  req:'co3' },
      { id:'co5', name:'Influencer',   desc:'Teach someone a skill you have',          xp:120, req:'co4' },
    ]
  },
  Knowledge: {
    icon: '📖',
    nodes: [
      { id:'kn1', name:'Reader',       desc:'Read for 7 consecutive days',             xp:30,  req:null },
      { id:'kn2', name:'Deep Work',    desc:'Complete a 2-hour no-distraction session',xp:40,  req:'kn1' },
      { id:'kn3', name:'Scholar',      desc:'Finish an entire book',                   xp:80,  req:'kn2' },
      { id:'kn4', name:'Builder',      desc:'Apply something you learned to a project',xp:120, req:'kn3' },
      { id:'kn5', name:'Synthesizer',  desc:'Teach back a complex concept to someone', xp:180, req:'kn4' },
    ]
  },
  Resilience: {
    icon: '🛡️',
    nodes: [
      { id:'re1', name:'Cold Start',   desc:'Cold shower 7 days straight',              xp:40,  req:null },
      { id:'re2', name:'Discomfort',   desc:'Do something uncomfortable 5 times',       xp:50,  req:'re1' },
      { id:'re3', name:'Hard Day',     desc:'Finish a full task day when you wanted to quit', xp:70, req:'re2' },
      { id:'re4', name:'Steel Frame',  desc:'Bounce back strong after a broken streak', xp:100, req:'re3' },
      { id:'re5', name:'Unshaken',     desc:'30-day zero complaints challenge',          xp:200, req:'re4' },
    ]
  },
  Spiritual: {
    icon: '✝️',
    nodes: [
      { id:'sp1', name:'Daily Word',   desc:'Read Scripture 7 consecutive days',        xp:30,  req:null },
      { id:'sp2', name:'Still Voice',  desc:'Pray intentionally for 14 days straight',  xp:50,  req:'sp1' },
      { id:'sp3', name:'Gratitude',    desc:'Write 3 gratitudes per day for 10 days',   xp:60,  req:'sp2' },
      { id:'sp4', name:'Service',      desc:'Serve someone without recognition',         xp:80,  req:'sp3' },
      { id:'sp5', name:'Grounded',     desc:'Memorize 5 passages of Scripture',          xp:120, req:'sp4' },
    ]
  },
};

const CHALLENGES = [
  // Physical
  { label:'Complete your full workout — no cutting it short', cat:'Physical', xp:30 },
  { label:'Drink 3 litres of water before 8pm', cat:'Physical', xp:10 },
  { label:'Do 50 push-ups across the day — any time, any reps', cat:'Physical', xp:15 },
  { label:'Stretch for 10 minutes before bed', cat:'Physical', xp:10 },
  { label:'Take the stairs every single time today', cat:'Physical', xp:10 },
  // Discipline
  { label:'No phone for the first 30 minutes after waking', cat:'Discipline', xp:20 },
  { label:'No social media after 8pm tonight', cat:'Discipline', xp:20 },
  { label:'In bed with lights out by 10:30pm', cat:'Discipline', xp:15 },
  { label:'Make your bed within 5 minutes of waking', cat:'Discipline', xp:10 },
  { label:'One hour of pure focus — app blockers on, zero interruptions', cat:'Discipline', xp:25 },
  { label:'Write your 3 priorities for tomorrow before midnight', cat:'Discipline', xp:15 },
  // Communication
  { label:'Start a real conversation with someone you don\'t normally talk to', cat:'Communication', xp:20 },
  { label:'Make deliberate eye contact in every conversation today', cat:'Communication', xp:15 },
  { label:'Give someone a genuine, specific compliment', cat:'Communication', xp:15 },
  { label:'Ask one person a deep question and actually listen to the answer', cat:'Communication', xp:20 },
  // Knowledge
  { label:'Read for 20 uninterrupted minutes', cat:'Knowledge', xp:15 },
  { label:'Learn one thing you didn\'t know this morning — write it down', cat:'Knowledge', xp:15 },
  { label:'Watch zero entertainment. Use that time to read or build.', cat:'Discipline', xp:20 },
  { label:'Spend 30 minutes on your most important skill', cat:'Knowledge', xp:25 },
  // Resilience
  { label:'Cold shower — no hesitation, no easing in', cat:'Resilience', xp:25 },
  { label:'Do one thing today you\'ve been putting off for over a week', cat:'Resilience', xp:30 },
  { label:'Zero complaints today. Catch yourself and stop.', cat:'Resilience', xp:20 },
  // Spiritual
  { label:'Read Scripture for at least 10 minutes', cat:'Spiritual', xp:15 },
  { label:'Write down 3 things you\'re genuinely grateful for', cat:'Spiritual', xp:10 },
  { label:'Do something for someone without telling anyone about it', cat:'Spiritual', xp:20 },
  { label:'Pray intentionally — not just words, actually focus', cat:'Spiritual', xp:15 },
];

const WEEKLY_MISSIONS = [
  { title:'Complete 3 full workouts this week',          xp:150 },
  { title:'Read every single day this week',             xp:120 },
  { title:'Wake up before 7am for 5 consecutive days',   xp:130 },
  { title:'Have 3 meaningful conversations with new people', xp:140 },
  { title:'Go one full week with zero complaints',        xp:160 },
  { title:'Complete every daily task set this week',      xp:200 },
  { title:'No social media for 5 straight days',          xp:150 },
  { title:'Journal or reflect every single day this week',xp:110 },
];

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
  name: '',
  areas: [],
  xp: 0,
  tier: 0,         // index into TIERS
  division: 0,     // 0=I, 1=II, 2=III
  streak: 0,
  forgedDays: 0,
  lastForgedDate: null,
  tasksCompleted: [],    // array of "YYYY-MM-DD_idx"
  aiTasksToday: null,    // { date, tasks[] }
  skillProgress: {},     // nodeId -> 'done'
  weekMission: null,     // { weekKey, missionIdx, days: bool[7], rewarded }
  reflections: [],       // { date, text }
  streakBonusesClaimed: [],
  joinDate: null,
};

let S = {};

function save() { try { localStorage.setItem('in_v2', JSON.stringify(S)); } catch(e) {} }
function load() {
  try {
    const raw = localStorage.getItem('in_v2');
    S = raw ? { ...DEFAULT, ...JSON.parse(raw) } : { ...DEFAULT };
  } catch(e) { S = { ...DEFAULT }; }
}

// ─── HELPERS ──────────────────────────────────────────────

function today() { return new Date().toISOString().split('T')[0]; }

function weekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function dayOfWeek() { return new Date().getDay(); } // 0=Sun

function getTierObj() { return TIERS[S.tier]; }
function getTierColor() { return getTierObj().color; }
function getTierLabel() {
  const t = getTierObj();
  if (S.tier >= 5) return t.name; // Champion, Olympian no divisions
  return `${t.name} ${DIVS[S.division]}`;
}
function getXPNeeded() { return getTierObj().xpNeeded; }
function getXPPercent() { return Math.min(100, Math.round(S.xp / getXPNeeded() * 100)); }

function seededShuffle(arr, seed) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.abs(Math.imul(seed + i, 2654435761) >>> 0) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── DAILY TASKS ──────────────────────────────────────────

function getDailyTasks() {
  const t = today();
  const seed = t.split('-').reduce((a, n) => a + parseInt(n) * 17, 0);
  return seededShuffle(CHALLENGES, seed).slice(0, 4);
}

function getAITasks() {
  if (S.aiTasksToday && S.aiTasksToday.date === today()) return S.aiTasksToday.tasks;
  return null;
}

function isDoneToday(type, idx) {
  return S.tasksCompleted.includes(`${today()}_${type}${idx}`);
}

function completeTask(type, idx, xp) {
  const key = `${today()}_${type}${idx}`;
  if (S.tasksCompleted.includes(key)) return;
  S.tasksCompleted.push(key);
  markForgedDay();
  addXP(xp);
  checkSkillAutoUnlock();
  save();
  renderHome();
}

function markForgedDay() {
  const t = today();
  if (S.lastForgedDate === t) return;
  const prev = new Date();
  prev.setDate(prev.getDate() - 1);
  const prevKey = prev.toISOString().split('T')[0];
  S.streak = S.lastForgedDate === prevKey ? S.streak + 1 : 1;
  S.lastForgedDate = t;
  S.forgedDays++;
  checkStreakBonus();
  save();
}

// ─── STREAK BONUS ─────────────────────────────────────────

function checkStreakBonus() {
  const milestones = { 7:50, 21:120, 45:200, 90:400 };
  for (const [days, bonus] of Object.entries(milestones)) {
    if (S.streak == parseInt(days) && !S.streakBonusesClaimed.includes(days.toString())) {
      S.streakBonusesClaimed.push(days.toString());
      setTimeout(() => {
        addXP(bonus);
        showToast(`${days}-DAY STREAK BONUS  +${bonus} XP`, '🔥');
      }, 600);
    }
  }
}

// ─── XP & TIER ────────────────────────────────────────────

function addXP(amount) {
  S.xp += amount;
  const overflow = checkTierUp();
  save();
  if (!overflow) showToast(`+${amount} XP`, '⚡');
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
  const tBadge = document.getElementById('tier-badge-home');
  if (tBadge) { tBadge.textContent = getTierLabel(); tBadge.style.color = getTierColor(); tBadge.style.borderColor = getTierColor() + '40'; }
}

function animXP() {
  const el = document.getElementById('xp-fill');
  if (el) { el.classList.remove('xp-pop'); void el.offsetWidth; el.classList.add('xp-pop'); }
}

// ─── WEEKLY MISSION ───────────────────────────────────────

function ensureWeekMission() {
  const wk = weekKey();
  if (!S.weekMission || S.weekMission.weekKey !== wk) {
    const idx = Object.values(S.skillProgress).length % WEEKLY_MISSIONS.length;
    S.weekMission = { weekKey: wk, missionIdx: idx, days: [false,false,false,false,false,false,false], rewarded: false };
    save();
  }
}

function logMissionDay() {
  ensureWeekMission();
  const dow = dayOfWeek();
  if (S.weekMission.days[dow]) { showToast('Already logged today', '✓'); return; }
  S.weekMission.days[dow] = true;
  save();
  const allDone = S.weekMission.days.every(Boolean);
  if (allDone && !S.weekMission.rewarded) {
    S.weekMission.rewarded = true;
    save();
    addXP(WEEKLY_MISSIONS[S.weekMission.missionIdx].xp);
    showToast('WEEKLY MISSION COMPLETE', '🏆');
  } else {
    showToast('Day logged', '✓');
  }
  renderHome();
}

// ─── SKILL TREES ──────────────────────────────────────────

function canUnlock(node) {
  if (!node.req) return true;
  return S.skillProgress[node.req] === 'done';
}

function claimNode(nodeId, xp) {
  const all = Object.values(SKILL_TREES).flatMap(t => t.nodes);
  const node = all.find(n => n.id === nodeId);
  if (!node || !canUnlock(node) || S.skillProgress[nodeId] === 'done') return;
  S.skillProgress[nodeId] = 'done';
  addXP(xp);
  save();
  renderSkills();
  showToast(`Milestone unlocked: ${node.name}`, '🛡️');
}

function checkSkillAutoUnlock() {
  // Auto-detect streak-based discipline nodes
  const di = S.streak;
  if (di >= 7  && canUnlock(SKILL_TREES.Discipline.nodes[1])) { /* available */ }
  if (di >= 21 && canUnlock(SKILL_TREES.Discipline.nodes[2])) { /* available */ }
  if (di >= 45 && canUnlock(SKILL_TREES.Discipline.nodes[3])) { /* available */ }
  if (di >= 90 && canUnlock(SKILL_TREES.Discipline.nodes[4])) { /* available */ }
}

// ─── REFLECTION ───────────────────────────────────────────

function getTodayReflect() {
  return S.reflections.find(r => r.date === today());
}

function saveReflection(text) {
  if (!text.trim()) return;
  const existing = S.reflections.findIndex(r => r.date === today());
  if (existing >= 0) {
    S.reflections[existing].text = text;
  } else {
    S.reflections.push({ date: today(), text });
    addXP(10);
    showToast('Reflection saved  +10 XP', '✍️');
  }
  save();
}

// ─── AI COACH ─────────────────────────────────────────────

let aiCoachCache = null; // { date, message }

async function getAICoachMessage(forceRefresh = false) {
  if (!forceRefresh && aiCoachCache && aiCoachCache.date === today()) {
    return aiCoachCache.message;
  }

  const fallback = getStaticCoachMessage();

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 120,
        system: `You are the Iron North AI Coach — a firm, wise, older-brother-style mentor for young men building discipline. Speak directly. No filler words. No cheerleading. Short, punchy, truthful. 1-3 sentences maximum.`,
        messages: [{
          role: 'user',
          content: `Daily message for a user: tier ${getTierLabel()}, ${S.streak}-day streak, ${S.forgedDays} forged days, areas: ${S.areas.join(', ')}. Today's date: ${today()}. Give them a direct, no-fluff message for today.`
        }]
      })
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const msg = data.content?.[0]?.text?.trim() || fallback;
    aiCoachCache = { date: today(), message: msg };
    return msg;
  } catch (e) {
    return fallback;
  }
}

async function generateAITasks() {
  const el = document.getElementById('ai-tasks-area');
  if (el) el.innerHTML = `<div class="coach" style="margin:7px 0 0"><div class="coach-lbl">AI Coach</div><div class="coach-loading"><div class="coach-dot"></div><div class="coach-dot"></div><div class="coach-dot"></div></div></div>`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `You generate personalized daily challenges for the Iron North self-improvement app. Be direct, specific, no filler. Challenges must be completable in under 30 minutes. Return ONLY valid JSON, no markdown, no explanation.`,
        messages: [{
          role: 'user',
          content: `Generate 3 challenges for: tier=${getTierLabel()}, streak=${S.streak} days, areas=${S.areas.join(',')}, forged days=${S.forgedDays}.
Return ONLY this JSON array:
[{"label":"challenge text","cat":"area name","xp":20}]
XP range 10-40. Categories must be from: Physical, Discipline, Communication, Knowledge, Resilience, Spiritual.`
        }]
      })
    });
    if (!res.ok) throw new Error();
    const data = await res.json();
    const text = data.content?.[0]?.text || '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    const tasks = JSON.parse(clean);
    if (!Array.isArray(tasks) || tasks.length === 0) throw new Error();
    S.aiTasksToday = { date: today(), tasks };
    save();
    renderHome();
  } catch(e) {
    if (el) el.innerHTML = `<div style="font-family:var(--ff-ui);font-size:12px;color:var(--text-3);padding:8px 0">Couldn't reach AI — add your API key to app.js to enable.</div>`;
  }
}

function getStaticCoachMessage() {
  const msgs = [
    `You're ${getXPNeeded() - S.xp} XP from the next division. Every task today closes that gap.`,
    `${S.streak > 1 ? `${S.streak}-day streak. ` : ''}Discipline is built in moments like this one — when you don't want to.`,
    `The person you're becoming is built one decision at a time. Make the right one right now.`,
    `Consistency beats intensity. Show up again today.`,
    `Your character is being forged. The heat is uncomfortable for a reason.`,
    `No one is coming to motivate you. You either do it or you don't.`,
    `The gap between who you are and who you want to be is filled with exactly this — daily work.`,
  ];
  return msgs[new Date().getDate() % msgs.length];
}

// ─── RENDER: HOME ─────────────────────────────────────────

async function renderHome() {
  const el = document.getElementById('page-home');
  if (!el) return;
  ensureWeekMission();

  const tasks = getDailyTasks();
  const aiTasks = getAITasks();
  const reflect = getTodayReflect();
  const promptIdx = new Date().getDate() % REFLECT_PROMPTS.length;
  const mission = WEEKLY_MISSIONS[S.weekMission.missionIdx];
  const completedCount = tasks.filter((_, i) => isDoneToday('t', i)).length;

  el.innerHTML = `
    <!-- HEADER -->
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

    <!-- XP BAR -->
    <div class="card" style="margin-top:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px">
        <span style="font-family:var(--ff-ui);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3)">Experience</span>
        <span id="xp-lbl" style="font-family:var(--ff-ui);font-size:12px;font-weight:700;color:var(--ember)">${S.xp} / ${getXPNeeded()} XP</span>
      </div>
      <div class="xp-track"><div class="xp-fill xp-pop" id="xp-fill" style="width:${getXPPercent()}%"></div></div>
    </div>

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat">
        <div class="stat-val" style="color:var(--ember)">${S.streak}</div>
        <div class="stat-lbl">Streak</div>
      </div>
      <div class="stat">
        <div class="stat-val">${S.forgedDays}</div>
        <div class="stat-lbl">Forged</div>
      </div>
      <div class="stat">
        <div class="stat-val">${completedCount}/${tasks.length}</div>
        <div class="stat-lbl">Today</div>
      </div>
    </div>

    <!-- AI COACH -->
    <div id="coach-area" class="coach">
      <div class="coach-lbl">AI Coach</div>
      <div class="coach-loading"><div class="coach-dot"></div><div class="coach-dot"></div><div class="coach-dot"></div></div>
    </div>

    <!-- TODAY'S TASKS -->
    <div class="sec-lbl">Today's Forge</div>
    ${tasks.map((t, i) => {
      const done = isDoneToday('t', i);
      return `
        <div class="task ${done ? 'done' : ''}" onclick="completeTask('t',${i},${t.xp})">
          <div class="task-check">
            <svg class="task-check-icon" viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg>
          </div>
          <div style="flex:1;min-width:0">
            <div class="task-label">${t.label}</div>
            <div class="task-cat">${t.cat}</div>
          </div>
          <div class="task-xp">+${t.xp}</div>
        </div>
      `;
    }).join('')}

    <!-- AI TASKS -->
    <div id="ai-tasks-area">
      ${aiTasks ? aiTasks.map((t, i) => {
        const done = isDoneToday('a', i);
        return `
          <div class="task ai-task ${done ? 'done' : ''}" onclick="completeTask('a',${i},${t.xp})">
            <div class="task-check">
              <svg class="task-check-icon" viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg>
            </div>
            <div style="flex:1;min-width:0">
              <div class="task-label">${t.label}</div>
              <div class="task-cat">${t.cat}</div>
            </div>
            <div class="task-xp">+${t.xp}</div>
          </div>
        `;
      }).join('') : `
        <div style="margin:8px 16px 0">
          <button onclick="generateAITasks()" class="btn-sm" style="width:100%;padding:11px;font-size:12px;color:var(--ember);border-color:var(--ember-border);background:var(--ember-faint)">
            ✦ Generate AI Challenges
          </button>
        </div>
      `}
    </div>

    <!-- WEEKLY MISSION -->
    <div class="sec-lbl">Weekly Mission</div>
    <div class="mission">
      <div class="mission-hd">
        <span class="mission-hd-lbl">Active Mission</span>
        <span class="mission-hd-xp">+${mission.xp} XP</span>
      </div>
      <div class="mission-bd">
        <div class="mission-title">${mission.title}</div>
        <div class="mission-days">
          ${['S','M','T','W','T','F','S'].map((d, i) => {
            const done = S.weekMission.days[i];
            return `<div class="m-day ${done ? 'done' : ''}">${done ? '<svg viewBox="0 0 12 12"><polyline points="1.5,6 4.5,9 10.5,3"/></svg>' : d}</div>`;
          }).join('')}
          <button class="mission-log-btn" onclick="logMissionDay()" ${S.weekMission.days[dayOfWeek()] ? 'disabled' : ''}>
            ${S.weekMission.days[dayOfWeek()] ? 'Logged ✓' : 'Log Today'}
          </button>
        </div>
      </div>
    </div>

    <!-- REFLECTION -->
    <div class="sec-lbl">Daily Reflection</div>
    <div class="card-ember" style="margin-bottom:4px">
      <div class="reflect-prompt">${REFLECT_PROMPTS[promptIdx]}</div>
      <textarea class="reflect-input" id="reflect-input" placeholder="Write honestly..." rows="3">${reflect ? reflect.text : ''}</textarea>
      <button onclick="saveReflectionUI()" class="btn-primary" style="margin-top:10px;font-size:17px;padding:13px">Save Reflection (+10 XP)</button>
    </div>
  `;

  // Load AI coach async without blocking render
  getAICoachMessage().then(msg => {
    const el = document.getElementById('coach-area');
    if (el) el.innerHTML = `<div class="coach-lbl">AI Coach</div><div class="coach-text">${msg}</div>`;
  });
}

function saveReflectionUI() {
  const text = document.getElementById('reflect-input')?.value || '';
  saveReflection(text);
}

// ─── RENDER: SKILLS ───────────────────────────────────────

let activeSkillTab = Object.keys(SKILL_TREES)[0];

function renderSkills() {
  const el = document.getElementById('page-skills');
  if (!el) return;

  el.innerHTML = `
    <div class="ph" style="padding-top:max(20px,env(safe-area-inset-top))">
      <div>
        <div class="ph-eyebrow">Character</div>
        <div class="ph-title">Skill Trees</div>
      </div>
    </div>
    <div class="skill-tabs" id="skill-tabs">
      ${Object.keys(SKILL_TREES).map(area => `
        <button class="skill-tab ${area === activeSkillTab ? 'active' : ''}" onclick="switchTab('${area}')">${area}</button>
      `).join('')}
    </div>
    <div class="skill-list" id="skill-list">
      ${renderSkillNodes(activeSkillTab)}
    </div>
    <div style="margin:14px 16px 0;font-family:var(--ff-ui);font-size:11px;color:var(--text-3);line-height:1.6">
      Tap available milestones to claim XP. Complete the challenge in real life first — Iron North runs on honesty.
    </div>
  `;
}

function renderSkillNodes(area) {
  return SKILL_TREES[area].nodes.map(node => {
    const done = S.skillProgress[node.id] === 'done';
    const available = canUnlock(node) && !done;
    const locked = !canUnlock(node) && !done;
    return `
      <div class="skill-node ${done ? 'done' : available ? 'available' : 'locked'}"
           onclick="${available ? `claimNode('${node.id}',${node.xp})` : ''}">
        <div class="skill-icon">${done ? '✅' : locked ? '🔒' : SKILL_TREES[area].icon}</div>
        <div class="skill-info">
          <div class="skill-name">${node.name}</div>
          <div class="skill-desc">${node.desc}</div>
        </div>
        <div class="skill-badge ${done ? 'badge-done' : available ? 'badge-available' : 'badge-locked'}">
          ${done ? 'DONE' : available ? `+${node.xp} XP` : 'LOCKED'}
        </div>
      </div>
    `;
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

  const last28 = getLast28Days();
  const totalSkills = Object.values(SKILL_TREES).reduce((a, t) => a + t.nodes.length, 0);
  const doneSkills = Object.values(S.skillProgress).filter(v => v === 'done').length;

  el.innerHTML = `
    <div class="ph" style="padding-top:max(20px,env(safe-area-inset-top))">
      <div>
        <div class="ph-eyebrow">Your Journey</div>
        <div class="ph-title">Progress</div>
      </div>
    </div>

    <!-- TIER CARD -->
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

    <!-- STATS -->
    <div class="stats-row">
      <div class="stat">
        <div class="stat-val" style="color:var(--ember)">${S.streak}</div>
        <div class="stat-lbl">Streak</div>
      </div>
      <div class="stat">
        <div class="stat-val">${S.forgedDays}</div>
        <div class="stat-lbl">Days</div>
      </div>
      <div class="stat">
        <div class="stat-val">${doneSkills}</div>
        <div class="stat-lbl">Skills</div>
      </div>
    </div>

    <!-- CALENDAR -->
    <div class="sec-lbl">Last 28 Days</div>
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d =>
          `<div style="flex:1;text-align:center;font-family:var(--ff-ui);font-size:9px;font-weight:700;letter-spacing:0.06em;color:var(--text-3)">${d}</div>`
        ).join('')}
      </div>
      <div class="cal-grid">
        ${last28.map((f, i) => `<div class="cal-day ${f ? 'forged' : ''} ${i===27 ? 'today' : ''}"></div>`).join('')}
      </div>
      <div style="display:flex;gap:14px;margin-top:10px">
        <span style="display:flex;align-items:center;gap:5px;font-family:var(--ff-ui);font-size:11px;color:var(--text-3)">
          <span style="width:10px;height:10px;border-radius:2px;background:var(--ember);display:inline-block"></span>Forged
        </span>
        <span style="display:flex;align-items:center;gap:5px;font-family:var(--ff-ui);font-size:11px;color:var(--text-3)">
          <span style="width:10px;height:10px;border-radius:2px;background:var(--bg-raised);border:1px solid var(--line-2);display:inline-block"></span>Missed
        </span>
      </div>
    </div>

    <!-- SKILL BARS -->
    <div class="sec-lbl">Skill Progress</div>
    <div class="skill-bar-list">
      ${Object.entries(SKILL_TREES).map(([area, tree]) => {
        const done = tree.nodes.filter(n => S.skillProgress[n.id] === 'done').length;
        const pct = Math.round(done / tree.nodes.length * 100);
        return `
          <div class="skill-bar-row" onclick="switchSkillTab('${area}')">
            <div class="skill-bar-icon">${tree.icon}</div>
            <div class="skill-bar-info">
              <div class="skill-bar-name">${area}<span class="skill-bar-count">${done}/${tree.nodes.length}</span></div>
              <div class="xp-track"><div class="xp-fill" style="width:${pct}%"></div></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- STREAK MILESTONES -->
    <div class="sec-lbl">Streak Milestones</div>
    <div class="card">
      ${[7,21,45,90].map(days => {
        const earned = S.streakBonusesClaimed.includes(days.toString()) || S.streak >= days;
        const bonus = {7:50,21:120,45:200,90:400}[days];
        return `
          <div class="milestone-row">
            <div class="milestone-icon" style="background:${earned ? 'var(--ember-faint)' : 'var(--bg-raised)'};border:1px solid ${earned ? 'var(--ember-border)' : 'var(--line)'};color:${earned ? 'var(--ember)' : 'var(--text-3)'}">
              ${days}
            </div>
            <div class="milestone-label" style="color:${earned ? 'var(--text-1)' : 'var(--text-3)'}">${days}-Day Streak</div>
            <div class="milestone-status" style="color:${earned ? 'var(--ember)' : 'var(--text-3)'}">
              ${earned ? `EARNED  +${bonus}` : `+${bonus} XP`}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function getLast28Days() {
  return Array.from({ length: 28 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (27 - i));
    const key = d.toISOString().split('T')[0];
    return S.tasksCompleted.some(k => k.startsWith(key));
  });
}

function switchSkillTab(area) {
  activeSkillTab = area;
  navigate('skills');
}

// ─── RENDER: PROFILE ──────────────────────────────────────

function renderProfile() {
  const el = document.getElementById('page-profile');
  if (!el) return;
  const since = S.joinDate
    ? new Date(S.joinDate).toLocaleDateString('en-CA', { year:'numeric', month:'long' })
    : 'Recently';

  el.innerHTML = `
    <div class="profile-hero">
      <div class="avatar">⚡</div>
      <div class="profile-name">${S.name || 'Warrior'}</div>
      <div class="profile-since">Member since ${since}</div>
      <div style="margin-top:10px">
        <span class="tier-badge" style="color:${getTierColor()};border-color:${getTierColor()}40">${getTierLabel()}</span>
      </div>
      <div class="profile-chips">
        ${S.areas.map(a => `<span class="chip chip-ember">${a}</span>`).join('')}
      </div>
    </div>

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
      <button class="menu-item" onclick="showAPIKey()">
        AI Coach API Key
        <svg class="menu-chevron" viewBox="0 0 16 16"><path d="M6 3l5 5-5 5"/></svg>
      </button>
      <button class="menu-item danger" onclick="confirmReset()">
        Reset All Progress
      </button>
    </div>

    <div style="text-align:center;padding:32px 0 8px;font-family:var(--ff-ui);font-size:10px;color:var(--text-3);letter-spacing:0.12em;text-transform:uppercase">
      Iron North v1.0 &nbsp;·&nbsp; Built for those who forge
    </div>
  `;
}

function showEditProfile() {
  openSheet(`
    <div class="sheet-title">Edit Profile</div>
    <div style="margin-bottom:10px;font-family:var(--ff-ui);font-size:12px;color:var(--text-3);letter-spacing:0.08em;text-transform:uppercase">Name</div>
    <input type="text" id="edit-name" value="${S.name}" class="ob-name-input" style="font-size:24px;margin-bottom:16px" />
    <div style="margin-bottom:10px;font-family:var(--ff-ui);font-size:12px;color:var(--text-3);letter-spacing:0.08em;text-transform:uppercase">Focus Areas</div>
    <div class="area-grid" id="edit-areas">
      ${Object.keys(SKILL_TREES).map(area => `
        <button class="area-btn ${S.areas.includes(area) ? 'sel' : ''}" onclick="toggleEditArea(this,'${area}')">
          <span class="ai">${SKILL_TREES[area].icon}</span>
          <span>${area}</span>
        </button>
      `).join('')}
    </div>
    <div style="margin-top:18px">
      <button class="btn-primary" onclick="saveEditProfile()">Save Changes</button>
    </div>
  `);
}

function toggleEditArea(btn, area) {
  btn.classList.toggle('sel');
}

function saveEditProfile() {
  const name = document.getElementById('edit-name')?.value?.trim() || S.name;
  const areas = Array.from(document.querySelectorAll('#edit-areas .area-btn.sel'))
    .map(b => b.querySelector('span:last-child').textContent.trim());
  S.name = name || S.name;
  if (areas.length > 0) S.areas = areas;
  save();
  closeSheet();
  renderProfile();
  showToast('Profile updated', '✓');
}

function showAPIKey() {
  openSheet(`
    <div class="sheet-title">AI Coach Setup</div>
    <p style="font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:16px">
      The AI Coach uses Claude. To activate it, add your Anthropic API key below. Your key is stored locally on your device only.
    </p>
    <div style="margin-bottom:10px;font-family:var(--ff-ui);font-size:12px;color:var(--text-3);letter-spacing:0.08em;text-transform:uppercase">API Key</div>
    <input type="password" id="api-key-input" value="${localStorage.getItem('in_apikey') || ''}"
      placeholder="sk-ant-..."
      style="width:100%;padding:14px;background:var(--bg-raised);border:1px solid var(--line-2);border-radius:var(--r-md);color:var(--text-1);font-family:var(--ff-ui);font-size:14px;outline:none;margin-bottom:16px;-webkit-appearance:none"
    />
    <p style="font-size:12px;color:var(--text-3);line-height:1.6;margin-bottom:16px">Get your key at anthropic.com/claude. Without a key, the coach uses built-in messages.</p>
    <button class="btn-primary" onclick="saveAPIKey()">Save Key</button>
  `);
}

function saveAPIKey() {
  const key = document.getElementById('api-key-input')?.value?.trim();
  if (key) { localStorage.setItem('in_apikey', key); showToast('API key saved', '✓'); }
  closeSheet();
}

function exportData() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `iron-north-${today()}.json`; a.click();
  URL.revokeObjectURL(url);
}

function confirmReset() {
  openSheet(`
    <div class="sheet-title" style="color:#f87171">Reset Progress?</div>
    <p style="font-size:14px;color:var(--text-2);line-height:1.65;margin-bottom:20px">
      This will permanently delete all your XP, streaks, skill progress, and reflections. There is no undo.
    </p>
    <button class="btn-primary" style="background:#f87171;margin-bottom:10px" onclick="resetApp()">Yes, Reset Everything</button>
    <button class="btn-ghost" onclick="closeSheet()">Cancel</button>
  `);
}

function resetApp() {
  localStorage.removeItem('in_v2');
  localStorage.removeItem('in_apikey');
  location.reload();
}

// ─── SHEET (BOTTOM MODAL) ─────────────────────────────────

function openSheet(html) {
  const backdrop = document.getElementById('sheet-backdrop');
  const content = document.getElementById('sheet-content');
  if (!backdrop || !content) return;
  content.innerHTML = html;
  backdrop.classList.add('open');
}

function closeSheet() {
  document.getElementById('sheet-backdrop')?.classList.remove('open');
}

// ─── TOAST ────────────────────────────────────────────────

let toastTimer;
function showToast(msg, icon = '⚡') {
  const el = document.getElementById('toast');
  if (!el) return;
  clearTimeout(toastTimer);
  el.textContent = `${icon}  ${msg}`;
  el.classList.add('show');
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

// ─── LEVEL UP OVERLAY ─────────────────────────────────────

function showLevelUp() {
  const el = document.getElementById('lvlup');
  if (!el) return;
  el.innerHTML = `
    <div class="lvlup-tier" style="color:${getTierColor()}">${getTierLabel()}</div>
    <div class="lvlup-label">Tier Achieved</div>
  `;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2900);
}

// ─── NAVIGATION ───────────────────────────────────────────

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(n => n.classList.remove('active'));
  const pageEl = document.getElementById('page-' + page);
  const navEl = document.getElementById('nav-' + page);
  if (pageEl) pageEl.classList.add('active');
  if (navEl) navEl.classList.add('active');
  if (page === 'home')     renderHome();
  if (page === 'skills')   renderSkills();
  if (page === 'progress') renderProgress();
  if (page === 'profile')  renderProfile();
  window.scrollTo(0, 0);
}

// ─── ONBOARDING ───────────────────────────────────────────

let obStep = 0;
let obAreas = [];
let obName = '';

function renderOnboard() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `<div class="onboard">${obContent()}</div>`;
}

function obContent() {
  if (obStep === 0) return `
    <div style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:max(80px,env(safe-area-inset-top))">
      <div style="font-family:var(--ff-ui);font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--ember);margin-bottom:14px">Welcome to</div>
      <div class="ob-logo">IRON<br>NORTH</div>
      <div class="ob-tagline">Forge yourself. Every day.</div>
      <div style="margin-top:28px" class="ob-body">
        This isn't a productivity app.<br>
        This is a system for building the kind of man you want to become — one forged day at a time.
      </div>
    </div>
    <div class="ob-footer">
      <div class="ob-dots"><div class="ob-dot active"></div><div class="ob-dot"></div><div class="ob-dot"></div></div>
      <button class="btn-primary" onclick="obNext()">BEGIN</button>
    </div>
  `;

  if (obStep === 1) return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      <div class="ob-step-label">Step 1 of 2</div>
      <div class="ob-step-title">What do you<br>want to forge?</div>
      <div class="ob-desc">Pick the areas where you need to grow. Be honest — pick what you actually need, not what sounds impressive.</div>
      <div class="area-grid">
        ${[
          { id:'Physical',      icon:'⚡', label:'Physical Strength' },
          { id:'Discipline',    icon:'🔥', label:'Discipline'        },
          { id:'Communication', icon:'🗣️', label:'Communication'     },
          { id:'Knowledge',     icon:'📖', label:'Knowledge'         },
          { id:'Resilience',    icon:'🛡️', label:'Resilience'        },
          { id:'Spiritual',     icon:'✝️', label:'Spiritual Depth'   },
        ].map(a => `
          <button class="area-btn ${obAreas.includes(a.id) ? 'sel' : ''}" onclick="obToggle('${a.id}')">
            <span class="ai">${a.icon}</span><span>${a.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
    <div class="ob-footer">
      <div class="ob-dots"><div class="ob-dot"></div><div class="ob-dot active"></div><div class="ob-dot"></div></div>
      <button class="btn-primary" onclick="obAreas.length?obNext():showToast('Pick at least one area','⚠️')">NEXT</button>
    </div>
  `;

  if (obStep === 2) return `
    <div style="flex:1;padding-top:max(60px,env(safe-area-inset-top))">
      <div class="ob-step-label">Step 2 of 2</div>
      <div class="ob-step-title">What do they<br>call you?</div>
      <div class="ob-desc">Your name in the forge.</div>
      <input type="text" class="ob-name-input" id="ob-name" placeholder="Your name" value="${obName}" oninput="obName=this.value" autocomplete="given-name" />
    </div>
    <div class="ob-footer">
      <div class="ob-dots"><div class="ob-dot"></div><div class="ob-dot"></div><div class="ob-dot active"></div></div>
      <button class="btn-primary" onclick="obFinish()">ENTER THE FORGE</button>
    </div>
  `;
}

function obNext() { obStep++; renderOnboard(); if (obStep === 2) setTimeout(() => document.getElementById('ob-name')?.focus(), 100); }
function obToggle(id) {
  const i = obAreas.indexOf(id);
  if (i >= 0) obAreas.splice(i, 1); else obAreas.push(id);
  renderOnboard();
}
function obFinish() {
  const name = document.getElementById('ob-name')?.value?.trim() || obName || 'Warrior';
  S.onboarded = true;
  S.name = name;
  S.areas = obAreas.length > 0 ? obAreas : ['Physical','Discipline'];
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

    <!-- Bottom sheet -->
    <div class="sheet-backdrop" id="sheet-backdrop" onclick="if(event.target===this)closeSheet()">
      <div class="sheet">
        <div class="sheet-handle"></div>
        <div id="sheet-content"></div>
      </div>
    </div>

    <!-- Level up overlay -->
    <div id="lvlup"></div>

    <!-- Toast -->
    <div id="toast"></div>
  `;
}

// ─── API KEY INJECTION ────────────────────────────────────
// Intercept fetch to inject stored API key automatically
const _origFetch = window.fetch;
window.fetch = function(url, opts = {}) {
  if (typeof url === 'string' && url.includes('anthropic.com')) {
    const key = localStorage.getItem('in_apikey');
    if (key) {
      opts.headers = { ...(opts.headers || {}), 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
    }
  }
  return _origFetch(url, opts);
};

// ─── INIT ─────────────────────────────────────────────────

function init() {
  load();

  // Register SW immediately
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  if (!S.onboarded) {
    document.getElementById('app').innerHTML = '';
    renderOnboard();
    return;
  }

  ensureWeekMission();
  buildApp();
  navigate('home');
}

document.addEventListener('DOMContentLoaded', init);
