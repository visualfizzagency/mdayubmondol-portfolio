// Portfolio projects.
// Contract used by app/page.js: slug, title, category, year, featured.
// The homepage shows entries with `featured: true`, in this array order.

export const projects = [
  // ───────── Featured (homepage) ─────────
  {
    slug: 'match-day-poster-design',
    title: "Match Day Poster Design",
    category: 'Poster Design',
    year: 2025,
    featured: true,
  },
  {
    slug: 'creative-smartphone-advertisement-poster',
    title: "Creative Smartphone Advertisement Poster",
    category: 'Advertisement',
    year: 2025,
    featured: true,
  },
  {
    slug: 'fifa-world-cup-2026-match-fixtures',
    title: "FIFA World Cup 2026 Match Fixtures",
    category: 'Sports',
    year: 2026,
    featured: true,
  },
  {
    slug: 'helio-billboard-design',
    title: "Helio Billboard Design",
    category: 'Billboard',
    year: 2026,
    featured: true,
  },
  {
    slug: 'bangladesh-national-football-team-campaign',
    title: "Bangladesh National Football Team Campaign",
    category: 'Campaign',
    year: 2025,
    featured: true,
  },
  {
    slug: 'movie-poster-design',
    title: "Movie Poster Design",
    category: 'Poster Design',
    year: 2024,
    featured: true,
  },

  // ───────── More work ─────────
  {
    slug: 'creative-mobile-phone-advertisement-posters',
    title: "Creative Mobile Phone Advertisement Posters",
    category: 'Advertisement',
    year: 2025,
    featured: false,
  },
  {
    slug: 'bike-creative-social-media-post-ads-creative-banner',
    title: "Bike Creative Social Media post | Ads | Creative Banner",
    category: 'Social Media',
    year: 2024,
    featured: false,
  },
  {
    slug: 'mobile-phone-social-media-post-design',
    title: "Mobile Phone Social Media Post Design",
    category: 'Social Media',
    year: 2025,
    featured: false,
  },
  {
    slug: 'educational-reels-editing-portfolio-study-abroad',
    title: "Educational Reels Editing Portfolio | Study Abroad",
    category: 'Motion Graphics',
    year: 2025,
    featured: false,
  },
  {
    slug: 'global-horizons-study-abroad-branding-reel-series',
    title: "Global Horizons | Study Abroad Branding & Reel Series",
    category: 'Branding',
    year: 2025,
    featured: false,
  },
  {
    slug: 'womens-day-social-media-banner',
    title: "Women's Day Social Media Banner",
    category: 'Social Media',
    year: 2025,
    featured: false,
  },
  {
    slug: 'thirty-first-night-no-noise-pollution-typography',
    title: "আসছে থার্টি ফার্স্ট নাইটে – শব্দ দূষণ না করি Typography",
    category: 'Typography',
    year: 2024,
    featured: false,
  },
  {
    slug: 'australia-education-expo-2025-study-abroad',
    title: "Australia Education Expo 2025 | Study Abroad",
    category: 'Education',
    year: 2025,
    featured: false,
  },
  {
    slug: 'social-media-design-for-education',
    title: "Social Media Design for Education",
    category: 'Education',
    year: 2024,
    featured: false,
  },
  {
    slug: 'allora-bd-mini-truck-branding-design-case-study',
    title: "Allora BD's Mini Truck Branding Design Project: A Case Study",
    category: 'Branding',
    year: 2024,
    featured: false,
  },
  {
    slug: 'study-abroad-social-media-post-design',
    title: "Study Abroad Social Media Post Design",
    category: 'Education',
    year: 2024,
    featured: false,
  },
  {
    slug: 'if-today-is-the-last-day-of-my-life-bangla-typography',
    title: "If today is the last day of my life Bangla Typography",
    category: 'Typography',
    year: 2024,
    featured: false,
  },
  {
    slug: 'success-of-global-marketplace-motion-graphic-dgen-academy',
    title: "Success of Global Marketplace – Motion Graphic for DGen Academy",
    category: 'Motion Graphics',
    year: 2024,
    featured: false,
  },
  {
    slug: 'typography-inspired-by-love-and-spring',
    title: "Typography inspired by love and spring",
    category: 'Typography',
    year: 2024,
    featured: false,
  },
  {
    slug: 'dgen-academy-notepad-design',
    title: "DGen Academy Notepad Design",
    category: 'Branding',
    year: 2024,
    featured: false,
  },
  {
    slug: 'international-mother-language-day-banner-design',
    title: "International Mother Language Day Banner Design",
    category: 'Social Media',
    year: 2025,
    featured: false,
  },
  {
    slug: 'redbull-can-manipulation-post-design',
    title: "RedBull Can Manipulation Post Design",
    category: 'Advertisement',
    year: 2023,
    featured: false,
  },
  {
    slug: 'shopping-paper-bag-design',
    title: "Shopping Paper Bag Design",
    category: 'Branding',
    year: 2023,
    featured: false,
  },
  {
    slug: 'education-social-media-post-design',
    title: "Education Social Media Post Design",
    category: 'Education',
    year: 2024,
    featured: false,
  },
  {
    slug: 'game-leaderboard-ui-design',
    title: "Game Leaderboard UI Design",
    category: 'UI Design',
    year: 2023,
    featured: false,
  },
  {
    slug: 'study-abroad',
    title: "Study Abroad Social Media Post Design",
    category: 'Social Media',
    year: 2026,
    featured: false,
  },
];

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}
