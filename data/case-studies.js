// Real case-study copy for the project detail pages, keyed by project slug.
// Source: the portfolio items on mdayubmondol.com, rewritten for clarity.
// Only facts from that copy are used — nothing here is invented.
//
// Shape of each entry (every field optional except `overview`):
//   overview:    array of paragraphs
//   sections:    [{ title, paragraphs?: [], items?: [string | { label, text }] }]
//   details:     [{ label, value }]      → "Project details" card
//   highlights:  [string]                → "Design Highlights"
//   tools:       [string]                → "Tools Used"
//   projectType: string                  → "Project Type"
//   closing:     string                  → closing line
//   note:        string                  → small footnote
//
// Projects without an entry here (for example the Behance-only projects) show
// the Behance description when available, plus the "View on Behance" button.

const studyAbroadBanners = {
  overview: [
    'A social media banner design project created to promote study-abroad opportunities, presented as a complete set of banner designs.',
  ],
  sections: [
    {
      title: 'Banner formats',
      paragraphs: [
        'Banner work of this kind covers the main social and marketing placements:',
      ],
      items: [
        'Instagram banners',
        'Social media banners',
        'Facebook ads and Facebook covers',
        'LinkedIn banners',
        'Marketing banners',
      ],
    },
  ],
  projectType: 'Social media banner design',
};

