'use client';

import { Box, Container, Typography, Link } from '@mui/material';

/* ── THEME (MONOCHROME CLEAN) ── */
const T = {
  bg: "#F5F7FB",
  bgCard: "#FFFFFF",
  ink: "#253957",
  inkMuted: "rgba(37,57,87,0.6)",
  border: "rgba(37,57,87,0.08)",
  borderMid: "rgba(37,57,87,0.14)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

const listSx = {
  fontFamily: SANS,
  color: T.inkMuted,
  pl: 3,
  lineHeight: 2,
  fontSize: '0.9375rem',
  mb: 1.5,
};

const bodySx = {
  fontFamily: SANS,
  color: T.inkMuted,
  lineHeight: 1.8,
  fontSize: '0.9375rem',
  mb: 1.5,
};

const TermsOfService = () => {
  return (
    <Box sx={{
      background: T.bg,
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
            Terms of Service
          </Typography>
          <Typography sx={{
            fontFamily: SANS,
            fontWeight: 400,
            fontSize: '0.9375rem',
            color: T.inkMuted,
            lineHeight: 1.75,
            maxWidth: 480,
            mx: 'auto',
          }}>
            Please read these terms carefully before using our website or services.
          </Typography>
        </Box>

        {/* Content card */}
        <Box sx={{
          background: T.bgCard,
          border: `1px solid ${T.borderMid}`,
          borderRadius: '20px',
          p: { xs: '28px 24px', md: '48px 52px' },
        }}>

          {/* Intro */}
          <Typography sx={{ ...bodySx, mb: 6 }}>
            Welcome to <strong style={{ color: T.ink }}>Merraki Solutions</strong>. These Terms of Service ("Terms") govern your access to and use of our website, services, and any related content provided by Merraki Solutions. By accessing or using our website or services, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use our website or services.
          </Typography>

          {/* Sections */}
          {[
            {
              title: '1. About Merraki Solutions',
              content: (
                <>
                  <Typography sx={bodySx}>
                    Merraki Solutions provides professional financial services including but not limited to:
                  </Typography>
                  <Box component="ul" sx={listSx}>
                    <li>Financial modeling</li>
                    <li>Budgeting and forecasting</li>
                    <li>Financial analysis</li>
                    <li>Data analysis and visualization</li>
                    <li>Business plans</li>
                    <li>Pitch deck support</li>
                    <li>Accounting and financial consulting services</li>
                  </Box>
                  <Typography sx={bodySx}>
                    All services are provided on a professional consulting basis.
                  </Typography>
                </>
              ),
            },
            {
              title: '2. Use of the Website',
              content: (
                <>
                  <Typography sx={bodySx}>
                    You agree to use this website only for lawful purposes and in accordance with these Terms.
                  </Typography>
                  <Typography sx={{ ...bodySx, mb: 1 }}>You agree not to:</Typography>
                  <Box component="ul" sx={listSx}>
                    <li>Use the website for any illegal activity</li>
                    <li>Attempt to gain unauthorized access to the website or its systems</li>
                    <li>Disrupt or interfere with website functionality</li>
                    <li>Copy, reproduce, or distribute website content without permission</li>
                  </Box>
                  <Typography sx={bodySx}>
                    We reserve the right to restrict or terminate access to the website if these terms are violated.
                  </Typography>
                </>
              ),
            },
            {
              title: '3. Intellectual Property',
              content: (
                <>
                  <Typography sx={bodySx}>
                    All content on this website, including but not limited to text, graphics, logos, documents, designs, and website structure, is the intellectual property of Merraki Solutions unless otherwise stated.
                  </Typography>
                  <Typography sx={bodySx}>
                    You may not reproduce, distribute, modify, or commercially use any content without prior written permission.
                  </Typography>
                </>
              ),
            },
            {
              title: '4. Services and Engagement',
              content: (
                <>
                  <Typography sx={bodySx}>
                    Services offered by Merraki Solutions may require a separate written agreement or proposal. Important conditions:
                  </Typography>
                  <Box component="ul" sx={listSx}>
                    <li>Scope of work will be defined in individual agreements</li>
                    <li>Pricing and payment terms will be communicated before engagement</li>
                    <li>Timelines depend on client cooperation and availability of required information</li>
                  </Box>
                  <Typography sx={bodySx}>
                    Merraki Solutions reserves the right to decline or discontinue services at its discretion.
                  </Typography>
                </>
              ),
            },
            {
              title: '5. Client Responsibilities',
              content: (
                <>
                  <Typography sx={bodySx}>Clients agree to:</Typography>
                  <Box component="ul" sx={listSx}>
                    <li>Provide accurate and complete information required for services</li>
                    <li>Respond to information requests in a timely manner</li>
                    <li>Ensure they have the right to share any data or documents provided to us</li>
                  </Box>
                  <Typography sx={bodySx}>
                    Merraki Solutions is not responsible for errors arising from incorrect or incomplete information provided by the client.
                  </Typography>
                </>
              ),
            },
            {
              title: '6. Limitation of Liability',
              content: (
                <Typography sx={bodySx}>
                  The information and services provided by Merraki Solutions are intended for informational and professional advisory purposes only. While we strive to ensure accuracy and quality, we do not guarantee financial outcomes, business performance results, or investment outcomes. To the fullest extent permitted by law, Merraki Solutions shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or services.
                </Typography>
              ),
            },
            {
              title: '7. Confidentiality',
              content: (
                <Typography sx={bodySx}>
                  We respect the confidentiality of our clients and will take reasonable steps to protect sensitive business information shared with us. Confidentiality obligations may be governed more specifically by separate agreements when applicable.
                </Typography>
              ),
            },
            {
              title: '8. Third-Party Tools and Links',
              content: (
                <Typography sx={bodySx}>
                  Our website may contain links to third-party websites or tools for convenience. Merraki Solutions does not control or assume responsibility for the content, policies, or practices of third-party websites.
                </Typography>
              ),
            },
            {
              title: '9. Termination of Use',
              content: (
                <Typography sx={bodySx}>
                  We reserve the right to suspend or terminate access to our website or services at any time if users violate these Terms or engage in harmful or unlawful activities.
                </Typography>
              ),
            },
            {
              title: '10. Changes to the Terms',
              content: (
                <Typography sx={bodySx}>
                  We may update these Terms of Service from time to time. Updated versions will be posted on this page. Your continued use of the website after changes are posted constitutes acceptance of the updated Terms.
                </Typography>
              ),
            },
            {
              title: '11. Governing Law',
              content: (
                <Typography sx={bodySx}>
                  These Terms shall be governed and interpreted in accordance with the laws of India, without regard to conflict of law principles.
                </Typography>
              ),
            },
            {
              title: '12. Contact Information',
              content: (
                <Typography sx={bodySx}>
                  If you have any questions regarding these Terms of Service, you may contact us at:
                  <br /><br />
                  <strong style={{ color: T.ink }}>Merraki Solutions</strong><br />
                  Email:{' '}
                  <Link href="mailto:info@merrakisolutions.com" sx={{ color: T.ink, textDecorationColor: T.ink }}>
                    info@merrakisolutions.com
                  </Link><br />
                  Website:{' '}
                  <Link href="https://www.merrakisolutions.com" target="_blank" sx={{ color: T.ink, textDecorationColor: T.ink }}>
                    www.merrakisolutions.com
                  </Link>
                </Typography>
              ),
            },
          ].map((section, idx, arr) => (
            <Box key={idx} sx={{ mb: idx < arr.length - 1 ? 5 : 0 }}>
              {idx > 0 && <Box sx={{ height: '1px', background: T.border, mb: 5 }} />}
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

export default TermsOfService;