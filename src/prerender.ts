// Prerender script for String Art Generator SEO optimization
// This generates static HTML content for search engines

// Tutorial content for prerendering (embedded for SEO)
const TUTORIAL_CONTENT = [
  {
    title: "Upload Your Image",
    description: "Choose a high-contrast photo for the best string art results",
    content: "Click or drag your image into the upload area. The best images for string art are high-contrast photos with clear subjects - portraits, silhouettes, and bold graphics work exceptionally well."
  },
  {
    title: "Choose a Style Preset", 
    description: "Select from our optimized presets or customize your own settings",
    content: "Pick from four carefully tuned presets designed for different effects: Fine Detail for precision work, Bold Impact for dramatic results, Soft Portrait for gentle rendering, or Professional for balanced quality."
  },
  {
    title: "Generate Your String Art",
    description: "Watch as the algorithm creates your mathematical masterpiece",
    content: "Click 'Generate String Art' to start the process. You'll see real-time progress as the algorithm calculates optimal string paths and draws lines progressively on the canvas."
  },
  {
    title: "View & Save Your Creation",
    description: "Admire your string art and save it for physical creation",
    content: "Once generation is complete, you'll see your finished string art along with detailed statistics. The result shows exactly how the physical piece would look with real string and pins."
  }
]

// FAQ content for prerendering (embedded for SEO)
const FAQ_CONTENT = [
  {
    question: "What is string art and how does this generator work?",
    answer: "String art is a traditional craft where thread is wound between pins to create images. Our generator uses computer algorithms to analyze your photo and calculate the optimal sequence of lines between pins that will recreate your image using just thread."
  },
  {
    question: "What types of images work best for string art?", 
    answer: "High contrast images with clear light and dark areas work best. Portraits, architectural photos, and images with defined shadows produce excellent results. Avoid very busy or low-contrast images as they may not translate well to the limited resolution of string art."
  },
  {
    question: "How many pins should I use?",
    answer: "For beginners, start with 144-216 pins for a good balance of detail and complexity. More pins (288-360) allow finer detail but require more precision. Fewer pins (36-120) create bold, minimalist designs that are easier to recreate physically."
  },
  {
    question: "Why is my result blank or very light?",
    answer: "This usually means your image has low contrast or the settings don't match your image type. Try increasing the line weight, adding more lines, or choosing an image with stronger contrast between light and dark areas."
  },
  {
    question: "How do I recreate this physically?",
    answer: "You'll need a circular frame, pins/nails, and thread. Mark pin positions evenly around your frame, then follow the generated line sequence, winding thread from pin to pin in order. The downloadable result shows the complete pattern."
  }
]

