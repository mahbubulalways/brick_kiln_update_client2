import SingleSubscriptionPage from "@/components/Platform/PlatformPages/SubscriptionPage/SingleSubscriptionPage/SingleSubscriptionPage";
import { TParams } from "@/interface/query";

export default async function page(props: TParams) {
    const { id } = await props.params
    return (
        <div><SingleSubscriptionPage id={id}/></div>
    )
}
