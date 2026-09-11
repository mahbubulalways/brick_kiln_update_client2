import { IDocument } from "@/interface/document";
import FileTypeIcon from "./FileTypeIcon";
import Image from "next/image";
import Link from "next/link";

const ImagePreview = ({ file }: { file: IDocument }) => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${file.name}`;

    if (file.mimeType?.startsWith("image/") && file.name) {
        return (
            <Link
                href={url}
                target="_blank"
                className="block h-full w-full"
            >
                <Image
                    src={url}
                    alt={file.name}
                    width={100}
                    height={100}
                    unoptimized
                    className="h-full w-full object-cover"
                />
            </Link>
        );
    }

    return <Link href={url}
        target="_blank"><FileTypeIcon file={file} /></Link>;
};

export default ImagePreview;