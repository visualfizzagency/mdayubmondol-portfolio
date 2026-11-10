// Blog posts — newest first.
// Contract used by app/page.js: slug, title, date ('YYYY-MM-DD').
// Full article text loads from the Firestore seed.

const EXCERPT = 'Full article text loads from the Firestore seed.';

export const posts = [
  { slug: 'ai-prompt-for-veo', date: '2025-08-03', title: "AI prompt for Veo. Mountain Dew AI Video Made with Veo & Prompt Generator", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'prmopt-for-your-visuals', date: '2025-07-29', title: "Prmopt For your Visuals", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'veo-prompt-gallery-cinematic-ai-video-prompts-by-md-ayub-mondol', date: '2025-07-28', title: "Veo Prompt Gallery | Cinematic AI Video Prompts by Md Ayub Mondol", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'prompt-simplifier', date: '2025-07-28', title: "Prompt Simplifier", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'ai-powered-design-your-secret-weapon-for-faster-smarter-branding-in-2025', date: '2025-07-07', title: "AI-Powered Design: Your Secret Weapon for Faster, Smarter Branding in 2025", category: 'Branding', excerpt: EXCERPT },
  { slug: 'project-astra-google-ai', date: '2025-05-21', title: "Project Astra: Revolutionizing AI with Real-Time Intelligence and Vision", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'chatgpt-for-professionals', date: '2025-04-21', title: "10 Game-Changing ChatGPT Prompts to Instantly Level Up Your Productivity", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'free-ramadan-calendar-editable', date: '2025-02-25', title: "Download Free Ramadan Calendar Editable File in Bangla and English", category: 'Free Resources', excerpt: EXCERPT },
  { slug: 'free-psd-file-download', date: '2025-01-27', title: "Download Free PSD File with Stunning Visual Effects", category: 'Free Resources', excerpt: EXCERPT },
  { slug: 'free-bangla-font', date: '2025-01-08', title: "ফ্রি ডাউনলোড করুন ৭০০টি স্টাইলিশ বাংলা ফন্ট", category: 'Fonts & Typography', excerpt: EXCERPT },
  { slug: 'top-graphic-design-trends-for-2025', date: '2024-12-31', title: "Top Graphic Design Trends for 2025", category: 'Design Trends', excerpt: EXCERPT },
  { slug: 'graphic-design-trends', date: '2024-10-25', title: "Revolutionary Graphic Design Trends of 2025", category: 'Design Trends', excerpt: EXCERPT },
  { slug: 'are-you-interested-in-learning-graphic-design-your-ultimate-guide-to-getting-started', date: '2024-09-11', title: "Are You Interested in Learning Graphic Design? Your Ultimate Guide to Getting Started", category: 'Tutorials', excerpt: EXCERPT },
  { slug: 'protesters-promotional-banner-free-download', date: '2024-08-04', title: "Protesters Promotional Banner Free Download", category: 'Free Resources', excerpt: EXCERPT },
  { slug: 'boosting-your-slow-moving-business-with-the-right-branding-branding-importance', date: '2024-07-10', title: "Boosting Your Slow-Moving Business with the Right Branding | Branding Importance", category: 'Branding', excerpt: EXCERPT },
  { slug: 'icc-cricket-t20-world-cup-2024-logo-vector-free-download', date: '2024-06-04', title: "ICC Cricket T20 World Cup 2024 Logo Vector Free Download", category: 'Free Resources', excerpt: EXCERPT },
  { slug: 'top-500-stylish-bangla-fonts', date: '2024-05-28', title: "Top 500+ Stylish Bangla Fonts", category: 'Fonts & Typography', excerpt: EXCERPT },
  { slug: 'navigating-design-trends-in-2024-crafting-tomorrows-visual-landscape', date: '2024-05-21', title: "Navigating Design Trends in 2024: Crafting Tomorrow's Visual Landscape", category: 'Design Trends', excerpt: EXCERPT },
  { slug: 'creative-freelancers-how-to-make-brand-guidelines-that-impress', date: '2024-04-29', title: "Creative Freelancers: How to Make Brand Guidelines That Impress", category: 'Branding', excerpt: EXCERPT },
  { slug: 'ai-generated-images', date: '2024-03-29', title: "Professional AI-generated images and Enhancement Service with Midjourney, DALL-E", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'time-management-strategies', date: '2024-02-22', title: "Time Management Strategies to Boost Productivity for Graphic Designers", category: 'Career', excerpt: EXCERPT },
  { slug: 'graphic-design-for-daily-life-basic-to-advanced-course-free-course-by-md-ayub-mondol', date: '2024-02-18', title: "Graphic Design For Daily Life: Basic to Advanced Course | Free Course by Md Ayub Mondol", category: 'Tutorials', excerpt: EXCERPT },
  { slug: '10-graphic-design-careers-of-2024', date: '2024-02-15', title: "The Top 10 Graphic Design Careers of 2024", category: 'Career', excerpt: EXCERPT },
  { slug: 'whats-in-a-logo', date: '2024-02-07', title: "How to Make a Logo?", category: 'Branding', excerpt: EXCERPT },
  { slug: 'color-palette', date: '2024-02-04', title: "30 Vibrant Color Palette for Your Next Creative Design Project", category: 'Graphic Design', excerpt: EXCERPT },
  { slug: '10-hacks-to-design-killer-brand-guidelines-in-record-time', date: '2024-01-29', title: "10 Hacks to Design Killer Brand Guidelines in Record Time", category: 'Branding', excerpt: EXCERPT },
  { slug: 'creative-portfolio-hacks-what-you-need-to-include-to-showcase-your-best-work', date: '2024-01-24', title: "Creative Portfolio Hacks", category: 'Career', excerpt: EXCERPT },
  { slug: 'the-basics-of-brand-management-understanding-its-function-and-best-practices', date: '2024-01-21', title: "The Basics of Brand Management", category: 'Branding', excerpt: EXCERPT },
  { slug: '10-great-tips-to-design-like-a-professional', date: '2024-01-17', title: "10 Great Tips to Design Like a Professional", category: 'Graphic Design', excerpt: EXCERPT },
  { slug: 'understanding-typeface-selection-why-it-matters-in-design', date: '2024-01-16', title: "Understanding Typeface Selection", category: 'Fonts & Typography', excerpt: EXCERPT },
  { slug: 'how-to-icon-design-for-web-and-mobile', date: '2024-01-14', title: "How to Icon Design for Web and Mobile", category: 'Tutorials', excerpt: EXCERPT },
  { slug: 'unlocking-the-secrets-of-color-psychology-in-design', date: '2024-01-09', title: "Unlocking the Secrets of Color Psychology in Design", category: 'Graphic Design', excerpt: EXCERPT },
  { slug: '24-best-fonts-to-make-an-impact-in-2024', date: '2024-01-07', title: "24 Best Fonts to Make an Impact in 2024", category: 'Fonts & Typography', excerpt: EXCERPT },
  { slug: 'how-to-use-adobe-firefly-to-generate-ai-images', date: '2024-01-03', title: "How to Use Adobe Firefly to Generate AI Images", category: 'Tutorials', excerpt: EXCERPT },
  { slug: 'the-4-main-types-of-fonts-how-to-choose-the-right-font-for-your-brand-and-logo', date: '2023-12-29', title: "The 4 main types of fonts & how to choose the right font for your brand and logo", category: 'Fonts & Typography', excerpt: EXCERPT },
  { slug: '10-best-gif-creators-makeagif-adobe-photoshop-gifs-com-giphy-photodirector-365-canva-imgflip-kapwing-flixier-veed-io', date: '2023-12-27', title: "10 Best GIF Creators", category: 'Tutorials', excerpt: EXCERPT },
  { slug: 'best-30-ai-image-generation-prompts-with-examples', date: '2023-12-25', title: "Best 30 AI Image Generation Prompts with Examples", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'graphic_design_trends_2024', date: '2023-12-25', title: "গ্রাফিক ডিজাইন ট্রেন্ড ২০২৪", category: 'Design Trends', excerpt: EXCERPT },
  { slug: 'how-to-use-text-to-image-ai-imagine-type-create', date: '2023-12-21', title: "How to Use Text-to-Image AI: Imagine, Type, Create", category: 'AI & Prompts', excerpt: EXCERPT },
  { slug: 'principles-of-graphic-design', date: '2023-12-20', title: "Principles of Graphic Design", category: 'Graphic Design', excerpt: EXCERPT },
  { slug: 'graphic-design-trends-for-2024-from-interactive-design-to-the-grunge-resurgence', date: '2023-12-19', title: "Graphic Design Trends for 2024", category: 'Design Trends', excerpt: EXCERPT },
  { slug: 'how-to-build-a-personal-brand-in-6-steps', date: '2023-12-19', title: "How to Build a Personal Brand in 6 Steps", category: 'Branding', excerpt: EXCERPT },
  { slug: 'the-importance-of-a-well-designed-logo-for-your-business', date: '2023-12-18', title: "The Importance of a Well-Designed Logo for Your Business", category: 'Branding', excerpt: EXCERPT },
  { slug: 'how-to-effectively-brand-your-brand-identity-to-a-professional-graphic-designer', date: '2023-12-16', title: "How to Effectively Brand Your Brand Identity to a Professional Graphic Designer", category: 'Branding', excerpt: EXCERPT },
];

export function getPostBySlug(slug) {
  return posts.find((p) => p.slug === slug);
}
