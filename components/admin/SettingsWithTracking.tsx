"use client";

import { useEffect } from "react";
import { trackSettingsView } from "@/lib/gtm/events";
import BrandSettingsForm from "./BrandSettingsForm";
import type { SiteSettings } from "@/lib/types";

export default function SettingsWithTracking({ settings }: { settings: SiteSettings }) {
  useEffect(() => {
    trackSettingsView();
  }, []);

  return <BrandSettingsForm initialSettings={settings} />;
}
