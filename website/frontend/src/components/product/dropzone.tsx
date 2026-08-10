"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { UploadSimple } from "@phosphor-icons/react/dist/ssr/UploadSimple";
import { X } from "@phosphor-icons/react/dist/ssr/X";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr/WarningCircle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_BYTES = 15 * 1024 * 1024;

export function Dropzone({
  value,
  onChange,
  disabled,
}: {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) return;
    const url = URL.createObjectURL(value);
    // Object URLs are an external resource requiring imperative create/revoke —
    // there's no way to derive this value during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [value]);

  const acceptFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setError("That file isn't an image. Try a JPG or PNG.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("That image is over 15MB. Try a smaller export.");
        return;
      }
      setError(null);
      onChange(file);
    },
    [onChange],
  );

  if (value && previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        <Image
          src={previewUrl}
          alt="Uploaded dermoscopic image"
          width={640}
          height={640}
          unoptimized
          className="aspect-square w-full object-cover"
        />
        {!disabled && (
          <Button
            variant="secondary"
            size="icon-sm"
            className="absolute top-3 right-3 shadow-sm"
            onClick={() => onChange(null)}
            aria-label="Remove image"
          >
            <X weight="bold" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          acceptFile(e.dataTransfer.files[0]);
        }}
        className={cn(
          "flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-secondary/30 hover:bg-secondary/50",
          disabled && "pointer-events-none opacity-60",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full border border-border bg-card">
          <UploadSimple weight="bold" className="size-5 text-primary" />
        </span>
        <span className="text-sm font-medium text-foreground">
          Drop a dermoscopic image, or click to browse
        </span>
        <span className="max-w-[26ch] text-xs text-muted-foreground">
          JPG or PNG, captured through a dermoscope. Up to 15MB.
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => acceptFile(e.target.files?.[0])}
      />
      {error && (
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-destructive">
          <WarningCircle weight="bold" className="size-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}
