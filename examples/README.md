# Examples

This directory contains example files to help you get started with customizing your Stern Home Leaderboard.

## Files

### `docker-compose-with-custom-css.yml`
Example Docker Compose configuration that shows:
- How to mount custom CSS and assets
- Proper volume configuration for customization
- Environment variable usage

### `custom-styles.css`
A comprehensive example of custom CSS overrides showing how to:
- Change colors and themes
- Customize machine cards
- Style high score tables
- Add animations and effects
- Create responsive designs
- Use custom assets (images, fonts)

## Configuration Examples

### Changing the Frontend Port

If port 3000 conflicts with other services on your system (common with Unraid), set a custom port in your `.env` file:

```bash
# Example: Use port 8080 instead of 3000
FRONTEND_PORT=8080

# Other common alternatives:
# FRONTEND_PORT=3001
# FRONTEND_PORT=8000
# FRONTEND_PORT=3333
```

After changing the port, restart your containers:
```bash
docker-compose down
docker-compose up --build
```

Then access the application at: http://localhost:8080 (or your chosen port)

## Usage

### Using the Data Volume Approach (Recommended)

1. **Create your data directories**:
   ```bash
   mkdir -p frontend/public/app/data/images frontend/public/app/data/fonts
   ```
2. **Copy the example CSS file**:
   ```bash
   cp examples/custom-styles.css frontend/public/app/data/custom.css
   ```

3. **Add your assets**:
   - Place images in `frontend/public/app/data/images/`
   - Place fonts in `frontend/public/app/data/fonts/`
   - Edit `frontend/public/app/data/custom.css` to reference your assets

4. **Uncomment the volume mount in the Docker Compose file**:
   This mount is symlinked to the web server's root at container start.
   ```
      # Optional: Mount your custom assets into the /app/data directory.
      # They will be linked to the web server static directory if present.
      # `custom.css` specifically will be injected if present.
      # Update the path on the left to your custom location
      - ./frontend/public/app/data:/app/data:ro
   ```

### Web Root Data Directory Structure
```
app/
└──data/
   ├── custom.css      # Main CSS file
   ├── images/                # Custom images
   │   ├── background.jpg     # Page background
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

## Troubleshooting Custom CSS

- **Styles not applying**: Ensure the `/app/data` file path is correctly mounted in the container and the file is named `custom.css`.
- **File not found (404 in dev console)**: Check the volume mount path and verify the file exists on the host.
- **Override not working**: Use more specific CSS selectors or `!important` declarations
- **Changes not visible**: Rebuild the container with `docker-compose up --build`

For development, you can test CSS changes by temporarily editing the styles directly in your browser's developer tools before creating your custom CSS file. You can also edit the file in place and reload since a symlink exists between the host file and the web
server `/app/data` directory.
