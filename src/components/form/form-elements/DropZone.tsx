"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import ComponentCard from "../../common/ComponentCard";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { UploadIcon, TrashBinIcon, EyeIcon } from "@/icons";

interface FileWithPreview extends File {
  preview?: string;
}

export default function DropzoneComponent() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [previewImage, setPreviewImage] = useState<FileWithPreview | null>(null);
  const { isOpen, openModal, closeModal } = useModal();

  // Keep a ref always pointing at the latest files so the unmount cleanup
  // can revoke all object URLs without needing `files` as a dependency.
  const filesRef = useRef<FileWithPreview[]>(files);
  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        })
      ),
    ]);
  }, []);

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => {
      const target = prevFiles.find((f) => f.name === fileName);
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prevFiles.filter((f) => f.name !== fileName);
    });
  };

  const handleOpenPreview = (file: FileWithPreview) => {
    setPreviewImage(file);
    openModal();
  };

  const handleClosePreview = () => {
    closeModal();
    setPreviewImage(null);
  };

  // Revoke all object URLs only when the component unmounts to prevent memory leaks.
  // Using an empty dependency array ensures cleanup does NOT run after every drop,
  // which would revoke URLs immediately and break the preview images.
  useEffect(() => {
    return () => {
      filesRef.current.forEach((file) => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    isFocused,
  } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
      "image/svg+xml": [".svg"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  const getBorderColor = () => {
    if (isDragReject) return "border-red bg-red-soft/60";
    if (isDragAccept) return "border-dark bg-tile/60";
    if (isFocused) return "border-dark ring-2 ring-dark/20 bg-tile";
    return "border-line bg-tile hover:border-dark";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <ComponentCard title="Dropzone">
      <div>
        <div
          {...getRootProps()}
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-tile border border-dashed p-7 text-center transition-all duration-200 outline-hidden lg:p-10 ${getBorderColor()}`}
        >
          {/* Hidden file input handled by react-dropzone */}
          <input {...getInputProps()} />

          <div className="flex flex-col items-center">
            {/* Icon Container */}
            <div className="mb-4 flex size-15 items-center justify-center rounded-full bg-icon text-ink">
              <UploadIcon className="size-6 text-current" />
            </div>

            {/* Title / Status Message */}
            <h4 className="mb-2 text-fx-20 font-medium text-ink">
              {isDragReject
                ? "File type not supported"
                : isDragAccept
                ? "Drop images here"
                : isDragActive
                ? "Drop files here"
                : "Drag & Drop Files Here"}
            </h4>

            {/* Helper Text */}
            <p className="mb-4 max-w-72.5 text-fx-15 text-secondary">
              {isDragReject
                ? "Only PNG, JPG, WebP, and SVG images up to 5MB are allowed"
                : "Drag and drop your PNG, JPG, WebP, SVG images here or browse"}
            </p>

            {/* Action Prompt */}
            <span className="text-fx-15 font-medium text-orange underline hover:text-orange">
              Browse File
            </span>
          </div>
        </div>

        {/* Uploaded Images Preview Gallery */}
        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-fx-15 font-medium text-ink">
                Uploaded Images ({files.length})
              </h5>
              <button
                type="button"
                onClick={() => {
                  files.forEach((f) => {
                    if (f.preview) URL.revokeObjectURL(f.preview);
                  });
                  setFiles([]);
                }}
                className="text-fx-14 font-medium text-red hover:text-red"
              >
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {files.map((file) => (
                <div
                  key={`${file.name}-${file.lastModified}`}
                  className="group relative overflow-hidden rounded-tile border border-line bg-card transition"
                >
                  {/* Image Preview Container */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-tile">
                    {file.preview ? (
                      <Image
                        src={file.preview}
                        alt={file.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted">
                        <UploadIcon className="size-8" />
                      </div>
                    )}

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-dark/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      {file.preview && (
                        <button
                          type="button"
                          onClick={() => handleOpenPreview(file)}
                          className="flex size-8 items-center justify-center rounded-full bg-white/90 text-ink backdrop-blur-xs transition hover:bg-card"
                          title="Preview image"
                          aria-label={`Preview ${file.name}`}
                        >
                          <EyeIcon className="size-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(file.name)}
                        className="flex size-8 items-center justify-center rounded-full bg-white/90 text-red backdrop-blur-xs transition hover:bg-card"
                        title="Remove image"
                        aria-label={`Remove ${file.name}`}
                      >
                        <TrashBinIcon className="size-4" />
                      </button>
                    </div>
                  </div>

                  {/* File Metadata */}
                  <div className="p-3">
                    <p className="truncate text-fx-14 font-medium text-ink" title={file.name}>
                      {file.name}
                    </p>
                    <p className="mt-0.5 text-fx-11 text-secondary">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Image Preview Modal */}
        <Modal
          isOpen={isOpen}
          onClose={handleClosePreview}
          className="max-w-2xl p-6 sm:p-8"
        >
          {previewImage && (
            <div>
              <div className="mb-4">
                <h4 className="text-fx-17 font-medium text-ink">
                  Image Preview
                </h4>
                <p className="text-fx-14 text-secondary">
                  {previewImage.name} • {formatFileSize(previewImage.size)}
                </p>
              </div>

              <div className="relative aspect-video w-full overflow-hidden rounded-tile border border-line bg-tile">
                {previewImage.preview && (
                  <Image
                    src={previewImage.preview}
                    alt={previewImage.name}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ComponentCard>
  );
}


