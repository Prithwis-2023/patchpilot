"use client";

interface UploadCardProps {
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

export default function UploadCard({ onUpload, isUploading = false }: UploadCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("video/")) {
      onUpload(file);
    }
  };

  return (
    <div className="card w-full rounded-lg border-2 border-dashed p-8 text-center transition-colors glass-hover">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
        id="video-upload"
      />
      <label
        htmlFor="video-upload"
        className={`cursor-pointer ${isUploading ? "cursor-not-allowed opacity-50" : ""}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="rounded-full p-4"
            style={{
              backgroundColor: "var(--accent)",
              opacity: 0.1,
            }}
          >
            <svg
              className="h-8 w-8"
              style={{ color: "var(--accent)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-primary">
              {isUploading ? "Uploading..." : "Upload Bug Recording"}
            </p>
            <p className="mt-2 text-sm text-muted">
              {isUploading
                ? "Please wait while we process your video"
                : "Click to select an MP4 video file (30-60 seconds recommended)"}
            </p>
          </div>
        </div>
      </label>
    </div>
  );
}
