import DocumentPage from "@/components/Pages/Docuemts/DocumentPage"
import CustomLoader from "@/components/Reusable/CustomLoader"
import PrivateComponent from "@/components/Reusable/PrivateComponent"
import { Suspense } from "react"

const Page = () => {

    return (
        <PrivateComponent feature="DOCUMENTS">
            <Suspense fallback={<div><CustomLoader cls="h-[30vh]" /></div>}>
                <DocumentPage />
            </Suspense >
        </PrivateComponent>
    )
}

export default Page