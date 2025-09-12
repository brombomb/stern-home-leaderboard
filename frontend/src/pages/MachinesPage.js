
import { useEffect, useRef, useState } from 'react';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import MachineCard from '../components/MachineCard';
import Toast from '../components/Toast';
import { GRID_COLUMNS } from '../config';
import { triggerCelebration } from '../utils/confetti';
import './MachinesPage.css';

function MachinesPage({
  machines,
  highScores,
  avatars,
  loading,
  loadingScores,
  error,
  fetchHighScores,
  newScoreIds,
  newScoreNotification,
  setNewScoreNotification,
}) {

  const pageRef = useRef(null);
  const scrollIntervalRef = useRef(null);
  const isScrollingDown = useRef(true);
  const userActivityTimeoutRef = useRef(null);
  const pauseAtEndTimeoutRef = useRef(null);
  const isScrollPausedRef = useRef(false);
  const isPausedAtEndRef = useRef(false);
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  const [resumeCountdown, setResumeCountdown] = useState(0);

  // Handle new score notifications and confetti
  useEffect(() => {
    if (newScoreNotification) {
      triggerCelebration();
    }
  }, [newScoreNotification]);

  const handleCloseToast = () => {
    setNewScoreNotification(null);
  };

  useEffect(() => {
    // Only start auto-scrolling if we have machines and the content is loaded
    if (!loading && !error && machines.length > 0) {
      const startAutoScroll = () => {
        // Clear any existing interval
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }

        // Wait a moment for content to render
        setTimeout(() => {
          scrollIntervalRef.current = setInterval(() => {
            if (!pageRef.current || isScrollPausedRef.current || isPausedAtEndRef.current) {
              return;
            }

            const currentScrollY = window.scrollY;
            const maxScrollY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

            // Only proceed if there's content to scroll
            if (maxScrollY <= 0) {
              return;
            }

            // If we're at or near the bottom, pause for a moment then start scrolling up
            if (currentScrollY >= maxScrollY - 5 && isScrollingDown.current) {
              isPausedAtEndRef.current = true;
              pauseAtEndTimeoutRef.current = setTimeout(() => {
                isScrollingDown.current = false;
                isPausedAtEndRef.current = false;
              }, 2000); // Pause for 2 seconds at bottom
              return;
            } else if (currentScrollY <= 5 && !isScrollingDown.current) {
              // If we're at or near the top, pause for a moment then start scrolling down
              isPausedAtEndRef.current = true;
              pauseAtEndTimeoutRef.current = setTimeout(() => {
                isScrollingDown.current = true;
                isPausedAtEndRef.current = false;
              }, 2000); // Pause for 2 seconds at top
              return;
            }

            // Scroll direction and speed (slower for better readability)
            const scrollSpeed = 1; // Increased from 0.5 for more visible movement
            let targetY;

            if (isScrollingDown.current) {
              targetY = Math.min(maxScrollY, currentScrollY + scrollSpeed);
            } else {
              targetY = Math.max(0, currentScrollY - scrollSpeed);
            }

            window.scrollTo({
              top: targetY,
              behavior: 'auto', // Use 'auto' for smooth continuous scrolling
            });
          }, 50); // Increased interval for better performance
        }, 1000); // Wait 1 second before starting
      };

      const pauseScrolling = () => {
        isScrollPausedRef.current = true;
        setIsScrollPaused(true);

        // Clear existing timeout
        if (userActivityTimeoutRef.current) {
          clearTimeout(userActivityTimeoutRef.current);
        }

        // Start countdown
        const countdownDuration = 3; // 3 seconds
        setResumeCountdown(countdownDuration);

        const countdownInterval = setInterval(() => {
          setResumeCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Resume scrolling after 3 seconds of inactivity
        userActivityTimeoutRef.current = setTimeout(() => {
          clearInterval(countdownInterval);
          isScrollPausedRef.current = false;
          setIsScrollPaused(false);
          setResumeCountdown(0);
        }, countdownDuration * 1000);
      };

      // Throttle user activity detection to avoid too frequent pausing
      let lastActivityTime = 0;
      const handleUserActivity = () => {
        const now = Date.now();
        if (now - lastActivityTime > 500) { // Only trigger once every 500ms
          lastActivityTime = now;
          pauseScrolling();
        }
      };

      // Add event listeners for user activity (reduced set for less interference)
      window.addEventListener('mousedown', handleUserActivity);
      window.addEventListener('keydown', handleUserActivity);
      window.addEventListener('wheel', handleUserActivity);
      window.addEventListener('touchstart', handleUserActivity);

      startAutoScroll();

      // Cleanup function
      return () => {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }
        if (userActivityTimeoutRef.current) {
          clearTimeout(userActivityTimeoutRef.current);
        }
        if (pauseAtEndTimeoutRef.current) {
          clearTimeout(pauseAtEndTimeoutRef.current);
        }

        // Remove event listeners
        window.removeEventListener('mousedown', handleUserActivity);
        window.removeEventListener('keydown', handleUserActivity);
        window.removeEventListener('wheel', handleUserActivity);
        window.removeEventListener('touchstart', handleUserActivity);
      };
    }
  }, [loading, error, machines.length]); // Removed isScrollPaused and isPausedAtEnd from dependencies

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="machines-page" ref={pageRef}>
      {/* Toast notification for new scores */}
      <Toast
        message={newScoreNotification?.message}
        isVisible={!!newScoreNotification}
        onClose={handleCloseToast}
      />

      {isScrollPaused && (
        <div className="scroll-pause-indicator visible">
          Auto-scroll paused{resumeCountdown > 0 ? ` - resuming in ${resumeCountdown}s` : ' - will resume in a few seconds'}
        </div>
      )}
      {machines.length === 0 ? (
        <div className="no-machines-message">No machines found.</div>
      ) : (
        <div
          className="machines-container"
          style={{
            '--grid-columns': GRID_COLUMNS,
          }}
        >
          {machines.map(machine => (
            <MachineCard
              key={machine.id}
              machine={machine}
              highScores={highScores}
              loadingScores={loadingScores}
              avatars={avatars}
              onFetchHighScores={fetchHighScores}
              newScoreIds={newScoreIds[machine.id] || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MachinesPage;