export const caseStudies = {
  'allora-bd-mini-truck-branding-design-case-study': {
    overview: [
      'Allora BD wanted a stronger visual presence for its fleet. This project turned the company’s mini trucks into moving advertisements through one cohesive branding design that builds recognition wherever the vehicles travel.',
    ],
    sections: [
      {
        title: 'The concept',
        paragraphs: [
          'Mini trucks are small vehicles with a lot of visibility. The idea was to treat each one as a moving advertisement: carefully planned so it looks good and communicates the brand’s message at a glance.',
        ],
      },
      {
        title: 'Design and execution',
        paragraphs: [
          'The design combines vibrant colours, bold typography and clear graphics, chosen to stand out in busy urban environments and leave a lasting impression. During production, high-quality printing and precise application kept the design intact on the vehicles.',
        ],
      },
      {
        title: 'Outcome',
        paragraphs: [
          'The branded trucks have received positive feedback from customers and industry peers, and the project has helped raise Allora BD’s visibility and brand recognition.',
        ],
      },
    ],
    details: [{ label: 'Client', value: 'Allora BD' }],
    projectType: 'Mini truck branding',
  },

  'if-today-is-the-last-day-of-my-life-bangla-typography': {
    overview: [
      'A Bangla typography piece built around the line “If today is the last day of my life”, where the lettering itself carries the message.',
    ],
    projectType: 'Bangla typography',
  },

  'match-day-poster-design': {
    overview: [
      'A modern, high-impact football match-day poster designed for social media promotion and sports branding. It combines dynamic player compositions, dramatic lighting, stadium atmosphere, national pride and bold typography to capture the excitement of match day.',
      'The visual direction aims for an energetic, professional sports look suited to football clubs, fan pages, sports media platforms and tournament promotions. Strong contrast, cinematic effects and a considered use of team colours emphasise the intensity of the fixture while keeping the result clean and premium.',
    ],
    highlights: [
      'Professional sports poster layout',
      'Dynamic, player-focused composition',
      'Stadium and crowd atmosphere',
      'Dramatic lighting and visual effects',
      'Social media-ready format',
      'Modern typography hierarchy',
      'High-quality photo manipulation',
      'Premium sports branding aesthetic',
    ],
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    projectType: 'Sports graphic design · Football poster · Social media design · Match-day creative',
    closing: 'Designed to build excitement among football fans before kickoff through powerful visual storytelling.',
  },

  'movie-poster-design': {
    overview: [
      'A movie poster compresses a whole story into a single frame. This collection brings together a range of concepts, from action and thrillers to romance, each designed to capture the story, genre and mood of its film.',
    ],
    sections: [
      {
        title: 'The posters',
        items: [
          {
            label: 'Squid Game Season 2',
            text: 'A suspenseful, gritty continuation of the series, expressed through bold red tones and ominous imagery.',
          },
          {
            label: 'Crimson Chars',
            text: 'An explosive action poster that channels the chaos and intensity of its storyline.',
          },
          {
            label: 'He-Man Live Action Movie',
            text: 'A nostalgic yet powerful take on a legendary character, with epic visuals that promise a heroic adventure.',
          },
          {
            label: 'Shadowfall',
            text: 'A sleek, dramatic design that pulls viewers into a high-stakes espionage thriller.',
          },
          {
            label: 'Crimson Chase',
            text: 'An action-packed series poster with fierce protagonists and fiery backdrops.',
          },
          {
            label: 'When You Fall in Love',
            text: 'A tender, romantic visual that captures the sweetness and serenity of love.',
          },
          {
            label: 'Bullet Horizon',
            text: 'An adrenaline-fuelled design built around intense chases and dramatic visuals.',
          },
        ],
      },
      {
        title: 'Approach',
        paragraphs: [
          'Each poster uses dynamic composition, striking typography and a vivid colour palette to communicate the tone of the film.',
        ],
      },
    ],
    projectType: 'Movie poster design',
  },

  'social-media-design-for-education': {
    overview: [
      'A complete social media design case study for an educational content platform. The goal was to tackle a common e-learning challenge: turning dense learning material into vibrant, shareable content that lifts student engagement online.',
    ],
    sections: [
      {
        title: 'The challenge',
        paragraphs: [
          'The client needed more visibility and interaction on Instagram and Facebook. Their content was informative, but it did not stop people from scrolling, which led to low reach and engagement.',
        ],
      },
      {
        title: 'My role and process',
        paragraphs: [
          'I designed a new visual strategy and a set of versatile templates for the client’s social media channels.',
        ],
        items: [
          {
            label: 'Research',
            text: 'Analysed the target audience (students and lifelong learners) and the top-performing content in the education marketing niche.',
          },
          {
            label: 'Visual strategy',
            text: 'Developed a clean, modern and energetic visual identity, with a colour palette chosen to suggest creativity and trust, paired with bold, legible typography for mobile screens.',
          },
          {
            label: 'Content creation',
            text: 'Designed informational graphics including single posts, carousels and story templates. Each piece works as “micro-learning”: valuable and easy to digest on its own.',
          },
        ],
      },
      {
        title: 'The solution',
        paragraphs: [
          'The result is a cohesive, scalable system of e-learning visuals that breaks complex topics into clear, engaging graphics. A strong visual hierarchy highlights the key information and encourages likes, shares and comments, giving the client a practical tool for building a community around learning.',
        ],
      },
    ],
    projectType: 'Social media design · E-learning',
  },

  'study-abroad-social-media-post-design': studyAbroadBanners,
  'study-abroad': studyAbroadBanners,

  'success-of-global-marketplace-motion-graphic-dgen-academy': {
    overview: [
      'A motion graphic created for DGen Academy that traces the evolution and success of the global marketplace, from its early beginnings to its worldwide impact.',
    ],
    sections: [
      {
        title: 'The story',
        paragraphs: [
          'Through visuals, animation and narration, the piece covers key milestones, trends and innovations: the rise of e-commerce, the arrival of digital currencies, and the way technology, globalisation and consumer behaviour have changed how goods and services are bought and sold.',
        ],
      },
      {
        title: 'Who it is for',
        paragraphs: ['Entrepreneurs, business owners, students and professionals.'],
      },
    ],
    details: [
      { label: 'Client', value: 'DGen Academy' },
      { label: 'Duration', value: '13 seconds' },
      {
        label: 'Scope',
        value: 'Conceptualisation, scriptwriting, storyboarding, animation, voiceover, editing',
      },
      { label: 'Distribution', value: 'Online platforms, social media, presentations' },
    ],
    highlights: ['Engaging animation', 'Compelling narration', 'Strong visuals'],
    projectType: 'Motion graphic',
  },

  'typography-inspired-by-love-and-spring': {
    overview: [
      'Spring is a season of renewal, and also a season of love. This typography project brings the two together, using lettering to express the feeling of blossoms, warmth and romance.',
    ],
    sections: [
      {
        title: 'The concept',
        paragraphs: [
          'The work draws on “Vasanta”, the Sanskrit word for spring, and “Bhalobasha”, the Bengali word for love, weaving them into a single typographic story of love blooming in spring.',
        ],
      },
      {
        title: 'Visual language',
        paragraphs: [
          'Delicate floral motifs, vibrant colours reminiscent of blooming flowers and graceful curves that echo the sway of petals shape each letter. Every stroke is crafted to carry the joy and warmth of springtime romance.',
        ],
      },
      {
        title: 'Why typography',
        paragraphs: [
          'Fonts, sizes and arrangements do more than make text legible. They carry emotion, from a bold declaration of affection to a quiet whisper of longing.',
        ],
      },
    ],
    projectType: 'Typography',
    closing: 'Created in celebration of spring and Valentine’s Day.',
  },

  'dgen-academy-notepad-design': {
    overview: [
      'A notepad designed for DGen Academy that turns an everyday tool into a branded, tactile object: visually distinctive, and genuinely useful for note-taking.',
    ],
    sections: [
      {
        title: 'Design concept',
        paragraphs: [
          'The aim was to move beyond a traditional notepad and give it a visual identity that reflects the academy’s dynamic spirit, while keeping it a highly functional tool.',
        ],
      },
      {
        title: 'Colour palette',
        paragraphs: [
          'The academy’s brand colours are integrated into a cohesive scheme. Bold, energetic hues reflect the academy’s identity and add vibrancy to the note-taking experience.',
        ],
      },
      {
        title: 'Typography and layout',
        paragraphs: [
          'Clean sans-serif fonts keep the text readable, with subtle variations in weight adding polish. The layout leaves ample writing space without compromising the overall look.',
        ],
      },
      {
        title: 'Branding elements',
        paragraphs: [
          'The DGen Academy logo and brand elements are placed deliberately to keep the design consistent and to reinforce the academy’s identity with every page turned.',
        ],
      },
      {
        title: 'Function, materials and users',
        paragraphs: [
          'Practical additions include a section for goals and priorities, quick-reference pages and a durable cover. Premium-quality paper gives a smooth writing surface, with a subtle texture and a sturdy cover material for a tactile finish.',
          'The design is made for students, professionals and anyone who needs an organised note-taking tool.',
        ],
      },
    ],
    details: [{ label: 'Client', value: 'DGen Academy' }],
    projectType: 'Notepad and stationery design',
  },

  'education-social-media-post-design': {
    overview: [
      'Static social media ads designed for an education company, built to promote courses and events with strong visual impact and clear messaging.',
    ],
    sections: [
      {
        title: 'Why static ads',
        items: [
          {
            label: 'Visual impact',
            text: 'Courses, services and events are showcased in an appealing way that stays aligned with the brand identity.',
          },
          {
            label: 'Concise messaging',
            text: 'Limited space calls for focused copy that communicates the key benefits quickly and clearly.',
          },
          {
            label: 'Easy sharing',
            text: 'Static ads are simple to share across platforms, which helps followers spread the word.',
          },
        ],
      },
      {
        title: 'Process',
        items: [
          {
            label: 'Consultation',
            text: 'Understanding the company’s goals, target audience and brand identity.',
          },
          {
            label: 'Design concept',
            text: 'Creating initial concepts and presenting them for feedback.',
          },
          {
            label: 'Refinement',
            text: 'Refining the chosen concept based on that feedback.',
          },
          {
            label: 'Final delivery',
            text: 'Delivering the approved ads in the required format, ready to share on social media.',
          },
        ],
      },
    ],
    projectType: 'Static social media ads · Education',
  },

  'international-mother-language-day-banner-design': {
    overview: [
      'A banner for International Mother Language Day (21 February), created to celebrate linguistic diversity and the importance of preserving mother languages through visual storytelling.',
    ],
    sections: [
      {
        title: 'Research and concept',
        paragraphs: [
          'The design began with research into scripts, alphabets and calligraphy styles from languages around the world. The aim was to weave together a tapestry of linguistic diversity that resonates with people of many cultural backgrounds.',
        ],
      },
      {
        title: 'Central idea',
        paragraphs: [
          'A symbolic tree stands at the centre, its leaves carrying different scripts to show how languages are connected. Its roots reach into a globe, underlining the global significance of linguistic diversity.',
        ],
      },
      {
        title: 'Colour',
        paragraphs: [
          'A harmonious blend of vibrant hues symbolises the kaleidoscope of languages. Warm tones evoke cultural richness, while subtle gradients add depth and dimension.',
        ],
      },
      {
        title: 'Calligraphy and typography',
        paragraphs: [
          'Calligraphy from different scripts creates an interplay of words and symbols. Modern and traditional fonts are balanced to keep the text legible while respecting the cultural character of each script.',
        ],
      },
      {
        title: 'Outcome',
        paragraphs: [
          'A banner that celebrates linguistic heritage and promotes unity through design.',
        ],
      },
    ],
    projectType: 'Banner design · Cultural awareness',
  },

  'redbull-can-manipulation-post-design': {
    overview: [
      'A creative reinterpretation of the Red Bull can, pushing a familiar object into an art form that expresses energy, vitality and the brand’s adventurous spirit.',
    ],
    sections: [
      {
        title: 'Concept',
        paragraphs: [
          'The work started with a close study of Red Bull’s brand identity: energy, vitality and the thrill of pushing limits. The can’s bold logo, vibrant colours and iconic imagery were then integrated into a new composition.',
        ],
      },
      {
        title: 'Colour',
        paragraphs: [
          'The signature blue and silver stay central, keeping the design on brand while suggesting cool, crisp energy. Dynamic shapes and patterns convey the burst of energy associated with the drink.',
        ],
      },
      {
        title: 'Digital manipulation',
        paragraphs: [
          'The can’s structure became a canvas. Digital techniques add intricate detail and dynamic textures, turning its surface into a visual narrative of motion and vitality.',
        ],
      },
      {
        title: 'Brand cues and typography',
        paragraphs: [
          'Stylised wings, racing stripes and dynamic swirls reference adventure and extreme sports and create a sense of movement. Sharp, bold type echoes the strength of the identity and sits comfortably within the composition.',
        ],
      },
    ],
    projectType: 'Product visual · Digital manipulation',
    note: 'Red Bull is a trademark of its respective owner.',
  },

  'shopping-paper-bag-design': {
    overview: [
      'A shopping paper bag designed for DGen Academy as a tangible extension of the brand: a practical carryall that is also a memorable brand touchpoint.',
    ],
    sections: [
      {
        title: 'Objectives',
        items: [
          {
            label: 'Reflect the brand',
            text: 'Express DGen Academy’s values, mission and commitment to quality education.',
          },
          {
            label: 'Create visual impact',
            text: 'A striking, attractive bag that catches the eye and leaves a lasting impression.',
          },
          {
            label: 'Promote sustainability',
            text: 'A design that works with eco-friendly materials, in line with the academy’s environmental responsibility.',
          },
          {
            label: 'Enhance the user experience',
            text: 'A bag that is practical, functional and durable as well as good-looking.',
          },
        ],
      },
      {
        title: 'Design elements',
        items: [
          {
            label: 'Colour palette',
            text: 'Based on the brand colours for consistency across every touchpoint.',
          },
          {
            label: 'Logo placement',
            text: 'Positioned for maximum visibility and brand recall.',
          },
          {
            label: 'Typography',
            text: 'Chosen to reinforce the brand message and values.',
          },
          {
            label: 'Imagery',
            text: 'Used where it helps tell a visual story about the academy.',
          },
        ],
      },
    ],
    details: [
      { label: 'Client', value: 'DGen Academy' },
      { label: 'Timeline', value: 'Scheduled for completion within 4 hours' },
    ],
    projectType: 'Packaging design',
  },
};

export function getCaseStudy(slug) {
  return caseStudies[slug] || null;
}
