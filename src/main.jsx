import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const SUBJECTS = [
  { id: 'maths', name: 'Mathematics', short: 'MATHS', count: 25, color: 'pink', icon: '∑' },
  { id: 'science', name: 'Basic Science', short: 'SCIENCE', count: 9, color: 'cyan', icon: '⌬' },
  { id: 'reasoning', name: 'Reasoning', short: 'REASONING', count: 35, color: 'violet', icon: '◈' },
  { id: 'analysis', name: 'Data Analysis', short: 'DATA ANALYSIS', count: 12, color: 'blue', icon: '▥' }
];
const TOTAL = 81;
const makeInitial = () => Object.fromEntries(SUBJECTS.map(s => [s.id, Array.from({length:s.count}, (_,i) => ({id:`${s.id}-${i+1}`, title:`Chapter ${String(i+1).padStart(2,'0')}`, done:false}))]));
const readStore = () => {
  try { const raw = JSON.parse(localStorage.getItem('solo-v1') || '{}'); return {
    profile: { name: raw.profile?.name || '', age: raw.profile?.age || '' },
    chapters: raw.chapters || makeInitial()
  }; } catch { return { profile:{name:'',age:''}, chapters:makeInitial() }; }
};
const percent = (n,d) => d ? Math.round(n/d*100) : 0;
const levelFor = completed => Math.min(100, Math.floor(completed * 100 / TOTAL));
const xpFor = completed => Math.round(completed * 10000 / TOTAL);
const milestones = [
  {level:10, title:'First Spark', detail:'Your journey is in motion.'},
  {level:20, title:'Momentum', detail:'Consistency is becoming your advantage.'},
  {level:30, title:'Focused Mind', detail:'Your preparation is gaining structure.'},
  {level:40, title:'Discipline', detail:'You are building serious momentum.'},
  {level:50, title:'Halfway Hero', detail:'Half the level journey is behind you.'},
  {level:60, title:'Precision', detail:'Your work is turning into mastery.'},
  {level:70, title:'Elite Focus', detail:'You are entering the final stretch.'},
  {level:80, title:'Unstoppable', detail:'The finish line is getting closer.'},
  {level:90, title:'Final Ascent', detail:'One last push towards completion.'},
  {level:100, title:'SOLO LEGEND', detail:'All 81 chapters completed. Maximum level achieved.'}
];

