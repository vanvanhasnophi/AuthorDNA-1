import { useMemo, useRef, useState } from "react";
import { metrics, sampleText, suggestions, userBaseline } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Check, X, Sparkles, Activity, FileText, Send, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

function MetricBar({
  score,
  fillColor = "var(--color-brand)",
  trackColor = "var(--color-brand-muted)",
}: {
  score: number;
  fillColor?: string;
  trackColor?: string;
}) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full" style={{ backgroundColor: trackColor }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${score}%`, backgroundColor: fillColor }}
      />
    </div>
  );
}

type CategoryColor = {
  fill: string;
  soft: string;
};

const CATEGORY_COLORS: Record<string, CategoryColor> = {
  "Sentence Flow": {
    fill: "oklch(0.74 0.08 190)",
    soft: "oklch(0.95 0.02 190)",
  },
  "Word Choice": {
    fill: "oklch(0.8 0.09 85)",
    soft: "oklch(0.95 0.02 85)",
  },
  Structure: {
    fill: "oklch(0.77 0.07 250)",
    soft: "oklch(0.95 0.02 250)",
  },
  Tone: {
    fill: "oklch(0.76 0.09 22)",
    soft: "oklch(0.95 0.02 22)",
  },
  Punctuation: {
    fill: "oklch(0.76 0.07 335)",
    soft: "oklch(0.95 0.02 335)",
  },
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS["Sentence Flow"];
}

type ViewMode = "document" | "sentence";
type SuggestionItem = (typeof suggestions)[number];

