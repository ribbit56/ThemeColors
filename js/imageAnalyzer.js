/**
 * Image Analyzer Class
 * Handles image loading and color analysis
 */
class ImageAnalyzer {
    constructor() {
        this.image = null;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }
    
    /**
     * Load an image from a File object
     * @param {File} file - The image file to load
     * @returns {Promise} - Resolves when the image is loaded
     */
    loadImage(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.match('image.*')) {
                reject(new Error('Selected file is not an image.'));
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                // Set crossOrigin to anonymous to avoid CORS issues
                img.crossOrigin = 'anonymous';
                
                img.onload = () => {
                    // Store the image in the class instance
                    this.image = img;
                    resolve(img);
                };
                
                img.onerror = () => {
                    reject(new Error('Failed to load image.'));
                };
                
                img.src = e.target.result;
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file.'));
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    /**
     * Get the color at a specific pixel in the image
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Object} - RGB and hex color values
     */
    getPixelColor(x, y) {
        if (!this.image) {
            throw new Error('No image loaded');
        }
        
        // Draw the image on the canvas at original size
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        this.ctx.drawImage(this.image, 0, 0);
        
        // Get the pixel data
        const pixelData = this.ctx.getImageData(x, y, 1, 1).data;
        
        // Convert to RGB and hex
        const rgb = {
            r: pixelData[0],
            g: pixelData[1],
            b: pixelData[2]
        };
        
        const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
        
        return {
            rgb: rgb,
            hex: hex
        };
    }
    
    /**
     * Analyze the image to find the most common colors
     * @param {number} numColors - Number of colors to return
     * @returns {Array} - Array of color objects with count and percentage
     */
    analyzeImage(numColors = 10) {
        if (!this.image) {
            throw new Error('No image loaded');
        }

        // Resize image for analysis (100x100 is enough for color analysis)
        const analysisWidth = 100;
        const analysisHeight = 100;
        
        this.canvas.width = analysisWidth;
        this.canvas.height = analysisHeight;
        
        // Draw the image on the canvas
        this.ctx.drawImage(this.image, 0, 0, analysisWidth, analysisHeight);
        
        // Get the pixel data
        const imageData = this.ctx.getImageData(0, 0, analysisWidth, analysisHeight);
        const pixels = imageData.data;
        
        // Count colors (using hex values as keys)
        const colorCounts = {};
        const totalPixels = analysisWidth * analysisHeight;
        
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];
            
            // Skip transparent pixels
            if (a < 128) continue;
            
            // Simplify colors to reduce the number of unique colors
            // This groups similar colors together
            const simplifiedR = Math.round(r / 10) * 10;
            const simplifiedG = Math.round(g / 10) * 10;
            const simplifiedB = Math.round(b / 10) * 10;
            
            const hex = this.rgbToHex(simplifiedR, simplifiedG, simplifiedB);
            
            if (colorCounts[hex]) {
                colorCounts[hex]++;
            } else {
                colorCounts[hex] = 1;
            }
        }
        
        // Convert to array and sort by count
        let colorArray = Object.keys(colorCounts).map(hex => {
            return {
                hex: hex,
                count: colorCounts[hex],
                percentage: (colorCounts[hex] / totalPixels * 100).toFixed(1)
            };
        });
        
        // Sort by count (descending)
        colorArray.sort((a, b) => b.count - a.count);
        
        // Filter to ensure diversity among top colors
        const diverseColors = this.filterSimilarColors(colorArray, numColors);
        
