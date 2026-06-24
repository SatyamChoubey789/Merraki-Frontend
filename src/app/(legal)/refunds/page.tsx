'use client';

import { Box, Container, Typography, Link } from '@mui/material';

/* ── TOKENS — no blue, background #F5F7FB, text #253957 ── */
const T = {
  bg:        "#F5F7FB",
  bgSection: "#F5F7FB",
  ink:       "#253957",
  inkDark:   "#253957",
  inkMuted:  "#253957",
  border:    "rgba(37,57,87,0.08)",
  borderMid: "rgba(37,57,87,0.14)",
};

const SANS = '"DM Sans","Mona Sans",system-ui,sans-serif';

const bodySx = {
  fontFamily: SANS,
  color: T.ink,
  lineHeight: 1.8,
  fontSize: '0.9375rem',
  mb: 1.5,
};

const listSx = {
  fontFamily: SANS,
  color: T.ink,
  pl: 3,
  lineHeight: 2,
  fontSize: '0.9375rem',
  mb: 1.5,
};

const RefundPolicy = () => {
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
            Refund Policy
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
            Please read this policy carefully before purchasing any of our digital products.
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
          <Typography sx={{ ...bodySx, mb: 6 }}>
            At <strong style={{ color: T.ink }}>Merraki Solutions</strong>, we offer digital products including financial templates, models, spreadsheets, dashboards, and other downloadable resources. Due to the digital nature of these products, this Refund Policy outlines the conditions under which refunds may or may not be issued. By purchasing a product from our website, you agree to the terms described below.
          </Typography>

          {[ 
            {
              title: '1. Nature of Digital Products',
              content: (
                <>
                  <Typography sx={bodySx}>Our products include downloadable digital files such as:</Typography>
                  <Box component="ul" sx={listSx}>
                    <li>Financial modeling templates</li>
                    <li>Budgeting templates</li>
                    <li>Financial dashboards</li>
                    <li>Excel or spreadsheet tools</li>
                    <li>Business planning templates</li>
                    <li>Other financial resources</li>
                  </Box>
                  <Typography sx={bodySx}>Since these products are delivered instantly and cannot be returned, refunds are limited.</Typography>
                </>
              ),
            },
            {
              title: '2. No Refunds After Download',
              content: (
                <Typography sx={bodySx}>
                  Once a digital product has been downloaded, accessed, or delivered via email or download link, the purchase is considered final, and no refunds will be issued. This policy exists because digital products cannot be returned once delivered.
                </Typography>
              ),
            },
            {
              title: '3. Duplicate Purchases',
              content: (
                <>
                  <Typography sx={bodySx}>If you accidentally purchase the same template more than once, you may contact us within 48 hours of the purchase. In such cases, we may offer:</Typography>
                  <Box component="ul" sx={listSx}>
                    <li>A refund for the duplicate order</li>
                    <li>Store credit for another product</li>
                  </Box>
                  <Typography sx={bodySx}>This will be reviewed on a case-by-case basis.</Typography>
                </>
              ),
            },
            {
              title: '4. Technical Issues',
              content: (
                <>
                  <Typography sx={bodySx}>If you experience technical issues such as corrupted files, download problems, or file compatibility issues, please contact us and we will:</Typography>
                  <Box component="ul" sx={listSx}>
                    <li>Provide a new download link</li>
                    <li>Help resolve the issue</li>
                  </Box>
                  <Typography sx={bodySx}>Our goal is to ensure that you receive a working version of the product you purchased.</Typography>
                </>
              ),
            },
            {
              title: '5. Product Descriptions',
              content: (
                <Typography sx={bodySx}>
                  We aim to provide accurate descriptions, previews, and explanations of all templates before purchase. It is the customer's responsibility to review product features, file format, and software requirements (e.g., Microsoft Excel, Google Sheets compatibility) before completing the purchase. Refunds will not be issued due to misunderstanding of product features.
                </Typography>
              ),
            },
            {
              title: '6. Unauthorized Distribution',
              content: (
                <>
                  <Typography sx={bodySx}>All templates and digital products sold by Merraki Solutions are for personal or internal business use only. You may not:</Typography>
                  <Box component="ul" sx={listSx}>
                    <li>Resell the templates</li>
                    <li>Share them publicly</li>
                    <li>Redistribute them to third parties</li>
                    <li>Upload them to marketplaces or file-sharing platforms</li>
                  </Box>
                  <Typography sx={bodySx}>Unauthorized distribution may result in legal action.</Typography>
                </>
              ),
            },
            {
              title: '7. Changes to This Policy',
              content: (
                <Typography sx={bodySx}>
                  Merraki Solutions reserves the right to update or modify this Refund Policy at any time. Any changes will be posted on this page with the updated revision date.
                </Typography>
              ),
            },
            {
              title: '8. Contact Information',
              content: (
                <Typography sx={bodySx}>
                  If you have questions regarding a purchase or need technical support, please contact:
                  <br /><br />
                  <strong style={{ color: T.inkDark }}>Merraki Solutions</strong><br />
                  Email:{' '}
                  <Link href="mailto:info@merrakisolutions.com" sx={{ color: T.ink, textDecorationColor: T.ink }}>
                    info@merrakisolutions.com
                  </Link><br />
                  Website:{' '}
                  <Link href="https://www.merrakisolutions.com" target="_blank" sx={{ color: T.ink, textDecorationColor: T.ink }}>
                    www.merrakisolutions.com
                  </Link><br />
                  Please include your order details and purchase email when contacting us.
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

export default RefundPolicy;