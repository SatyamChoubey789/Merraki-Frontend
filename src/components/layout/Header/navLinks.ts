export interface NavLink {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export const NAV_LINKS: NavLink[] = [
  {
    label: "Templates",
    href: "/templates",
    description: "Excel & financial templates",
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
  },
  { label: "Blog", href: "/blog", description: "Finance insights & guides" },
  { label: "About", href: "/about" },
];
