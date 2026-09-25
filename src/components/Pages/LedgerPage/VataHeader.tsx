import { TVataInformation } from "@/interface/vata";
import { MapPin, Phone, User } from "lucide-react";
export default function VataHeader({
    vata,
}: {
    vata: TVataInformation;
}) {
    const data = vata;

    if (!data) return null;

    const contactPeople = [
        data.challanPersonOneName && {
            label: data.challanPersonOneName,
            phone: data.challanPersonOnePhoneNumber,
        },
        data.challanPersonTwoName && {
            label: data.challanPersonTwoName,
            phone: data.challanPersonTwoPhoneNumber,
        },
        data.challanManagerPhoneNumber && {
            label: "ম্যানেজার",
            phone: data.challanManagerPhoneNumber,
        },
    ].filter(Boolean) as {
        label: string;
        phone?: string;
    }[];

    return (
        <div className="relative mb-4 overflow-hidden rounded-md bg-[#039A63]">
            {/* Soft background glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl" />

            <div className="relative mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-7">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="min-w-0 flex-1">
                        <h2 className="text-2xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                            {data.nameBangla}
                        </h2>

                        {data.shortDescription && (
                            <p className="mt-1 text-sm text-white md:text-[15px]">
                                {data.shortDescription}
                            </p>
                        )}

                        {/* Owner & Address */}
                        <div className="mt-2 flex flex-col items-center gap-2 text-sm text-white">
                            {data.ownerName && (
                                <span className="inline-flex items-center justify-center gap-1.5">
                                    <User className="h-4 w-4 text-white/60" />

                                    <span className="font-semibold text-white">
                                        প্রোঃ {data.ownerName}
                                    </span>

                                    {data.ownerPhoneNumber && (
                                        <span>
                                            · {data.ownerPhoneNumber}
                                        </span>
                                    )}
                                </span>
                            )}

                            {(data.additionalAddress || data.address) && (
                                <span className="inline-flex font-semibold  items-center justify-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-white/60" />

                                    <span>
                                        {[data.additionalAddress, data.address]
                                            .filter(Boolean)
                                            .join(" • ")}
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Challan Contacts */}
                {contactPeople.length > 0 && (
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                        {contactPeople.map((person, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.08] px-3 py-1.5 text-sm text-white/80"
                            >
                                <Phone className="h-3 w-3 text-white/60" />

                                <span className="font-semibold text-white">
                                    {person.label}
                                </span>

                                {person.phone && (
                                    <span className="text-white">
                                        {person.phone}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Brand Accent */}
            <div className="h-0.5 w-full bg-white/20" />
        </div>
    );
}