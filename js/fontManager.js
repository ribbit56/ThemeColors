/**
 * Simplified Font Manager Class
 * Provides minimal functionality needed for the app to work without typography UI
 */
class FontManager {
    constructor() {
        this.currentSettings = {
            headingFont: 'sans-serif',
            bodyFont: 'sans-serif',
            baseFontSize: 16,
            scaleRatio: 1.2
        };
    }
    
    /**
     * Get current font settings
     * @returns {Object} - Current font settings
     */
    getFontSettings() {
        return { ...this.currentSettings };
    }
    
    /**
     * Export typography settings to JSON
     * @returns {string} - JSON string of typography settings
     */
    exportToJson() {
        return JSON.stringify(this.currentSettings, null, 2);
    }
}

// Export the class
window.FontManager = FontManager;
