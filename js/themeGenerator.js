/**
 * Theme Generator Class
 * Generates color themes based on a base color
 */
class ThemeGenerator {
    constructor() {
        this.baseColor = '#3498db';
        this.themeColors = [];
        this.harmonyType = 'complementary';
    }
    
    /**
     * Set the base color for theme generation
     * @param {string} hexColor - Hex color string
     */
    setBaseColor(hexColor) {
        this.baseColor = hexColor;
    }
    
    /**
     * Set the color harmony type
     * @param {string} type - Harmony type (complementary, analogous, triadic, etc.)
     */
    setHarmonyType(type) {
        this.harmonyType = type;
    }
    
    /**
     * Generate a theme based on the base color and selected harmony type
     * @returns {Array} - Array of theme color objects
     */
    generateTheme() {
        // Convert base color to HSV
        const rgb = this.hexToRgb(this.baseColor);
        const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
        
        // Generate theme colors
        const themeColors = [
            // Primary color (base color)
            {
                name: 'primary',
                hex: this.baseColor,
                role: 'Primary color for buttons, links, and highlights'
            }
        ];
        
        // Generate additional colors based on selected harmony type
        switch(this.harmonyType) {
            case 'complementary':
                // Secondary color (complementary - opposite on color wheel)
                themeColors.push({
                    name: 'secondary',
                    hex: this.hsvToHex((hsv.h + 0.5) % 1.0, hsv.s, hsv.v),
                    role: 'Secondary color for accents and contrasting elements'
                });
                
                // Accent color (30 degrees from complementary)
                themeColors.push({
                    name: 'accent',
                    hex: this.hsvToHex((hsv.h + 0.58) % 1.0, hsv.s, hsv.v),
                    role: 'Accent color for special elements and calls to action'
                });
                break;
                
            case 'analogous':
                // Secondary color (30 degrees from primary)
                themeColors.push({
                    name: 'secondary',
                    hex: this.hsvToHex((hsv.h + 0.08) % 1.0, hsv.s * 0.9, hsv.v),
                    role: 'Secondary color for accents and contrasting elements'
                });
                
                // Accent color (60 degrees from primary)
                themeColors.push({
                    name: 'accent',
                    hex: this.hsvToHex((hsv.h + 0.16) % 1.0, hsv.s * 0.8, hsv.v),
                    role: 'Accent color for special elements and calls to action'
                });
                break;
                
            case 'triadic':
                // Secondary color (120 degrees from primary)
                themeColors.push({
                    name: 'secondary',
                    hex: this.hsvToHex((hsv.h + 0.33) % 1.0, hsv.s, hsv.v),
                    role: 'Secondary color for accents and contrasting elements'
                });
                
                // Accent color (240 degrees from primary)
                themeColors.push({
                    name: 'accent',
                    hex: this.hsvToHex((hsv.h + 0.66) % 1.0, hsv.s, hsv.v),
                    role: 'Accent color for special elements and calls to action'
                });
                break;
                
            // Split-complementary case removed as it was too similar to Complementary
                
            case 'tetradic':
                // Secondary color (90 degrees from primary)
                themeColors.push({
                    name: 'secondary',
                    hex: this.hsvToHex((hsv.h + 0.25) % 1.0, hsv.s, hsv.v),
                    role: 'Secondary color for accents and contrasting elements'
                });
                
                // Accent color (180 degrees from primary)
                themeColors.push({
                    name: 'accent',
                    hex: this.hsvToHex((hsv.h + 0.5) % 1.0, hsv.s, hsv.v),
                    role: 'Accent color for special elements and calls to action'
                });
                
                // Fourth color (270 degrees from primary)
                themeColors.push({
                    name: 'accent2',
                    hex: this.hsvToHex((hsv.h + 0.75) % 1.0, hsv.s, hsv.v),
                    role: 'Additional accent color for complex designs'
                });
                break;
                
            case 'monochromatic':
                // Secondary color (same hue, lower saturation)
                themeColors.push({
                    name: 'secondary',
                    hex: this.hsvToHex(hsv.h, Math.max(0.1, hsv.s * 0.7), hsv.v),
                    role: 'Secondary color for accents and contrasting elements'
                });
                
                // Accent color (same hue, different brightness)
                themeColors.push({
                    name: 'accent',
                    hex: this.hsvToHex(hsv.h, hsv.s, Math.max(0.2, Math.min(0.9, hsv.v * 0.7))),
                    role: 'Accent color for special elements and calls to action'
                });
                break;
                
            default: // Default to complementary if unknown type
                // Secondary color (complementary)
                themeColors.push({
                    name: 'secondary',
                    hex: this.hsvToHex((hsv.h + 0.5) % 1.0, hsv.s, hsv.v),
                    role: 'Secondary color for accents and contrasting elements'
                });
                
                // Accent color (triadic harmony)
                themeColors.push({
                    name: 'accent',
                    hex: this.hsvToHex((hsv.h + 0.33) % 1.0, hsv.s, hsv.v),
                    role: 'Accent color for special elements and calls to action'
                });
                break;
        }
        
        // Add the remaining theme colors
        themeColors.push(
            // Background color (very light version of base)
            {
                name: 'background',
                hex: this.hsvToHex(hsv.h, Math.max(0, hsv.s - 0.7), Math.min(0.98, hsv.v + 0.3)),
                role: 'Main background color'
            },
            
            // Surface color (slightly darker than background)
            {
                name: 'surface',
                hex: this.hsvToHex(hsv.h, Math.max(0, hsv.s - 0.6), Math.min(0.95, hsv.v + 0.2)),
                role: 'Card and surface background color'
            },
            
            // Error color (reddish)
            {
                name: 'error',
                hex: '#e74c3c',
                role: 'Error messages and alerts'
            },
            
            // Warning color (yellowish)
            {
                name: 'warning',
                hex: '#f39c12',
                role: 'Warning messages and notifications'
            },
            
            // Success color (greenish)
            {
                name: 'success',
                hex: '#2ecc71',
                role: 'Success messages and confirmations'
            },
            
            // Text color (dark)
            {
                name: 'text',
                hex: '#333333',
                role: 'Primary text color'
            },
            
            // Text secondary color (lighter)
            {
                name: 'textSecondary',
                hex: '#666666',
                role: 'Secondary text color for less emphasis'
            }
        );
        
        // Store the theme colors
        this.themeColors = themeColors;
        
        return themeColors;
    }
    