function splitIntoSentences(paragraph: string) {
  return (paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [])
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeForMatch(value: string) {
  return value
    .toLowerCase()
    .replace(/^\.{3}/, "")
    .replace(/\.{3}$/, "")
    .replace(/^"+|"+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function findSentenceIndexForSuggestion(paragraphSentences: string[], suggestion: SuggestionItem) {
  const normalizedTarget = normalizeForMatch(suggestion.targetText ?? suggestion.excerpt ?? "");
  const normalizedExcerpt = normalizeForMatch(suggestion.excerpt ?? "");

  const exactMatchIndex = paragraphSentences.findIndex((sentence) => {
    const normalizedSentence = normalizeForMatch(sentence);
    return (
      normalizedSentence.includes(normalizedTarget) ||
      normalizedTarget.includes(normalizedSentence) ||
      (normalizedExcerpt ? normalizedSentence.includes(normalizedExcerpt) : false)
    );
  });

  return exactMatchIndex >= 0 ? exactMatchIndex : 0;
}

function renderSentenceDiffLine(label: string, text: string, tone: "removed" | "added") {
  const styles =
    tone === "removed"
      ? "border-red-200 bg-red-50 text-red-950"
      : "border-emerald-200 bg-emerald-50 text-emerald-950";

  return (
    <div className={cn("rounded-md border px-2.5 py-2", styles)}>
      <div className="mb-1 text-[10px] font-medium uppercase tracking-wider opacity-70">{label}</div>
      <p className="font-serif text-[13px] leading-relaxed text-ink">{text}</p>
    </div>
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeExcerpt(value: string) {
  return value.replace(/^"+|"+$/g, "").replace(/^\.\.\./, "").replace(/\.\.\.$/, "").trim();
}

function renderFlaggedText(text: string, flaggedTokens: string[]) {
  return text.split(new RegExp(`(${flaggedTokens.map(escapeRegExp).join("|")})`, "g")).map((part, i) => {
    const flagged = flaggedTokens.includes(part);
    return flagged ? (
      <mark
        key={i}
        className="bg-transparent text-ink"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

function renderParagraphWithHover(
  paragraph: string,
  flaggedTokens: string[],
  hoverPhrase: string | null,
  hoverColor: string | null,
) {
  const normalizedHover = hoverPhrase ? normalizeExcerpt(hoverPhrase) : "";
  if (!normalizedHover) {
    return renderFlaggedText(paragraph, flaggedTokens);
  }

  const regex = new RegExp(`(${escapeRegExp(normalizedHover)})`, "i");
  const match = paragraph.match(regex);
  if (!match || match.index == null) {
    return renderFlaggedText(paragraph, flaggedTokens);
  }

  const start = match.index;
  const end = start + match[0].length;
  const before = paragraph.slice(0, start);
  const concern = paragraph.slice(start, end);
  const after = paragraph.slice(end);

  return (
    <>
      {renderFlaggedText(before, flaggedTokens)}
      <mark
        className="rounded-sm px-0.5 py-0.5 text-ink"
        style={{
          backgroundColor: hoverColor ?? CATEGORY_COLORS["Sentence Flow"].soft,
        }}
      >
        {concern}
      </mark>
      {renderFlaggedText(after, flaggedTokens)}
    </>
  );
}

function buildRefineVariations(category: string) {
  switch (category) {
    case "Tone":
      return [
        "Artificial intelligence has redefined academic authorship.",
        "Artificial intelligence has changed scholarly writing significantly.",
        "Artificial intelligence has redefined how scholars approach writing.",
      ];
    case "Sentence Flow":
      return [
        "The technology has evolved rapidly. It brings real opportunities and challenges.",
        "The technology has changed quickly, creating opportunities and trade-offs worth weighing.",
        "The technology has advanced at pace, and scholars are now balancing its benefits with its costs.",
      ];
    case "Word Choice":
      return [
        "...questions of authorship, originality, and honesty...",
        "...questions of authorship, originality, and integrity...",
        "...questions of authorship, originality, and responsibility...",
      ];
    case "Structure":
      return [
        "The integration of these tools has shifted academic writing in subtle but important ways.",
        "These tools are changing academic writing, but the implications are still unfolding.",
        "The tools are now part of the writing process, and the full effects are still emerging.",
      ];
    case "Punctuation":
      return [
        "The integration of these tools — quietly, over years — has blurred the boundaries...",
        "The integration of these tools, over time, has blurred the boundaries...",
        "The integration of these tools has blurred the boundaries between human creativity and machine assistance.",
      ];
    default:
      return [
        "The proposed wording stays close to the original while making the change more direct.",
        "This version keeps the meaning but tightens the phrasing.",
        "A slightly softer alternative that preserves the original intent.",
      ];
  }
}

export default function InfluenceDashboard() {
  const [resolved, setResolved] = useState<Record<string, "accept" | "reject">>({});
  const [activeRefineId, setActiveRefineId] = useState<string | null>(null);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [refineVariations, setRefineVariations] = useState<Record<string, string[]>>({});
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredSuggestionId, setHoveredSuggestionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("document");
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const overall = useMemo(
    () => Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length),
    [],
  );

  const visibleSuggestions = selectedCategory
    ? suggestions.filter((s) => s.category === selectedCategory)
    : suggestions;
  const documentParagraphs = sampleText.trim().split(/\n\s*\n/);
  const hoveredSuggestion = suggestions.find((s) => s.id === hoveredSuggestionId) ?? null;
  const hoveredColor = hoveredSuggestion ? getCategoryColor(hoveredSuggestion.category) : null;
  const hoveredTarget = hoveredSuggestion?.targetText ?? null;
  const flaggedTokens = [
    "seems that",
    "perhaps",
    "proliferation",
    "unprecedented",
    "unimaginable",
    "Furthermore",
  ];
  const sentenceGroups = useMemo(() => {
    const paragraphSentenceLists = documentParagraphs.map((paragraph) => splitIntoSentences(paragraph));

    return paragraphSentenceLists.map((sentences, paragraphIndex) => {
      const sentenceSuggestions = suggestions
        .filter((suggestion) => suggestion.paragraphIndex === paragraphIndex)
        .map((suggestion) => ({
          suggestion,
          sentenceIndex: findSentenceIndexForSuggestion(sentences, suggestion),
        }));

      return sentences.map((sentence, sentenceIndex) => ({
        sentence,
        paragraphIndex,
        sentenceIndex,
        suggestions: sentenceSuggestions
          .filter((item) => item.sentenceIndex === sentenceIndex)
          .map((item) => item.suggestion),
      }));
    });
  }, [documentParagraphs]);

  const sentenceSuggestionCount = sentenceGroups.reduce(
    (sum, paragraph) => sum + paragraph.reduce((inner, item) => inner + item.suggestions.length, 0),
    0,
  );

  const handleRefineClick = (id: string) => {
    setActiveRefineId((current) => {
      const next = current === id ? null : id;
      if (next !== current) {
        setRefinePrompt("");
      }
      return next;
    });
  };

  const handleSubmitRefine = (id: string) => {
    const prompt = refinePrompt.trim();
    if (!prompt) {
      return;
    }
    setRefineVariations((current) => ({
      ...current,
      [id]: buildRefineVariations(suggestions.find((s) => s.id === id)?.category ?? ""),
    }));
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 border-b border-border/60 bg-paper/40 backdrop-blur">
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
              <div className="text-ink">{userBaseline.name}</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-muted text-brand">
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
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-border bg-background p-1 text-[11px] text-ink-muted shadow-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("document")}
                    className={cn(
                      "rounded-full px-3 py-1 transition",
                      viewMode === "document" ? "bg-brand text-brand-foreground" : "hover:text-ink",
                    )}
                  >
                    Document
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("sentence")}
                    className={cn(
                      "rounded-full px-3 py-1 transition",
                      viewMode === "sentence" ? "bg-brand text-brand-foreground" : "hover:text-ink",
                    )}
                  >
                    Sentence view
                  </button>
                </div>
                <span className="rounded-full bg-brand-muted px-2.5 py-1 text-brand">
                  <Activity className="mr-1 inline h-3 w-3" />
                  Live analysis
                </span>
              </div>
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
                {viewMode === "document" ? (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="font-serif text-[16px] leading-[1.9] text-ink outline-none"
                  >
                    {documentParagraphs.map((paragraph, paragraphIndex) => (
                      <p
                        key={paragraphIndex}
                        ref={(node) => {
                          paragraphRefs.current[paragraphIndex] = node;
                        }}
                        className={paragraphIndex === documentParagraphs.length - 1 ? "" : "mb-4"}
                      >
                        {renderParagraphWithHover(
                          paragraph,
                          flaggedTokens,
                          hoveredTarget,
                          hoveredColor ? hoveredColor.soft : null,
                        )}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sentenceGroups.map((paragraph, paragraphIndex) => (
                      <div key={paragraphIndex} className="space-y-2">
                        {paragraph.map((item) => (
                          <div
                            key={`${paragraphIndex}-${item.sentenceIndex}`}
                            className="rounded-xl border border-border bg-background p-4 shadow-sm"
                          >
                            <div className="mb-3 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-muted">
                              <span>Sentence {item.sentenceIndex + 1}</span>
                              <span>{item.suggestions.length} suggestion{item.suggestions.length === 1 ? "" : "s"}</span>
                            </div>
                            <p className="font-serif text-[16px] leading-[1.9] text-ink">{item.sentence}</p>
                            {item.suggestions.length > 0 && (
                              <div className="mt-4 space-y-3 border-t border-border/70 pt-4">
                                {item.suggestions.map((suggestion) => {
                                  const categoryColor = getCategoryColor(suggestion.category);
                                  const state = resolved[suggestion.id];
                                  return (
                                    <div
                                      key={suggestion.id}
                                      className="rounded-lg border border-border bg-paper/50 p-3"
                                    >
                                      <div className="mb-2 flex items-center gap-2">
                                        <span
                                          className="h-1.5 w-1.5 rounded-full"
                                          style={{ backgroundColor: categoryColor.fill }}
                                        />
                                        <span className="text-[10px] font-medium uppercase tracking-wider text-ink-muted">
                                          {suggestion.category}
                                        </span>
                                        {state && (
                                          <span className="ml-auto text-[10px] text-ink-muted">
                                            {state === "accept" ? "Accepted" : "Dismissed"}
                                          </span>
                                        )}
                                      </div>
                                      <p className="mb-2 text-xs text-ink-muted">{suggestion.observation}</p>
                                      <div className="space-y-2">
                                        {renderSentenceDiffLine("Original", suggestion.targetText, "removed")}
                                        {renderSentenceDiffLine("Proposed", suggestion.proposed, "added")}
                                      </div>
                                      <div className="mt-3 grid grid-cols-3 gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => setResolved((current) => ({ ...current, [suggestion.id]: "accept" }))}
                                          className="flex items-center justify-center gap-1 rounded-md bg-brand px-2 py-1.5 text-xs font-medium text-brand-foreground transition hover:opacity-90"
                                        >
                                          <Check className="h-3 w-3" /> Accept
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setResolved((current) => ({ ...current, [suggestion.id]: "reject" }))}
                                          className="flex items-center justify-center gap-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs text-ink transition hover:bg-paper"
                                        >
                                          <X className="h-3 w-3" /> Dismiss
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => handleRefineClick(suggestion.id)}
                                          className={cn(
                                            "flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs transition",
                                            activeRefineId === suggestion.id
                                              ? "border-brand bg-brand-muted/30 text-ink"
                                              : "border-border bg-background text-ink hover:bg-paper",
                                          )}
                                        >
                                          <Sparkles className="h-3 w-3" /> Refine
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-ink-muted">
              <span>
                {sampleText.split(/\s+/).length} words · {viewMode === "document" ? "1 paragraph" : `${sentenceSuggestionCount} mapped suggestions`}
              </span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </section>

        {/* RIGHT — Influence Index + Suggestions */}
        <aside className="min-h-0 overflow-y-auto border-l border-border bg-card">
          {/* Influence Index */}
          <div className="border-b border-border p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-[22px] text-ink">DNA Alignment</h2>
              <span className="font-serif text-[22px] leading-none text-ink">{overall}</span>
            </div>
            <div className="mb-3">
              <MetricBar score={overall} />
            </div>
            <button
              type="button"
              onClick={() =>
                setShowBreakdown((current) => {
                  const next = !current;
                  if (!next) {
                    setSelectedCategory(null);
                  }
                  return next;
                })
              }
              className="flex items-center gap-1 text-xs text-ink-muted transition hover:text-ink"
            >
              {showBreakdown ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Hide breakdown
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  View breakdown
                </>
              )}
            </button>
            {showBreakdown && (
              <>
                <div className="my-4 border-b border-border/70" />
                <div className="space-y-2.5">
                  {metrics.map((m) => (
                    <div key={m.id}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs text-ink">{m.name}</span>
                        <span className="font-serif text-xs tabular-nums text-ink-muted">
                          {m.score}
                        </span>
                      </div>
                      <MetricBar
                        score={m.score}
                        fillColor={getCategoryColor(m.name).fill}
                        trackColor={getCategoryColor(m.name).soft}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-border/70 pt-4">
                  <div className="mb-2 text-[11px] uppercase tracking-wider text-ink-muted">
                    Filter suggestions
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-[11px] transition",
                        selectedCategory === null
                          ? "border-brand bg-brand-muted/20 text-ink"
                          : "border-border bg-background text-ink-muted hover:text-ink",
                      )}
                    >
                      All
                    </button>
                    {metrics.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedCategory(m.name)}
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] transition",
                          selectedCategory === m.name ? "text-ink" : "text-ink-muted hover:text-ink",
                        )}
                        style={{
                          borderColor:
                            selectedCategory === m.name
                              ? getCategoryColor(m.name).fill
                              : getCategoryColor(m.name).soft,
                          backgroundColor:
                            selectedCategory === m.name ? getCategoryColor(m.name).soft : "transparent",
                        }}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Suggestions — scrollable */}
          <div>
            <div className="flex items-baseline justify-between border-b border-border px-5 py-3">
              <h3 className="font-serif text-sm text-ink">
                Suggestions <span className="text-ink-muted">· {visibleSuggestions.length}</span>
              </h3>
              <span className="text-[11px] text-ink-muted">Accept, dismiss, refine</span>
            </div>
            <div className="space-y-2.5 p-4">
              {visibleSuggestions.map((s) => {
                const state = resolved[s.id];
                const categoryColor = getCategoryColor(s.category);
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "rounded-lg border p-3.5 transition-all",
                      state === "accept" && "border-brand/40 bg-brand-muted/30",
                      state === "reject" && "opacity-60",
                      !state && "border-border bg-background hover:border-brand/40",
                    )}
                    onMouseEnter={() => {
                      setHoveredSuggestionId(s.id);
                      const paragraphIndex = s.paragraphIndex ?? 0;
                      window.requestAnimationFrame(() => {
                        paragraphRefs.current[paragraphIndex]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      });
                    }}
                    onMouseLeave={() =>
                      setHoveredSuggestionId((current) => (current === s.id ? null : current))
                    }
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: categoryColor.fill }} />
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
                        <button
                          type="button"
                          onClick={() => handleRefineClick(s.id)}
                          className={cn(
                            "flex items-center justify-center gap-1 rounded-md border px-2 py-1.5 text-xs transition",
                            activeRefineId === s.id
                              ? "border-brand bg-brand-muted/30 text-ink"
                              : "border-border bg-background text-ink hover:bg-paper",
                          )}
                        >
                          <Sparkles className="h-3 w-3" /> Refine
                        </button>
                      </div>
                    )}

                    {activeRefineId === s.id && (
                      <div className="mt-3 border-t border-border pt-3">
                        <div className="mb-1">
                          <div className="font-serif text-sm font-medium text-ink">
                            Refine this suggestion
                          </div>
                          <div className="text-xs text-ink-muted">
                            Tell the AI how you'd like to adjust the proposed text.
                          </div>
                        </div>

                        <div className="relative rounded-md border border-border bg-background px-3 py-2">
                          <textarea
                            value={refinePrompt}
                            onChange={(e) => setRefinePrompt(e.target.value)}
                            placeholder="E.g., Make it more concise and natural, reduce the academic tone, …"
                            className="min-h-[56px] w-full resize-none bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted/70"
                          />
                          <button
                            type="button"
                            onClick={() => handleSubmitRefine(s.id)}
                            className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-brand transition hover:bg-paper"
                            aria-label="Send refine prompt"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {refineVariations[s.id] && (
                          <div className="mt-3">
                            <div className="mb-2 flex items-center justify-between">
                              <div>
                                <div className="font-serif text-sm font-medium text-ink">
                                  Here are 3 variations
                                </div>
                                <div className="text-xs text-ink-muted">
                                  Select the one that fits best, or refine further.
                                </div>
                              </div>
                            <button
                                type="button"
                                onClick={() =>
                                  setRefineVariations((current) => ({
                                    ...current,
                                    [s.id]: [
                                      "Artificial intelligence has fundamentally changed how scholars write.",
                                      "Artificial intelligence is changing academic writing at its core.",
                                      "Artificial intelligence has transformed academic writing.",
                                    ],
                                  }))
                                }
                                className="flex items-center gap-1 text-xs text-ink-muted transition hover:text-ink"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Regenerate
                              </button>
                            </div>

                            <div className="space-y-2">
                              {refineVariations[s.id].map((variation) => (
                                <div
                                  key={variation}
                                  className="flex items-start gap-3 rounded-md border border-border bg-background px-3 py-2.5"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="font-serif text-[13px] leading-snug text-ink">
                                      {variation}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    className="shrink-0 rounded-md border border-border bg-background px-3 py-1.5 text-xs text-ink transition hover:bg-paper"
                                  >
                                    Accept
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
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
