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

### `docker-compose-with-custom-css.yml`
An example Docker Compose configuration that demonstrates how to:
- Enable custom CSS overrides
- Mount your CSS file as a volume
- Set the required environment variables

## Usage

### Using the Example CSS

1. **Copy the example CSS file**:
   ```bash
   cp examples/custom-styles.css my-custom-styles.css
   ```

2. **Edit the CSS file** to match your preferences

3. **Use the example Docker Compose file**:
   ```bash
   # Copy the example
   cp examples/docker-compose-with-custom-css.yml docker-compose.yml

   # Or use it directly
   docker-compose -f examples/docker-compose-with-custom-css.yml up
   ```

4. **Or modify your existing docker-compose.yml**:
   Add these lines to your frontend service:
   ```yaml
   environment:
     - CUSTOM_CSS_PATH=/app/custom-css/overrides.css
   volumes:
     - ./my-custom-styles.css:/app/custom-css/overrides.css:ro
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
