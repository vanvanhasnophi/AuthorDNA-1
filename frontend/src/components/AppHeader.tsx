import { useEffect, useState } from "react";
import { getAuthorDnaDataset } from "@/lib/author-dna-data";

export default function AppHeader() {
  const [userName, setUserName] = useState("Unknown");

  useEffect(() => {
    let isMounted = true;

    getAuthorDnaDataset()
      .then((dataset) => {
        if (isMounted) {
          setUserName(dataset.profile.name || "Unknown");
        }
      })
      .catch(() => {
        if (isMounted) {
          setUserName("Unknown");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="shrink-0 border-b border-border/70 bg-card/70 shadow-soft backdrop-blur">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="font-serif text-base font-semibold text-ink">AuthorDNA</div>
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-brand"
              aria-hidden="true"
            >
              <path
                d="M7 4c3 2 7 2 10 4s4 6 0 8-7 2-10 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M17 4c-3 2-7 2-10 4S3 14 7 16s7 2 10 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
              <circle cx="12" cy="6" r="1" fill="currentColor" />
              <circle cx="12" cy="18" r="1" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden text-right md:block">
            <div className="text-ink">{userName}</div>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-muted text-brand shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4 0-7 2.2-7 5v1h14v-1c0-2.8-3-5-7-5Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