    /**
     * Convert RGB values to HSV
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {Object} - HSV values (h: 0-1, s: 0-1, v: 0-1)
     */
    rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        let h, s, v;
        
        // Calculate value (brightness)
        v = max;
        
        // Calculate saturation
        s = max === 0 ? 0 : delta / max;
        
        // Calculate hue
        if (delta === 0) {
            h = 0; // No color, achromatic (gray)
        } else {
            if (max === r) {
                h = ((g - b) / delta) % 6;
            } else if (max === g) {
                h = (b - r) / delta + 2;
            } else { // max === b
                h = (r - g) / delta + 4;
            }
            
            h /= 6;
            
            // Ensure h is between 0 and 1
            if (h < 0) h += 1;
        }
        
        return { h, s, v };
    }
    
    /**
     * Convert HSV values to RGB
     * @param {number} h - Hue (0-1)
     * @param {number} s - Saturation (0-1)
     * @param {number} v - Value (0-1)
     * @returns {Object} - RGB values (0-255)
     */
    hsvToRgb(h, s, v) {
        let r, g, b;
        
        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        
        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
    
    /**
     * Convert HSV values to hex color string
     * @param {number} h - Hue (0-1)
     * @param {number} s - Saturation (0-1)
     * @param {number} v - Value (0-1)
     * @returns {string} - Hex color string
     */
    hsvToHex(h, s, v) {
        const rgb = this.hsvToRgb(h, s, v);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }
    
    /**
     * Convert RGB values to hex color string
     * @param {number} r - Red (0-255)
     * @param {number} g - Green (0-255)
     * @param {number} b - Blue (0-255)
     * @returns {string} - Hex color string
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    
    /**
     * Convert hex color string to RGB object
     * @param {string} hex - Hex color string
     * @returns {Object} - RGB values
     */
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex values
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return { r, g, b };
    }
    
    /**
     * Export theme colors to JSON format
     * @returns {string} - JSON string of theme colors
     */
    exportToJson() {
        const themeData = {
            name: 'Custom Theme',
            baseColor: this.baseColor,
            colors: this.themeColors.reduce((obj, color) => {
                obj[color.name] = color.hex;
                return obj;
            }, {})
        };
        
        return JSON.stringify(themeData, null, 2);
    }
    
    /**
     * Export theme colors to Power BI theme format
     * @returns {string} - JSON string in Power BI theme format
     */
    exportToPowerBI() {
        // Create a mapping of our theme colors to Power BI theme properties
        const colorMap = {
            primary: 'dataColors',
            secondary: 'dataColors',
            accent: 'dataColors',
            success: 'dataColors',
            warning: 'dataColors',
            error: 'dataColors',
            background: 'background',
            surface: 'tableAccent',
            text: 'foreground',
            textSecondary: 'secondaryForeground'
        };
        
        // Initialize Power BI theme object
        const powerBITheme = {
            name: 'Custom Theme',
            dataColors: [],
            background: '#ffffff',
            foreground: '#333333',
            tableAccent: '#f0f0f0',
            secondaryForeground: '#666666'
        };
        
        // Map our theme colors to Power BI theme properties
        this.themeColors.forEach(color => {
            if (colorMap[color.name] === 'dataColors') {
                powerBITheme.dataColors.push(color.hex);
            } else if (colorMap[color.name]) {
                powerBITheme[colorMap[color.name]] = color.hex;
            }
        });
        
        return JSON.stringify(powerBITheme, null, 2);
    }
}

// Export the class
window.ThemeGenerator = ThemeGenerator;
