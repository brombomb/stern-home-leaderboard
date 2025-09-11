# Features Guide

## Fullscreen Mode

Display any machine in fullscreen mode with multiple interaction methods:

### Accessing Fullscreen Mode

1. **Click Game Logo**: Simply click on any game logo to enter fullscreen mode
2. **Direct URL**: Navigate directly using query parameters:
   ```
   http://localhost:3000?machine=MACHINE_ID&fullscreen=true
   ```
3. **Copy & Share**: Copy the current page URL when in fullscreen to share or bookmark specific machines

### Exiting Fullscreen Mode

- **Click Game Logo**: Click the game logo again to exit fullscreen
- **Escape Key**: Press ESC to exit fullscreen mode
- **Exit Button**: Click the X button in the top-right corner

### Features

- **Kiosk Mode**: Perfect for dedicated displays next to pinball machines
- **Auto-refresh**: Automatically fetches latest high scores
- **Responsive**: Adapts to any screen size
- **Shareable URLs**: Copy and paste URLs to go directly to specific machines in fullscreen

### Usage Examples

- **Next to a machine**: `?machine=12345&fullscreen=true`
- **Sharing high scores**: Copy the URL and send to friends
- **Bookmarking favorites**: Save direct links to your favorite machines
- **Digital signage**: Display rotating machines on TVs or monitors
- **Tournament displays**: Show specific tournament machines
- **Home arcade displays**: Dedicated kiosk mode for home setups

### Finding Machine IDs

To get a machine ID for direct URL access:
1. Click on any game logo to enter fullscreen
2. Copy the URL from your browser's address bar
3. The machine ID will be in the URL as `machine=XXXXX`
4. Use this ID to create direct links or bookmarks

## Browser Kiosk Mode

For dedicated kiosk displays, you can launch browsers in full kiosk mode to hide all browser UI elements:

### Chrome/Chromium Kiosk Mode
```bash
# Basic kiosk mode (hides all UI, prevents navigation)
google-chrome --kiosk http://localhost:3000?machine=12345&fullscreen=true

# Advanced kiosk mode with additional security
google-chrome --kiosk \
  --no-first-run \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-web-security \
  --disable-features=TranslateUI \
  --disable-ipc-flooding-protection \
  http://localhost:3000?machine=12345&fullscreen=true
```

### Firefox Kiosk Mode
```bash
# Firefox fullscreen mode
firefox --kiosk http://localhost:3000?machine=12345&fullscreen=true

# Or use private browsing with fullscreen
firefox --private-window --new-instance http://localhost:3000?machine=12345&fullscreen=true
# Then press F11 to enter fullscreen
```

### Edge Kiosk Mode
```bash
# Microsoft Edge kiosk mode
microsoft-edge --kiosk http://localhost:3000?machine=12345&fullscreen=true
```

### Additional Kiosk Tips

- **Auto-start on boot**: Add kiosk command to system startup scripts
- **Prevent navigation**: Kiosk mode blocks most user navigation attempts
- **Screen saver**: Disable screen saver for always-on displays
- **Touch displays**: Works great with touch screens for interactive kiosks
- **Multiple displays**: Run separate browser instances for different machines
- **Recovery**: Use Ctrl+Alt+T (Linux) or Ctrl+Shift+Esc (Windows) for emergency access

### Raspberry Pi Kiosk Setup
```bash
# Install Chromium on Raspberry Pi
sudo apt update && sudo apt install chromium-browser

# Add to autostart (create ~/.config/autostart/kiosk.desktop)
[Desktop Entry]
Type=Application
Name=Kiosk
Exec=chromium-browser --kiosk --no-sandbox http://localhost:3000?machine=12345&fullscreen=true
Hidden=false
NoDisplay=false
X-GNOME-Autostart-enabled=true
```

### Exit Kiosk Mode
- **Alt + F4**: Close browser window
- **Ctrl + Shift + Q**: Quit Chrome/Chromium
- **Alt + Tab**: Switch between applications (if available)
- **System power button**: Hardware reset option
