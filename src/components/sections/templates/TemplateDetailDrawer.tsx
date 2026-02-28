'use client';

import {
  Drawer,
  Box,
  Typography,
  Button,
  Chip,
  Rating,
  IconButton,
  Divider,
  Skeleton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  ShoppingCart as CartIcon,
  Download as DownloadIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { colorTokens, shadowTokens } from '@/theme';
import { useTemplate } from '@/lib/hooks/useTemplates';
import { useCart } from '@/lib/hooks/useCart';
import { useCurrency } from '@/lib/hooks/useCurrency';

interface TemplateDetailDrawerProps {
  slug: string;
  open: boolean;
  onClose: () => void;
}

export function TemplateDetailDrawer({ slug, open, onClose }: TemplateDetailDrawerProps) {
  const { data, isLoading, isError } = useTemplate(slug);
  const { addItem, isInCart } = useCart();
  const { format } = useCurrency();
  const template = data?.data;
  const inCart = template ? isInCart(template.id) : false;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 540, md: 600 },
          borderRadius: { sm: '20px 0 0 20px' },
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colorTokens.slate[100]}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: colorTokens.white,
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: colorTokens.slate[500], fontFamily: 'var(--font-display)' }}
        >
          Template Details
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ backgroundColor: colorTokens.slate[100], '&:hover': { backgroundColor: colorTokens.slate[200] } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Scrollable Content */}
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {isLoading ? (
          <Box sx={{ p: 3 }}>
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: '12px', mb: 3 }} />
            <Skeleton variant="text" height={40} width="80%" sx={{ mb: 1 }} />
            <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
            <Skeleton variant="text" height={20} width="100%" />
            <Skeleton variant="text" height={20} width="90%" />
            <Skeleton variant="text" height={20} width="95%" />
          </Box>
        ) : isError || !template ? (
          <Box sx={{ p: 3, textAlign: 'center', py: 8 }}>
            <Typography color="error">Failed to load template details.</Typography>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Preview Image */}
            <Box
              sx={{
                position: 'relative',
                height: 280,
                backgroundColor: colorTokens.financeBlue[50],
              }}
            >
              {template.thumbnailUrl && (
                <Image
                  src={template.thumbnailUrl}
                  alt={template.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              )}
              {template.discountPercent && template.discountPercent > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    px: '10px',
                    py: '5px',
                    borderRadius: '8px',
                    backgroundColor: colorTokens.error.main,
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  -{template.discountPercent}% OFF
                </Box>
              )}
            </Box>

            <Box sx={{ p: 3 }}>
              {/* Badges */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={template.category.name} size="small" color="primary" sx={{ borderRadius: '8px', fontWeight: 600 }} />
                <Chip label={template.format.toUpperCase()} size="small" sx={{ borderRadius: '8px', fontWeight: 700, backgroundColor: colorTokens.success.light, color: colorTokens.success.dark }} />
                <Chip label={template.difficulty} size="small" sx={{ borderRadius: '8px', fontWeight: 500, textTransform: 'capitalize' }} />
              </Box>

              {/* Title */}
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5, color: colorTokens.darkNavy[900] }}>
                {template.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Rating value={template.rating} precision={0.5} size="small" readOnly sx={{ '& .MuiRating-iconFilled': { color: '#F59E0B' } }} />
                <Typography variant="body2" sx={{ color: colorTokens.slate[600], fontWeight: 500 }}>
                  {template.rating.toFixed(1)} · {template.reviewCount} reviews · {template.downloadCount.toLocaleString()} downloads
                </Typography>
              </Box>

              {/* Description */}
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3 }}>
                {template.longDescription}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Features */}
              {template.features.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: colorTokens.darkNavy[800] }}>
                    What&apos;s Included
                  </Typography>
                  <List disablePadding dense>
                    {template.features.map((feature, i) => (
                      <ListItem key={i} disablePadding sx={{ mb: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckIcon sx={{ fontSize: '1rem', color: colorTokens.success.main }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{ variant: 'body2', fontWeight: 500, color: colorTokens.slate[700] }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              {/* Tags */}
              {template.tags.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {template.tags.map((tag) => (
                    <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ borderRadius: '6px', fontSize: '0.75rem', color: colorTokens.slate[500] }} />
                  ))}
                </Box>
              )}
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Sticky Footer CTA */}
      {template && (
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${colorTokens.slate[100]}`,
            backgroundColor: colorTokens.white,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: colorTokens.financeBlue[600], letterSpacing: '-0.02em', lineHeight: 1 }}>
              {format(template.price, template.currency as 'INR')}
            </Typography>
            {template.originalPrice && template.originalPrice > template.price && (
              <Typography variant="caption" sx={{ color: colorTokens.slate[400], textDecoration: 'line-through' }}>
                {format(template.originalPrice, template.currency as 'INR')}
              </Typography>
            )}
          </Box>
          <motion.div style={{ flex: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={inCart ? 'outlined' : 'contained'}
              fullWidth
              size="large"
              startIcon={<CartIcon />}
              onClick={() => { if (!inCart) { addItem(template); onClose(); } }}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                fontWeight: 700,
                ...(inCart ? { borderColor: colorTokens.success.main, color: colorTokens.success.main } : {
                  background: `linear-gradient(135deg, ${colorTokens.financeBlue[500]}, ${colorTokens.financeBlue[700]})`,
                  color: '#fff',
                  boxShadow: '0 4px 16px rgba(26,86,219,0.3)',
                }),
              }}
            >
              {inCart ? '✓ Added to Cart' : 'Add to Cart'}
            </Button>
          </motion.div>
        </Box>
      )}
    </Drawer>
  );
}