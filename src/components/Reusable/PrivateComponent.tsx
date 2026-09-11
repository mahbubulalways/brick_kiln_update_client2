"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGetMyVataNavbarFeaturesQuery } from "@/redux/features/vata.features";

import { TFeatureKey } from "@/components/Platform/PlatformPages/SubscriptionPage/CreateSubscriptionPage/subscription.features";

interface PrivateComponentProps {
  children: ReactNode;
  feature: TFeatureKey;
}

const PrivateComponent = ({
  children,
  feature,
}: PrivateComponentProps) => {
  const router = useRouter();

  const { data, isLoading } =
    useGetMyVataNavbarFeaturesQuery(undefined);

  const allowedFeatures: TFeatureKey[] =
    data?.data?.subscriptionPlan?.features ?? [];

  useEffect(() => {
    if (isLoading) return;

    // Vata information না থাকলে login page এ পাঠাবে
    if (!data?.data) {
      router.replace("/login");
      return;
    }

    // নির্দিষ্ট feature না থাকলে dashboard এ পাঠাবে
    if (feature && !allowedFeatures.includes(feature)) {
      router.replace("/dashboard");
    }
  }, [data, isLoading, feature, allowedFeatures, router]);

  // API loading হলে কিছু দেখাবে না
  if (isLoading) {
    return null;
  }

  // Vata না থাকলে কিছু render করবে না
  if (!data?.data) {
    return null;
  }

  // Feature permission না থাকলে কিছু render করবে না
  if (feature && !allowedFeatures.includes(feature)) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateComponent;