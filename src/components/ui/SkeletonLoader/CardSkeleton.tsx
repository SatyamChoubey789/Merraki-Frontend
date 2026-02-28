"use client";

import { Box, Skeleton } from "@mui/material";
import { borderRadiusTokens } from "@/theme";

interface CardSkeletonProps {
  count?: number;
  height?: number;
}

export function CardSkeleton({ count = 1, height = 380 }: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            borderRadius: borderRadiusTokens.lg,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "grey.100",
            p: 0,
          }}
        >
          <Skeleton
            variant="rectangular"
            height={200}
            sx={{ transform: "none", borderRadius: 0 }}
          />
          <Box sx={{ p: 3 }}>
            <Skeleton variant="text" height={28} width="60%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="90%" />
            <Skeleton variant="text" height={20} width="75%" sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
              <Skeleton variant="rounded" width={70} height={26} />
              <Skeleton variant="rounded" width={80} height={26} />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Skeleton variant="text" width={80} height={36} />
              <Skeleton variant="rounded" width={120} height={42} />
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}

export function BlogCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Box
          key={i}
          sx={{
            borderRadius: borderRadiusTokens.lg,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "grey.100",
          }}
        >
          <Skeleton
            variant="rectangular"
            height={220}
            sx={{ transform: "none", borderRadius: 0 }}
          />
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="text" width={80} height={24} />
            </Box>
            <Skeleton variant="text" height={32} width="85%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="100%" />
            <Skeleton variant="text" height={20} width="70%" sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton variant="text" width={100} height={20} />
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}

export function TemplateSkeleton() {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" width={90} height={36} />
        ))}
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        <CardSkeleton count={6} />
      </Box>
    </Box>
  );
}
