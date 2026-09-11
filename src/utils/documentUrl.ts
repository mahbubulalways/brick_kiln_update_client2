

export default function documentUrl(name:string) {
 return `${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${name}`
}
