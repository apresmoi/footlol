const SITE_NAME = 'Footlol';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://footlol.com').replace(/\/+$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/index.png`;
const DEFAULT_DESCRIPTION =
  'Footlol is a real-time multiplayer football arena game where champion-inspired abilities and team play decide every match.';
const DEFAULT_KEYWORDS =
  'football game, multiplayer game, browser game, champion abilities, online football, arena game, team game, free to play, real-time multiplayer, esports';

const ROUTE_META = {
  '/': {
    title: 'Footlol | Multiplayer Football Arena with Champion Abilities',
    description:
      'Play Footlol in your browser: join rooms, pick a team, and win matches with champion-style skills and tight teamwork.',
    keywords:
      'play footlol, browser football, multiplayer arena, champion skills, team play, online match, free browser game',
    robots: 'index,follow',
  },
  '/room-select': {
    title: 'Room Select | Footlol',
    description:
      'Browse active Footlol rooms, squad up quickly, and jump into a fast multiplayer football battle.',
    robots: 'noindex,nofollow',
  },
  '/room-create': {
    title: 'Create a Room | Footlol',
    description:
      'Create a custom Footlol match room and invite players for a champion-powered football showdown.',
    robots: 'noindex,nofollow',
  },
  '/game': {
    title: 'Live Match | Footlol',
    description:
      'Compete in a live Footlol match where positioning, ability timing, and team play determine the winner.',
    robots: 'noindex,nofollow',
  },
};

const setMetaTag = (attr, key, content) => {
  if (!content) return;

  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const setCanonical = (url) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
};

export const applySeo = (pathname) => {
  if (typeof document === 'undefined') return;

  const metadata = ROUTE_META[pathname] || {
    title: 'Footlol',
    description: DEFAULT_DESCRIPTION,
    robots: 'index,follow',
  };
  const canonicalPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  document.title = metadata.title;

  // Standard meta
  setMetaTag('name', 'description', metadata.description);
  setMetaTag('name', 'keywords', metadata.keywords || DEFAULT_KEYWORDS);
  setMetaTag('name', 'robots', metadata.robots || 'index,follow');

  // Open Graph
  setMetaTag('property', 'og:title', metadata.title);
  setMetaTag('property', 'og:description', metadata.description);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('property', 'og:url', canonicalUrl);
  setMetaTag('property', 'og:image', DEFAULT_IMAGE);
  setMetaTag('property', 'og:image:width', '512');
  setMetaTag('property', 'og:image:height', '512');
  setMetaTag('property', 'og:image:alt', `${SITE_NAME} — Multiplayer Football Arena`);
  setMetaTag('property', 'og:site_name', SITE_NAME);
  setMetaTag('property', 'og:locale', 'en_US');

  // Twitter Card
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', metadata.title);
  setMetaTag('name', 'twitter:description', metadata.description);
  setMetaTag('name', 'twitter:image', DEFAULT_IMAGE);
  setMetaTag('name', 'twitter:image:alt', `${SITE_NAME} — Multiplayer Football Arena`);

  setCanonical(canonicalUrl);
};
