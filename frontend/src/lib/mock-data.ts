export type MetricCategory = {
  id: string;
  name: string;
  score: number;
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
  },
  {
    id: "word",
    name: "Word Choice",
    score: 38,
  },
  {
    id: "structure",
    name: "Structure",
    score: 55,
  },
  {
    id: "tone",
    name: "Tone",
    score: 31,
  },
  {
    id: "punctuation",
    name: "Punctuation",
    score: 68,
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
    category: "Structure",
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
