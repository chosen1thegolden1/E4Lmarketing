# Eat 4 Life Marketing Website

A modern, interactive website featuring a unique split-screen homepage that transforms based on user selection, showcasing both digital marketing education resources and done-for-you marketing services.

## Overview

Eat 4 Life Marketing (formerly Gold Standard Gaming) is a dual-purpose platform offering:
- **Learning Section**: Digital marketing courses, books, and resources
- **Services Section**: Full-service digital marketing and advertising agency

## Features

### Split-Screen Homepage
- Interactive 50/50 split design
- Smooth takeover animations on selection
- Mobile-responsive vertical stacking
- Accessibility-focused keyboard navigation

### Dual Theme System
- **Learning Theme**: Yellow (#FFC200) background with black accents
- **Services Theme**: Black background with yellow accents
- Seamless theme switching throughout the site
- Consistent branding across all sections

### Modern User Experience
- Smooth scroll animations
- Card-based content layout
- Responsive design (mobile-first approach)
- Touch-friendly interactive elements
- Loading screen with logo animation

### Accessibility
- WCAG AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly
- Focus indicators on all interactive elements
- Skip-to-content link

## Technology Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, Grid, and Flexbox
- **Vanilla JavaScript**: No dependencies, pure ES6+
- **Google Fonts**: Rethink Sans typography

## Brand Guidelines

### Colors
```css
Primary Yellow: #FFC200 (RGB: 255, 194, 0)
Black: #000000
White: #FFFFFF
```

### Typography
- **Primary Font**: Rethink Sans
  - ExtraBold (800): Main headings (75px)
  - Bold (700): Section headings (46px)
  - Medium (500): Subheadings (28px)
  - Regular (400): Body text (18px)
- **Accent Font**: Brush Script MT (Fineday fallback) for logo and decorative elements

### Logo Usage
- Full logo: "Eat For Life" in script font
- Logo mark: "EFL" with underline swooshes
- Maintain 3x exclusion zone around logos
- Never rotate, change colors, add effects, or alter proportions

## File Structure

```
E4Lmarketing/
├── index.html              # Main HTML file with all sections
├── css/
│   └── styles.css          # Complete styling and responsive design
├── js/
│   └── main.js             # All interactive functionality
├── assets/
│   ├── images/             # Image assets (to be added)
│   └── fonts/              # Custom fonts (to be added)
└── README.md               # This file
```

## Setup Instructions

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/chosen1thegolden1/E4Lmarketing.git
   cd E4Lmarketing
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server for best results:

   **Using Python:**
   ```bash
   python -m http.server 8000
   ```
   Then visit `http://localhost:8000`

   **Using Node.js (http-server):**
   ```bash
   npx http-server
   ```

   **Using VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click `index.html` and select "Open with Live Server"

### Adding Custom Fonts

To use the actual Fineday font (4 styles available):

1. Add font files to `assets/fonts/`
2. Update `css/styles.css` with font-face declarations:
   ```css
   @font-face {
       font-family: 'Fineday';
       src: url('../assets/fonts/Fineday-Regular.woff2') format('woff2');
       font-weight: 400;
       font-style: normal;
   }
   ```
3. Update the CSS variable:
   ```css
   --font-fineday: 'Fineday', 'Brush Script MT', cursive;
   ```

### Adding Images

1. Place images in `assets/images/`
2. Replace placeholder elements in HTML:
   - Book covers: `.book-placeholder`
   - Team photos: `.team-photo-placeholder`
   - Client logos: `.client-logo-placeholder`
   - About image: `.image-placeholder`

## Usage Guide

### Navigation Flow

1. **Initial Load**: Loading screen with EFL logo pulse animation
2. **Split Screen**: User chooses between Learning or Services
3. **Theme Selection**: Site transforms to selected theme
4. **Theme Toggle**: Switch between themes using header or footer button
5. **Smooth Scrolling**: All anchor links scroll smoothly to sections

### Customization

#### Changing Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-yellow: #FFC200;
    --primary-black: #000000;
    --primary-white: #FFFFFF;
}
```

#### Modifying Content
All content is in `index.html`:
- Learning section: Lines 93-210
- Services section: Lines 213-348
- About section: Lines 351-396
- Contact section: Lines 399-448

#### Adjusting Animations
Modify transition speeds in `css/styles.css`:
```css
:root {
    --transition-fast: 0.3s ease-in-out;
    --transition-medium: 0.6s ease-in-out;
    --transition-slow: 0.8s ease-in-out;
}
```

## Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Required Features
- CSS Grid
- CSS Flexbox
- CSS Custom Properties (Variables)
- IntersectionObserver API
- ES6 JavaScript

## Performance Optimization

- Minified CSS and JavaScript (production)
- Lazy loading for images
- Optimized animations with CSS transforms
- Reduced motion support for accessibility
- Efficient DOM manipulation

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader friendly
- High contrast mode support
- Skip-to-content link
- Touch-friendly (44px minimum touch targets)

## Form Handling

The contact form includes:
- Client-side validation
- Email format validation
- Required field checking
- Success/error messaging
- Form reset on successful submission

**Note**: Currently uses simulated submission. For production:
1. Add backend endpoint
2. Update form action in `js/main.js`
3. Implement server-side validation
4. Add spam protection (reCAPTCHA, etc.)

## SEO Considerations

### Current Implementation
- Semantic HTML structure
- Meta description tag
- Descriptive title tag
- Alt text placeholders for images

### Recommended Additions
- Open Graph meta tags for social sharing
- Twitter Card meta tags
- Structured data (Schema.org)
- XML sitemap
- robots.txt file
- Canonical URLs

## Deployment

### Static Hosting Options

**GitHub Pages**
```bash
# Push to main branch
git push origin main

