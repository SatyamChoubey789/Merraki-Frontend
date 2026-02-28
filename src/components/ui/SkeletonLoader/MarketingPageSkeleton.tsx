import { Box, Container, Grid, Skeleton } from "@mui/material";
import { colorTokens } from "@/theme";

export function MarketingPageSkeleton() {
  return (
    <Box>
      {/* Hero skeleton */}
      <Box
        sx={{
          height: "100vh",
          backgroundColor: colorTokens.darkNavy[900],
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, lg: 6 }}>
              <Skeleton
                variant="rounded"
                width={160}
                height={28}
                sx={{
                  mb: 3,
                  borderRadius: "999px",
                  backgroundColor: "rgba(255,255,255,0.08)",
                }}
              />
              <Skeleton
                variant="text"
                height={80}
                width="90%"
                sx={{ mb: 1, backgroundColor: "rgba(255,255,255,0.08)" }}
              />
              <Skeleton
                variant="text"
                height={80}
                width="75%"
                sx={{ mb: 3, backgroundColor: "rgba(255,255,255,0.08)" }}
              />
              <Skeleton
                variant="text"
                height={28}
                width="80%"
                sx={{ mb: 1, backgroundColor: "rgba(255,255,255,0.06)" }}
              />
              <Skeleton
                variant="text"
                height={28}
                width="65%"
                sx={{ mb: 4, backgroundColor: "rgba(255,255,255,0.06)" }}
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Skeleton
                  variant="rounded"
                  width={180}
                  height={52}
                  sx={{
                    borderRadius: "14px",
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                />
                <Skeleton
                  variant="rounded"
                  width={180}
                  height={52}
                  sx={{
                    borderRadius: "14px",
                    backgroundColor: "rgba(255,255,255,0.06)",
                  }}
                />
              </Box>
            </Grid>
            <Grid
              size={{ xs: 12, lg: 6 }}
              sx={{ display: { xs: "none", lg: "block" } }}
            >
              <Skeleton
                variant="rounded"
                height={420}
                sx={{
                  borderRadius: "24px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
