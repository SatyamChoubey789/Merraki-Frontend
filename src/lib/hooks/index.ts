// Query hooks
export {
  useTemplates,
  useFeaturedTemplates,
  usePopularTemplates,
  useTemplateSearch,
  useTemplate,
  TEMPLATE_KEYS,
} from "./useTemplates";
export { useCategories, CATEGORY_KEYS } from "./useCategories";
export {
  useBlogPosts,
  useBlogSearch,
  useBlogPost,
  useBlogCategories,
} from "./useBlogPosts";

// Feature hooks
export { useCheckout } from "./useCheckout";
export { useCart } from "./useCart";
export {
  useNewsletterSubscribe,
  useNewsletterUnsubscribe,
} from "./useNewsletter";
export { useContact } from "./useContact";

// Calculator hooks
export {
  useBreakevenCalculator,
  useRunwayCalculator,
  useProfitMarginCalculator,
  useValuationCalculator,
} from "./useCalculator";

// Utility hooks
export { usePagination } from "./usePagination";
export { useDebounce } from "./useDebounce";
export { useSearchFilter } from "./useSearchFilter";
export { useLocalStorage } from "./useLocalStorage";
export { useMediaQuery, useBreakpoint } from "./useMediaQuery";
export {
  useScrollProgress,
  useScrollY,
  useParallax,
} from "./useScrollProgress";
export { useInView } from "./useInView";
