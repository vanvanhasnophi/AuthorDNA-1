import { useMemo, useState } from "react";
import { metrics, sampleText, suggestions, userBaseline } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Check, X, Sparkles, Activity, FileText } from "lucide-react";

function ScoreRing({ score }: { score: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={r} className="fill-none stroke-brand-muted" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          className="fill-none stroke-brand transition-all duration-700"
          strokeWidth="8"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-serif text-[22px] font-semibold leading-none text-ink">{score}</span>
      </div>
    </div>
  );
}

function MetricBar({ score }: { score: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-muted">
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
      <header className="shrink-0 border-b border-border/60 bg-paper/40 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand text-brand-foreground">
              <span className="font-serif text-sm font-bold">A</span>
            </div>
            <div className="flex items-center">
              <div className="font-serif text-base font-semibold text-ink">AuthorDNA</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="hidden text-right md:block">
              <div className="text-xs text-ink-muted">Profile</div>
              <div className="text-ink">{userBaseline.name}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-muted font-serif text-sm text-brand">
              EV
            </div>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* LEFT — A4 document */}
        <section className="min-h-0 overflow-y-auto bg-paper/30 px-8 py-8">
          <div className="mx-auto flex max-w-[816px] flex-col">
            <div className="mb-3 flex items-center justify-between text-xs text-ink-muted">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5" />
                <span>Writing in the age of AI</span>
                <span className="opacity-60">·</span>
                <span>Auto-saved</span>
              </div>
              <span className="rounded-full bg-brand-muted px-2.5 py-1 text-brand">
                <Activity className="mr-1 inline h-3 w-3" />
                Live analysis
              </span>
            </div>

            {/* A4 page */}
            <div
              className="rounded-sm border border-border bg-card shadow-soft"
              style={{ aspectRatio: "1 / 1.414", minHeight: "1056px" }}
            >
              <div className="px-24 py-20">
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  className="mb-8 font-serif text-3xl font-semibold text-ink outline-none"
                >
                  Writing in the age of AI
                </h1>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="font-serif text-[16px] leading-[1.9] text-ink outline-none"
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
        <aside className="min-h-0 overflow-y-auto border-l border-border bg-card">
          {/* Influence Index */}
          <div className="border-b border-border p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-[22px] text-ink">DNA Alignment</h2>
              </div>
              <ScoreRing score={overall} />
            </div>
            <div className="space-y-2.5">
              {metrics.map((m) => (
                <div key={m.id}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs text-ink">{m.name}</span>
                    <span className="font-serif text-xs tabular-nums text-ink-muted">
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
            <div className="flex items-baseline justify-between border-b border-border px-5 py-3">
              <h3 className="font-serif text-sm text-ink">
                Suggestions <span className="text-ink-muted">· {pending.length}</span>
              </h3>
              <span className="text-[11px] text-ink-muted">Accept, dismiss, refine</span>
            </div>
            <div className="space-y-2.5 p-4">
              {suggestions.map((s) => {
                const state = resolved[s.id];
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "rounded-lg border p-3.5 transition-all",
                      state === "accept" && "border-brand/40 bg-brand-muted/30",
                      state === "reject" && "opacity-60",
                      !state && "border-border bg-background hover:border-brand/40",
                    )}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          s.severity === "high"
                            ? "bg-brand"
                            : s.severity === "medium"
                              ? "bg-chart-4"
                              : "bg-ink-muted",
                        )}
                      />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">
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

                    <div className="mb-2.5 rounded-md border border-dashed border-border bg-paper/60 p-2.5">
                      <div className="mb-1 text-[10px] uppercase tracking-wider text-ink-muted">
                        Proposed
                      </div>
                      <p className="font-serif text-[13px] leading-relaxed text-ink">
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
                          className="flex items-center justify-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-ink transition hover:bg-paper"
                        >
                          <X className="h-3 w-3" /> Dismiss
                        </button>
                        <button className="flex items-center justify-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-ink transition hover:bg-paper">
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