        return diverseColors;
    }
    
    /**
     * Filter similar colors to ensure diversity
     * @param {Array} colors - Array of color objects sorted by frequency
     * @param {number} maxColors - Maximum number of colors to return
     * @param {number} minDistance - Minimum Euclidean distance between colors (0-441.67)
     * @returns {Array} - Array of diverse color objects
     */
    filterSimilarColors(colors, maxColors = 10, minDistance = 50) {
        if (!colors || colors.length <= 1) {
            return colors;
        }
        
        const diverseColors = [];
        
        // Always include the most common color
        diverseColors.push(colors[0]);
        
        // Check each color against already selected colors
        for (let i = 1; i < colors.length && diverseColors.length < maxColors; i++) {
            const currentColor = this.hexToRgb(colors[i].hex);
            let isDiverse = true;
            
            // Compare with already selected colors
            for (let j = 0; j < diverseColors.length; j++) {
                const selectedColor = this.hexToRgb(diverseColors[j].hex);
                
                // Calculate Euclidean distance in RGB space
                const distance = Math.sqrt(
                    Math.pow(currentColor.r - selectedColor.r, 2) +
                    Math.pow(currentColor.g - selectedColor.g, 2) +
                    Math.pow(currentColor.b - selectedColor.b, 2)
                );
                
                // If too similar to any selected color, skip it
                if (distance < minDistance) {
                    isDiverse = false;
                    break;
                }
            }
            
            // If diverse enough, add to the result
            if (isDiverse) {
                diverseColors.push(colors[i]);
            }
        }
        
        // If we don't have enough diverse colors, add more from the original list
        // with gradually decreasing distance threshold
        let currentThreshold = minDistance;
        while (diverseColors.length < maxColors && diverseColors.length < colors.length && currentThreshold > 10) {
            currentThreshold *= 0.7; // Reduce threshold by 30%
            
            for (let i = 1; i < colors.length && diverseColors.length < maxColors; i++) {
                // Skip if already added
                if (diverseColors.includes(colors[i])) continue;
                
                const currentColor = this.hexToRgb(colors[i].hex);
                let minCurrentDistance = Infinity;
                
                // Find minimum distance to any selected color
                for (let j = 0; j < diverseColors.length; j++) {
                    const selectedColor = this.hexToRgb(diverseColors[j].hex);
                    
                    const distance = Math.sqrt(
                        Math.pow(currentColor.r - selectedColor.r, 2) +
                        Math.pow(currentColor.g - selectedColor.g, 2) +
                        Math.pow(currentColor.b - selectedColor.b, 2)
                    );
                    
                    minCurrentDistance = Math.min(minCurrentDistance, distance);
                }
                
                // If this is the most diverse option at current threshold, add it
                if (minCurrentDistance >= currentThreshold) {
                    diverseColors.push(colors[i]);
                }
            }
        }
        
        // Sort by original frequency (count)
        diverseColors.sort((a, b) => b.count - a.count);
        
        return diverseColors;
    }
    
    /**
     * Calculate color diversity score
     * @param {Array} colors - Array of color objects
     * @returns {number} - Diversity score (0-100)
     */
    calculateDiversity(colors) {
        if (!colors || colors.length < 2) {
            return 0;
        }
        
        // Calculate average distance between all color pairs
        let totalDistance = 0;
        let pairCount = 0;
        
        for (let i = 0; i < colors.length; i++) {
            for (let j = i + 1; j < colors.length; j++) {
                const color1 = this.hexToRgb(colors[i].hex);
                const color2 = this.hexToRgb(colors[j].hex);
                
                // Calculate Euclidean distance in RGB space
                const distance = Math.sqrt(
                    Math.pow(color1.r - color2.r, 2) +
                    Math.pow(color1.g - color2.g, 2) +
                    Math.pow(color1.b - color2.b, 2)
                );
                
                // Max possible distance is sqrt(255^2 + 255^2 + 255^2) = 441.67
                totalDistance += distance;
                pairCount++;
            }
        }
        
        // Average distance normalized to 0-100 scale
        // 441.67 is the maximum possible distance in RGB space
        const avgDistance = totalDistance / pairCount;
        const diversityScore = (avgDistance / 441.67) * 100;
        
        return Math.round(diversityScore);
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
}

// Export the class
window.ImageAnalyzer = ImageAnalyzer;
