"use client";

import { useEffect } from "react";
import { getCalApi } from "@calcom/embed-react";

export default function CalEmbed() {
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

  return null;
}
