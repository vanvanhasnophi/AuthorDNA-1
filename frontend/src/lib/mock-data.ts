export type MetricCategory = {
  id: string;
  name: string;
  score: number; // 0-100, higher = closer to user's voice
  observation: string;
  subMetrics: { label: string; userValue: string; textValue: string; aligned: boolean }[];
};

export const sampleText = `It seems that the proliferation of artificial intelligence in academic writing has fundamentally transformed how scholars approach their craft. The technology, which has rapidly evolved over the past several years, presents both unprecedented opportunities and significant challenges that must be carefully considered. Researchers across disciplines are grappling with questions of authorship, originality, and intellectual integrity in ways that were perhaps unimaginable just a decade ago. Furthermore, the integration of these tools into the writing process has perhaps blurred the boundaries between human creativity and machine assistance, raising essential questions about the future of scholarly communication.`;

export const userBaseline = {
  name: "Eleanor Vance",
  samplesAnalyzed: 47,
  wordsProfiled: 38420,
  voiceSummary: "Direct, declarative, sparing with hedges. Favors em-dashes and short paragraphs.",
};

export const metrics: MetricCategory[] = [
  {
    id: "architecture",
    name: "Sentence Flow",
    score: 42,
    observation:
      "Your sentences are typically short and direct. This paragraph has several long, complex sentences.",
    subMetrics: [
      { label: "Mean sentence length", userValue: "14 words", textValue: "31 words", aligned: false },
      { label: "Length variability (σ)", userValue: "5.2", textValue: "8.1", aligned: false },
      { label: "Simple sentence ratio", userValue: "62%", textValue: "18%", aligned: false },
      { label: "Complex sentence ratio", userValue: "21%", textValue: "64%", aligned: false },
    ],
  },
  {
    id: "word",
    name: "Word Choice",
    score: 38,
    observation:
      "You rarely use formal academic vocabulary. This passage uses several formal terms like 'proliferation,' 'unprecedented,' and 'unimaginable.'",
    subMetrics: [
      { label: "Lexical formality", userValue: "0.18", textValue: "0.41", aligned: false },
      { label: "Contraction rate", userValue: "12%", textValue: "0%", aligned: false },
      { label: "First-person density", userValue: "2.8%", textValue: "0%", aligned: false },
      { label: "Lexical diversity (MTLD)", userValue: "78", textValue: "82", aligned: true },
    ],
  },
  {
    id: "structure",
    name: "Structure",
    score: 55,
    observation:
      "You usually write short paragraphs with clear transitions. This is a single dense paragraph.",
    subMetrics: [
      { label: "Mean paragraph length", userValue: "3.1 sent.", textValue: "5 sent.", aligned: false },
      { label: "Transition density", userValue: "0.18", textValue: "0.20", aligned: true },
      { label: "Question openings", userValue: "8%", textValue: "0%", aligned: false },
    ],
  },
  {
    id: "tone",
    name: "Tone",
    score: 31,
    observation:
      "You typically write with confidence. This passage uses hedging language like 'seems,' 'perhaps,' and 'may have.'",
    subMetrics: [
      { label: "Hedge density", userValue: "0.4%", textValue: "1.9%", aligned: false },
      { label: "Emphatic density", userValue: "1.2%", textValue: "0.3%", aligned: false },
      { label: "Passive voice ratio", userValue: "9%", textValue: "24%", aligned: false },
      { label: "Certainty balance", userValue: "+0.8", textValue: "−1.6", aligned: false },
    ],
  },
  {
    id: "punctuation",
    name: "Punctuation",
    score: 68,
    observation: "You often use em-dashes for asides. This paragraph has none.",
    subMetrics: [
      { label: "Em-dash / 1k words", userValue: "8.4", textValue: "0", aligned: false },
      { label: "Semicolon / 1k words", userValue: "1.1", textValue: "0", aligned: true },
      { label: "Colon / 1k words", userValue: "2.3", textValue: "0", aligned: true },
      { label: "Question mark / 1k", userValue: "4.0", textValue: "0", aligned: false },
    ],
  },
];

export const suggestions = [
  {
    id: "s1",
    category: "Tone",
    severity: "high",
    excerpt: "It seems that the proliferation of artificial intelligence...",
    observation: "You typically write with confidence. The opener hedges with 'seems.'",
    tradeoff: {
      gain: "Stronger, more declarative voice that matches your baseline.",
      loss: "Softer, more cautious framing that invites disagreement.",
    },
    proposed:
      "The proliferation of artificial intelligence in academic writing has fundamentally transformed how scholars approach their craft.",
  },
  {
    id: "s2",
    category: "Sentence Flow",
    severity: "high",
    excerpt:
      "The technology, which has rapidly evolved over the past several years, presents both unprecedented opportunities and significant challenges...",
    observation: "Your sentences average 14 words. This one runs to 31.",
    tradeoff: {
      gain: "Shorter, punchier rhythm that reads like your past work.",
      loss: "Some nuance in the parenthetical clause about timing.",
    },
    proposed:
      "The technology has evolved rapidly. It brings real opportunities — and challenges worth weighing.",
  },
  {
    id: "s3",
    category: "Word Choice",
    severity: "medium",
    excerpt: "...questions of authorship, originality, and intellectual integrity...",
    observation: "Three formal terms in a row. You usually pick one and move on.",
    tradeoff: {
      gain: "Closer to your everyday register.",
      loss: "Reduced rhetorical weight in a list of abstract concepts.",
    },
    proposed: "...questions of authorship, originality, and honesty...",
  },
  {
    id: "s4",
    category: "Punctuation",
    severity: "low",
    excerpt: "Furthermore, the integration of these tools into the writing process has perhaps blurred the boundaries...",
    observation: "You often use em-dashes for asides. This sentence buries the aside in commas.",
    tradeoff: {
      gain: "Visual cue that matches your signature punctuation.",
      loss: "A more neutral, less personal cadence.",
    },
    proposed:
      "The integration of these tools — quietly, over years — has blurred the boundaries...",
  },
];
