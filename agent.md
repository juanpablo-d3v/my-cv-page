# Landing CV Page - Plain JavaScript

A modern, responsive landing page template using vanilla HTML, CSS, and JavaScript.

## Project Architecture
- Use plain Vanilla JS without need bundlers
- Apply object oriented programming as possible
- Use ES modules
- Implements ARIA and accesibility support

## File Structure

```
web-cv/
├── index.html           # bootstrap
├── styles/
│   └── style.css       # global styles
|── scripts/
│   ├── main.js          # Main (import modules)
    │   ├── /components  # Reusable components (UI)
    │   ├── /services    # APIs/Bussiness logic call
    │   └── /utils       # Helpers
|── images
│    ├── /logos
│    └── /icons
```

## Code rules
- HTML5 with semantinc tags
- CSS3
- Use vanilla javascript
- Avoid user features, tags or modules without at least 90% of browser support

## Performance
- Use async/awit for services
- Lazy load for html media elements
- Improve video and images load

## General
- Answer every chat request with "[JP-DEV]"

## Planning

### What is your website about?
Present my personal CV and experience in a web site format focused on provide the information for save time in the hiring process when looking for a job.

### What information are you presenting on the subject?
JuanPablo Dev

Web developer with 12+ years of experience, focused in front-end technologies to develop web solutions. Contributed in multiple enterprise projects and took in knowledge of very talented people.

### What's the background color? 
Paper White (#F9FBF9)

### What kind of font is appropriate?
formal

### Sketching out your design
Use the next image:
![CV Web Sketching](./images/cv-web-sketching.jpg)

### Choosing a theme color
Follow Material Design baselines colors M3 specification and roles

/* Primary - High emphasis */
  --md-sys-color-primary: #D0E4FF;
  --md-sys-color-on-primary: #003258;
  --md-sys-color-primary-container: #00497D;
  --md-sys-color-on-primary-container: #D1E4FF;

  /* Secondary - Less prominent */
  --md-sys-color-secondary: #BBC7DB;
  --md-sys-color-on-secondary: #253140;
  --md-sys-color-secondary-container: #3B4858;
  --md-sys-color-on-secondary-container: #D7E3F7;

  /* Tertiary - Contrast accents */
  --md-sys-color-tertiary: #D6BEE4;
  --md-sys-color-on-tertiary: #3B2948;
  --md-sys-color-tertiary-container: #523F5F;
  --md-sys-color-on-tertiary-container: #F2DAFF;

  /* Neutral/Surface */
  --md-sys-color-surface: #1A1C1E;
  --md-sys-color-on-surface: #E2E2E6;
  --md-sys-color-surface-variant: #43474E;
  --md-sys-color-on-surface-variant: #C3C7CF;
  --md-sys-color-outline: #8D9199;

  /* Error */
  --md-sys-color-error: #FFB4AB;
  --md-sys-color-on-error: #690005;

### Choosing an image
![Logo](./images/logos/logoJP.png)

### Choosing a font
Merriweather Sans

## Design definitions
The theme color is based on Material Design suggestion. Consider next tips:

- Contrast: Ensure your text (On Surface) is either white (#FFFFFF) or a very light grey (#E3E2E6) to meet accessibility standards.

- Elevation: In Material 3, "Elevation" is shown by making the Surface Variant slightly lighter than the Surface. This creates a visual hierarchy for your "Work Experience" cards.

- Accent Usage: Use your Primary color sparingly—around 10% of the page—to draw the eye to your Call to Action (like a "Download PDF" button).

- Apply responsive design in all layout and sections according to Material Design suggestion