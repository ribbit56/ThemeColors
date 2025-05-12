# Color Analyzer Web App

A web-based application for analyzing image colors, generating color themes, and creating dashboard previews.

## Features

- **Image Analysis**: Upload and analyze images to extract the most common colors
- **Color Picking**: Click on any part of an image to select specific colors
- **Theme Generation**: Automatically generate harmonious color themes based on selected colors
- **Typography Customization**: Select from Google Fonts and adjust font sizes and scale ratios
- **Dashboard Preview**: Visualize how your theme colors would look in a real dashboard
- **Export Options**: Export your theme as JSON or in Power BI compatible format
- **Dark Mode**: Toggle between light and dark themes

## Getting Started

1. Open `index.html` in a modern web browser
2. Upload an image using the file input
3. Click "Analyze Colors" to extract the most common colors
4. Select a color to use as the base for your theme
5. Customize individual theme colors as needed
6. Adjust typography settings to match your design
7. Export your theme in your preferred format

## Technical Details

### File Structure

- `index.html` - Main HTML file
- `css/styles.css` - Custom styling
- `js/app.js` - Main application logic
- `js/imageAnalyzer.js` - Image processing and color analysis
- `js/themeGenerator.js` - Color theme generation
- `js/fontManager.js` - Typography and Google Fonts management
- `js/dashboardPreview.js` - Dashboard visualization
- `js/darkMode.js` - Dark mode toggle functionality

### Dependencies

- Bootstrap 5.3.0 - UI framework
- Google Fonts API - Web font integration
- WebFont Loader - Font loading management

## Browser Compatibility

The application is compatible with modern browsers that support HTML5 Canvas and ES6 JavaScript:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the MIT License.
