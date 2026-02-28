'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Rating,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Star as StarIcon,
  ShoppingCart as CartIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Variants, easeOut } from 'framer-motion';
import Image from 'next/image';
import { colorTokens, shadowTokens } from '@/theme';
import { useCart } from '@/lib/hooks/useCart';
import { useCurrency } from '@/lib/hooks/useCurrency';
import { TemplateDetailDrawer } from './TemplateDetailDrawer';
import type { Template } from '@/types/template.types';

interface TemplateCardProps {
  template: Template;
  index?: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.05,
      ease: easeOut,
    },
  }),
};
const FORMAT_COLORS: Record<string, { bg: string; text: string }> = {
  xlsx: { bg: colorTokens.success.light, text: colorTokens.success.dark },
  pdf: { bg: colorTokens.error.light, text: colorTokens.error.dark },
  pptx: { bg: colorTokens.warning.light, text: colorTokens.warning.dark },
  bundle: { bg: colorTokens.financeBlue[50], text: colorTokens.financeBlue[700] },
  csv: { bg: colorTokens.slate[100], text: colorTokens.slate[700] },
};

export function TemplateCard({ template, index = 0 }: TemplateCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, isInCart } = useCart();
  const { format } = useCurrency();
  const inCart = isInCart(template.id);
  const formatColors = FORMAT_COLORS[template.format] ?? FORMAT_COLORS.xlsx;

  return (
    <>
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Box
          sx={{
            borderRadius: '16px',
            border: `1px solid ${isHovered ? colorTokens.financeBlue[200] : colorTokens.slate[100]}`,
            overflow: 'hidden',
            backgroundColor: colorTokens.white,
            boxShadow: isHovered ? shadowTokens.xl : shadowTokens.md,
            transition: 'all 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Thumbnail */}
          <Box
            sx={{
              position: 'relative',
              height: 200,
              overflow: 'hidden',
              backgroundColor: colorTokens.financeBlue[50],
              cursor: 'pointer',
            }}
            onClick={() => setDetailOpen(true)}
          >
            {template.thumbnailUrl ? (
              <Image
                src={template.thumbnailUrl}
                alt={template.name}
                fill
                style={{
                  objectFit: 'cover',
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                  transition: 'transform 0.4s ease',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3.5rem',
                }}
              >
                📊
              </Box>
            )}

            {/* Badges */}
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                left: 12,
                display: 'flex',
                gap: 1,
              }}
            >
              {template.isBestseller && (
                <Box
                  sx={{
                    px: '8px',
                    py: '4px',
                    borderRadius: '6px',
                    background: `linear-gradient(135deg, #F59E0B, #D97706)`,
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  BESTSELLER
                </Box>
              )}
              {template.isFeatured && !template.isBestseller && (
                <Box
                  sx={{
                    px: '8px',
                    py: '4px',
                    borderRadius: '6px',
                    background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                  }}
                >
                  FEATURED
                </Box>
              )}
            </Box>

            {/* Discount */}
            {template.discountPercent && template.discountPercent > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  px: '8px',
                  py: '4px',
                  borderRadius: '6px',
                  backgroundColor: colorTokens.error.main,
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}
              >
                -{template.discountPercent}%
              </Box>
            )}

            {/* Hover overlay */}
            <motion.div
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(10,20,48,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                variant="contained"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => setDetailOpen(true)}
                sx={{
                  background: 'rgba(255,255,255,0.95)',
                  color: colorTokens.darkNavy[800],
                  fontWeight: 700,
                  borderRadius: '10px',
                  '&:hover': { background: '#fff' },
                  boxShadow: shadowTokens.lg,
                }}
              >
                Quick View
              </Button>
            </motion.div>
          </Box>

          {/* Content */}
          <Box
            sx={{
              p: 2.5,
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Category + Format */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              <Chip
                label={template.category.name}
                size="small"
                sx={{
                  backgroundColor: colorTokens.financeBlue[50],
                  color: colorTokens.financeBlue[700],
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  height: 24,
                  borderRadius: '6px',
                }}
              />
              <Chip
                label={template.format.toUpperCase()}
                size="small"
                sx={{
                  backgroundColor: formatColors.bg,
                  color: formatColors.text,
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 24,
                  borderRadius: '6px',
                }}
              />
            </Box>

            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: colorTokens.darkNavy[900],
                lineHeight: 1.35,
                mb: 1,
                cursor: 'pointer',
                '&:hover': { color: colorTokens.financeBlue[600] },
                transition: 'color 0.2s ease',
              }}
              onClick={() => setDetailOpen(true)}
            >
              {template.name}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.6,
                mb: 2,
                flex: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {template.shortDescription}
            </Typography>

            {/* Rating + Downloads */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 2,
              }}
            >
              <Rating
                value={template.rating}
                precision={0.5}
                size="small"
                readOnly
                sx={{
                  '& .MuiRating-iconFilled': {
                    color: '#F59E0B',
                  },
                  fontSize: '0.875rem',
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: colorTokens.slate[500], fontWeight: 500 }}
              >
                {template.rating.toFixed(1)} ({template.reviewCount})
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <DownloadIcon sx={{ fontSize: '0.8125rem', color: colorTokens.slate[400] }} />
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                  {template.downloadCount.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            {/* Price + CTA */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    color: colorTokens.financeBlue[600],
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {format(template.price, template.currency as 'INR')}
                </Typography>
                {template.originalPrice && template.originalPrice > template.price && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: colorTokens.slate[400],
                      textDecoration: 'line-through',
                      fontWeight: 500,
                    }}
                  >
                    {format(template.originalPrice, template.currency as 'INR')}
                  </Typography>
                )}
              </Box>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant={inCart ? 'outlined' : 'contained'}
                  size="small"
                  startIcon={<CartIcon sx={{ fontSize: '1rem !important' }} />}
                  onClick={() => !inCart && addItem(template)}
                  sx={{
                    borderRadius: '10px',
                    px: 2,
                    py: 1,
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    whiteSpace: 'nowrap',
                    ...(inCart
                      ? {
                          borderColor: colorTokens.success.main,
                          color: colorTokens.success.main,
                          '&:hover': {
                            borderColor: colorTokens.success.dark,
                            backgroundColor: colorTokens.success.light,
                          },
                        }
                      : {
                          background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                          color: '#fff',
                          boxShadow: '0 4px 12px rgba(26,86,219,0.25)',
                          '&:hover': {
                            boxShadow: '0 6px 16px rgba(26,86,219,0.35)',
                          },
                        }),
                  }}
                >
                  {inCart ? 'In Cart ✓' : 'Add to Cart'}
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </motion.div>

      <TemplateDetailDrawer
        slug={template.slug}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}