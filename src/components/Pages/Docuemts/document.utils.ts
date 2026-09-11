import { IDocument } from "@/interface/document";

export const isImage = (file: IDocument) => {
    return file.mimeType?.startsWith("image/") ?? false;
};

export const isVideo = (file: IDocument) => {
    return file.mimeType?.startsWith("video/") ?? false;
};

export const isAudio = (file: IDocument) => {
    return file.mimeType?.startsWith("audio/") ?? false;
};

export const isPdf = (file: IDocument) => {
    return (
        file.mimeType === "application/pdf" ||
        file.extension?.toLowerCase() === "pdf"
    );
};