"use client";

import Image from "next/image";
import { X } from "lucide-react";

type ImageViewModalProps = {
    image: string;
    isOpen: boolean;
    onClose: () => void;
    alt?: string;
};

const ImageViewModal = ({
    image,
    isOpen,
    onClose,
    alt = "Image",
}: ImageViewModalProps) => {
    if (!isOpen || !image) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center bg-black/10 backdrop-blur-sm"
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-red-500
                 text-white transition hover:bg-red-500/80 cursor-pointer"
            >
                <X size={24} />
            </button>

            <div
                className="relative h-full w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${image}`}
                    alt={alt}
                    fill
                    unoptimized
                    className="object-contain p-6"
                    sizes="100vw"
                    priority
                />
            </div>
        </div>
    );
};

export default ImageViewModal;