function Ring({value=0, size=150, stroke=10, color='url(#ringGradient)', children}) {
  const r=(size-stroke)/2, c=2*Math.PI*r;
  return <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${value}% progress`}>
    <defs><linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff4f91"/><stop offset=".52" stopColor="#a36bff"/><stop offset="1" stopColor="#42dcff"/></linearGradient></defs>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,.075)" strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c-(c*value/100)} transform={`rotate(-90 ${size/2} ${size/2})`} className="ring-progress"/>
    <foreignObject x="0" y="0" width={size} height={size}><div className="ring-center">{children}</div></foreignObject>
  </svg>;
}
function PowerMark(){return <span className="power-mark"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5v18" /><path d="M13.2 11.5a18 18 0 1 0 21.6 0"/></svg></span>}

function App(){
  const [store,setStore]=useState(readStore);
  const [page,setPage]=useState('dashboard');
  const [subject,setSubject]=useState('all');
  const [query,setQuery]=useState('');
  const [toast,setToast]=useState('');
  const [levelUp,setLevelUp]=useState(null);
  const [editingName,setEditingName]=useState(false);
  const [profileDraft,setProfileDraft]=useState(store.profile);
  const [showReset,setShowReset]=useState(false);

  useEffect(()=>{localStorage.setItem('solo-v1',JSON.stringify(store));},[store]);
  const allChapters=useMemo(()=>SUBJECTS.flatMap(s=>(store.chapters[s.id]||[]).map(c=>({...c,subjectId:s.id,subjectName:s.name,color:s.color}))),[store]);
  const completed=allChapters.filter(c=>c.done).length;
  const level=levelFor(completed), xp=xpFor(completed), overall=percent(completed,TOTAL);
  const nextMilestone=milestones.find(m=>m.level>level) || null;
  const remaining=TOTAL-completed;

  function flash(message){setToast(message);window.clearTimeout(flash.timer);flash.timer=window.setTimeout(()=>setToast(''),2600);}
  function toggleChapter(subjectId,chapterId){
    const wasDone=store.chapters[subjectId].find(c=>c.id===chapterId)?.done;
    const before=level;
    setStore(prev=>({...prev,chapters:{...prev.chapters,[subjectId]:prev.chapters[subjectId].map(c=>c.id===chapterId?{...c,done:!c.done}:c)}}));
    if(!wasDone){
      const after=levelFor(completed+1);
      if(after>before){setLevelUp({level:after, title: milestones.filter(m=>m.level<=after && m.level>before).at(-1)?.title || 'LEVEL UP'});}
      else flash('Chapter completed · XP added');
    } else flash('Progress reset · chapter reopened');
  }
  function saveProfile(e){e.preventDefault();setStore(p=>({...p,profile:{name:profileDraft.name.trim(),age:profileDraft.age}}));setEditingName(false);flash('Profile updated');}
  function resetAll(){setStore(p=>({...p,chapters:makeInitial()}));setShowReset(false);setLevelUp(null);flash('All chapter progress has been reset');}
  const filtered=allChapters.filter(c=>(subject==='all'||c.subjectId===subject)&&(`${c.title} ${c.subjectName}`.toLowerCase().includes(query.toLowerCase())));
  const firstName=store.profile.name?.trim().split(/\s+/)[0] || 'Commander';

  return <div className="app-shell">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/><div className="ambient ambient-three"/>
    <aside className="sidebar glass">
      <div className="brand"><PowerMark/><div><b>SOLO</b><span>COMMAND CENTRE</span></div></div>
      <div className="side-label">WORKSPACE</div>
      <button className={`nav-item ${page==='dashboard'?'active':''}`} onClick={()=>setPage('dashboard')}><span className="nav-icon">⌂</span><span>Dashboard</span><i/></button>
      <button className={`nav-item ${page==='profile'?'active':''}`} onClick={()=>setPage('profile')}><span className="nav-icon">◉</span><span>Profile</span><i/></button>
      <div className="side-divider"/>
      <div className="side-label">YOUR MISSION</div>
      <div className="mission-mini"><span className="mission-dot"/><div><b>RRB STATION MASTER</b><small>81 chapters · 4 subjects</small></div></div>
      <div className="sidebar-bottom"><div className="mini-level"><span>YOUR LEVEL</span><b>LVL {level}<em>/100</em></b><div className="tiny-track"><i style={{width:`${level}%`}}/></div></div><div className="local-note"><span className="pulse-dot"/> SAVED ON THIS DEVICE</div></div>
    </aside>

    <main className="main-area">
      <header className="topbar">
        <div className="crumb"><span>SOLO</span><b>/</b>{page==='dashboard'?'DASHBOARD':'PROFILE'}</div>
        <div className="top-actions"><span className="live-status"><i/> SYSTEM ONLINE</span><button className="avatar" onClick={()=>setPage('profile')}>{store.profile.name?store.profile.name.trim().slice(0,1).toUpperCase():'S'}</button></div>
      </header>

      {page==='dashboard' ? <section className="page-content">
        <div className="welcome-row"><div><div className="eyebrow"><span/> PERSONAL PREPARATION SYSTEM</div><h1>Good {new Date().getHours()<12?'morning':new Date().getHours()<18?'afternoon':'evening'}, <span>{firstName}.</span></h1><p>Your mission. Your pace. Your progress.</p></div><div className="date-chip"><span className="date-symbol">◷</span><div><small>MISSION STATUS</small><b>IN PROGRESS</b></div></div></div>

        <div className="hero-grid">
          <article className="hero-card glass">
            <div className="card-orbit orbit-a"/><div className="card-orbit orbit-b"/>
            <div className="hero-top"><div><div className="eyebrow"><span/> OVERALL PROGRESS</div><h2>The bigger picture.</h2></div><span className="pill">81 CHAPTERS</span></div>
            <div className="hero-main"><Ring value={overall} size={190} stroke={12}><strong>{overall}<small>%</small></strong><span>COMPLETED</span></Ring>
              <div className="hero-stats"><div><small>CHAPTERS DONE</small><b>{String(completed).padStart(2,'0')}<em> / 81</em></b></div><div><small>REMAINING</small><b>{String(remaining).padStart(2,'0')}</b></div><div><small>TOTAL XP EARNED</small><b className="xp-number">{xp.toLocaleString('en-IN')} <em>XP</em></b></div></div>
            </div>
            <div className="hero-footer"><span>SYLLABUS COMPLETION</span><b>{completed} of {TOTAL} chapters</b></div><div className="progress-track"><i style={{width:`${overall}%`}}/></div>
          </article>

          <article className="level-card glass">
            <div className="level-card-head"><div className="eyebrow"><span/> LEVEL BOOSTER</div><span className="level-badge">✦ LIVE</span></div>
            <div className="level-number"><span>LVL</span><strong>{String(level).padStart(2,'0')}</strong></div>
            <div className="level-caption">THE PATH TO <b>LEVEL 100</b></div>
            <div className="level-track"><i style={{width:`${level}%`}}/><span className="level-glint"/></div>
            <div className="level-foot"><span>LEVEL 0</span><b>{level}% POWER</b><span>LEVEL 100</span></div>
            <div className="next-unlock"><span className="unlock-icon">✧</span><div><small>NEXT MILESTONE</small><b>{nextMilestone?`LEVEL ${nextMilestone.level} · ${nextMilestone.title}`:'MAX LEVEL ACHIEVED'}</b></div><span className="unlock-count">{nextMilestone?`${nextMilestone.level-level} LVL`:'MAX'}</span></div>
            <div className="level-milestones">{[10,20,30,40,50,60,70,80,90,100].map(n=><span key={n} className={level>=n?'reached':''} title={`Level ${n}`}/>)}</div>
          </article>
        </div>

        <div className="section-heading"><div><div className="eyebrow">THE BREAKDOWN</div><h2>Subject performance</h2></div><span className="section-meta">04 SUBJECTS <i/> 81 CHAPTERS</span></div>
        <div className="subject-grid">{SUBJECTS.map(s=>{
          const arr=store.chapters[s.id]||[], done=arr.filter(c=>c.done).length, pct=percent(done,s.count);
          return <article className={`subject-card glass ${s.color}`} key={s.id}>
            <div className="subject-card-top"><span className="subject-icon">{s.icon}</span><span className="subject-tag">{s.short}</span><button className="arrow-btn" onClick={()=>{setSubject(s.id);document.getElementById('chapter-manager')?.scrollIntoView({behavior:'smooth'});}}>↗</button></div>
            <h3>{s.name}</h3><div className="subject-count"><b>{String(done).padStart(2,'0')}</b><span>/ {s.count} chapters</span><strong>{pct}%</strong></div>
            <div className="subject-track"><i style={{width:`${pct}%`}}/></div><div className="subject-foot"><span>{s.count-done} LEFT</span><span>{done===s.count?'SUBJECT CLEARED':'IN PROGRESS'}</span></div>
          </article>
        })}</div>

        <div className="section-heading chapter-heading" id="chapter-manager"><div><div className="eyebrow">TAKE CONTROL</div><h2>Chapter manager</h2><p>Mark a chapter complete to earn XP and advance your level. Undo it anytime.</p></div><button className="reset-link" onClick={()=>setShowReset(true)}>↺ Reset all progress</button></div>
        <div className="manager glass">
          <div className="manager-toolbar"><div className="filter-tabs"><button className={subject==='all'?'selected':''} onClick={()=>setSubject('all')}>All chapters <span>81</span></button>{SUBJECTS.map(s=><button key={s.id} className={subject===s.id?'selected':''} onClick={()=>setSubject(s.id)}>{s.name}</button>)}</div><label className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a chapter..."/></label></div>
          <div className="chapter-list">{filtered.map(c=><div className={`chapter-row ${c.done?'is-done':''}`} key={c.id}><button className={`check-control ${c.done?'checked':''}`} onClick={()=>toggleChapter(c.subjectId,c.id)} aria-label={c.done?'Undo completion':'Mark complete'}>{c.done?'✓':'+'}</button><div className="chapter-info"><b>{c.title}</b><span className={`chapter-sub ${c.color}`}>{c.subjectName}</span></div><span className="chapter-xp">{c.done?'CLEARED':`+${xpFor(completed+1)-xpFor(completed)} XP`}</span><button className="chapter-action" onClick={()=>toggleChapter(c.subjectId,c.id)}>{c.done?'UNDO':'COMPLETE'}</button></div>)}
            {filtered.length===0&&<div className="empty-state">No chapters match your search.</div>}
          </div>
          <div className="manager-footer"><span>SHOWING {filtered.length} CHAPTERS</span><span><i className="legend-dot done-dot"/> COMPLETED <i className="legend-dot pending-dot"/> NOT STARTED</span></div>
        </div>
        <footer className="page-footer"><span>SOLO <b>v1.0</b></span><span>BUILT FOR THE LONG GAME <i>✦</i></span></footer>
      </section> : <section className="page-content profile-page">
        <div className="welcome-row"><div><div className="eyebrow"><span/> YOUR IDENTITY</div><h1>Operator <span>profile.</span></h1><p>Your personal details, stored privately on this device.</p></div></div>
        <div className="profile-layout">
          <article className="profile-card glass"><div className="profile-avatar"><PowerMark/></div><div className="profile-name">{store.profile.name||'Your name'}</div><div className="profile-role">SOLO OPERATOR · RRB STATION MASTER</div><div className="profile-divider"/><div className="profile-stats"><div><small>AGE</small><b>{store.profile.age||'—'}</b></div><div><small>CURRENT LEVEL</small><b>{level}/100</b></div><div><small>CHAPTERS DONE</small><b>{completed}/81</b></div></div></article>
          <article className="profile-form glass"><div className="eyebrow">PERSONAL DETAILS</div><h2>Make it yours.</h2><p>These details stay in your browser's local storage.</p><form onSubmit={saveProfile}><label>FULL NAME<input required value={profileDraft.name} onChange={e=>setProfileDraft({...profileDraft,name:e.target.value})} placeholder="Enter your name"/></label><label>AGE<input type="number" min="1" max="120" value={profileDraft.age} onChange={e=>setProfileDraft({...profileDraft,age:e.target.value})} placeholder="Enter your age"/></label><button className="primary-btn" type="submit">SAVE PROFILE <span>↗</span></button></form></article>
        </div>
        <div className="privacy-note glass"><span>◈</span><div><b>Your data belongs to you.</b><p>SOLO uses browser local storage. Your profile and chapter progress remain on this device and are not sent to a server. Clearing browser data will erase them, so export/backup is recommended before doing so.</p></div></div>
        <footer className="page-footer"><span>SOLO <b>v1.0</b></span><span>BUILT FOR THE LONG GAME <i>✦</i></span></footer>
      </section>}
    </main>

    {toast&&<div className="toast"><span>✦</span>{toast}</div>}
    {levelUp&&<div className="modal-backdrop" onClick={()=>setLevelUp(null)}><div className="levelup-modal glass" onClick={e=>e.stopPropagation()}><div className="confetti-mark">✦</div><div className="eyebrow">ACHIEVEMENT UNLOCKED</div><h2>LEVEL <span>{levelUp.level}</span></h2><h3>{levelUp.title}</h3><p>Another milestone conquered. Keep moving forward.</p><button className="primary-btn" onClick={()=>setLevelUp(null)}>LET'S GO <span>↗</span></button></div></div>}
    {showReset&&<div className="modal-backdrop" onClick={()=>setShowReset(false)}><div className="confirm-modal glass" onClick={e=>e.stopPropagation()}><div className="eyebrow">RESET PROGRESS</div><h2>Start from zero?</h2><p>This will uncheck all 81 chapters and return your level to 0. Your profile will remain unchanged.</p><div className="modal-actions"><button className="secondary-btn" onClick={()=>setShowReset(false)}>CANCEL</button><button className="danger-btn" onClick={resetAll}>RESET ALL</button></div></div></div>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App/>);
