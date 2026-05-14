import { useEffect, useState } from "react";

interface HUDProps {
  active: boolean;
}

const baseStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 2,
  fontFamily: "system-ui, -apple-system, sans-serif",
  pointerEvents: "none",
  userSelect: "none",
};

const pillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 14px",
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(8px)",
  borderRadius: 20,
  color: "#fff",
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: 0.2,
};

const kbdStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "2px 6px",
  background: "rgba(255,255,255,0.15)",
  borderRadius: 4,
  fontSize: 11,
  fontWeight: 600,
  fontFamily: "system-ui",
};

/**
 * Contextual navigation hints overlay.
 * Shows different tips depending on whether the user is
 * browsing the gallery or inside a panorama.
 */
export const HUD = ({ active }: HUDProps) => {
  const [showWelcome, setShowWelcome] = useState(true);

  // Auto-dismiss welcome message after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  // Reset welcome when returning to gallery
  useEffect(() => {
    if (!active) return;
    setShowWelcome(false);
  }, [active]);

  return (
    <>
      {/* Welcome tooltip — top center, fades out */}
      {showWelcome && !active && (
        <div
          style={{
            ...baseStyle,
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            animation: "fadeIn 0.4s ease",
          }}
        >
          <div
            style={{
              ...pillStyle,
              padding: "10px 20px",
              fontSize: 14,
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span>Welcome to Portal Panoramas</span>
            <span style={{ opacity: 0.7, fontSize: 12 }}>
              Explore the gallery below
            </span>
          </div>
        </div>
      )}

      {/* Bottom center — contextual navigation hints */}
      <div
        style={{
          ...baseStyle,
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 10,
          transition: "opacity 0.3s ease",
        }}
      >
        {active ? (
          <>
            <span style={pillStyle}>
              Drag to look around
            </span>
            <span style={pillStyle}>
              <kbd style={kbdStyle}>ESC</kbd> Exit panorama
            </span>
          </>
        ) : (
          <>
            <span style={pillStyle}>
              Drag to pan
            </span>
            <span style={pillStyle}>
              Scroll to zoom
            </span>
            <span style={pillStyle}>
              Double-click a card to enter
            </span>
          </>
        )}
      </div>
    </>
  );
};
