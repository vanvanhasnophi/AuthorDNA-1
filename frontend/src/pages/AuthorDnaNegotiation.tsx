import { useMemo, useState } from "react";
import { metrics, sampleText, suggestions, userBaseline } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Check, X, Sparkles, Activity, FileText } from "lucide-react";

function BrandMark() {
  return (
    <svg viewBox="0 0 52 52" className="h-8 w-8 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="dna-teal" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2d7f7a" />
          <stop offset="100%" stopColor="#7a2e3a" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="52" height="52" rx="12" fill="#2d7f7a" />
      <path
        d="M18 10c10 7 10 25 0 32"
        fill="none"
        stroke="#fffdf9"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M34 10c-10 7-10 25 0 32"
        fill="none"
        stroke="#fffdf9"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M21 16h10M19 25h14M21 34h10" stroke="url(#dna-teal)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="26" cy="8.5" r="2" fill="#7a2e3a" />
      <circle cx="26" cy="43.5" r="2" fill="#7a2e3a" />
    </svg>
  );
}

function BrandWordmark() {
  return (
    <div className="flex items-center gap-2 font-serif text-[30px] leading-none font-semibold tracking-[-0.03em]">
      <span className="text-ink">Author</span>
      <span className="text-brand">DNA</span>
    </div>
  );
}

function MetricBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(47,38,29,0.05)]">
      <div
        className="h-full rounded-full bg-brand transition-all duration-700"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

