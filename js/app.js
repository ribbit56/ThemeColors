/**
 * Color Analyzer Web App
 * Main application script
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    const imageAnalyzer = new ImageAnalyzer();
    const themeGenerator = new ThemeGenerator();
    const fontManager = new FontManager(); // Simplified version without UI
    const dashboardPreview = new DashboardPreview('dashboardPreview');
    
    // DOM elements
    const imageInput = document.getElementById('imageInput');
    const previewImage = document.getElementById('previewImage');
    const placeholderText = document.getElementById('placeholderText');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const colorResults = document.getElementById('colorResults');
    const pickedColorInfo = document.getElementById('pickedColorInfo');
    const pickedColorSwatch = document.getElementById('pickedColorSwatch');
    const pickedColorText = document.getElementById('pickedColorText');
    const usePickedColorBtn = document.getElementById('usePickedColorBtn');
    const selectedColorSwatch = document.getElementById('selectedColorSwatch');
    const selectedColorText = document.getElementById('selectedColorText');
    const colorPicker = document.getElementById('colorPicker');
    const colorPickerBtn = document.getElementById('colorPickerBtn');
    const generateThemeBtn = document.getElementById('generateThemeBtn');
    const themeResults = document.getElementById('themeResults');
    const dashboardContainer = document.getElementById('dashboardPreview');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const exportPowerBIBtn = document.getElementById('exportPowerBIBtn');
    const harmonyType = document.getElementById('harmonyType');
    const harmonyDescription = document.getElementById('harmonyDescription');
    
    // Set initial theme color and harmony type
    themeGenerator.setBaseColor('#3498db');
    themeGenerator.setHarmonyType('complementary');
    selectedColorSwatch.style.backgroundColor = '#3498db';
    
    // Harmony type descriptions
    const harmonyDescriptions = {
        'complementary': 'Complementary colors are opposite each other on the color wheel, providing high contrast and visual impact.',
        'analogous': 'Analogous colors are adjacent to each other on the color wheel, creating a harmonious and cohesive look.',
        'triadic': 'Triadic colors are evenly spaced around the color wheel (120° apart), offering visual contrast while maintaining harmony.',
        'tetradic': 'Tetradic (rectangle) harmony uses four colors arranged in two complementary pairs, offering rich color possibilities.',
        'monochromatic': 'Monochromatic schemes use variations in lightness and saturation of a single color, creating a cohesive and elegant look.'
    };
    
    // Update harmony description when selection changes
    harmonyType.addEventListener('change', () => {
        const selectedHarmony = harmonyType.value;
        harmonyDescription.textContent = harmonyDescriptions[selectedHarmony];
        themeGenerator.setHarmonyType(selectedHarmony);
        
        // If we already have a base color, regenerate the theme
        if (themeGenerator.baseColor) {
            generateTheme();
        }
    });
    
    /**
     * Handle image upload
     */
    imageInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
            try {
                // Load the image
                const img = await imageAnalyzer.loadImage(e.target.files[0]);
                
                // Display the image
                previewImage.src = img.src;
                previewImage.classList.remove('d-none');
                placeholderText.classList.add('d-none');
                
                // Enable analyze button
                analyzeBtn.disabled = false;
                
                // Show color picker info
                pickedColorInfo.classList.remove('d-none');
                
                // Clear previous results
                colorResults.innerHTML = '<div class="col-12 text-center py-5"><p>Click "Analyze Colors" to see results</p></div>';
                
            } catch (error) {
                alert('Error loading image: ' + error.message);
            }
        }
    });
    
    /**
     * Handle image click for color picking
     */
    previewImage.addEventListener('click', (e) => {
        try {
            // Get click coordinates relative to the image
            const rect = previewImage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate the actual coordinates in the original image
            const scaleX = previewImage.naturalWidth / previewImage.width;
            const scaleY = previewImage.naturalHeight / previewImage.height;
            
            const originalX = Math.floor(x * scaleX);
            const originalY = Math.floor(y * scaleY);
            
            // Get the color at the clicked position
            const color = imageAnalyzer.getPixelColor(originalX, originalY);
            
            // Update the picked color display
            pickedColorSwatch.style.backgroundColor = color.hex;
            pickedColorText.textContent = color.hex;
            
            // Enable the "Use This Color" button
            usePickedColorBtn.disabled = false;
            
        } catch (error) {
            console.error('Error picking color:', error);
        }
    });
    
    /**
     * Handle "Use This Color" button click
     */
    usePickedColorBtn.addEventListener('click', () => {
        const pickedColor = pickedColorText.textContent;
        
        // Update the selected color
        selectedColorSwatch.style.backgroundColor = pickedColor;
        selectedColorText.textContent = pickedColor;
        colorPicker.value = pickedColor;
        
        // Set the base color for theme generation
        themeGenerator.setBaseColor(pickedColor);
        
        // Generate theme based on this color
        generateTheme();
    });
    
    /**
     * Handle analyze button click
     */
    analyzeBtn.addEventListener('click', () => {
        analyzeImage();
    });
    
    /**
     * Handle color picker button click
     */
    colorPickerBtn.addEventListener('click', () => {
        colorPicker.click();
    });
    
    /**
     * Handle color picker change
     */
    colorPicker.addEventListener('change', () => {
        const selectedColor = colorPicker.value;
        
        // Update the selected color
        selectedColorSwatch.style.backgroundColor = selectedColor;
        selectedColorText.textContent = selectedColor;
        
        // Set the base color for theme generation
        themeGenerator.setBaseColor(selectedColor);
    });
    
    /**
     * Handle generate theme button click
     */
    generateThemeBtn.addEventListener('click', () => {
        generateTheme();
    });
    
    /**
     * Handle export JSON button click
     */
    exportJsonBtn.addEventListener('click', () => {
        // Get theme data
        const themeData = themeGenerator.exportToJson();
        
        // Create a download link
        const blob = new Blob([themeData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'theme.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    /**
     * Handle export Power BI button click
     */
    exportPowerBIBtn.addEventListener('click', () => {
        // Get Power BI theme data
        const powerBITheme = themeGenerator.exportToPowerBI();
        
        // Create a download link
        const blob = new Blob([powerBITheme], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'theme-powerbi.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    /**
     * Analyze the image to find the most common colors
     */
    function analyzeImage() {
        try {
            // Check if image is loaded
            if (!imageAnalyzer.image) {
                alert('Please upload an image first.');
                return;
            }
            
            // Analyze the image
            const colorData = imageAnalyzer.analyzeImage(10);
            
            // Display the results
            displayColorResults(colorData);
            
            // Generate a theme based on the most common color
            if (colorData && colorData.length > 0) {
                const mostCommonColor = colorData[0].hex;
                themeGenerator.setBaseColor(mostCommonColor);
                selectedColorSwatch.style.backgroundColor = mostCommonColor;
                selectedColorText.textContent = mostCommonColor;
                colorPicker.value = mostCommonColor;
                
                // Generate theme based on this color
                generateTheme();
            }
            
            // Enable export buttons
            exportJsonBtn.disabled = false;
            exportPowerBIBtn.disabled = false;
            
        } catch (error) {
            alert('Error analyzing image: ' + error.message);
        }
    }
    
    /**
     * Display color analysis results
     * @param {Array} colorData - Array of color objects
     */
    function displayColorResults(colorData) {
        // Clear previous results
        colorResults.innerHTML = '';
        
        // Create a container for the two columns
        const columnsContainer = document.createElement('div');
        columnsContainer.className = 'row';
        colorResults.appendChild(columnsContainer);
        
        // Create left column
        const leftColumn = document.createElement('div');
        leftColumn.className = 'col-md-6';
        columnsContainer.appendChild(leftColumn);
        
        // Create right column
        const rightColumn = document.createElement('div');
        rightColumn.className = 'col-md-6';
        columnsContainer.appendChild(rightColumn);
        
        // Add color results in two columns
        colorData.forEach((color, index) => {
            // Convert hex to RGB
            const rgb = imageAnalyzer.hexToRgb(color.hex);
            const rgbString = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            
            const colorEl = document.createElement('div');
            colorEl.className = 'mb-3';
            colorEl.innerHTML = `
                <div class="color-result-row d-flex align-items-center p-2 border rounded" data-color="${color.hex}">
                    <div class="color-swatch-large me-3" style="background-color: ${color.hex};"></div>
                    <div class="color-info">
                        <div>HEX: ${color.hex}</div>
                        <div class="small">${rgbString}</div>
                        <div class="small text-muted">${color.percentage}% of image</div>
                    </div>
                </div>
            `;
            
            // Add to left or right column based on index
            if (index < 5) {
                leftColumn.appendChild(colorEl);
            } else {
                rightColumn.appendChild(colorEl);
            }
            
            // Add click event to use this color
            colorEl.querySelector('.color-result-row').addEventListener('click', () => {
                themeGenerator.setBaseColor(color.hex);
                selectedColorSwatch.style.backgroundColor = color.hex;
                selectedColorText.textContent = color.hex;
                colorPicker.value = color.hex;
                generateTheme();
            });
        });
    }
    
    /**
     * Generate a theme based on the selected color
     */
    function generateTheme() {
        // Generate the theme
        const themeColors = themeGenerator.generateTheme();
        
        // Display the theme
        displayThemeResults(themeColors);
        
        // Update dashboard preview
        dashboardPreview.setThemeColors(themeColors);
        
        // Update fonts in dashboard preview
        const fonts = fontManager.getFontSettings();
        dashboardPreview.setFonts({
            heading: fonts.headingFont,
            body: fonts.bodyFont
        });
        
        // Enable export buttons
        exportJsonBtn.disabled = false;
        exportPowerBIBtn.disabled = false;
    }
    
    /**
     * Display theme generation results
     * @param {Array} themeColors - Array of theme color objects
     */
    function displayThemeResults(themeColors) {
        // Clear previous results
        themeResults.innerHTML = '';
        
        // Add theme colors
        themeColors.forEach(color => {
            const colorEl = document.createElement('div');
            colorEl.className = 'col-6 col-md-4 col-lg-3 mb-3';
            colorEl.innerHTML = `
                <div class="theme-color" style="background-color: ${color.hex};" data-color="${color.hex}" data-name="${color.name}">
                    <div class="theme-color-customize">Customize</div>
                    <div class="theme-color-info">
                        ${color.name}: ${color.hex}
                    </div>
                </div>
            `;
            themeResults.appendChild(colorEl);
            
            // Add click event to customize this color
            colorEl.querySelector('.theme-color-customize').addEventListener('click', () => {
                const colorInput = document.createElement('input');
                colorInput.type = 'color';
                colorInput.value = color.hex;
                
                colorInput.addEventListener('change', () => {
                    // Update the color in the theme
                    color.hex = colorInput.value;
                    
                    // Update the display
                    colorEl.querySelector('.theme-color').style.backgroundColor = color.hex;
                    colorEl.querySelector('.theme-color-info').innerHTML = `${color.name}: ${color.hex}`;
                    
                    // Update dashboard preview
                    dashboardPreview.setThemeColors(themeColors);
                });
                
                colorInput.click();
            });
        });
    }
    
    // Generate initial theme
    generateTheme();
});
