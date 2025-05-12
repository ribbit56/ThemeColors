# Color Analyzer Web App

A web-based application for analyzing image colors, generating color themes, and creating dashboard previews.

## Features

- **Image Analysis**: Upload and analyze images to extract the most common colors
- **Color Picking**: Click on any part of an image to select specific colors
- **Theme Generation**: Automatically generate harmonious color themes based on selected colors
- **Color Diversity Algorithm**: Ensures the top colors shown are sufficiently different from each other
- **Dashboard Preview**: Visualize how your theme colors would look in a real dashboard with KPI cards and charts
- **Export Options**: Export your theme as JSON or in Power BI compatible format
- **Dark Mode**: Toggle between light and dark themes

## Getting Started

1. Open `index.html` in a modern web browser
2. Upload an image using the file input
3. Click "Analyze Colors" to extract the most common colors
4. Select a color to use as the base for your theme
5. Customize individual theme colors as needed
6. View the dashboard preview to see how your colors work together
7. Export your theme in your preferred format

## Technical Details

### File Structure

- `index.html` - Main HTML file
- `css/styles.css` - Custom styling
- `js/app.js` - Main application logic
- `js/imageAnalyzer.js` - Image processing and color analysis
- `js/themeGenerator.js` - Color theme generation
- `js/fontManager.js` - Simplified font management
- `js/dashboardPreview.js` - Dashboard visualization with charts and KPI cards
- `js/darkMode.js` - Dark mode toggle functionality

### Dependencies

- Bootstrap 5.3.0 - UI framework

## Dashboard Preview

The dashboard preview provides a realistic visualization of how your theme colors would look in a real-world application:

- Three KPI cards showing metrics like Revenue, Users, and Conversion
- Bar chart displaying monthly revenue trends
- Line chart showing user growth over time
- Clean layout with proper spacing between elements

## Browser Compatibility

The application is compatible with modern browsers that support HTML5 Canvas and ES6 JavaScript:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.
