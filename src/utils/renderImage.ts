

export default function renderImage(image: string) {
    return `${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${image}`
}