# Enable in repository settings
```

**Netlify**
1. Connect GitHub repository
2. Deploy settings:
   - Build command: (none)
   - Publish directory: `/`

**Vercel**
```bash
npm i -g vercel
vercel
```

**AWS S3 + CloudFront**
1. Create S3 bucket
2. Enable static website hosting
3. Upload files
4. Configure CloudFront distribution

## Future Enhancements

### Planned Features
- [ ] Blog integration
- [ ] Course enrollment system
- [ ] Client portal
- [ ] Payment integration (Stripe/PayPal)
- [ ] Newsletter subscription
- [ ] Live chat support
- [ ] Video backgrounds
- [ ] Testimonials slider
- [ ] Portfolio gallery

### Technical Improvements
- [ ] Add actual Fineday font files
- [ ] Implement backend for forms
- [ ] Add analytics (Google Analytics/Mixpanel)
- [ ] Add CMS integration (Contentful, Sanity)
- [ ] Implement A/B testing
- [ ] Add PWA capabilities
- [ ] Optimize for Core Web Vitals

## Troubleshooting

### Split screen not working
- Check JavaScript console for errors
- Ensure JavaScript is enabled
- Clear browser cache

### Animations not smooth
- Check browser support for CSS transitions
- Verify GPU acceleration is enabled
- Test on different devices

### Mobile menu not appearing
- Verify screen width is below 768px
- Check z-index stacking
- Ensure JavaScript is loaded

### Form not submitting
- Open browser console for errors
- Check network tab for requests
- Verify form validation rules

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Copyright © 2024 Eat 4 Life Marketing. All rights reserved.

## Contact

For questions or support:
- Email: info@eat4lifemarketing.com
- Phone: (555) 123-4567
- Website: [Coming Soon]

## Acknowledgments

- Brand design and guidelines
- Rethink Sans font by Google Fonts
- Modern web design best practices
- Accessibility guidelines (WCAG 2.1)

---

**Built with ❤️ for Eat 4 Life Marketing**
