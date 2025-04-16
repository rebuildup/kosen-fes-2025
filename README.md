# Cultural Festival 2025 Website

This is a modern, responsive website template for a cultural festival, built using React, TypeScript, and Vite. The website is designed to provide visitors with comprehensive information about the festival, including events, exhibits, schedule, and venue map.

## Features

- **Mobile-First Responsive Design**: Optimized for mobile devices with responsive layouts that adapt to all screen sizes
- **Modern UI Components**: Clean, intuitive interface with smooth animations and transitions
- **Interactive Festival Map**: SVG-based venue map with location highlights
- **Dynamic Event Schedule**: Interactive timetable with filtering by day
- **Art Exhibits Gallery**: Filterable gallery of festival exhibits
- **GSAP Animations**: Smooth scroll-triggered animations throughout the site

## Pages

### Home

- Festival banner with animated elements
- Featured events section
- Festival highlights with custom SVG icons
- Call-to-action section

### Events

- Comprehensive list of all festival events
- Filtering by category (performances, workshops, etc.)
- Event cards with details and times

### Exhibits

- Art exhibit gallery with filtering by category
- Artist information and exhibit descriptions
- Visual categorization with custom styling

### Timetable

- Interactive schedule organized by day
- Timeline visualization for easy navigation
- Color-coded event categories

### Map

- Interactive SVG map of the festival venue
- Location listing with descriptions
- Visual color coordination between map and listing

## Technical Stack

- **React 19**: Latest React features with improved performance
- **TypeScript**: Type-safe JavaScript for better development experience
- **Vite**: Fast, modern build tool and development server
- **React Router**: Client-side routing for single-page application
- **GSAP (GreenSock Animation Platform)**: Professional-grade animations
- **CSS Modules**: Scoped CSS styling for components

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/cultural-festival-2025.git
cd cultural-festival-2025
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Build for production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
cultural-festival-2025/
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, fonts, etc.
│   ├── components/        # Reusable UI components
│   ├── pages/             # Page components
│   ├── App.tsx            # Main App component
│   ├── App.css            # App-wide styles
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## Customization

### Styling

- Global styles are in `src/index.css`
- App-wide styles are in `src/App.css`
- Page-specific styles are in their respective CSS files in the `pages` directory

### Content

- Event data is stored in the respective page components
- To change content, modify the arrays in each page component

### Images

- Replace placeholder images in the `src/assets/images/` directory with your own

## Notes on Assets

For the sake of this template, we've used placeholders for images and referenced them in CSS files. In a real implementation, you would need to:

1. Create an `assets/images/` directory
2. Add appropriate images for events, exhibits, etc.
3. Make sure the image names match those referenced in the CSS files

## Browser Support

The website is optimized for modern browsers including:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is licensed under the MIT License.
