#!/usr/bin/env node
 

const fs = require('fs');
const path = require('path');

// Environment variable for custom CSS file path
const customCssPath = process.env.CUSTOM_CSS_PATH;
const indexHtmlPath = path.join(__dirname, '..', 'index.html');

function injectCustomCss() {
  try {
    // Read the current index.html
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

    // Check if custom CSS path is provided and file exists
    if (customCssPath && fs.existsSync(customCssPath)) {
      console.log(`Custom CSS file found at: ${customCssPath}`);

      // Read the custom CSS content
      const customCssContent = fs.readFileSync(customCssPath, 'utf8');

      // Create a style tag with the custom CSS
      const customStyleTag = `    <style id="custom-css-override">
/* Custom CSS Overrides */
${customCssContent}
    </style>`;

      // Check if custom CSS is already injected to avoid duplicates
      if (!htmlContent.includes('id="custom-css-override"')) {
        // Inject the custom CSS just before the closing </head> tag
        htmlContent = htmlContent.replace(
          '</head>',
          `${customStyleTag}
    </head>`,
        );

        // Write the modified HTML back
        fs.writeFileSync(indexHtmlPath, htmlContent);
        console.log('Custom CSS successfully injected into index.html');
      } else {
        console.log('Custom CSS already injected, skipping...');
      }
    } else {
      console.log('No custom CSS file provided or file does not exist');

      // Remove custom CSS if it was previously injected but file no longer exists
      if (htmlContent.includes('id="custom-css-override"')) {
        const styleRegex = /\s*<style id="custom-css-override">[\s\S]*?<\/style>\s*/;
        htmlContent = htmlContent.replace(styleRegex, '');
        fs.writeFileSync(indexHtmlPath, htmlContent);
        console.log('Removed previously injected custom CSS');
      }
    }
  } catch (error) {
    console.error('Error injecting custom CSS:', error);
    process.exit(1);
  }
}

// Run the injection
injectCustomCss();
