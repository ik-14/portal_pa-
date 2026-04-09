import { useState, useRef } from "react";

interface UploadImageProps {
  sessionId: string;
  onUploadComplete: () => void;
}

export const UploadImage = ({ sessionId, onUploadComplete }: UploadImageProps) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("sessionId", sessionId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      setMessage("Uploaded!");
      onUploadComplete();

      // Clear the message after a few seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 1,
        background: "rgba(255,255,255,0.95)",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        maxWidth: 240,
        fontSize: 14,
      }}
    >
      <label
        htmlFor="panorama-upload"
        style={{
          display: "block",
          padding: "10px 16px",
          background: uploading ? "#ccc" : "#635bff",
          color: "#fff",
          borderRadius: 8,
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {uploading ? "Uploading..." : "Upload Panorama"}
      </label>
      <input
        id="panorama-upload"
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: "none" }}
      />
      {message && (
        <p
          style={{
            marginTop: 8,
            marginBottom: 0,
            color: message.startsWith("Error") ? "#e25950" : "#30b566",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};
