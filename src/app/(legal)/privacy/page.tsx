'use client';

import { Box, Container, Typography } from '@mui/material';

/* ── TOKENS — modified to remove blue, use F5F7FB / 253957 ── */
const T = {
  bg:        "#F5F7FB",
  bgSection: "#F5F7FB",
  ink:       "#253957",
  inkDark:   "#253957",
  inkMid:    "#253957",
  inkMuted:  "#253957",
  inkFaint:  "#9898AE",
  border:    "rgba(37,57,87,0.08)",
  borderMid: "rgba(37,57,87,0.14)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

const PrivacyPolicy = () => {
  return (
    <Box sx={{
      background: T.bgSection,
      py: { xs: 8, md: 14 },
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
          <Typography sx={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: { xs: '2rem', md: '3rem' },
            color: T.ink,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            mb: 2,
          }}>
            Privacy Policy
          </Typography>
          <Typography sx={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: '0.9375rem',
            color: T.ink,
            lineHeight: 1.75,
            maxWidth: 480,
            mx: 'auto',
          }}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </Typography>
        </Box>

        {/* Content card */}
        <Box sx={{
          background: T.bg,
          border: `1px solid ${T.borderMid}`,
          borderRadius: '20px',
          p: { xs: '28px 24px', md: '48px 52px' },
        }}>

          {/* Intro */}
          <Typography sx={{ fontFamily: SANS, color: T.ink, mb: 2.5, lineHeight: 1.8, fontSize: '0.9375rem' }}>
            <strong>Welcome to Merraki Solutions.</strong> Your privacy is important to us, and we are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </Typography>
          <Typography sx={{ fontFamily: SANS, color: T.ink, mb: 6, lineHeight: 1.8, fontSize: '0.9375rem' }}>
            By accessing or using our website, you agree to the terms outlined in this Privacy Policy.
          </Typography>

          {/* Sections */}
          {[
            {
              title: '1. Information We Collect',
              content: (
                <>
                  <Typography sx={{ fontFamily: SANS, color: T.inkDark, fontWeight: 700, fontSize: '0.9rem', mt: 2, mb: 0.5 }}>
                    Personal Information
                  </Typography>
                  <Typography sx={{ fontFamily: SANS, color: T.ink, mb: 1.5, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                    When you contact us, request services, or fill out forms on our website, we may collect:
                  </Typography>
                  <Box component="ul" sx={{ fontFamily: SANS, color: T.ink, pl: 3, mb: 2, lineHeight: 2, fontSize: '0.9375rem' }}>
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Company name</li>
                    <li>Business information relevant to financial services</li>
                  </Box>

                  <Typography sx={{ fontFamily: SANS, color: T.inkDark, fontWeight: 700, fontSize: '0.9rem', mt: 2, mb: 0.5 }}>
                    Technical Information
                  </Typography>
                  <Typography sx={{ fontFamily: SANS, color: T.ink, mb: 1.5, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                    When you visit our website, certain information may be collected automatically, including:
                  </Typography>
                  <Box component="ul" sx={{ fontFamily: SANS, color: T.ink, pl: 3, mb: 2, lineHeight: 2, fontSize: '0.9375rem' }}>
                    <li>IP address</li>
                    <li>Browser type</li>
                    <li>Device type</li>
                    <li>Pages visited</li>
                    <li>Time spent on the website</li>
                    <li>Referring URLs</li>
                  </Box>
                </>
              ),
            },
            {
              title: '2. How We Use Your Information',
              content: (
                <Box component="ul" sx={{ fontFamily: SANS, color: T.ink, pl: 3, lineHeight: 2, fontSize: '0.9375rem' }}>
                  <li>Respond to inquiries and communicate with you</li>
                  <li>Provide our services such as financial modeling, budgeting, bookkeeping, and financial analysis</li>
                  <li>Improve our website and services</li>
                  <li>Send updates or service-related communication</li>
                  <li>Maintain internal records and analytics</li>
                </Box>
              ),
            },
            {
              title: '3. Cookies and Tracking Technologies',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  Our website may use cookies and similar tracking technologies to enhance your browsing experience. You may choose to disable cookies through your browser settings, though some parts of the website may not function properly.
                </Typography>
              ),
            },
            {
              title: '4. How We Protect Your Information',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  We take appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet is completely secure.
                </Typography>
              ),
            },
            {
              title: '5. Sharing of Information',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  We do not sell, trade, or rent your personal information to third parties. We may share information only with trusted service providers, when required by law, or to protect our rights, users, or business operations.
                </Typography>
              ),
            },
            {
              title: '6. Third-Party Services',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  Our website may contain links to third-party websites or use third-party tools such as analytics services, payment processors, or CRM tools. These third parties have their own privacy policies, and we are not responsible for their practices.
                </Typography>
              ),
            },
            {
              title: '7. Data Retention',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  We retain personal information only for as long as necessary to provide our services, maintain business records, and comply with legal obligations. Once the information is no longer required, it will be securely deleted.
                </Typography>
              ),
            },
            {
              title: '8. Your Privacy Rights',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  Depending on your jurisdiction, you may have the right to request access to your personal data, correction of inaccurate information, deletion of your data, or withdraw consent for data processing. To exercise these rights, please contact us.
                </Typography>
              ),
            },
            {
              title: '9. Changes to This Privacy Policy',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  We may update this Privacy Policy from time to time. Updates will be posted on this page. We encourage users to review this policy periodically.
                </Typography>
              ),
            },
            {
              title: '10. Contact Us',
              content: (
                <Typography sx={{ fontFamily: SANS, color: T.ink, lineHeight: 1.8, fontSize: '0.9375rem' }}>
                  If you have any questions about this Privacy Policy or how we handle your data, you may contact us at:
                  <br /><br />
                  <strong>Merraki Solutions</strong><br />
                  Email: info@merrakisolutions.com<br />
                  Website: www.merrakisolutions.com
                </Typography>
              ),
            },
          ].map((section, idx, arr) => (
            <Box key={idx} sx={{ mb: idx < arr.length - 1 ? 5 : 0 }}>
              {/* Section divider */}
              {idx > 0 && (
                <Box sx={{ height: '1px', background: T.border, mb: 5 }} />
              )}
              <Typography sx={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: { xs: '1rem', md: '1.0625rem' },
                color: T.ink,
                letterSpacing: '-0.02em',
                mb: 1.5,
              }}>
                {section.title}
              </Typography>
              {section.content}
            </Box>
          ))}

        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;