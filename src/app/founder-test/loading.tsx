import { Box, CircularProgress } from '@mui/material';

const T = {
  bgSection: "#F5F7FB",
  bluePale:  "#EDF3FF",
  blue:      "#3B7BF6",
  blueGlow:  "rgba(59,123,246,0.18)",
  blueDim:   "rgba(59,123,246,0.06)",
};

export default function FounderTestLoading() {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${T.bluePale} 0%, ${T.bgSection} 50%, ${T.bluePale} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient blobs — exact FinalCTA */}
      <Box sx={{
        position: 'absolute', width: '60vw', height: '60vw',
        top: '-20vw', left: '-10vw', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${T.blueGlow} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', width: '50vw', height: '50vw',
        bottom: '-15vw', right: '-10vw', borderRadius: '50%',
        background: `radial-gradient(ellipse, ${T.blueDim} 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <CircularProgress size={48} sx={{ color: T.blue, position: 'relative', zIndex: 1 }} />
    </Box>
  );
}