"use client";

import { Box, Container, Typography, Button, Grid } from "@mui/material";
import { ArrowForward as ArrowIcon } from "@mui/icons-material";
import Link from "next/link";
import { colorTokens } from "@/theme";
import { SectionLabel, GradientText, CardSkeleton } from "@/components/ui";
import { useFeaturedTemplates } from "@/lib/hooks/useTemplates";
import { TemplateCard } from "@/components/sections/templates/TemplateCard";

export function FeaturedTemplates() {
  const { data, isLoading } = useFeaturedTemplates();
  const templates = data?.data?.slice(0, 3) ?? [];

  return (
    <Box sx={{ py: { xs: 8, md: 12 }, backgroundColor: colorTokens.white }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 5, md: 6 },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box>
            <SectionLabel text="Top Templates" color="blue" />
            <Typography
              variant="h2"
              sx={{ mt: 2, fontWeight: 800, color: colorTokens.darkNavy[900] }}
            >
              Built by Experts, <GradientText>Ready to Use</GradientText>
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/templates"
            variant="outlined"
            endIcon={<ArrowIcon />}
            sx={{
              borderRadius: "12px",
              fontWeight: 600,
              borderWidth: "1.5px",
              flexShrink: 0,
            }}
          >
            View All Templates
          </Button>
        </Box>

        <Grid container spacing={3}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                  <CardSkeleton height={380} />
                </Grid>
              ))
            : templates.map((template, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                  <TemplateCard template={template} index={i} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}
