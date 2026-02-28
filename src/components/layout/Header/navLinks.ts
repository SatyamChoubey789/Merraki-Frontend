export interface NavLink {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Templates",
    href: "/templates",
    description: "Excel & financial templates",
    badge: "New",
  },
  {
    label: "Calculators",
    href: "/calculators",
    description: "Free financial calculators",
  },
  {
    label: "Founder Test",
    href: "/founder-test",
    description: "Discover your financial personality",
    badge: "Free",
  },
  { label: "Blog", href: "/blog", description: "Finance insights & guides" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/book-consultation" },
];
