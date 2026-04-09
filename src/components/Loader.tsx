import { useProgress } from "@react-three/drei";

/**
 * HTML overlay that shows loading progress while the 3D scene initializes.
 * Sits outside the Canvas so it renders immediately.
 */
export const Loader = () => {
  const { progress, active } = useProgress();

  if (!active) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#1a1a2e",
        zIndex: 10,
        fontFamily: "system-ui, sans-serif",
        color: "#fff",
        transition: "opacity 0.4s ease",
      }}
    >
      <p style={{ fontSize: 18, marginBottom: 16, opacity: 0.8 }}>
        Loading panoramas...
      </p>
      <div
        style={{
          width: 200,
          height: 4,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#635bff",
            borderRadius: 2,
            transition: "width 0.2s ease",
          }}
        />
      </div>
      <p style={{ fontSize: 13, marginTop: 8, opacity: 0.5 }}>
        {progress.toFixed(0)}%
      </p>
    </div>
  );
};
