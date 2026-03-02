'use client';

import { Box, Typography } from '@mui/material';
import { ArrowBack as BackIcon, ArrowForward as ArrowIcon, LockOutlined as LockIcon, CheckCircleOutline as CheckIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { founderTestContactSchema, type FounderTestContactValues } from '@/lib/schemas/founderTest.schema';

const T = {
  /* surfaces */
  white:     "#FFFFFF",
  offwhite:  "#F9F8F5",
  cream:     "#F0EDE6",
  parchment: "#E8E4DA",

  /* text */
  ink:       "#0C0E12",
  inkMid:    "#2E3440",
  inkMuted:  "#64748B",
  inkFaint:  "#94A3B8",
  inkGhost:  "#CBD5E1",

  /* borders */
  border:    "#E2DED5",
  borderMd:  "#C8C3B8",

  /* blue / cool shades */
  blue:      "#3B82F6",
  blueMid:   "#60A5FA",
  blueLight: "#93C5FD",
  blueGlow:  "rgba(59,130,246,0.07)",
  blueBdr:   "rgba(59,130,246,0.18)",

   /* states */
  error:     "#DC2626",

  /* cool accents for charts/footer */
  accents: [
    { line: "#3B82F6", glow: "rgba(59,130,246,0.055)" }, // primary blue
    { line: "#10B981", glow: "rgba(16,185,129,0.055)" }, // teal
    { line: "#64748B", glow: "rgba(100,116,139,0.055)" }, // gray
    { line: "#94A3B8", glow: "rgba(148,163,184,0.055)" }, // light gray-blue
  ],
};

const SERIF = '"Instrument Serif","Playfair Display",Georgia,serif';
const SANS  = '"DM Sans","Mona Sans",system-ui,sans-serif';
const MONO  = '"DM Mono","JetBrains Mono",ui-monospace,monospace';
const EASE  = [0.16,1,0.3,1] as const;

const INCLUSIONS = [
  { icon:'◈', text:'Your financial personality archetype' },
  { icon:'◆', text:'Top 3 strengths mapped to your answers' },
  { icon:'△', text:'Key risk areas and blind spots' },
  { icon:'○', text:'Personalised growth playbook' },
  { icon:'◇', text:'Recommended tools and templates' },
];

/* ── Styled input ─────────────────────────────────────── */
function Field({ label, error, helperText, ...props }: { label:string; error?:boolean; helperText?:string; [k:string]:any }) {
  return (
    <Box sx={{ display:'flex', flexDirection:'column', gap:0.75 }}>
      <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.14em', color:T.inkFaint, textTransform:'uppercase' }}>
        {label}
      </Typography>
      <Box
        component="input"
        {...props}
        sx={{
          border:`1px solid ${error?T.error:T.border}`, borderRadius:'10px',
          background:T.white, fontFamily:SANS, fontSize:'0.9375rem', color:T.ink,
          px:2, py:'11px', outline:'none',
          transition:'border-color 0.15s, box-shadow 0.15s',
          '&:focus':{ borderColor:error?T.error:T.borderMd, boxShadow:error?`0 0 0 3px rgba(220,38,38,0.08)`:`0 0 0 3px rgba(12,14,18,0.06)` },
          '&::placeholder':{ color:T.inkGhost },
          '&:disabled':{ background:T.parchment, cursor:'not-allowed' },
        }}
      />
      {helperText && (
        <Typography sx={{ fontFamily:SANS, fontSize:'0.75rem', color:error?T.error:T.inkGhost, lineHeight:1.4 }}>
          {helperText}
        </Typography>
      )}
    </Box>
  );
}

interface Props { onSubmit:(data:FounderTestContactValues)=>Promise<void>; onBack:()=>void; isSubmitting:boolean; }

export function TestContactScreen({ onSubmit, onBack, isSubmitting }:Props) {
  const { register, handleSubmit, formState:{ errors } } = useForm<FounderTestContactValues>({
    resolver:zodResolver(founderTestContactSchema),
  });

  return (
    <Box sx={{ minHeight:'100vh', background:T.offwhite, fontFamily:SANS }}>
      <Box sx={{ display:'flex', flexDirection:{ xs:'column', lg:'row' }, minHeight:'100vh' }}>

        {/* ── LEFT: What you'll get ── */}
        <Box sx={{
          flex:'0 0 40%', background:T.white,
          borderRight:`1px solid ${T.border}`,
          display:'flex', flexDirection:'column', justifyContent:'center',
          p:{ xs:'48px 32px', md:'72px 56px' }, position:'relative', overflow:'hidden',
        }}>
          {/* Grid */}
          <Box sx={{ position:'absolute', inset:0, pointerEvents:'none',
            backgroundImage:`linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
            backgroundSize:'56px 56px', opacity:0.4 }} />
          {/* Gold glow */}
          <Box sx={{ position:'absolute', width:'60%', height:'50%', bottom:'-18%', right:'-18%', borderRadius:'50%',
            background:`radial-gradient(ellipse,rgba(184,146,42,0.08) 0%,transparent 70%)`, pointerEvents:'none' }} />

          <Box sx={{ position:'relative', zIndex:1 }}>
            {/* Eyebrow */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, ease:EASE }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:3.5 }}>
                <Box sx={{ width:24, height:'1px', background:`linear-gradient(90deg,${T.blue},${T.blueLight})` }} />
                <Typography sx={{ fontFamily:MONO, fontSize:'0.52rem', letterSpacing:'0.2em', color:T.blueMid||T.blueLight, textTransform:'uppercase' }}>
                  Almost There
                </Typography>
              </Box>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08, duration:0.6, ease:EASE }}>
              <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                fontSize:{ xs:'1.875rem', md:'2.625rem' }, color:T.ink, letterSpacing:'-0.025em', lineHeight:1.1, mb:1 }}>
                Your personalised
              </Typography>
              <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontWeight:400,
                fontSize:{ xs:'1.875rem', md:'2.625rem' }, letterSpacing:'-0.025em', lineHeight:1.1, mb:3,
                background:`linear-gradient(115deg,${T.blueLight},${T.blue})`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                report awaits.
              </Typography>
            </motion.div>

            {/* List */}
            <Box sx={{ display:'flex', flexDirection:'column', gap:1.75 }}>
              {INCLUSIONS.map((item,i)=>(
                <motion.div key={item.text} initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.22+i*0.08, duration:0.4, ease:EASE }}>
                  <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                    <Box sx={{ width:28, height:28, borderRadius:'8px', background:T.parchment, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Typography sx={{ fontFamily:MONO, fontSize:'0.6rem', color:T.blue }}>{item.icon}</Typography>
                    </Box>
                    <Typography sx={{ fontFamily:SANS, fontSize:'0.9rem', color:T.inkMuted, lineHeight:1.5 }}>{item.text}</Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── RIGHT: Form ── */}
        <Box sx={{
          flex:1, display:'flex', alignItems:'center', justifyContent:'center',
          p:{ xs:'48px 24px', md:'72px 64px' },
        }}>
          <Box sx={{ width:'100%', maxWidth:480 }}>
            <motion.div
              initial={{ opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.52, ease:EASE }}
            >
              {/* Heading */}
              <Box sx={{ mb:4 }}>
                <Typography sx={{ fontFamily:SERIF, fontStyle:'italic', fontWeight:400, fontSize:{ xs:'1.625rem', md:'2rem' }, color:T.ink, letterSpacing:'-0.025em', lineHeight:1.1, mb:1 }}>
                  Where should we send it?
                </Typography>
                <Typography sx={{ fontFamily:SANS, fontSize:'0.9rem', color:T.inkFaint, lineHeight:1.7 }}>
                  Your detailed PDF report will be emailed instantly. No spam, ever.
                </Typography>
              </Box>

              {/* Form */}
              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display:'flex', flexDirection:'column', gap:2.5 }}>
                <Field
                  label="Full Name *"
                  placeholder="Priya Sharma"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                  {...register('name')}
                />
                <Field
                  label="Email Address *"
                  type="email"
                  placeholder="priya@company.com"
                  error={!!errors.email}
                  helperText={errors.email?.message ?? 'Your report will be delivered here'}
                  disabled={isSubmitting}
                  {...register('email')}
                />
                <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2 }}>
                  <Field label="Company (optional)" placeholder="Merraki Co." disabled={isSubmitting} {...register('company')} />
                  <Field label="Your Role (optional)" placeholder="Founder, CEO…" disabled={isSubmitting} {...register('role')} />
                </Box>

                {/* Privacy note */}
                <Box sx={{ display:'flex', gap:1.25, px:2, py:1.5, borderRadius:'10px', background:T.parchment, border:`1px solid ${T.border}` }}>
                  <LockIcon sx={{ fontSize:'0.875rem', color:T.inkGhost, mt:'1px', flexShrink:0 }} />
                  <Typography sx={{ fontFamily:SANS, fontSize:'0.8125rem', color:T.inkFaint, lineHeight:1.55 }}>
                    Your data stays private. No selling, no spam, unsubscribe anytime.
                  </Typography>
                </Box>

                {/* Buttons */}
                <Box sx={{ display:'flex', gap:1.5, mt:0.5 }}>
                  <motion.button type="button" onClick={onBack} disabled={isSubmitting}
                    whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                    style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 20px', borderRadius:10, border:`1px solid ${T.border}`, background:'transparent', cursor:isSubmitting?'not-allowed':'pointer', outline:'none', flexShrink:0 }}>
                    <BackIcon sx={{ fontSize:'0.9rem', color:T.inkFaint }} />
                    <Typography sx={{ fontFamily:SANS, fontWeight:500, fontSize:'0.875rem', color:T.inkFaint }}>Back</Typography>
                  </motion.button>

                  <motion.button type="submit" disabled={isSubmitting}
                    whileHover={isSubmitting?{}:{ scale:1.02 }} whileTap={isSubmitting?{}:{ scale:0.98 }}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:10,
                      padding:'14px 24px', borderRadius:'10px', border:'none',
                      background:isSubmitting?T.parchment:`linear-gradient(115deg,${T.blueLight},${T.blue})`,
                      cursor:isSubmitting?'not-allowed':'pointer', outline:'none',
                      boxShadow:isSubmitting?'none':'0 5px 20px rgba(59,130,246,0.26)',
                      transition:'box-shadow 0.18s',
                    }}>
                    {isSubmitting ? (
                      <>
                        <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                          style={{ width:16, height:16, borderRadius:'50%', border:`2px solid ${T.border}`, borderTopColor:T.blue }} />
                        <Typography sx={{ fontFamily:SANS, fontWeight:600, fontSize:'0.9375rem', color:T.inkFaint }}>
                          Generating…
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography sx={{ fontFamily:SANS, fontWeight:700, fontSize:'0.9375rem', color:T.ink }}>
                          Get My Report
                        </Typography>
                        <ArrowIcon sx={{ fontSize:'1rem', color:T.ink }} />
                      </>
                    )}
                  </motion.button>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}