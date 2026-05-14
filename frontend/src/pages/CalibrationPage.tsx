import { useMemo, useState } from "react";
import { metrics as mockMetrics, suggestions as mockSuggestions } from "@/lib/mock-data";
import type { MetricCategory } from "@/lib/mock-data";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: Record<string, { fill: string; soft: string }> = {
  "Sentence Flow": { fill: "oklch(0.74 0.08 190)", soft: "oklch(0.95 0.02 190)" },
  "Word Choice": { fill: "oklch(0.8 0.09 85)", soft: "oklch(0.95 0.02 85)" },
  Structure: { fill: "oklch(0.77 0.07 250)", soft: "oklch(0.95 0.02 250)" },
  Tone: { fill: "oklch(0.76 0.09 22)", soft: "oklch(0.95 0.02 22)" },
  Punctuation: { fill: "oklch(0.76 0.07 335)", soft: "oklch(0.95 0.02 335)" },
};

function getColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Sentence Flow"];
}

export default function CalibrationPage({ onComplete }: { onComplete: () => void }) {
  const [rightMode, setRightMode] = useState<"actions" | "options">("actions");
  const [refinementIndex, setRefinementIndex] = useState(0);
  const [refinedCount, setRefinedCount] = useState(0);
  const [adjustedMetrics, setAdjustedMetrics] = useState<MetricCategory[]>(mockMetrics);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const overall = useMemo(
    () => Math.round(adjustedMetrics.reduce((s, m) => s + m.score, 0) / adjustedMetrics.length),
    [adjustedMetrics],
  );

  const currentSuggestion = mockSuggestions[refinementIndex % mockSuggestions.length];

  const buildOptions = () => {
    const cat = currentSuggestion.category;
    const proposed = currentSuggestion.proposed;
    const options = [proposed];

    switch (cat) {
      case "Tone":
        options.push(
          proposed.replace(/^(The|This)\s/, "").replace(/^\w/, (c) => c.toLowerCase()),
          "A more direct version: " + proposed.replace(/^(The|This)\s+\w+\s+has\s+/, ""),
        );
        break;
      case "Sentence Flow":
        options.push(
          proposed.replace(/,\s*and\s+/, ". "),
          proposed.replace(/^[^.]*\./, "").trim(),
        );
        break;
      case "Word Choice":
        options.push(
          proposed.replace(/\bproliferation\b/, "spread").replace(/\bunprecedented\b/, "unusual"),
          proposed.replace(/\bintellectual integrity\b/, "honesty").replace(/\boriginality\b/, "voice"),
        );
        break;
      case "Structure":
        options.push(proposed.replace(/\.\s*/, ". "), proposed + " This shift is already visible.");
        break;
      case "Punctuation":
        options.push(
          proposed.replace(/\s*—\s*/g, " — "),
          proposed.replace(/\s*—\s*/g, " -- "),
        );
        break;
      default:
        options.push("A simpler version of the same idea.", "Keeping the original meaning with cleaner phrasing.");
    }

    return options.slice(0, 3);
  };

  const options = buildOptions();

  const handleRefine = () => {
    setRightMode("options");
    setSelectedOption(null);
  };

  const handleBack = () => {
    setRightMode("actions");
    setSelectedOption(null);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;

    const bonus = Math.floor(Math.random() * 4) + 2;
    const category = currentSuggestion.category;

    setAdjustedMetrics((prev) =>
      prev.map((m) =>
        m.name === category ? { ...m, score: Math.min(100, m.score + bonus) } : m,
      ),
    );

    setRefinementIndex((i) => i + 1);
    setRefinedCount((c) => c + 1);
    setRightMode("actions");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppHeader />
      <main className="grid min-h-0 flex-1 grid-cols-[2fr_1fr]">
        {/* ─── LEFT: Dashboard (66%) ─── */}
        <section className="min-h-0 overflow-y-auto border-r border-border px-8 py-8">
          <div className="mx-auto max-w-2xl space-y-6">
            <h1 className="font-serif text-2xl text-ink">Your Writing Profile</h1>

            {/* Overall score */}
            <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-lg text-ink">DNA Alignment</h2>
                <span className="font-serif text-2xl text-ink">{overall}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-muted">
                <div
                  className="h-full rounded-full bg-brand transition-all duration-700"
                  style={{ width: `${overall}%` }}
                />
              </div>
            </div>

            {/* Metric cards */}
            <div className="space-y-3">
              {adjustedMetrics.map((m) => {
                const c = getColor(m.name);
                return (
                  <div key={m.id} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">{m.name}</span>
                      <span className="font-serif text-sm tabular-nums text-ink-muted">{m.score}</span>
                    </div>
                    <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-paper">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${m.score}%`, backgroundColor: c.fill }}
                      />
                    </div>
                    <p className="text-sm leading-relaxed text-ink-muted">{m.observation}</p>
                  </div>
                );
              })}
            </div>

            {refinedCount > 0 && (
              <p className="text-xs text-ink-muted">
                Refined {refinedCount} time{refinedCount > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </section>

        {/* ─── RIGHT: Action panel (33%) ─── */}
        <aside className="flex min-h-0 flex-col overflow-y-auto bg-card p-6">
          {rightMode === "actions" ? (
            <div className="flex flex-col gap-4">
              <Button size="lg" className="w-full font-serif" onClick={onComplete}>
                <Check className="mr-2 h-4 w-4" />
                Accept Analysis
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full font-serif text-ink-muted"
                onClick={handleRefine}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Doesn't feel right
              </Button>

              {refinedCount > 0 && (
                <p className="text-center text-xs text-ink-muted">
                  Refined {refinedCount} time{refinedCount > 1 ? "s" : ""}
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-xs text-ink-muted transition hover:text-ink"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>

              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-ink-muted">From your text</p>
                <p className="text-sm leading-relaxed text-ink-muted">
                  "{currentSuggestion.excerpt}"
                </p>
              </div>

              <p className="font-serif text-sm text-ink">How would YOU express this?</p>

              <div className="space-y-2">
                {options.map((opt, i) => {
                  const labels = ["A", "B", "C"];
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedOption(i)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all",
                        selectedOption === i
                          ? "border-brand bg-brand-muted/20 shadow-soft"
                          : "border-border bg-background hover:border-brand/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium transition",
                          selectedOption === i
                            ? "border-brand bg-brand text-brand-foreground"
                            : "border-border text-ink-muted",
                        )}
                      >
                        {labels[i]}
                      </span>
                      <span className="leading-relaxed text-ink">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <Button
                size="lg"
                className="w-full font-serif"
                disabled={selectedOption === null}
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
