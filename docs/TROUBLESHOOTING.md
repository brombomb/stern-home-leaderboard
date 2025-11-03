# Troubleshooting Guide

## Common Issues

### Authentication Failures
- Verify STERN_USERNAME and STERN_PASSWORD are correct
- Check that your Stern account has machine access
- Ensure your Stern account is active and in good standing

### No Machines Displayed
- Ensure machines are registered to your Stern account
- Check backend logs for API errors
- Verify your Stern account has associated pinball machines

### Missing Avatars
- Avatars depend on player profiles in Stern's system
- Players must have uploaded avatars in their Stern accounts
- Player Avatars are pulled from your **Home Team ONLY**

### Connection Issues
- Verify internet connectivity
- Check if Stern's API endpoints are accessible
- Ensure firewall is not blocking outbound connections
- Try restarting the application containers

### Docker Issues
- **Container won't start**: Check Docker logs with `docker-compose logs`
- **Port conflicts**: Ensure ports 3000 and 5100 are available
- **Permission issues**: Check file permissions on the project directory
- **Build failures**: Clear Docker cache with `docker system prune`

### Environment Variable Issues
- **Variables not loading**: Ensure `.env` file is in the project root
- **Syntax errors**: Check for spaces around `=` in environment variables
- **Missing variables**: Verify all required variables are set


### Common API Errors

**401 Unauthorized**
- Check Stern credentials
- Try re-authentication
- Verify account status

**403/429 Too Many Requests**
- Reduce refresh interval
- Wait before retrying
- Check for rate limiting

**404 Not Found**
- Check machine ID is correct
- Ensure machine is registered to your account

**500 Server Error**
- Check backend logs
- Verify Stern API is accessible
- Check for configuration issues

## Browser Issues

### Fullscreen Mode Problems
- **Not entering fullscreen**: Check browser permissions
- **Exiting unexpectedly**: Try different exit methods (ESC, click logo)
- **URL parameters not working**: Verify machine ID format

### Kiosk Mode Issues
- **Browser controls visible**: Use proper kiosk flags
- **Navigation allowed**: Check kiosk command parameters
- **Touch not working**: Verify touch screen drivers

## Custom CSS Issues

### Styles Not Applying
- Check file permissions and mounting
- Verify CSS syntax is valid
- Check browser developer tools for errors

### File Not Found
- Check volume mount path in docker-compose.yml
- Verify file exists on host system
- Ensure correct file permissions

### Override Not Working
- Use more specific CSS selectors
- Add `!important` declarations if needed
- Check CSS load order
- Verify target elements exist

## Getting Help

### Debug Information
- Operating system and version
- Docker and Docker Compose versions
- Browser and version (for frontend issues)
- Environment variable configuration (excluding credentials)
- Steps to reproduce the issue
- Expected vs actual behavior

### Resources
- Check the [Issues](https://github.com/brombomb/stern-home-leaderboard/issues) page for known problems
- Review [Stern Pinball API documentation](https://insider.sternpinball.com/) for API-related issues
- Consult Docker documentation for container issues
