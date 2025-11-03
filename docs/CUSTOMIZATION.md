# Customization Guide

## Custom Assets & Styling

The application supports custom CSS overrides and static assets (images, fonts, etc.) to personalize your leaderboard. All custom assets are mounted through a single data volume for easy management.

## Data Volume Structure

The data volume is mounted at `/app/data` and can contain:
- **CSS files** - Custom styling overrides
- **Images** - Backgrounds, logos, machine artwork
- **Fonts** - Custom typography
- **Other assets** - Any static files needed for customization

```
data/
├── custom.css        # Main custom CSS file
├── images/           # Custom images
│   ├── background.jpg
│   └── logos/
├── fonts/            # Custom fonts
│   └── custom-font.woff2
└── README.md         # Asset documentation
```

## Quick Setup

1. **Create your CSS file**
   ```bash
   touch frontend/public/app/data/custom.css
   ```

2. **Add your custom styles to `frontend/public/app/data/custom.css`**
   (This will be served as `/app/data/custom.css` by the web server.)
   ```css
   /* Custom CSS overrides for Stern Home Leaderboard */

   /* Using custom background image */
   body {
     background-image: url('/app/data/images/background.jpg');
     background-size: cover;
   }

   /* Using custom fonts */
   @font-face {
     font-family: 'CustomFont';
     src: url('/app/data/fonts/custom-font.woff2') format('woff2');
   }

   /* Custom machine card styling */
   .machine-card {
     border: 2px solid #e53935;
     border-radius: 12px;
     font-family: 'CustomFont', Arial, sans-serif;
   }
   ```

3. **Start the application**
   ```bash
   docker-compose up --build
   ```

## Asset Usage Examples

### Custom Background Images
```css
/* Full page background */
body {
  background-image: url('/app/data/images/pinball-background.jpg');
  background-size: cover;
  background-attachment: fixed;
}

/* Machine card backgrounds */
.machine-card {
  background-image: url('/app/data/images/card-texture.png');
  background-blend-mode: overlay;
}
```

### Custom Fonts
```css
@font-face {
  font-family: 'PinballFont';
  src: url('/app/data/fonts/pinball-font.woff2') format('woff2'),
       url('/app/data/fonts/pinball-font.woff') format('woff');
}

.machine-title {
  font-family: 'PinballFont', Arial, sans-serif;
}
```

### Machine-Specific Styling
```css
/* Style specific machines using data attributes */
.machine-card[data-game-name="Medieval Madness"] {
  background-image: url('/app/data/images/medieval-bg.jpg');
}
```

## How It Works

1. **Injection Process**: When the container starts, a symlink is created from the 
container's mounted app/data (if present) into the web server's root.
2. **Style Injection**: If found, the CSS content is injected into the HTML `<head>` section as a `<style>` tag when the page loads. 
3. **Override Priority**: The custom CSS is loaded last, ensuring it can override any existing styles
4. **Dynamic Updates**: If you remove the custom CSS file and refresh the page, the injected styles will be automatically removed. (You may need to shift-reload to flush cached styles.)

## Example Use Cases

- **Branding**: Apply your own color scheme and fonts
- **Theme Customization**: Create dark/light theme variations
- **Layout Adjustments**: Modify spacing, sizes, and positioning
- **Machine-Specific Styling**: Target specific machine cards with custom CSS classes
- **Tournament Mode**: Special styling for tournament displays
- **Accessibility**: Adjust colors and fonts for better visibility

## CSS Class Reference

The application uses semantic CSS class names that you can target:

- `.machine-card` - Individual machine display cards
- `.high-scores-table` - High scores table container
- `.player-info` - Player name and avatar display
- `.machine-status` - Online/offline status indicators
- `.error-message` - Error display component
- `.loader` - Loading spinner component

## Troubleshooting Custom CSS

- **Styles not applying**: Ensure the `/app/data` file path is correctly mounted in the container and the file is named `custom.css`.
- **File not found (404 in dev console)**: Check the volume mount path and verify the file exists on the host.
- **Override not working**: Use more specific CSS selectors or `!important` declarations
- **Changes not visible**: Rebuild the container with `docker-compose up --build`

For development, you can test CSS changes by temporarily editing the styles directly in your browser's developer tools before creating your custom CSS file. You can also edit the file in place and reload since a symlink exists between the host file and the web 
server `/app/data` directory.