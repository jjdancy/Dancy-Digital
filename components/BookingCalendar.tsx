"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export default function BookingCalendar() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "intro-call" });
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#ff5a1f" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace="intro-call"
      calLink="dancydigital/intro-call"
      style={{ width: "100%", height: "100%", overflow: "auto" }}
      config={{ layout: "month_view", theme: "light" }}
    />
  );
}
