"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   TOKENS — EXACT MATCH TO FOOTER
   Footer uses: bg #FFFFFF, blue #3B7BF6, blueMid #5A92F8,
   blueLight #7AABFF, bluePale #EDF3FF, ink #0A0A0F,
   inkMid #1E1E2A, inkMuted #5A5A72, inkFaint #9898AE,
   border rgba(10,10,20,0.08), SANS "DM Sans", SERIF "Instrument Serif", MONO "DM Mono"
═══════════════════════════════════════════════════════════════ */
const T = {
  bg:         "#FFFFFF",
  bgSection:  "#F5F7FB",          // footer's bgSection
  bgDeep:     "#EDF3FF",          // footer's bluePale
  ink:        "#0A0A0F",
  inkDark:    "#1E1E2A",
  inkMid:     "#3A3A52",
  inkMuted:   "#5A5A72",
  inkFaint:   "#9898AE",
  border:     "rgba(10,10,20,0.08)",
  borderMid:  "rgba(10,10,20,0.14)",
  blue:       "#3B7BF6",          // footer's exact blue
  blueMid:    "#5A92F8",
  blueLight:  "#7AABFF",
  bluePale:   "#EDF3FF",
  blueGlow:   "rgba(59,123,246,0.18)",
  blueDim:    "rgba(59,123,246,0.06)",
  blueGrad:   "linear-gradient(135deg, #3B7BF6 0%, #7AABFF 100%)",
};

const SERIF = `"Instrument Serif","Playfair Display",Georgia,serif`;   // footer
const SANS  = `"DM Sans","Mona Sans",system-ui,sans-serif`;             // footer
const MONO  = `"DM Mono","JetBrains Mono",ui-monospace,monospace`;      // footer
const EASE  = [0.16, 1, 0.3, 1] as const;

