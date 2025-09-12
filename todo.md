- Cache Stern API Responses in case it goes offline
- Make a demo site
    -- Use https://cms.prd.sternpinball.io/api/v1/portal/game_titles/ to fetch all Stern Pinball Titles (public API, no auth)
    -- render a single High score table
    -- Render a List using the above API, on change update the images and styles for the high score table
    -- Add a New High Score button, when clicked highlights the first score row, and adds the confetti affect and the toast notification
    -- For high score data use the offline data found in `backend/offline`  Don't actually make API calls, just a "static" HTML file with the needed JSON embedded in it.

- Each machine has a gradient_start and gradient_stop property.  This should be the border color around the machine card using a vertical gradient.
