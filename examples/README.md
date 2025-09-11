# Examples

This directory contains example files to help you get started with customizing your Stern Home Leaderboard.

## Files

### `custom-styles.css`
A comprehensive example of custom CSS overrides showing how to:
- Change colors and themes
- Customize machine cards
- Style high score tables
- Add animations and effects
- Create responsive designs
- Use custom assets (images, fonts)

### `docker-compose-with-custom-css.yml`
An example Docker Compose configuration that demonstrates how to:
- Enable custom CSS overrides with data volume
- Mount your assets directory
- Set the required environment variables

## Usage

### Using the Data Volume Approach (Recommended)

1. **Create your data directory**:
   ```bash
   mkdir -p data/images data/fonts
   ```

2. **Copy the example CSS file**:
   ```bash
   cp examples/custom-styles.css data/custom.css
   ```

3. **Add your assets**:
   - Place images in `data/images/`
   - Place fonts in `data/fonts/`
   - Edit `data/custom.css` to reference your assets

4. **Use the example Docker Compose file**:
   ```bash
   # Copy the example
   cp examples/docker-compose-with-custom-css.yml docker-compose.yml

   # Or use it directly
   docker-compose -f examples/docker-compose-with-custom-css.yml up
   ```

### Data Directory Structure
```
data/
├── custom.css              # Main CSS file
├── images/                 # Custom images
│   ├── background.jpg      # Page background
│   ├── logo.png           # Custom logo
│   └── machines/          # Machine-specific images
├── fonts/                 # Custom fonts
│   ├── title-font.woff2   # Headers
│   └── body-font.woff2    # Body text
└── README.md              # Documentation
```

### Asset Usage in CSS
```css
/* Background images */
body {
  background-image: url('/app/data/images/background.jpg');
}

/* Custom fonts */
@font-face {
  font-family: 'CustomFont';
  src: url('/app/data/fonts/title-font.woff2') format('woff2');
}

/* Machine-specific backgrounds */
.machine-card[data-game="Medieval Madness"] {
  background-image: url('/app/data/images/machines/medieval.jpg');
}
```

### Creating Your Own CSS

1. **Start with the example**:
   Use `custom-styles.css` as a starting point

2. **Identify elements to customize**:
   Use your browser's developer tools to inspect elements and find CSS class names

3. **Test your changes**:
   Use the browser's developer tools to test CSS changes before adding them to your file

4. **Use specific selectors**:
   If your styles aren't applying, use more specific CSS selectors or `!important`

## Tips

- **Backup**: Keep a backup of your working CSS file
- **Incremental**: Make small changes and test them
- **Browser DevTools**: Use F12 to inspect elements and test styles
- **CSS Variables**: Use CSS custom properties for consistent theming
- **Responsive**: Test your styles on different screen sizes

## Troubleshooting

- **File not found**: Check the volume mount path is correct
- **Styles not applying**: Rebuild the container with `--build` flag
- **Override not working**: Use more specific selectors or `!important`
- **Container won't start**: Check the CSS file syntax for errors