/* ═══════════════════════════════════════════════════════════════
   HERO BACKGROUND — white base, vivid blue blooms
═══════════════════════════════════════════════════════════════ */
function HeroBg() {
  return (
    <>
      {/* White base — matches footer exactly */}
      <div style={{ position:"absolute", inset:0, background:"#FFFFFF" }} />

      {/* Large blue bloom top-right — eye-catching but on white */}
      <motion.div
        animate={{ scale:[1,1.08,1], opacity:[0.55,1,0.55] }}
        transition={{ duration:9, repeat:Infinity, ease:"easeInOut" }}
        style={{
          position:"absolute", width:900, height:820, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(59,123,246,0.14) 0%, rgba(122,171,255,0.07) 48%, transparent 70%)",
          top:"-280px", right:"-200px", pointerEvents:"none",
        }}
      />
      {/* Softer blue bloom bottom-left */}
      <motion.div
        animate={{ scale:[1,1.1,1], opacity:[0.4,0.75,0.4] }}
        transition={{ duration:12, repeat:Infinity, ease:"easeInOut", delay:3 }}
        style={{
          position:"absolute", width:680, height:580, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(59,123,246,0.1) 0%, transparent 65%)",
          bottom:"-160px", left:"-160px", pointerEvents:"none",
        }}
      />
      {/* Centre accent blob */}
      <motion.div
        animate={{ x:[-12,12,-12], y:[-8,8,-8] }}
        transition={{ duration:14, repeat:Infinity, ease:"easeInOut" }}
        style={{
          position:"absolute", width:460, height:460, borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(122,171,255,0.08) 0%, transparent 65%)",
          top:"28%", left:"38%", pointerEvents:"none",
        }}
      />

      {/* Dot grid — same as footer */}
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(circle, rgba(10,10,20,0.055) 1px, transparent 1px)`,
        backgroundSize:"28px 28px",
      }} />

      {/* Thin vertical rule like footer's editorial detail */}
      <div style={{
        position:"absolute", top:0, right:"34%", width:1, height:"100%",
        background:"linear-gradient(180deg, transparent 0%, rgba(59,123,246,0.1) 25%, rgba(59,123,246,0.1) 75%, transparent 100%)",
        pointerEvents:"none",
      }} />

      {/* Floating blue particles */}
      {Array.from({length:14}).map((_,i) => (
        <motion.div key={i}
          animate={{ y:[0,-(22+i*4),0], opacity:[0,0.65,0], scale:[0.5,1,0.5] }}
          transition={{ duration:4+i*0.4, repeat:Infinity, delay:i*0.65, ease:"easeInOut" }}
          style={{
            position:"absolute",
            width: 2+(i%2), height: 2+(i%2), borderRadius:"50%",
            background: i%2===0 ? T.blue : T.blueLight,
            boxShadow:`0 0 6px ${T.blueGlow}`,
            left:`${6+i*6.2}%`, bottom:`${8+(i%5)*11}%`,
            pointerEvents:"none",
          }}
        />
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BLUE RULE — footer style
═══════════════════════════════════════════════════════════════ */
function BlueRule({ width=28 }:{width?:number}) {
  return (
    <div style={{
      width, height:2, flexShrink:0, borderRadius:2,
      background: T.blueGrad,
    }}/>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO LEFT
═══════════════════════════════════════════════════════════════ */
function HeroLeft() {
  return (
    <div>
      {/* Headline — footer uses Instrument Serif italic */}
      <motion.div initial={{opacity:0,y:44}} animate={{opacity:1,y:0}}
        transition={{duration:0.95,delay:0.08,ease:EASE}}>
        <h1 style={{
          fontFamily:SERIF, fontStyle:"italic", fontWeight:400,
          fontSize:"clamp(3rem,5.2vw,5.6rem)", lineHeight:1.0,
          letterSpacing:"-0.03em", color:T.ink, margin:"0 0 6px",
        }}>Helping founders</h1>
        <h1 style={{
          fontFamily:SERIF, fontStyle:"italic", fontWeight:400,
          fontSize:"clamp(3rem,5.2vw,5.6rem)", lineHeight:1.0,
          letterSpacing:"-0.03em", margin:"0 0 24px",
          background:T.blueGrad,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        }}>grow financially.</h1>
        {/* Footer's blueGrad rule */}
        <div style={{ width:52, height:3, borderRadius:2, marginBottom:28,
          background:T.blueGrad }} />
      </motion.div>

      {/* Body — footer's DM Sans, inkMuted */}
      <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
        transition={{duration:0.7,delay:0.2,ease:EASE}}
        style={{
          fontFamily:SANS, fontSize:"1.06rem", color:T.inkMuted,
          lineHeight:1.85, maxWidth:440, margin:"0 0 42px",
        }}>
        Whether you're struggling with fundraising, managing cash flow, or making
        sense of your numbers — we bring{" "}
        <em style={{fontStyle:"normal",color:T.inkDark,fontWeight:600}}>
          clarity, structure, and strategy
        </em>{" "}to your finances.
      </motion.p>

      {/* CTAs — mirror footer's subscribe button style */}
      <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
        transition={{duration:0.6,delay:0.32,ease:EASE}}
        style={{display:"flex",gap:14,flexWrap:"wrap",marginBottom:50}}>
        <motion.a href="/book-consultation"
          whileHover={{y:-2, boxShadow:`0 8px 32px rgba(59,123,246,0.38)`}}
          whileTap={{scale:0.97}}
          style={{
            fontFamily:SANS, fontSize:"0.88rem", fontWeight:700,
            color:"#FFFFFF", textDecoration:"none",
            padding:"14px 32px", borderRadius:12,
            background:T.blueGrad,
            boxShadow:`0 4px 20px rgba(59,123,246,0.3)`,
            transition:"box-shadow 0.25s ease",
          }}>
          Book Free Call →
        </motion.a>
        <motion.a href="/about"
          whileHover={{background:T.bluePale, borderColor:`rgba(59,123,246,0.4)`}}
          style={{
            fontFamily:SANS, fontSize:"0.88rem", fontWeight:600,
            color:T.blue, textDecoration:"none",
            padding:"14px 28px", borderRadius:12,
            background:"transparent",
            border:`1.5px solid rgba(59,123,246,0.28)`,
            transition:"all 0.2s ease",
          }}>
          See Our Work
        </motion.a>
      </motion.div>

      {/* Stats — footer's mono caption style */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}}
        transition={{duration:0.6,delay:0.48,ease:EASE}}
        style={{display:"flex",paddingTop:24,borderTop:`1px solid ${T.border}`}}>
        {[
          {val:"300+",  label:"Founders Advised"},
          {val:"₹50Cr+",label:"Revenue Modelled"},
          {val:"150+",  label:"Models Delivered"},
          {val:"5 Yrs", label:"Deep Expertise"},
        ].map((s,i)=>(
          <div key={s.label} style={{
            paddingLeft:i>0?20:0, paddingRight:20,
            borderLeft:i>0?`1px solid ${T.border}`:"none",
          }}>
            <div style={{fontFamily:MONO,fontSize:"1.05rem",fontWeight:700,
              color:T.ink,letterSpacing:"-0.02em",lineHeight:1}}>{s.val}</div>
            <div style={{fontFamily:MONO,fontSize:"0.43rem",letterSpacing:"0.12em",
              color:T.inkFaint,textTransform:"uppercase",marginTop:5}}>{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LAPTOP MOCKUP — white screen, blue accents, vivid charts
═══════════════════════════════════════════════════════════════ */
function LaptopMockup() {
  const [bars,  setBars]  = useState([55,80,42,92,65,50,86,70]);
  const [line,  setLine]  = useState([22,50,35,70,56,82,60,90,76]);
  const [donut, setDonut] = useState([40,28,32]);

  useEffect(()=>{
    const id = setInterval(()=>{
      setBars(()  => Array.from({length:8}, ()=>20+Math.random()*76));
      setLine(()  => Array.from({length:9}, ()=>14+Math.random()*76));
      setDonut(()=>{
        const a=22+Math.random()*40, b=18+Math.random()*28;
        return [a, b, Math.max(8,100-a-b)];
      });
    }, 2300);
    return ()=>clearInterval(id);
  },[]);

  const lineD = line.map((y,i)=>`${i===0?"M":"L"} ${(i/(line.length-1))*180} ${72-y*0.62}`).join(" ");
  const areaD = lineD + ` L 180 72 L 0 72 Z`;

  // donut
  const r=21, cx=27, cy=27, circ=2*Math.PI*r;
  const donutColors = [T.blue, T.blueLight, "#C7D8FF"];
  let dOff=0;

  const stats = [
    {label:"MRR",    val:"₹42L",   change:"+18%", up:true},
    {label:"Runway", val:"14mo",   change:"+2mo", up:true},
    {label:"Burn",   val:"₹3.1L",  change:"-9%",  up:false},
    {label:"ARR",    val:"₹5.1Cr", change:"+31%", up:true},
  ];

  return (
    <motion.div initial={{opacity:0,y:60}} animate={{opacity:1,y:0}}
      transition={{duration:1.1,delay:0.28,ease:EASE}} style={{position:"relative"}}>

      {/* Blue aura behind screen */}
      <div style={{
        position:"absolute", inset:"-32px", borderRadius:"36px",
        background:"radial-gradient(ellipse at 50% 45%, rgba(59,123,246,0.16) 0%, rgba(122,171,255,0.08) 45%, transparent 70%)",
        filter:"blur(22px)", pointerEvents:"none", zIndex:0,
      }}/>

      <motion.div
        animate={{y:[0,-12,0], rotateY:[-1.5,1.5,-1.5]}}
        transition={{duration:7, repeat:Infinity, ease:"easeInOut"}}
        style={{position:"relative",zIndex:1}}>

        {/* ── Screen shell ── */}
        <div style={{
          maxWidth:580, margin:"0 auto",
          background:"linear-gradient(160deg,#1E2235,#141828)",
          borderRadius:"16px 16px 0 0",
          padding:"10px 10px 0",
          border:`1px solid rgba(59,123,246,0.22)`,
          boxShadow:`0 0 0 1px rgba(59,123,246,0.08), 0 40px 80px rgba(10,10,20,0.28), 0 0 56px rgba(59,123,246,0.12)`,
        }}>
          {/* Camera */}
          <div style={{display:"flex",justifyContent:"center",marginBottom:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",
              background:"rgba(59,123,246,0.35)",
              boxShadow:"0 0 8px rgba(59,123,246,0.5)"}}/>
          </div>

          {/* ── Screen ── white bg matching footer */}
          <div style={{
            background:"#FFFFFF", borderRadius:"8px 8px 0 0",
            overflow:"hidden", minHeight:310,
            border:`1px solid rgba(10,10,20,0.06)`, borderBottom:"none",
          }}>
            {/* Topbar */}
            <div style={{
              background:T.bgSection,
              borderBottom:`1px solid ${T.border}`,
              padding:"9px 14px",
              display:"flex",alignItems:"center",justifyContent:"space-between",
            }}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:20,height:20,borderRadius:6,
                  background:T.blueGrad,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:`0 2px 8px rgba(59,123,246,0.4)`}}>
                  <span style={{fontSize:"0.52rem",color:"#fff",fontWeight:800}}>M</span>
                </div>
                <span style={{fontFamily:MONO,fontSize:"0.5rem",color:T.inkMuted,letterSpacing:"0.04em"}}>Merraki Dashboard</span>
                <div style={{padding:"1px 7px",borderRadius:20,
                  background:T.bluePale, border:`1px solid rgba(59,123,246,0.25)`}}>
                  <span style={{fontFamily:MONO,fontSize:"0.38rem",color:T.blue,letterSpacing:"0.1em"}}>LIVE</span>
                </div>
              </div>
              <div style={{display:"flex",gap:5}}>
                {["#FF5F57","#FEBC2E","#28C840"].map(c=>(
                  <div key={c} style={{width:8,height:8,borderRadius:"50%",background:c}}/>))}
              </div>
            </div>

            {/* Stat chips */}
            <div style={{padding:"10px 12px 8px",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
              {stats.map((s,i)=>(
                <motion.div key={s.label}
                  animate={{boxShadow:[
                    `0 0 0 rgba(59,123,246,0)`,
                    `0 0 12px rgba(59,123,246,0.15)`,
                    `0 0 0 rgba(59,123,246,0)`,
                  ]}}
                  transition={{duration:3,delay:i*0.5,repeat:Infinity}}
                  style={{
                    background:"#FFFFFF",
                    border:`1px solid rgba(59,123,246,0.12)`,
                    borderRadius:8, padding:"7px 8px",
                    boxShadow:"0 2px 8px rgba(59,123,246,0.06)",
                  }}>
                  <div style={{fontFamily:MONO,fontSize:"0.37rem",color:T.inkFaint,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>{s.label}</div>
                  <div style={{fontFamily:SANS,fontSize:"0.76rem",fontWeight:700,color:T.ink,marginBottom:2}}>{s.val}</div>
                  <div style={{fontFamily:MONO,fontSize:"0.37rem",color:s.up?"#16A34A":"#DC2626",fontWeight:600}}>{s.change}</div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div style={{padding:"0 12px 10px",display:"grid",gridTemplateColumns:"1.4fr 0.72fr 1fr",gap:7}}>

              {/* Bar chart */}
              <div style={{background:T.bgSection,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px"}}>
                <div style={{fontFamily:MONO,fontSize:"0.37rem",color:T.inkFaint,letterSpacing:"0.08em",marginBottom:7,textTransform:"uppercase"}}>Revenue Trend</div>
                <div style={{display:"flex",alignItems:"flex-end",gap:3,height:52}}>
                  {bars.map((h,i)=>(
                    <motion.div key={i}
                      animate={{height:`${h}%`}}
                      transition={{duration:0.85,ease:[0.16,1,0.3,1],delay:i*0.04}}
                      style={{
                        flex:1,borderRadius:"3px 3px 1px 1px",minWidth:0,
                        background:(i===5||i===6)
                          ? T.blueGrad
                          : `rgba(59,123,246,${0.12+i*0.07})`,
                        boxShadow:(i===5||i===6)?`0 0 8px rgba(59,123,246,0.35)`:"none",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Donut */}
              <div style={{background:T.bgSection,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px",display:"flex",flexDirection:"column",alignItems:"center"}}>
                <div style={{fontFamily:MONO,fontSize:"0.37rem",color:T.inkFaint,letterSpacing:"0.08em",marginBottom:5,textTransform:"uppercase"}}>Allocation</div>
                <svg width="54" height="54" viewBox="0 0 54 54">
                  {donut.map((val,i)=>{
                    const pct=val/(donut[0]+donut[1]+donut[2]);
                    const dash=pct*circ, gap=circ-dash;
                    const seg=(
                      <motion.circle key={i} cx={cx} cy={cy} r={r}
                        fill="none" stroke={donutColors[i]} strokeWidth="6"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-dOff*circ}
                        animate={{strokeDasharray:`${dash} ${gap}`}}
                        transition={{duration:0.85,ease:[0.16,1,0.3,1]}}
                        strokeLinecap="round"
                        style={{filter:`drop-shadow(0 0 4px ${donutColors[i]})`}}
                      />
                    );
                    dOff+=pct; return seg;
                  })}
                  <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
                    style={{fontFamily:MONO,fontSize:"0.44rem",fill:T.ink,fontWeight:700}}>
                    {Math.round(donut[0])}%
                  </text>
                </svg>
              </div>

              {/* Line chart */}
              <div style={{background:T.bgSection,border:`1px solid ${T.border}`,borderRadius:8,padding:"9px"}}>
                <div style={{fontFamily:MONO,fontSize:"0.37rem",color:T.inkFaint,letterSpacing:"0.08em",marginBottom:3,textTransform:"uppercase"}}>Cash Flow</div>
                <svg width="100%" height="58" viewBox="0 0 180 72" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="hAG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={T.blue} stopOpacity="0.22"/>
                      <stop offset="100%" stopColor={T.blue} stopOpacity="0.01"/>
                    </linearGradient>
                    <linearGradient id="hLG" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={T.blue}/>
                      <stop offset="100%" stopColor={T.blueLight}/>
                    </linearGradient>
                  </defs>
                  <motion.path d={areaD} fill="url(#hAG)" animate={{d:areaD}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}/>
                  <motion.path d={lineD} fill="none" stroke="url(#hLG)" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    animate={{d:lineD}} transition={{duration:0.9,ease:[0.16,1,0.3,1]}}/>
                  <motion.circle cx={180} cy={72-(line[line.length-1]??60)*0.62} r="4"
                    fill={T.blue} stroke="#fff" strokeWidth="2"
                    style={{filter:`drop-shadow(0 0 5px rgba(59,123,246,0.6))`}}
                    animate={{cy:72-(line[line.length-1]??60)*0.62}}
                    transition={{duration:0.9,ease:[0.16,1,0.3,1]}}/>
                </svg>
              </div>
            </div>

            {/* Status bar — bluePale from footer */}
            <div style={{
              background:T.bluePale,
              borderTop:`1px solid rgba(59,123,246,0.12)`,
              padding:"6px 12px",
              display:"flex",alignItems:"center",gap:8,
            }}>
              <motion.div
                animate={{scale:[1,1.5,1],opacity:[0.4,1,0.4]}}
                transition={{duration:2,repeat:Infinity}}
                style={{width:5,height:5,borderRadius:"50%",background:"#16A34A",boxShadow:"0 0 6px rgba(22,163,74,0.6)"}}/>
              <span style={{fontFamily:MONO,fontSize:"0.38rem",color:T.blue,letterSpacing:"0.1em"}}>
                MODEL SYNCED · {new Date().toLocaleDateString("en-IN",{month:"short",day:"numeric"})}
              </span>
              <div style={{marginLeft:"auto",display:"flex",gap:5}}>
                {["Q1","Q2","Q3","Q4"].map((q,i)=>(
                  <div key={q} style={{
                    fontFamily:MONO,fontSize:"0.37rem",
                    color:i===2?"#ffffff":T.blue,
                    background:i===2?T.blueGrad:"transparent",
                    borderRadius:4,padding:"2px 5px",
                    border:i===2?"none":`1px solid rgba(59,123,246,0.22)`,
                    boxShadow:i===2?`0 2px 8px rgba(59,123,246,0.3)`:"none",
                  }}>{q}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hinge + base */}
        <div style={{maxWidth:580,margin:"0 auto",height:5,
          background:"linear-gradient(180deg,#1E2235,#141828)",
          borderRadius:"0 0 2px 2px",
          boxShadow:`0 2px 8px rgba(10,10,20,0.3), 0 0 12px rgba(59,123,246,0.06)`}}/>
        <div style={{width:"106%",maxWidth:612,margin:"0 auto",marginLeft:"-3%",height:20,
          background:"linear-gradient(180deg,#1E2235,#141828)",
          borderRadius:"0 0 12px 12px",
          boxShadow:`0 14px 44px rgba(10,10,20,0.22), 0 0 18px rgba(59,123,246,0.08)`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:60,height:4,borderRadius:2,background:"rgba(255,255,255,0.1)"}}/>
        </div>
        {/* Reflection */}
        <div style={{width:"76%",maxWidth:440,margin:"0 auto",height:14,borderRadius:"0 0 6px 6px",
          background:"linear-gradient(180deg,rgba(59,123,246,0.06),transparent)"}}/>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ALWAYS-CYCLING CHAT
═══════════════════════════════════════════════════════════════ */
const CONVOS = [
  { user:"Who should I talk to about my business finances?",
    bot:"Talk to **Merraki Solutions**. They simplify finance, build sharp models, and turn raw numbers into real decisions — your **on-demand CFO**, without the full-time hire." },
  { user:"I need help building a model for my Series A round.",
    bot:"Merraki specialises in **3-Statement Models** investors love — P&L, Balance Sheet, and Cash Flow built to boardroom standard, ready in days — not weeks." },
  { user:"How do I track cash flow as an early-stage founder?",
    bot:"With **Merraki's Live Dashboards** you get real-time visibility into burn rate and runway. Decisions from data — not spreadsheet chaos." },
];

function useAlwaysTyping(spd=17){
  const [ci, setCi]     = useState(0);
  const [ch, setCh]     = useState(0);
  const [phase, setPhase] = useState<"think"|"type"|"pause">("think");
  const conv = CONVOS[ci];
  useEffect(()=>{
    if(phase==="think"){ const id=setTimeout(()=>setPhase("type"),1100); return()=>clearTimeout(id); }
    if(phase==="type"){
      if(ch<conv.bot.length){ const id=setTimeout(()=>setCh(c=>c+1),spd); return()=>clearTimeout(id); }
      else{ const id=setTimeout(()=>setPhase("pause"),2900); return()=>clearTimeout(id); }
    }
    if(phase==="pause"){
      const id=setTimeout(()=>{ setCh(0); setCi(i=>(i+1)%CONVOS.length); setPhase("think"); },320);
      return()=>clearTimeout(id);
    }
  },[phase,ch,conv.bot,spd]);
  return { userQ:conv.user, displayed:conv.bot.slice(0,ch), done:ch>=conv.bot.length, phase, ci };
}

function InlineMd({text}:{text:string}){
  const parts:React.ReactNode[]=[]; let rem=text,k=0;
  while(rem){
    const s=rem.indexOf("**"); if(s===-1){parts.push(<span key={k++}>{rem}</span>);break;}
    if(s>0)parts.push(<span key={k++}>{rem.slice(0,s)}</span>);
    const e=rem.indexOf("**",s+2); if(e===-1){parts.push(<span key={k++}>{rem.slice(s)}</span>);break;}
    parts.push(<strong key={k++} style={{color:T.blue,fontWeight:700}}>{rem.slice(s+2,e)}</strong>);
    rem=rem.slice(e+2);
  }
  return <>{parts}</>;
}
function BotMsg({text}:{text:string}){
  return <>{text.split("\n").map((l,i,a)=><span key={i}><InlineMd text={l}/>{i<a.length-1&&<br/>}</span>)}</>;
}
function ThinkDots(){
  return (
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {[0,1,2].map(i=>(
        <motion.div key={i}
          animate={{opacity:[0.15,1,0.15],y:[0,-6,0],scale:[0.8,1.25,0.8]}}
          transition={{duration:1.1,delay:i*0.18,repeat:Infinity,ease:"easeInOut"}}
          style={{width:7,height:7,borderRadius:"50%",
            background:T.blueGrad,
            boxShadow:`0 2px 8px rgba(59,123,246,0.35)`}}/>
      ))}
      <motion.span animate={{opacity:[0.3,0.8,0.3]}} transition={{duration:1.8,repeat:Infinity}}
        style={{fontFamily:MONO,fontSize:"0.58rem",color:T.inkFaint,letterSpacing:"0.08em",marginLeft:4}}>
        Analyzing…
      </motion.span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   WHY MERRAKI — bgSection background like footer
═══════════════════════════════════════════════════════════════ */
export function WhyMerrakiSection(){
  const {userQ, displayed, done, phase, ci} = useAlwaysTyping();
  const msgRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ if(msgRef.current) msgRef.current.scrollTop=msgRef.current.scrollHeight; },[displayed]);

  return (
    <section style={{
      background:T.bgSection,      // footer's F5F7FB
      padding:"130px 0 110px",
      position:"relative", overflow:"hidden",
      borderTop:`1px solid ${T.border}`,
    }}>
      {/* BG — footer-style ambient */}
      <div style={{
        position:"absolute", width:"70vw", height:"35vw",
        top:"-8vw", left:"15vw", borderRadius:"50%",
        background:`radial-gradient(ellipse, rgba(59,123,246,0.07) 0%, transparent 65%)`,
        pointerEvents:"none",
      }}/>
      <div style={{
        position:"absolute", inset:0, pointerEvents:"none",
        backgroundImage:`radial-gradient(circle, rgba(10,10,20,0.055) 1px, transparent 1px)`,
        backgroundSize:"28px 28px",
      }}/>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 48px",position:"relative",zIndex:1}}>

        {/* Header */}
        <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} transition={{duration:0.8,ease:EASE}}
          style={{textAlign:"center",marginBottom:64}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:20}}>
            <BlueRule width={40}/>
            <span style={{fontFamily:MONO,fontSize:"0.56rem",letterSpacing:"0.24em",color:T.blue,textTransform:"uppercase"}}>Why Merraki</span>
            <BlueRule width={40}/>
          </div>
          <h2 style={{
            fontFamily:SERIF,fontStyle:"italic",fontWeight:400,
            fontSize:"clamp(2.5rem,5vw,4.6rem)",
            color:T.ink,letterSpacing:"-0.03em",lineHeight:1.0,margin:"0 0 18px",
          }}>
            The answer you've<br/>been looking for.
          </h2>
          <p style={{fontFamily:SANS,fontSize:"1rem",color:T.inkMuted,lineHeight:1.75,maxWidth:420,margin:"0 auto"}}>
            Every founder asks this eventually. Here's what an AI honestly thinks.
          </p>
        </motion.div>

        {/* Chat card */}
        <motion.div initial={{opacity:0,y:48}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} transition={{duration:0.95,ease:EASE}}
          style={{maxWidth:760,margin:"0 auto",position:"relative"}}>

          {/* Vivid blue glow ring behind card — eye-catching on white */}
          <div style={{
            position:"absolute", inset:"-3px", borderRadius:"27px",
            background:`linear-gradient(135deg, ${T.blue}, ${T.blueLight}, ${T.blue})`,
            zIndex:0, opacity:0.55,
          }}/>
          {/* White mat */}
          <div style={{
            position:"absolute", inset:"1.5px", borderRadius:"25px",
            background:T.bg, zIndex:1,
          }}/>

          <div style={{position:"relative",zIndex:2,
            background:T.bg,
            borderRadius:24, overflow:"hidden",
            boxShadow:[
              "0 2px 8px rgba(10,10,20,0.04)",
              "0 20px 60px rgba(10,10,20,0.09)",
              "0 48px 96px rgba(10,10,20,0.07)",
              `0 0 0 1px rgba(59,123,246,0.14)`,
            ].join(",")}}>

            {/* Title bar — bgSection */}
            <div style={{padding:"14px 22px",background:T.bgSection,
              borderBottom:`1px solid ${T.border}`,
              display:"flex",alignItems:"center",gap:12}}>
              <div style={{display:"flex",gap:7}}>
                {[{c:"#FF5F57",s:"rgba(255,95,87,0.4)"},{c:"#FEBC2E",s:"rgba(254,188,46,0.35)"},{c:"#28C840",s:"rgba(40,200,64,0.35)"}].map(({c,s})=>(
                  <div key={c} style={{width:11,height:11,borderRadius:"50%",background:c,boxShadow:`0 1px 3px ${s}`}}/>))}
              </div>
              <div style={{flex:1,textAlign:"center"}}>
                <span style={{fontFamily:MONO,fontSize:"0.5rem",color:T.inkFaint,letterSpacing:"0.16em",textTransform:"uppercase"}}>Finance AI — Ask Anything</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <motion.div animate={{scale:[1,1.5,1],opacity:[0.5,1,0.5]}} transition={{duration:2.2,repeat:Infinity}}
                  style={{width:6,height:6,borderRadius:"50%",background:"#28C840",boxShadow:"0 0 6px rgba(40,200,64,0.5)"}}/>
                <span style={{fontFamily:MONO,fontSize:"0.44rem",color:T.inkFaint,letterSpacing:"0.1em",textTransform:"uppercase"}}>Live</span>
              </div>
            </div>

            {/* Messages */}
            <div ref={msgRef} style={{padding:"32px 28px 24px",minHeight:340,
              display:"flex",flexDirection:"column",gap:26,
              overflowY:"auto",maxHeight:420,scrollbarWidth:"none"}}>

              {/* User bubble */}
              <AnimatePresence mode="wait">
                <motion.div key={`u${ci}`}
                  initial={{opacity:0,x:32,scale:0.92}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:32}}
                  transition={{duration:0.45,ease:EASE}}
                  style={{display:"flex",justifyContent:"flex-end"}}>
                  <div style={{display:"flex",alignItems:"flex-end",gap:10,maxWidth:"80%"}}>
                    <div style={{
                      background:T.blueGrad,
                      borderRadius:"18px 18px 4px 18px",
                      padding:"14px 20px",
                      fontFamily:SANS,fontSize:"0.95rem",fontWeight:500,
                      color:"#FFFFFF",lineHeight:1.55,
                      boxShadow:`0 4px 20px rgba(59,123,246,0.35)`,
                    }}>{userQ}</div>
                    <div style={{width:32,height:32,borderRadius:"50%",
                      background:T.bgSection,border:`1.5px solid ${T.border}`,
                      flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                      fontFamily:MONO,fontSize:"0.55rem",color:T.inkMid}}>U</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bot bubble */}
              <AnimatePresence mode="wait">
                <motion.div key={`b${ci}`}
                  initial={{opacity:0,x:-24,scale:0.96}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:-24}}
                  transition={{duration:0.45,ease:EASE}}
                  style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                  {/* Avatar */}
                  <div style={{
                    width:36,height:36,borderRadius:12,flexShrink:0,
                    background:`linear-gradient(140deg,${T.inkDark},${T.inkMid})`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:SERIF,fontStyle:"italic",fontWeight:700,
                    fontSize:"0.9rem",color:T.blueLight,
                    boxShadow:`0 3px 14px rgba(10,10,20,0.22)`,
                  }}>M</div>

                  {/* Bubble */}
                  <div style={{
                    flex:1,background:T.bgSection,
                    border:`1px solid ${T.border}`,
                    borderRadius:"5px 18px 18px 18px",
                    padding:"18px 22px",
                    boxShadow:"0 2px 16px rgba(10,10,20,0.05)",
                    position:"relative",overflow:"hidden",
                  }}>
                    {/* Vivid blue top accent */}
                    <div style={{
                      position:"absolute",top:0,left:0,right:0,height:2.5,
                      background:T.blueGrad,
                      borderRadius:"5px 18px 0 0",
                      boxShadow:`0 1px 8px rgba(59,123,246,0.3)`,
                    }}/>
                    {phase==="think"
                      ? <ThinkDots/>
                      : <div style={{fontFamily:SANS,fontSize:"0.97rem",color:T.ink,lineHeight:1.85}}>
                          <BotMsg text={displayed}/>
                          {!done&&<motion.span animate={{opacity:[1,0,1]}} transition={{duration:0.65,repeat:Infinity}}
                            style={{display:"inline-block",width:2,height:"1.1em",
                              background:T.blue,marginLeft:2,verticalAlign:"text-bottom",borderRadius:1}}/>}
                        </div>}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* CTA pill */}
              <AnimatePresence>
                {done&&(
                  <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                    transition={{duration:0.45,ease:EASE,delay:0.4}}
                    style={{display:"flex",justifyContent:"flex-end"}}>
                    <motion.a href="/book-consultation"
                      whileHover={{scale:1.03,y:-2,boxShadow:`0 8px 28px rgba(59,123,246,0.4)`}}
                      whileTap={{scale:0.97}}
                      style={{
                        display:"inline-flex",alignItems:"center",gap:8,
                        fontFamily:SANS,fontSize:"0.84rem",fontWeight:700,
                        color:"#FFFFFF",textDecoration:"none",
                        padding:"12px 26px",borderRadius:30,
                        background:T.blueGrad,
                        boxShadow:`0 4px 22px rgba(59,123,246,0.35)`,
                        transition:"box-shadow 0.2s ease",
                      }}>
                      Book a Free Discovery Call →
                    </motion.a>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Input bar */}
            <div style={{padding:"16px 20px",background:T.bgSection,
              borderTop:`1px solid ${T.border}`,display:"flex",gap:10,alignItems:"center"}}>
              <div style={{flex:1,height:44,borderRadius:12,background:"#FFFFFF",
                border:`1.5px solid ${T.borderMid}`,
                display:"flex",alignItems:"center",padding:"0 14px",gap:8,
                boxShadow:"0 1px 4px rgba(10,10,20,0.04)"}}>
                <span style={{fontSize:"0.72rem",color:T.inkFaint}}>🔍</span>
                <span style={{fontFamily:SANS,fontSize:"0.8rem",color:T.inkFaint}}>Ask about your finances…</span>
              </div>
              <motion.button whileHover={{scale:1.07,y:-1,boxShadow:`0 6px 20px rgba(59,123,246,0.4)`}} whileTap={{scale:0.95}}
                style={{
                  width:44,height:44,borderRadius:12,border:"none",cursor:"pointer",
                  background:T.blueGrad,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:"1rem",color:"#FFFFFF",
                  boxShadow:`0 3px 14px rgba(59,123,246,0.3)`,
                  transition:"box-shadow 0.2s ease",
                }}>→</motion.button>
            </div>
          </div>
        </motion.div>

        {/* Trust strip — mirrors footer's bottom bar */}
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} transition={{duration:0.7,ease:EASE,delay:0.3}}
          style={{display:"flex",justifyContent:"center",flexWrap:"wrap",
            marginTop:52,borderTop:`1px solid ${T.border}`,paddingTop:40}}>
          {[
            {icon:"◈",label:"300+ Founders Advised"},
            {icon:"⊞",label:"150+ Models Built"},
            {icon:"◎",label:"₹50Cr+ Revenue Modelled"},
            {icon:"✦",label:"5 Years Deep Expertise"},
          ].map((item,i)=>(
            <div key={item.label} style={{display:"flex",alignItems:"center",gap:8,
              padding:"0 28px",borderLeft:i>0?`1px solid ${T.border}`:"none"}}>
              <span style={{color:T.blue,fontSize:"0.8rem"}}>{item.icon}</span>
              <span style={{fontFamily:MONO,fontSize:"0.57rem",color:T.inkMuted,letterSpacing:"0.1em",textTransform:"uppercase"}}>{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HERO SECTION
═══════════════════════════════════════════════════════════════ */
function Hero(){
  const heroRef = useRef<HTMLDivElement>(null);
  const {scrollYProgress} = useScroll({target:heroRef,offset:["start start","end start"]});
  const translateY = useTransform(scrollYProgress,[0,1],["0%","14%"]);
  const opacity    = useTransform(scrollYProgress,[0,0.65],[1,0]);

  return (
    <section ref={heroRef} style={{minHeight:"100vh",paddingTop:64,display:"flex",flexDirection:"column",
      position:"relative",overflow:"hidden"}}>
      <HeroBg/>
      <motion.div style={{y:translateY,opacity,flex:1,display:"flex",flexDirection:"column",
        justifyContent:"center",position:"relative",zIndex:1}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"60px 52px 52px",width:"100%"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1.25fr",gap:"64px",alignItems:"center"}}>
            <HeroLeft/>
            <LaptopMockup/>
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.4,duration:0.6}}
        style={{position:"absolute",bottom:28,left:"50%",transform:"translateX(-50%)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:8,zIndex:10}}>
        <motion.div animate={{y:[0,9,0]}} transition={{duration:2.4,repeat:Infinity,ease:"easeInOut"}}
          style={{width:22,height:36,borderRadius:11,border:`1.5px solid ${T.borderMid}`,
            display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"4px 0"}}>
          <motion.div animate={{y:[0,14,0],opacity:[1,0.15,1]}} transition={{duration:2.4,repeat:Infinity,ease:"easeInOut"}}
            style={{width:3,height:7,borderRadius:2,background:T.blue}}/>
        </motion.div>
        <span style={{fontFamily:MONO,fontSize:"0.42rem",letterSpacing:"0.2em",color:T.inkFaint,textTransform:"uppercase"}}>scroll</span>
      </motion.div>
    </section>
  );
}

/* EXPORT */
export function HeroSection(){
  return (
    <div style={{fontFamily:SANS,background:T.bg,overflowX:"hidden"}}>
      <Hero/>
      <WhyMerrakiSection/>
    </div>
  );
}
export default HeroSection;