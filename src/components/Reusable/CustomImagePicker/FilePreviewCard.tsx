"use client";

import Image from "next/image";
import { Eye, FileText, Trash2 } from "lucide-react";

type FilePreviewCardProps = {
  file: File;
  preview?: string;
  onView: () => void;
  onDelete: () => void;
};

export default function FilePreviewCard({
  file,
  preview,
  onView,
  onDelete,
}: FilePreviewCardProps) {
  // const isPdf = file.type === "application/pdf";
  const isImage = file.type.startsWith("image/");

  return (
    <div className="flex h-full flex-col">
      <div className="group relative flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {isImage && preview ? (
          <Image src={preview} alt={file.name} fill className="object-cover" />
        ) : (
          <div className="flex flex-col items-center text-red-500">
            <FileText className="h-16 w-16" />
            <span className="mt-2 text-xs font-medium">PDF</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            type="button"
            onClick={onView}
            className="rounded-full bg-white p-2 cursor-pointer text-gray-700 transition hover:scale-110 hover:bg-blue-500 hover:text-white"
          >
            <Eye className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-full bg-white p-2 cursor-pointer text-gray-700 transition hover:scale-110 hover:bg-red-500 hover:text-white"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
