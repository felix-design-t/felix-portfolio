import { Suspense } from "react";
import { PillClock, SiteHeaderBar } from "@/components/site-header-client";

export function SiteHeader() {
  return (
    <SiteHeaderBar
      clock={
        <Suspense fallback={<time className="pill-clock">––:––</time>}>
          <PillClock />
        </Suspense>
      }
    />
  );
}
