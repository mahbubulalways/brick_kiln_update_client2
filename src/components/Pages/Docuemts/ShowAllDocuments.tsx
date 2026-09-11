"use client";

import React, { useState } from "react";

import {
    Folder,
    FileText,
    MoreVertical,
    FileImage,
    FileVideo,
    FileAudio,
    File,
    FileType2,
    X,
    Download,
} from "lucide-react";

import { useGetAllDocumentsQuery } from "@/redux/features/document.features";
import { IDocument } from "@/interface/document";

import Link from "next/link";
import Image from "next/image";

import ImagePreview from "./ImagePreview";
import { isImage } from "./document.utils";
import { WindowsFolderIcon } from "./WindowsFolderIcon";
import FileTypeIcon from "./FileTypeIcon";
import { CommonActionMenu } from "./CommonActionMenu";

import UpdateFolderNameModal from "@/components/Dashboard/Modals/EditModals/UpdateFolderNameModal";

import { CommonFolderActionMenu } from "./CommonFolderActionMenu";

interface ShowAllDocumentsProps {
    orientation: "grid" | "list" | "image";
    documents: IDocument[];
}

export default function ShowAllDocuments({
    documents,
    orientation,
}: ShowAllDocumentsProps) {
    const folders = documents?.filter(
        (item) => item.type === "FOLDER"
    );

    const files = documents?.filter(
        (item) => item.type === "FILE"
    );

    if (orientation === "list") {
        return (
            <>
                <div className="mt-5 space-y-6">
                    {/* FOLDERS */}
                    {folders.length > 0 && (
                        <div>
                            <div className="space-y-2">
                                {folders.map((folder) => (
                                    <Link
                                        href={`/dashboard/documents/folder/${folder.id}`}
                                        key={folder.id}
                                        className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-[#039A63] hover:bg-[#f8fffc] hover:shadow-sm"
                                    >
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f7f1]">
                                                <Folder
                                                    size={22}
                                                    className="text-[#039A63]"
                                                    fill="currentColor"
                                                    fillOpacity={0.15}
                                                />
                                            </div>

                                            <p className="truncate text-sm font-medium text-gray-700">
                                                {folder.name}
                                            </p>
                                        </div>

                                        <MoreVertical
                                            size={18}
                                            className="ml-4 shrink-0 text-gray-400"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* FILES */}
                    {files.length > 0 && (
                        <div>
                            <div className="space-y-2">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => isImage(file)}
                                        className="flex min-h-[64px] cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-[#039A63] hover:bg-[#f8fffc] hover:shadow-sm"
                                    >
                                        <Link
                                            href={`${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${file.name}`}
                                            target="_blank"
                                        >
                                            <div className="flex min-w-0 items-center gap-4">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                                                    {isImage(file) &&
                                                    file.name ? (
                                                        <Image
                                                            alt={file.name}
                                                            width={100}
                                                            height={100}
                                                            unoptimized
                                                            src={`${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${file.name}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <FileTypeIcon
                                                            file={file}
                                                            size={22}
                                                        />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-gray-700">
                                                        {file.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {file.extension?.toUpperCase()}

                                                        {file.size
                                                            ? ` • ${file.size}`
                                                            : ""}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        <CommonActionMenu
                                            file={file}
                                            className="text-gray-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!documents.length && <EmptyDocuments />}
                </div>
            </>
        );
    }

    if (orientation === "image") {
        return (
            <>
                <div className="mt-5">
                    {files.length > 0 && (
                        <div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        onClick={() => isImage(file)}
                                        className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-[#039A63] hover:shadow-sm"
                                    >
                                        <div className="relative flex h-[150px] items-center justify-center overflow-hidden bg-[#f8f9fa]">
                                            <ImagePreview file={file} />

                                            <CommonActionMenu
                                                file={file}
                                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 opacity-100 shadow-sm transition-all group-hover:bg-white group-hover:text-gray-800 focus:outline-none focus-visible:ring-0 data-[state=open]:opacity-100"
                                            />
                                        </div>

                                        <div className="p-3">
                                            <p className="truncate text-sm font-medium text-gray-700">
                                                {file.name}
                                            </p>

                                            <p className="mt-1 text-xs text-gray-400">
                                                {file.extension?.toUpperCase()}

                                                {file.size
                                                    ? ` • ${file.size}`
                                                    : ""}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!documents.length && (
                        <EmptyDocuments />
                    )}
                </div>
            </>
        );
    }

    return (
        <>
            <div className="mt-5 space-y-6">
                {/* FOLDERS */}
                {folders?.length > 0 && (
                    <div>
                        <div className="flex flex-wrap gap-5">
                            {folders.map((folder) => (
                                <div
                                    key={folder.id}
                                    className="group relative flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-yellow-300 hover:bg-yellow-50/30 hover:shadow-sm"
                                >
                                    <Link
                                        href={`/dashboard/documents/folder/${folder.id}`}
                                    >
                                        <div className="flex h-[80px] items-center justify-center">
                                            <WindowsFolderIcon size={100} />
                                        </div>

                                        <p
                                            title={folder.name}
                                            className="max-w-[120px] truncate pt-3 text-center text-sm font-medium text-gray-700"
                                        >
                                            {folder.name}
                                        </p>
                                    </Link>

                                    <CommonFolderActionMenu
                                        folder={folder}
                                        className="absolute right-0 top-1 flex h-8 w-8 items-center justify-center  text-gray-500 
                                        opacity-100 cursor-pointer transition-all duration-200 hover:bg-white
                                         hover:text-gray-800 focus:outline-none focus-visible:ring-0 
                                         data-[state=open]:opacity-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FILES */}
                {files?.length > 0 && (
                    <div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {files?.map((file) => (
                                <div
                                    key={file.id}
                                    className="group relative overflow-hidden rounded-lg border border-[#dadce0] bg-white transition-all duration-200 hover:shadow-md"
                                >
                                    <div className="relative flex h-[150px] items-center justify-center overflow-hidden bg-[#f8f9fa]">
                                        <ImagePreview file={file} />

                                        <CommonActionMenu
                                            file={file}
                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 opacity-100 shadow-sm transition-all group-hover:bg-white group-hover:text-gray-800 focus:outline-none focus-visible:ring-0 data-[state=open]:opacity-100"
                                        />
                                    </div>

                                    <div className="px-3 pb-2 pt-3">
                                        <p
                                            title={file.name}
                                            className="truncate text-sm font-medium text-[#202124]"
                                        >
                                            {file.name}
                                        </p>

                                        <div className="mt-1 flex items-center gap-1 text-[11px] text-[#70757a]">
                                            <span>
                                                {file.extension?.toUpperCase()}
                                            </span>

                                            {file.size && (
                                                <>
                                                    <span>•</span>

                                                    <span>
                                                        {(
                                                            Number(file.size) /
                                                            (1024 * 1024)
                                                        ).toFixed(2)}{" "}
                                                        MB
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!documents?.length && (
                    <EmptyDocuments />
                )}
            </div>
        </>
    );
}

const EmptyDocuments = () => {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <p className="text-sm text-gray-500">
                কোনো ডকুমেন্ট পাওয়া যায়নি।
            </p>
        </div>
    );
};