export async function prerender(data: { url: string }) {
  const { url } = data
  
  // Generate route-specific HTML content
  const generateHTML = () => {
    const baseHTML = `
      <div itemscope itemtype="https://schema.org/WebApplication">
        <header>
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="/#generator">Generator</a></li>
              <li><a href="/#gallery">Gallery</a></li>
              <li><a href="/#tutorial">Tutorial</a></li>
              <li><a href="/#faq">FAQ</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <section id="generator">
            <h1 itemprop="name">String Art Generator - Convert Photos to Mathematical String Art</h1>
            <p itemprop="description">Transform your photos into beautiful mathematical string art using advanced algorithms and customizable presets. Perfect for educators, artists, and DIY enthusiasts.</p>
            
            <div class="features">
              <h2>Features</h2>
              <ul>
                <li>Convert photo to string art using algorithmic optimization</li>
                <li>Mathematical string art with precise calculations</li>
                <li>Educational tool for art and mathematics intersection</li>
                <li>DIY string art patterns for physical creation</li>
                <li>Customizable pins, lines, and artistic presets</li>
                <li>Real-time generation with progress tracking</li>
              </ul>
            </div>
          </section>
          
          <section id="tutorial">
            <h2>How to Create String Art</h2>
            <p>Transform your photos into mathematical masterpieces with our step-by-step guide</p>
            ${TUTORIAL_CONTENT.map((step) => `
              <article class="tutorial-step">
                <h3>${step.title}</h3>
                <p class="description">${step.description}</p>
                <p class="content">${step.content}</p>
              </article>
            `).join('')}
          </section>
          
          <section id="faq">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about string art generation</p>
            ${FAQ_CONTENT.map((faq) => `
              <article class="faq-item" itemscope itemtype="https://schema.org/Question">
                <h3 itemprop="name">${faq.question}</h3>
                <div itemscope itemtype="https://schema.org/Answer" itemprop="acceptedAnswer">
                  <p itemprop="text">${faq.answer}</p>
                </div>
              </article>
            `).join('')}
          </section>
          
          <section id="gallery">
            <h2>String Art Gallery</h2>
            <p>Examples and inspiration from our string art generator</p>
            <div class="gallery-preview">
              <p>Explore stunning mathematical string art creations generated by our advanced algorithms. From portraits to abstract designs, see the intersection of mathematics and art.</p>
            </div>
          </section>
        </main>
      </div>
    `
    
    return baseHTML
  }
  
  // Route-specific configurations
  const routeConfig = {
    '/': {
      title: 'String Art Generator - Transform Photos into Mathematical String Art | Free Online Tool',
      description: 'Create stunning string art from your photos using our advanced algorithmic generator. Transform images into mathematical masterpieces with customizable pins, lines, and artistic presets. Perfect for educators, artists, and DIY enthusiasts.',
      keywords: 'string art generator, mathematical string art, convert photo to string art, algorithmic art, DIY string art, educational art tool'
    },
    '/#tutorial': {
      title: 'String Art Tutorial - Step by Step Guide | String Art Generator',
      description: 'Learn how to create mathematical string art with our comprehensive tutorial. Step-by-step instructions for transforming photos into beautiful string art patterns.',
      keywords: 'string art tutorial, how to make string art, string art guide, mathematical art tutorial'
    },
    '/#faq': {
      title: 'String Art Generator FAQ - Frequently Asked Questions',
      description: 'Find answers to common questions about string art generation, including tips for best images, pin configurations, and troubleshooting guidance.',
      keywords: 'string art FAQ, string art questions, string art help, string art troubleshooting'
    },
    '/#gallery': {
      title: 'String Art Gallery - Examples and Inspiration | String Art Generator',
      description: 'Explore stunning string art examples and gallery of mathematical art creations. Get inspired by algorithmic string art patterns and designs.',
      keywords: 'string art gallery, string art examples, mathematical art gallery, algorithmic art inspiration'
    },
    '/#generator': {
      title: 'String Art Generator Tool - Create Mathematical String Art Online',
      description: 'Use our advanced string art generator tool to convert your photos into mathematical string art patterns. Free online tool with customizable settings.',
      keywords: 'string art generator tool, online string art creator, photo to string art converter'
    }
  }
  
  const config = routeConfig[url as keyof typeof routeConfig] || routeConfig['/']
  
  return {
    html: generateHTML(),
    links: new Set(['/', '/#tutorial', '/#faq', '/#gallery', '/#generator']),
    head: {
      lang: 'en',
      title: config.title,
      elements: new Set([
        // SEO Meta Tags
        { type: 'meta', props: { name: 'description', content: config.description } },
        { type: 'meta', props: { name: 'keywords', content: config.keywords } },
        { type: 'meta', props: { property: 'og:title', content: config.title } },
        { type: 'meta', props: { property: 'og:description', content: config.description } },
        { type: 'meta', props: { property: 'og:type', content: 'website' } },
        { type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } },
        { type: 'meta', props: { name: 'twitter:title', content: config.title } },
        { type: 'meta', props: { name: 'twitter:description', content: config.description } },
        
        // Performance Resource Hints
        { type: 'link', props: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
        { type: 'link', props: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' } },
        { type: 'link', props: { rel: 'dns-prefetch', href: 'https://stringartgenerator.co' } },
        
        // Critical CSS (inline for above-the-fold content)
        { 
          type: 'style', 
          props: {},
          content: `
            /* Critical CSS for above-the-fold content */
            *,*::before,*::after{box-sizing:border-box;border-width:0;border-style:solid}
            html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif}
            body{margin:0;line-height:inherit}
            h1,h2,h3{margin:0;font-size:inherit;font-weight:inherit}
            p{margin:0}
            button{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}
            .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
            
            /* Hero section critical styles */
            #root{min-height:100vh;background:#ffffff}
            h1{font-size:2.25rem;font-weight:800;line-height:1.2;color:#1a1a1a;text-align:center;margin:2rem 0 1rem}
            .hero-description{font-size:1.125rem;line-height:1.6;color:#6b7280;text-align:center;max-width:48rem;margin:0 auto 2rem;padding:0 1rem}
            
            /* Navigation critical styles */
            nav{padding:1rem;background:#ffffff}
            nav ul{display:flex;list-style:none;margin:0;padding:0;justify-content:center;gap:2rem}
            nav a{text-decoration:none;color:#4f46e5;font-weight:500;padding:0.5rem 1rem;border-radius:0.375rem}
            nav a:hover{background:#f3f4f6}
            
            /* Loading states */
            .loading{animation:pulse 2s cubic-bezier(0.4,0,0.6,1) infinite}
            @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
          `
        },
        // Schema.org structured data for FAQ pages
        ...(url === '/#faq' ? [{
          type: 'script',
          props: { type: 'application/ld+json' },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_CONTENT.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer", 
                "text": faq.answer
              }
            }))
          })
        }] : []),
        // Schema.org structured data for tutorial pages
        ...(url === '/#tutorial' ? [{
          type: 'script',
          props: { type: 'application/ld+json' },
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Create String Art",
            "description": "Transform your photos into mathematical masterpieces with our step-by-step guide",
            "step": TUTORIAL_CONTENT.map((step, index) => ({
              "@type": "HowToStep",
              "position": index + 1,
              "name": step.title,
              "text": step.content
            }))
          })
        }] : [])
      ])
    }
  }
}