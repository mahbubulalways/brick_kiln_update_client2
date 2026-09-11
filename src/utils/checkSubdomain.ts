export const checkSubdomain = async (
    subdomain: string
): Promise<boolean> => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/v1/vata/verify-domain/${subdomain}`,
            {
                method: "GET",
                cache: "no-store",
            }
        );
        console.log(response.ok)
        return response.ok;
    } catch (error) {
        console.error("Subdomain check error:", error);
        return false;
    }
};