export default function InfluenceDashboard() {
  const [resolved, setResolved] = useState<Record<string, "accept" | "reject">>({});

  const overall = useMemo(
    () => Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length),
    [],
  );

  const pending = suggestions.filter((s) => !resolved[s.id]);
  const flaggedTokens = [
    "seems that",
    "perhaps",
    "proliferation",
    "unprecedented",
    "unimaginable",
    "Furthermore",
  ];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-[rgba(47,38,29,0.1)] bg-[#f8f5ef]/95 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <BrandWordmark />
              <div className="text-[11px] text-ink-muted">Writing that sounds like you</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden text-right md:block">
              <div className="text-xs text-ink-muted">Profile</div>
              <div className="text-ink">{userBaseline.name}</div>
              <div className="text-[11px] text-ink-muted">
                {userBaseline.samplesAnalyzed} samples · {userBaseline.wordsProfiled.toLocaleString()} words
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef6f5] font-serif text-sm font-semibold text-[#7a2e3a]">
              EV
            </div>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* LEFT — A4 document */}
        <section className="min-h-0 overflow-y-auto bg-[#f6f1e8] px-8 py-8">
          <div className="mx-auto flex max-w-[816px] flex-col">
            <div className="mb-3 flex items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                <span>Untitled document</span>
                <span className="opacity-60">·</span>
                <span>Auto-saved</span>
              </div>
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-brand">
                <Activity className="mr-1 inline h-3 w-3" />
                Live analysis
              </span>
            </div>

            {/* A4 page */}
            <div
              className="rounded-xl border border-[rgba(47,38,29,0.10)] bg-card shadow-soft"
              style={{ aspectRatio: "1 / 1.414", minHeight: "1056px" }}
            >
              <div className="px-24 py-24">
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  className="mb-10 max-w-[600px] font-serif text-[48px] font-semibold leading-[1.02] tracking-[-0.04em] text-ink outline-none"
                >
                  The shape of scholarly writing in the age of AI
                </h1>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="font-serif text-[16px] leading-[1.95] text-ink outline-none"
                >
                  <p>
                    {sampleText
                      .split(new RegExp(`(${flaggedTokens.join("|")})`, "g"))
                      .map((part, i) => {
                        const flagged = flaggedTokens.includes(part);
                        return flagged ? (
                          <mark
                            key={i}
                            className="bg-transparent px-0.5 text-ink underline decoration-secondary decoration-wavy underline-offset-4"
                          >
                            {part}
                          </mark>
                        ) : (
                          <span key={i}>{part}</span>
                        );
                      })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
              <span>{sampleText.split(/\s+/).length} words · 1 paragraph</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </section>

        {/* RIGHT — Influence Index + Suggestions */}
        <aside className="min-h-0 overflow-y-auto border-l border-[rgba(47,38,29,0.10)] bg-card">
          {/* Influence Index */}
          <div className="border-b border-[rgba(47,38,29,0.10)] p-6">
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[15px] text-ink">DNA Alignment</span>
                <span className="font-serif text-[15px] tabular-nums text-ink-muted">{overall}</span>
              </div>
              <MetricBar score={overall} />
            </div>
            <div className="mb-5 h-px w-full bg-[rgba(47,38,29,0.08)]" />
            <div className="space-y-3">
              {metrics.map((m) => (
                <div key={m.id}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[15px] text-ink">{m.name}</span>
                    <span className="font-serif text-[15px] tabular-nums text-ink-muted">
                      {m.score}
                    </span>
                  </div>
                  <MetricBar score={m.score} />
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions — scrollable */}
          <div>
            <div className="flex items-baseline justify-between border-b border-[rgba(47,38,29,0.10)] px-6 py-4">
              <h3 className="font-serif text-[26px] text-ink">
                Suggestions <span className="text-ink-muted">· {pending.length}</span>
              </h3>
              <span className="text-[11px] text-ink-muted">Accept, dismiss, refine</span>
            </div>
            <div className="space-y-3 p-4">
              {suggestions.map((s) => {
                const state = resolved[s.id];
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "rounded-[18px] border border-[rgba(47,38,29,0.10)] p-4 transition-all",
                      state === "accept" && "border-[rgba(45,127,122,0.35)] bg-brand-soft",
                      state === "reject" && "opacity-60",
                      !state && "bg-[#fffdf9] hover:border-[rgba(45,127,122,0.35)]",
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          s.severity === "high"
                            ? "bg-secondary"
                            : s.severity === "medium"
                              ? "bg-brand"
                              : "bg-slate-500",
                        )}
                      />
                      <span className="text-[10px] font-medium uppercase tracking-[0.26em] text-ink-muted">
                        {s.category}
                      </span>
                      {state && (
                        <span className="ml-auto text-[10px] text-ink-muted">
                          {state === "accept" ? "Accepted" : "Dismissed"}
                        </span>
                      )}
                    </div>
                    <p className="mb-2 line-clamp-2 text-xs italic text-ink-muted">"{s.excerpt}"</p>
                    <p className="mb-2.5 text-xs text-ink">{s.observation}</p>

                    <div className="mb-2.5 rounded-2xl border border-dashed border-[rgba(47,38,29,0.14)] bg-[#f8f4ed] p-3">
                      <div className="mb-1 text-[10px] uppercase tracking-[0.26em] text-ink-muted">
                        Proposed
                      </div>
                      <p className="font-serif text-[16px] leading-relaxed text-ink">
                        {s.proposed}
                      </p>
                    </div>

                    <div className="mb-2.5 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <div className="mb-0.5 font-medium text-ink">Gain</div>
                        <div className="leading-snug text-ink-muted">{s.tradeoff.gain}</div>
                      </div>
                      <div>
                        <div className="mb-0.5 font-medium text-ink">Trade-off</div>
                        <div className="leading-snug text-ink-muted">{s.tradeoff.loss}</div>
                      </div>
                    </div>

                    {!state && (
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => setResolved((r) => ({ ...r, [s.id]: "accept" }))}
                          className="flex items-center justify-center gap-1 rounded-md bg-brand px-2 py-1.5 text-xs font-medium text-brand-foreground transition hover:opacity-90"
                        >
                          <Check className="h-3 w-3" /> Accept
                        </button>
                        <button
                          onClick={() => setResolved((r) => ({ ...r, [s.id]: "reject" }))}
                          className="flex items-center justify-center gap-1 rounded-md border border-[rgba(47,38,29,0.14)] bg-[#fffdf9] px-2 py-1.5 text-xs text-ink transition hover:bg-[#f8f4ed]"
                        >
                          <X className="h-3 w-3" /> Dismiss
                        </button>
                        <button className="flex items-center justify-center gap-1 rounded-md border border-[rgba(47,38,29,0.14)] bg-[#fffdf9] px-2 py-1.5 text-xs text-ink transition hover:bg-[#f8f4ed]">
                          <Sparkles className="h-3 w-3" /> Refine
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
