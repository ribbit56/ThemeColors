/**
 * Dashboard Preview Class
 * Renders a sample dashboard using the current theme colors
 */
class DashboardPreview {
    /**
     * Constructor
     * @param {string} containerId - ID of the container element
     */
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.canvas = null;
        this.ctx = null;
        this.themeColors = null;
        this.fonts = {
            heading: 'Roboto',
            body: 'Roboto'
        };
        
        this.init();
    }
    
    /**
     * Initialize the dashboard preview
     */
    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        
        // Get context
        this.ctx = this.canvas.getContext('2d');
        
        // Set initial size
        this.resize();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resize();
            this.render();
        });
        
        // Listen for theme changes
        document.addEventListener('theme-updated', (e) => {
            if (e.detail && e.detail.colors) {
                this.setThemeColors(e.detail.colors);
            }
        });
        
        // Listen for typography changes
        document.addEventListener('typography-updated', (e) => {
            if (e.detail) {
                this.setFonts({
                    heading: e.detail.headingFont,
                    body: e.detail.bodyFont
                });
            }
        });
        
        // Initial render
        this.render();
    }
    
    /**
     * Resize the canvas to fit the container
     */
    resize() {
        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;
        
        // Set canvas size
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;
        
        // Set CSS size
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }
    
    /**
     * Set theme colors for the dashboard preview
     * @param {Array} colors - Array of theme color objects
     */
    setThemeColors(colors) {
        this.themeColors = colors;
        this.render();
    }
    
    /**
     * Set fonts for the dashboard preview
     * @param {Object} fonts - Object with heading and body font properties
     */
    setFonts(fonts) {
        if (fonts) {
            if (fonts.heading) this.fonts.heading = fonts.heading;
            if (fonts.body) this.fonts.body = fonts.body;
        }
        this.render();
    }
    
    /**
     * Render the dashboard preview
     */
    render() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Default colors if theme colors not set
        const colors = this.themeColors || [
            { name: 'primary', hex: '#3498db' },
            { name: 'secondary', hex: '#2ecc71' },
            { name: 'accent', hex: '#f39c12' },
            { name: 'background', hex: '#f8f9fa' },
            { name: 'surface', hex: '#ffffff' },
            { name: 'text', hex: '#333333' },
            { name: 'textSecondary', hex: '#666666' }
        ];
        
        // Get color values
        const colorMap = {};
        colors.forEach(color => {
            colorMap[color.name] = color.hex;
        });
        
        // Set default colors if not found
        const primary = colorMap.primary || '#3498db';
        const secondary = colorMap.secondary || '#2ecc71';
        const accent = colorMap.accent || '#f39c12';
        const background = colorMap.background || '#f8f9fa';
        const surface = colorMap.surface || '#ffffff';
        const text = colorMap.text || '#333333';
        const textSecondary = colorMap.textSecondary || '#666666';
        
        // Dashboard dimensions
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        // Draw background
        this.ctx.fillStyle = background;
        this.ctx.fillRect(0, 0, width, height);
        
        // Draw header
        this.ctx.fillStyle = primary;
        this.ctx.fillRect(0, 0, width, 60);
        
        // Draw header text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = `bold 20px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('Dashboard Preview', 20, 30);
        
        // Draw content area
        this.ctx.fillStyle = surface;
        this.ctx.fillRect(20, 80, width - 40, height - 100);
        
        // Draw page title
        this.ctx.fillStyle = text;
        this.ctx.font = `bold 24px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Analytics Dashboard', 40, 110);
        
        // Draw KPI cards
        const cardWidth = (width - 100) / 3;
        this.drawKpiCard(40, 140, cardWidth, 100, 'Revenue', '$12,345', '+8.5%', primary);
        this.drawKpiCard(40 + cardWidth + 10, 140, cardWidth, 100, 'Users', '1,234', '+12.3%', secondary);
        this.drawKpiCard(40 + (cardWidth + 10) * 2, 140, cardWidth, 100, 'Conversion', '5.2%', '-2.1%', accent);
        
        // Draw charts with moderate height and bottom padding
        const chartHeight = 280; // Moderate height with space at bottom
        this.drawBarChart(40, 260, width / 2 - 50, chartHeight, primary, secondary, text, textSecondary);
        this.drawLineChart(width / 2 + 10, 260, width / 2 - 50, chartHeight, accent, primary, text, textSecondary);
        
        // Add a footer/summary text at the bottom for better spacing
        this.ctx.fillStyle = text;
        this.ctx.font = `14px ${this.fonts.body}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Dashboard data last updated: Today at 2:30 PM', 40, 560);
    }
    
    /**
     * Draw a KPI card
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} title - Card title
     * @param {string} value - Main value
     * @param {string} change - Change indicator
     * @param {string} color - Accent color
     */
    drawKpiCard(x, y, width, height, title, value, change, color) {
        // Draw card background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        this.roundRect(x, y, width, height, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw color accent
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, 8, height);
        
        // Draw title
        this.ctx.fillStyle = '#666666';
        this.ctx.font = `14px ${this.fonts.body}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(title, x + 16, y + 15);
        
        // Draw main value
        this.ctx.fillStyle = '#333333';
        this.ctx.font = `bold 24px ${this.fonts.heading}`;
        this.ctx.fillText(value, x + 16, y + 40);
        
        // Draw change indicator
        this.ctx.fillStyle = change.startsWith('+') ? '#2ecc71' : '#e74c3c';
        this.ctx.font = `14px ${this.fonts.body}`;
        this.ctx.fillText(change, x + 16, y + 75);
    }
    
    /**
     * Draw a bar chart
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} color1 - Primary color
     * @param {string} color2 - Secondary color
     * @param {string} textColor - Text color
     * @param {string} secondaryTextColor - Secondary text color
     */
    drawBarChart(x, y, width, height, color1, color2, textColor, secondaryTextColor) {
        // Draw chart background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        this.roundRect(x, y, width, height, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw chart title
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Monthly Revenue', x + 20, y + 15);
        
        // Draw bars
        const barWidth = 30;
        const barGap = 15;
        const barCount = 6;
        const barAreaWidth = (barWidth * 2 + barGap) * barCount;
        const startX = x + (width - barAreaWidth) / 2;
        const maxBarHeight = 100;
        const baseline = y + height - 30;
        
        // Sample data
        const data1 = [70, 45, 90, 60, 80, 65];
        const data2 = [50, 65, 40, 75, 55, 80];
        
        // Draw bars
        for (let i = 0; i < barCount; i++) {
            const barX = startX + i * (barWidth * 2 + barGap);
            
            // First bar
            const height1 = (data1[i] / 100) * maxBarHeight;
            this.ctx.fillStyle = color1;
            this.roundRect(barX, baseline - height1, barWidth, height1, 4, true);
            
            // Second bar
            const height2 = (data2[i] / 100) * maxBarHeight;
            this.ctx.fillStyle = color2;
            this.roundRect(barX + barWidth + 5, baseline - height2, barWidth, height2, 4, true);
        }
        
        // Draw x-axis
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 20, baseline);
        this.ctx.lineTo(x + width - 20, baseline);
        this.ctx.stroke();
        
        // Draw x-axis labels
        this.ctx.fillStyle = secondaryTextColor;
        this.ctx.font = `12px ${this.fonts.body}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        for (let i = 0; i < barCount; i++) {
            const labelX = startX + i * (barWidth * 2 + barGap) + barWidth;
            this.ctx.fillText(months[i], labelX, baseline + 5);
        }
    }
    
    /**
     * Draw a pie chart
     * @param {number} x - X position (center)
     * @param {number} y - Y position (center)
     * @param {number} radius - Radius
     * @param {Array} colors - Array of colors
     * @param {string} textColor - Text color
     * @param {string} secondaryTextColor - Secondary text color
     */
    drawPieChart(x, y, radius, colors, textColor, secondaryTextColor) {
        // Draw chart background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        this.roundRect(x - radius - 80, y - radius - 40, radius * 2 + 160, radius * 2 + 100, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw chart title
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Revenue Distribution', x, y - radius - 25);
        
        // Sample data
        const data = [45, 30, 25];
        const labels = ['Product A', 'Product B', 'Product C'];
        
        // Draw pie chart
        let startAngle = 0;
        for (let i = 0; i < data.length; i++) {
            const sliceAngle = (data[i] / 100) * 2 * Math.PI;
            
            this.ctx.fillStyle = colors[i];
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, radius, startAngle, startAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fill();
            
            startAngle += sliceAngle;
        }
        
        // Draw center circle (donut style)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.6, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw legend
        const legendX = x + radius + 20;
        const legendY = y - 30;
        
        this.ctx.textAlign = 'left';
        this.ctx.font = `14px ${this.fonts.body}`;
        
        for (let i = 0; i < labels.length; i++) {
            const itemY = legendY + i * 25;
            
            // Draw color box
            this.ctx.fillStyle = colors[i];
            this.ctx.fillRect(legendX, itemY, 15, 15);
            
            // Draw text
            this.ctx.fillStyle = textColor;
            this.ctx.fillText(`${labels[i]} (${data[i]}%)`, legendX + 25, itemY + 12);
        }
    }
    
    /**
     * Draw an area chart
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} color1 - Primary area color
     * @param {string} color2 - Secondary area color
     * @param {string} textColor - Text color
     * @param {string} secondaryTextColor - Secondary text color
     */
    drawAreaChart(x, y, width, height, color1, color2, textColor, secondaryTextColor) {
        // Draw chart background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        this.roundRect(x, y, width, height, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw chart title
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Monthly Engagement', x + 20, y + 15);
        
        // Chart dimensions
        const chartX = x + 40;
        const chartY = y + 50;
        const chartWidth = width - 60;
        const chartHeight = height - 80;
        const pointCount = 6;
        
        // Sample data
        const data = [30, 50, 45, 70, 65, 90];
        
        // Draw grid lines
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const lineY = chartY + (chartHeight / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(chartX, lineY);
            this.ctx.lineTo(chartX + chartWidth, lineY);
            this.ctx.stroke();
        }
        
        // Draw area
        this.ctx.fillStyle = this.hexToRgba(color1, 0.3);
        this.ctx.beginPath();
        
        // Start at bottom left
        this.ctx.moveTo(chartX, chartY + chartHeight);
        
        // Draw line to first data point
        const firstPointY = chartY + chartHeight - (data[0] / 100) * chartHeight;
        this.ctx.lineTo(chartX, firstPointY);
        
        // Draw lines through all data points
        for (let i = 0; i < pointCount; i++) {
            const pointX = chartX + (chartWidth / (pointCount - 1)) * i;
            const pointY = chartY + chartHeight - (data[i] / 100) * chartHeight;
            this.ctx.lineTo(pointX, pointY);
        }
        
        // Draw line to bottom right and close the path
        this.ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
        this.ctx.closePath();
        this.ctx.fill();
        
        // Draw the line on top of the area
        this.ctx.strokeStyle = color1;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        for (let i = 0; i < pointCount; i++) {
            const pointX = chartX + (chartWidth / (pointCount - 1)) * i;
            const pointY = chartY + chartHeight - (data[i] / 100) * chartHeight;
            
            if (i === 0) {
                this.ctx.moveTo(pointX, pointY);
            } else {
                this.ctx.lineTo(pointX, pointY);
            }
        }
        
        this.ctx.stroke();
        
        // Draw points
        for (let i = 0; i < pointCount; i++) {
            const pointX = chartX + (chartWidth / (pointCount - 1)) * i;
            const pointY = chartY + chartHeight - (data[i] / 100) * chartHeight;
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = color1;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // Draw x-axis labels
        this.ctx.fillStyle = secondaryTextColor;
        this.ctx.font = `12px ${this.fonts.body}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        for (let i = 0; i < pointCount; i++) {
            const labelX = chartX + (chartWidth / (pointCount - 1)) * i;
            this.ctx.fillText(months[i], labelX, chartY + chartHeight + 10);
        }
    }
    
    /**
     * Convert hex color to rgba
     * @param {string} hex - Hex color string
     * @param {number} alpha - Alpha value (0-1)
     * @returns {string} - RGBA color string
     */
    hexToRgba(hex, alpha) {
        const rgb = this.hexToRgb(hex);
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }
    
    /**
     * Draw a line chart
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} color1 - Primary line color
     * @param {string} color2 - Secondary line color
     * @param {string} textColor - Text color
     * @param {string} secondaryTextColor - Secondary text color
     */
    drawLineChart(x, y, width, height, color1, color2, textColor, secondaryTextColor) {
        // Draw chart background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        this.roundRect(x, y, width, height, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw chart title
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('User Growth', x + 20, y + 15);
        
        // Chart dimensions
        const chartX = x + 40;
        const chartY = y + 50;
        const chartWidth = width - 60;
        const chartHeight = height - 80;
        const pointCount = 6;
        
        // Sample data
        const data1 = [30, 50, 45, 70, 65, 90];
        const data2 = [20, 35, 55, 40, 60, 75];
        
        // Draw grid lines
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const lineY = chartY + (chartHeight / 4) * i;
            this.ctx.beginPath();
            this.ctx.moveTo(chartX, lineY);
            this.ctx.lineTo(chartX + chartWidth, lineY);
            this.ctx.stroke();
        }
        
        // Draw lines
        const drawLine = (data, color) => {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            
            for (let i = 0; i < pointCount; i++) {
                const pointX = chartX + (chartWidth / (pointCount - 1)) * i;
                const pointY = chartY + chartHeight - (data[i] / 100) * chartHeight;
                
                if (i === 0) {
                    this.ctx.moveTo(pointX, pointY);
                } else {
                    this.ctx.lineTo(pointX, pointY);
                }
            }
            
            this.ctx.stroke();
            
            // Draw points
            for (let i = 0; i < pointCount; i++) {
                const pointX = chartX + (chartWidth / (pointCount - 1)) * i;
                const pointY = chartY + chartHeight - (data[i] / 100) * chartHeight;
                
                this.ctx.fillStyle = '#ffffff';
                this.ctx.beginPath();
                this.ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.strokeStyle = color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(pointX, pointY, 5, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        };
        
        // Draw both lines
        drawLine(data1, color1);
        drawLine(data2, color2);
        
        // Draw x-axis labels
        this.ctx.fillStyle = secondaryTextColor;
        this.ctx.font = `12px ${this.fonts.body}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        for (let i = 0; i < pointCount; i++) {
            const labelX = chartX + (chartWidth / (pointCount - 1)) * i;
            this.ctx.fillText(months[i], labelX, chartY + chartHeight + 10);
        }
    }
    
    /**
     * Draw a color palette section
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {Array} colors - Array of color objects
     * @param {string} textColor - Text color
     */
    drawColorPalette(x, y, width, height, colors, textColor) {
        // Draw section background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 8;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 2;
        this.roundRect(x, y, width, height, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw section title
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Theme Colors', x + 20, y + 15);
        
        // Draw color swatches
        const swatchSize = 40; // Increased size
        const swatchGap = 25; // Increased gap
        const startX = x + 20;
        const startY = y + 45;
        const maxColors = Math.min(colors.length, 10); // Show up to 10 colors
        
        for (let i = 0; i < maxColors; i++) {
            const color = colors[i];
            const swatchX = startX + i * (swatchSize + swatchGap);
            
            // Draw color swatch
            this.ctx.fillStyle = color.hex;
            this.roundRect(swatchX, startY, swatchSize, swatchSize, 4, true);
            
            // Draw color name below at an angle
            this.ctx.fillStyle = textColor;
            this.ctx.font = `12px ${this.fonts.body}`;
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';
            
            // Save context for rotation
            this.ctx.save();
            
            // Translate to the point where we want to draw the text
            this.ctx.translate(swatchX + swatchSize / 2, startY + swatchSize + 10);
            
            // Rotate the context (45 degrees in radians)
            this.ctx.rotate(Math.PI / 4);
            
            // Draw the text at the origin (0,0) of the rotated context
            this.ctx.fillText(color.name, 0, 0);
            
            // Restore the context to its original state
            this.ctx.restore();
        }
    }
    
    /**
     * Convert hex color to RGB
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
     * Draw a bar chart
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} color1 - Primary color
     * @param {string} color2 - Secondary color
     */
    drawBarChart(x, y, width, height, color1, color2) {
        // Draw chart background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 4;
        this.roundRect(x, y, width, height, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw chart title
        this.ctx.fillStyle = '#333333';
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Monthly Trends', x + 20, y + 30);
        
        // Draw bars
        const barWidth = 30;
        const barGap = 15;
        const barCount = 5;
        const barAreaWidth = (barWidth * 2 + barGap) * barCount;
        const startX = x + (width - barAreaWidth) / 2;
        const maxBarHeight = 100;
        const baseline = y + height - 40;
        
        // Sample data
        const data1 = [70, 45, 90, 60, 80];
        const data2 = [50, 65, 40, 75, 55];
        
        // Draw bars
        for (let i = 0; i < barCount; i++) {
            const barX = startX + i * (barWidth * 2 + barGap);
            
            // First bar
            const height1 = (data1[i] / 100) * maxBarHeight;
            this.ctx.fillStyle = color1;
            this.roundRect(barX, baseline - height1, barWidth, height1, 4, true);
            
            // Second bar
            const height2 = (data2[i] / 100) * maxBarHeight;
            this.ctx.fillStyle = color2;
            this.roundRect(barX + barWidth + 5, baseline - height2, barWidth, height2, 4, true);
        }
        
        // Draw x-axis
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 20, baseline);
        this.ctx.lineTo(x + width - 20, baseline);
        this.ctx.stroke();
        
        // Draw x-axis labels
        this.ctx.fillStyle = '#666666';
        this.ctx.font = `12px ${this.fonts.body}`;
        this.ctx.textAlign = 'center';
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        for (let i = 0; i < barCount; i++) {
            const labelX = startX + i * (barWidth * 2 + barGap) + barWidth;
            this.ctx.fillText(months[i], labelX, baseline + 20);
        }
    }
    
    /**
     * Draw a pie chart
     * @param {number} x - X position (center)
     * @param {number} y - Y position (center)
     * @param {number} radius - Radius
     * @param {Array} colors - Array of colors
     */
    drawPieChart(x, y, radius, colors) {
        // Draw chart background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 4;
        this.roundRect(x - radius - 40, y - radius - 40, radius * 2 + 80, radius * 2 + 80, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw chart title
        this.ctx.fillStyle = '#333333';
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Distribution', x, y - radius - 15);
        
        // Sample data
        const data = [45, 30, 25];
        
        // Draw pie chart
        let startAngle = 0;
        for (let i = 0; i < data.length; i++) {
            const sliceAngle = (data[i] / 100) * 2 * Math.PI;
            
            this.ctx.fillStyle = colors[i];
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.arc(x, y, radius, startAngle, startAngle + sliceAngle);
            this.ctx.closePath();
            this.ctx.fill();
            
            startAngle += sliceAngle;
        }
        
        // Draw center circle (donut style)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.6, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw legend
        const legendItems = ['Product A', 'Product B', 'Product C'];
        const legendX = x - radius - 30;
        const legendY = y + radius + 20;
        
        this.ctx.textAlign = 'left';
        this.ctx.font = `14px ${this.fonts.body}`;
        
        for (let i = 0; i < legendItems.length; i++) {
            const itemY = legendY + i * 25;
            
            // Draw color box
            this.ctx.fillStyle = colors[i];
            this.ctx.fillRect(legendX, itemY, 15, 15);
            
            // Draw text
            this.ctx.fillStyle = '#333333';
            this.ctx.fillText(legendItems[i], legendX + 25, itemY + 12);
        }
    }
    
    /**
     * Draw a table
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {Array} colors - Array of colors
     * @param {string} textColor - Text color
     * @param {string} secondaryTextColor - Secondary text color
     */
    drawTable(x, y, width, height, colors, textColor, secondaryTextColor) {
        // Draw table background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 4;
        this.roundRect(x, y, width, height, 8, true);
        this.ctx.shadowColor = 'transparent';
        
        // Draw table title
        this.ctx.fillStyle = textColor;
        this.ctx.font = `bold 16px ${this.fonts.heading}`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Recent Activity', x + 20, y + 30);
        
        // Draw table headers
        const columns = ['User', 'Action', 'Date', 'Status'];
        const columnWidths = [0.25, 0.35, 0.2, 0.2];
        
        this.ctx.fillStyle = secondaryTextColor;
        this.ctx.font = `bold 14px ${this.fonts.body}`;
        
        let currentX = x + 20;
        for (let i = 0; i < columns.length; i++) {
            this.ctx.fillText(columns[i], currentX, y + 60);
            currentX += columnWidths[i] * width;
        }
        
        // Draw separator line
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x + 20, y + 70);
        this.ctx.lineTo(x + width - 20, y + 70);
        this.ctx.stroke();
        
        // Draw table rows
        const rows = [
            ['John Doe', 'Logged in', 'Today', 'Success'],
            ['Jane Smith', 'Updated profile', 'Yesterday', 'Success'],
            ['Bob Johnson', 'Failed login', 'Yesterday', 'Error']
        ];
        
        this.ctx.font = `14px ${this.fonts.body}`;
        
        for (let i = 0; i < rows.length; i++) {
            const rowY = y + 90 + i * 25;
            
            for (let j = 0; j < rows[i].length; j++) {
                currentX = x + 20;
                for (let k = 0; k < j; k++) {
                    currentX += columnWidths[k] * width;
                }
                
                // Special handling for status column
                if (j === 3) {
                    const statusColor = rows[i][j] === 'Success' ? colors[1] : colors[0];
                    this.ctx.fillStyle = statusColor;
                    this.roundRect(currentX, rowY - 15, 70, 20, 10, true);
                    
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(rows[i][j], currentX + 35, rowY);
                    this.ctx.textAlign = 'left';
                } else {
                    this.ctx.fillStyle = textColor;
                    this.ctx.fillText(rows[i][j], currentX, rowY);
                }
            }
        }
    }
    
    /**
     * Draw a rounded rectangle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {number} radius - Corner radius
     * @param {boolean} fill - Whether to fill the rectangle
     */
    roundRect(x, y, width, height, radius, fill) {
        if (typeof radius === 'undefined') {
            radius = 5;
        }
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
        
        if (fill) {
            this.ctx.fill();
        } else {
            this.ctx.stroke();
        }
    }
}

// Export the class
window.DashboardPreview = DashboardPreview;
