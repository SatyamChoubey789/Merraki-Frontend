'use client';

import {
  Box,
  Typography
} from '@mui/material';
import {
  Close as CloseIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTemplate } from '@/lib/hooks/useTemplates';
import { useCart } from '@/lib/hooks/useCart';
import { useCurrency } from '@/lib/hooks/useCurrency';

interface Props {
  slug: string;
  open: boolean;
  onClose: () => void;
}

export function TemplateDetailDrawer({
  slug,
  open,
  onClose,
}: Props) {
  const { data, isLoading } = useTemplate(slug);
  const { addItem, isInCart } = useCart();
  const { format } = useCurrency();

  const template = data?.data;
  const inCart = template
    ? isInCart(template.id)
    : false;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 1200,
            }}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              bottom: 0,
              width: '600px',
              background: '#fff',
              zIndex: 1300,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Typography fontWeight={600}>
                Template Preview
              </Typography>

              <CloseIcon
                sx={{ cursor: 'pointer' }}
                onClick={onClose}
              />
            </Box>

            {isLoading || !template ? (
              <Box p={4}>Loading...</Box>
            ) : (
              <Box p={4} flex={1} overflow="auto">
                <Typography variant="h5" mb={2}>
                  {template.title}
                </Typography>

                <Typography mb={2}>
                  {template.description}
                </Typography>

                <Box
                  display="flex"
                  gap={2}
                  alignItems="center"
                  mb={3}
                >
                  <Box display="flex" gap={0.5}>
                    {Array.from({ length: 5 }).map(
                      (_, i) => (
                        <StarIcon
                          key={i}
                          sx={{
                            fontSize: 16,
                            color:
                              i <
                              Math.round(template.rating)
                                ? '#C9A84C'
                                : '#E2DED5',
                          }}
                        />
                      )
                    )}
                  </Box>

                  <Typography fontSize={13}>
                    {template.rating.toFixed(1)} (
                    {template.rating_count})
                  </Typography>

                  <Box display="flex" gap={0.5}>
                    <DownloadIcon fontSize="small" />
                    <Typography fontSize={13}>
                      {template.downloads_count}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="h6" mb={3}>
                  {format(template.price_inr / 100, 'INR')}
                </Typography>

                <Box
                  component="button"
                  onClick={() => {
                    if (!inCart) {
                      addItem(template);
                      onClose();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: inCart
                      ? 'transparent'
                      : '#B8922A',
                    color: inCart ? '#5C7A5C' : '#fff',
                    border: inCart
                      ? '1px solid #5C7A5C'
                      : 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  <CartIcon
                    sx={{ mr: 1, fontSize: 18 }}
                  />
                  {inCart
                    ? '✓ Added to Cart'
                    : 'Add to Cart'}
                </Box>
              </Box>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}