"use client";

import React, { useRef, useState } from "react";
import { useUploadThing } from "@/uploadthing";
import { toast } from "react-hot-toast";
import { Upload, Loader2 } from "lucide-react";

interface UploadResponse {
  ufsUrl: string;
  url: string;
}

interface UploaderProps {
  handleUploadComplete: (res: UploadResponse[]) => void;
  /** Current image URL — when set, the button is hidden */
  value?: string | null;
  buttonText?: string;
  maxFileCount?: number;
}

export default function Uploader({
  handleUploadComplete,
  value,
  buttonText = "Upload Photo",
  maxFileCount = 1,
}: UploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const { startUpload, isUploading } = useUploadThing("productImage", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        handleUploadComplete(res as UploadResponse[]);
        toast.success("Image uploaded successfully!");
      }
      setProgress(null);
    },
    onUploadError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
      setProgress(null);
    },
    onUploadProgress: (p) => setProgress(p),
  });

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await startUpload(Array.from(files));
    e.target.value = "";
  };

  // Hide the button once an image is present (and not currently uploading)
  if (value && !isUploading) return null;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={maxFileCount > 1}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleClick}
        disabled={isUploading}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.02] hover:shadow-lg transition-all duration-200"
        style={{
          background: "linear-gradient(135deg, #2563eb, #3b82f6)",
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
        }}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
            <span>{progress !== null ? `${progress}%` : "Uploading..."}</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 flex-shrink-0" />
            <span>{buttonText}</span>
          </>
        )}
      </button>
    </>
  );
}
