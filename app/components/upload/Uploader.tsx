"use client";

import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";
import { useUploadThing } from "@/uploadthing";
import type { OurFileRouter } from "@/api/uploadthing/core";
import PrimaryButton from "@/components/ui/PrimaryButton";

type Endpoint = keyof OurFileRouter;

const ACCEPT: Record<Endpoint, string> = {
  image: "image/*",
  logo: "image/*",
  pdf: "application/pdf",
  video: "video/*",
};

export default function Uploader({
  endpoint = "image",
  multiple = false,
  buttonText = "Upload",
  variant = "glass",
  onComplete,
}: {
  endpoint?: Endpoint;
  multiple?: boolean;
  buttonText?: string;
  variant?: "solid" | "glass" | "ghost";
  onComplete: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      const urls = (res ?? [])
        .map((r) => (r as { url?: string; ufsUrl?: string }).url ?? (r as any).ufsUrl)
        .filter(Boolean) as string[];
      if (urls.length) {
        onComplete(urls);
        toast.success(urls.length > 1 ? `${urls.length} files uploaded` : "Uploaded");
      }
      setProgress(null);
    },
    onUploadError: (e) => {
      toast.error(`Upload failed: ${e.message}`);
      setProgress(null);
    },
    onUploadProgress: (p) => setProgress(p),
  });

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[endpoint]}
        multiple={multiple}
        className="hidden"
        onChange={async (e) => {
          const files = e.target.files;
          if (files && files.length) await startUpload(Array.from(files));
          e.target.value = "";
        }}
      />
      <PrimaryButton
        as="button"
        type="button"
        variant={variant}
        onClick={() => inputRef.current?.click()}
        loading={isUploading}
        loadingText={progress !== null ? `${progress}%` : "Uploading…"}
      >
        <Upload className="h-4 w-4" />
        {buttonText}
      </PrimaryButton>
    </>
  );
}
