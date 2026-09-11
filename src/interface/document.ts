export type DocumentType = "FILE" | "FOLDER";

export interface IDocument {
    id: string;
    name: string;
    type: DocumentType;

    parentId: string;

    fileUrl: string;
    fileKey: string;
    mimeType: string;
    size: number;
    extension: string;

    createdAt: string;
    updatedAt: string;
}