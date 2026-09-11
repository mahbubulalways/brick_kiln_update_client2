"use client";

import {
    File,
    FileArchive,
    FileAudio,
    FileAudio2,
    FileCode2,
    FileImage,
    FileSpreadsheet,
    FileText,
    FileType2,
    FileVideo,
    Presentation,
} from "lucide-react";

import { IDocument } from "@/interface/document";
import { PiFilePdf } from "react-icons/pi";

interface FileTypeIconProps {
    file: IDocument;
    size?: number;
}

const FileTypeIcon = ({
    file,
    size = 40,
}: FileTypeIconProps) => {
    const mimeType = file.mimeType?.toLowerCase() || "";
    const extension = file.extension?.toLowerCase().replace(".", "") || "";

    const iconProps = {
        size,
        strokeWidth: 1.4,
    };

    // =========================
    // Images
    // =========================
    if (
        mimeType.startsWith("image/") ||
        ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico", "avif"].includes(extension)
    ) {
        return (
            <FileImage
                {...iconProps}
                className="text-blue-500"
            />
        );
    }

    // =========================
    // Videos
    // =========================
    if (
        mimeType.startsWith("video/") ||
        ["mp4", "webm", "mkv", "avi", "mov", "wmv", "flv", "m4v"].includes(extension)
    ) {
        return (
            <FileVideo
                {...iconProps}
                className="text-purple-500"
            />
        );
    }

    // =========================
    // Audio
    // =========================
    if (
        mimeType.startsWith("audio/") ||
        ["mp3", "wav", "ogg", "m4a", "aac", "flac", "wma"].includes(extension)
    ) {
        return (
            <FileAudio2
                {...iconProps}
                className="text-orange-500"
            />
        );
    }

    // =========================
    // PDF
    // =========================
    if (
        mimeType === "application/pdf" ||
        extension === "pdf"
    ) {
        return (
            <PiFilePdf
                {...iconProps}
                className="text-red-500"
            />
        );
    }

    // =========================
    // Word / Documents
    // =========================
    if (
        [
            "doc",
            "docx",
            "odt",
            "rtf",
        ].includes(extension) ||
        mimeType.includes("word") ||
        mimeType.includes("document")
    ) {
        return (
            <FileText
                {...iconProps}
                className="text-blue-600"
            />
        );
    }

    // =========================
    // Excel / Spreadsheet
    // =========================
    if (
        [
            "xls",
            "xlsx",
            "xlsm",
            "csv",
            "ods",
        ].includes(extension) ||
        mimeType.includes("spreadsheet") ||
        mimeType.includes("excel")
    ) {
        return (
            <FileSpreadsheet
                {...iconProps}
                className="text-green-600"
            />
        );
    }

    // =========================
    // PowerPoint / Presentation
    // =========================
    if (
        [
            "ppt",
            "pptx",
            "pps",
            "ppsx",
            "odp",
        ].includes(extension) ||
        mimeType.includes("presentation") ||
        mimeType.includes("powerpoint")
    ) {
        return (
            <Presentation
                {...iconProps}
                className="text-orange-600"
            />
        );
    }

    // =========================
    // Text
    // =========================
    if (
        [
            "txt",
            "md",
            "markdown",
            "log",
            "text",
        ].includes(extension) ||
        mimeType === "text/plain" ||
        mimeType === "text/markdown"
    ) {
        return (
            <FileText
                {...iconProps}
                className="text-gray-500"
            />
        );
    }

    // =========================
    // Code
    // =========================
    if (
        [
            "js",
            "jsx",
            "ts",
            "tsx",
            "html",
            "css",
            "scss",
            "sass",
            "json",
            "xml",
            "php",
            "py",
            "java",
            "c",
            "cpp",
            "cs",
            "go",
            "rs",
            "sql",
            "sh",
            "bash",
        ].includes(extension) ||
        mimeType.startsWith("text/")
    ) {
        return (
            <FileCode2
                {...iconProps}
                className="text-cyan-600"
            />
        );
    }

    // =========================
    // Archive
    // =========================
    if (
        [
            "zip",
            "rar",
            "7z",
            "tar",
            "gz",
            "bz2",
        ].includes(extension) ||
        mimeType.includes("zip") ||
        mimeType.includes("compressed")
    ) {
        return (
            <FileArchive
                {...iconProps}
                className="text-yellow-600"
            />
        );
    }

    // =========================
    // Default
    // =========================
    return (
        <File
            {...iconProps}
            className="text-gray-400"
        />
    );
};

export default FileTypeIcon;