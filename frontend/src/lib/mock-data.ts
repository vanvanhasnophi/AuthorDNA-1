export type MetricCategory = {
  id: string;
  name: string;
  score: number; // 0-100, higher = closer to user's voice
  observation: string;
  subMetrics: { label: string; userValue: string; textValue: string; aligned: boolean }[];
};

export const sampleText = `It seems that the proliferation of artificial intelligence in academic writing has fundamentally transformed how scholars approach their craft. The technology has moved quickly from a distant novelty to an ordinary tool, and that shift has changed how researchers draft, revise, and evaluate their work.

The rise of these systems has also altered the rhythm of scholarly composition. Writers can now generate summaries, test outlines, and compare phrasings in seconds, yet those efficiencies do not remove the need for judgment. In many cases, they make judgment more important, because the first clear answer is not always the most precise one.

Researchers across disciplines are grappling with questions of authorship, originality, and intellectual integrity in ways that were perhaps unimaginable just a decade ago. Some scholars see the tools as a practical extension of writing labor, while others worry that the convenience of automation may flatten the specificity of academic voice.

Furthermore, the integration of these tools into the writing process has perhaps blurred the boundaries between human creativity and machine assistance, raising essential questions about the future of scholarly communication. Universities, journals, and individual writers are still deciding how to define responsible use, and those decisions will shape the norms that follow.

For that reason, the discussion is no longer only about whether AI should be used. It is about how it should be used, where its limits should be drawn, and how writers can preserve clarity, ownership, and voice while still benefiting from the speed it offers.`;

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
    paragraphIndex: 0,
    targetText:
      "It seems that the proliferation of artificial intelligence in academic writing has fundamentally transformed how scholars approach their craft.",
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
    paragraphIndex: 0,
    targetText:
      "The technology has moved quickly from a distant novelty to an ordinary tool, and that shift has changed how researchers draft, revise, and evaluate their work.",
    observation:
      "You typically write in shorter, more self-contained statements. This sentence unfolds across multiple clauses, which makes it feel more reflective.",
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
    paragraphIndex: 2,
    targetText: "questions of authorship, originality, and intellectual integrity",
    observation: "Three formal terms in a row. You usually pick one and move on.",
    tradeoff: {
      gain: "Closer to your everyday register.",
      loss: "Reduced rhetorical weight in a list of abstract concepts.",
    },
    proposed: "...questions of authorship, originality, and honesty...",
  },
  {
    id: "s4",
    category: "Structure",
    severity: "medium",
    excerpt:
      "Researchers across disciplines are grappling with questions of authorship, originality, and intellectual integrity...",
    paragraphIndex: 2,
    targetText:
      "Researchers across disciplines are grappling with questions of authorship, originality, and intellectual integrity in ways that were perhaps unimaginable just a decade ago.",
    observation: "You typically separate major moves more clearly. Here, the point stays embedded in the paragraph.",
    tradeoff: {
      gain: "Clearer structural pacing and a more deliberate progression.",
      loss: "A slightly less continuous argumentative flow.",
    },
    proposed:
      "Researchers across disciplines are grappling with questions of authorship, originality, and intellectual integrity. These questions are now shaping academic practice in concrete ways.",
  },
  {
    id: "s5",
    category: "Punctuation",
    severity: "low",
    excerpt: "Furthermore, the integration of these tools into the writing process has perhaps blurred the boundaries...",
    paragraphIndex: 3,
    targetText:
      "Furthermore, the integration of these tools into the writing process has perhaps blurred the boundaries between human creativity and machine assistance, raising essential questions about the future of scholarly communication.",
    observation: "You usually use em-dashes for asides. Here, the aside is tucked into commas instead.",
    tradeoff: {
      gain: "Visual cue that matches your signature punctuation.",
      loss: "A more neutral, less personal cadence.",
    },
    proposed:
      "The integration of these tools — quietly, over years — has blurred the boundaries...",
  },
  {
    id: "s6",
    category: "Tone",
    severity: "medium",
    excerpt:
      "The rise of these systems has also altered the rhythm of scholarly composition...",
    paragraphIndex: 1,
    targetText: "The rise of these systems has also altered the rhythm of scholarly composition.",
    observation: "You usually sound more direct. This line keeps a more detached, analytical distance.",
    tradeoff: {
      gain: "More confident and immediate voice.",
      loss: "Some of the measured distance in the original framing.",
    },
    proposed:
      "The rise of these systems has changed scholarly composition in practical ways.",
  },
  {
    id: "s8",
    category: "Word Choice",
    severity: "high",
    excerpt: "...the convenience of automation may flatten the specificity of academic voice.",
    paragraphIndex: 2,
    targetText:
      "Some scholars see the tools as a practical extension of writing labor, while others worry that the convenience of automation may flatten the specificity of academic voice.",
    observation: "You usually choose plainer verbs and nouns. This phrasing leans more abstract than your baseline.",
    tradeoff: {
      gain: "More natural and readable diction.",
      loss: "Less conceptual precision.",
    },
    proposed: "...the convenience of automation may dull the distinctiveness of academic voice.",
  },
  {
    id: "s9",
    category: "Structure",
    severity: "low",
    excerpt:
      "In many cases, they make judgment more important, because the first clear answer is not always the most precise one.",
    paragraphIndex: 1,
    targetText:
      "In many cases, they make judgment more important, because the first clear answer is not always the most precise one.",
    observation: "You typically end paragraphs more cleanly. This sentence would land better with more separation around it.",
    tradeoff: {
      gain: "More decisive paragraph ending.",
      loss: "A slightly less layered explanation.",
    },
    proposed:
      "In many cases, they make judgment more important. The first clear answer is not always the most precise one.",
  },
  {
    id: "s10",
    category: "Tone",
    severity: "low",
    excerpt:
      "Some scholars see the tools as a practical extension of writing labor, while others worry that the convenience of automation may flatten the specificity of academic voice.",
    paragraphIndex: 2,
    targetText:
      "Some scholars see the tools as a practical extension of writing labor, while others worry that the convenience of automation may flatten the specificity of academic voice.",
    observation: "You usually write with more certainty. This sentence leaves more hedging and distance in place.",
    tradeoff: {
      gain: "A firmer, more assertive tone.",
      loss: "Less room for uncertainty in the comparison.",
    },
    proposed:
      "Some scholars see the tools as a practical extension of writing labor, while others worry that automation will flatten academic voice.",
  },
  {
    id: "s11",
    category: "Sentence Flow",
    severity: "medium",
    excerpt:
      "Writers can now generate summaries, test outlines, and compare phrasings in seconds, yet those efficiencies do not remove the need for judgment.",
    paragraphIndex: 1,
    targetText:
      "Writers can now generate summaries, test outlines, and compare phrasings in seconds, yet those efficiencies do not remove the need for judgment.",
    observation: "You typically break dense ideas earlier. This sentence keeps both clauses together, which makes it feel heavier.",
    tradeoff: {
      gain: "Cleaner pacing and easier comprehension.",
      loss: "A little less rhetorical compression.",
    },
    proposed:
      "Writers can now generate summaries, test outlines, and compare phrasings in seconds. Those efficiencies do not remove the need for judgment.",
  },
  {
    id: "s12",
    category: "Word Choice",
    severity: "medium",
    excerpt:
      "Universities, journals, and individual writers are still deciding how to define responsible use...",
    paragraphIndex: 3,
    targetText:
      "Universities, journals, and individual writers are still deciding how to define responsible use, and those decisions will shape the norms that follow.",
    observation: "You usually prefer more direct phrasing. This version is accurate, but more formal and generalized than your norm.",
    tradeoff: {
      gain: "More direct and conversational phrasing.",
      loss: "Less institutional distance.",
    },
    proposed:
      "Universities, journals, and individual writers are still deciding what responsible use should mean...",
  },
  {
    id: "s13",
    category: "Punctuation",
    severity: "low",
    excerpt:
      "It is about how it should be used, where its limits should be drawn, and how writers can preserve clarity, ownership, and voice...",
    paragraphIndex: 4,
    targetText:
      "It is about how it should be used, where its limits should be drawn, and how writers can preserve clarity, ownership, and voice while still benefiting from the speed it offers.",
    observation: "You usually mark pauses with em-dashes. This sentence relies on commas instead of your usual punctuation pattern.",
    tradeoff: {
      gain: "A more distinctive pause and a stronger cadence.",
      loss: "A slightly more marked stylistic signature.",
    },
    proposed:
      "It is about how it should be used — where its limits should be drawn — and how writers can preserve clarity, ownership, and voice...",
  },
  {
    id: "s14",
    category: "Structure",
    severity: "medium",
    excerpt:
      "The rise of these systems has also altered the rhythm of scholarly composition.",
    paragraphIndex: 1,
    targetText:
      "The rise of these systems has also altered the rhythm of scholarly composition.",
    observation: "You typically use shorter structural units. This idea is sitting inside the paragraph rather than guiding the transition.",
    tradeoff: {
      gain: "Better structural separation between ideas.",
      loss: "Slightly less continuity within the paragraph.",
    },
    proposed:
      "The rise of these systems has also altered the rhythm of scholarly composition. That change is visible in how writers begin and revise drafts.",
  },
  {
    id: "s15",
    category: "Tone",
    severity: "high",
    excerpt:
      "For that reason, the discussion is no longer only about whether AI should be used.",
    paragraphIndex: 4,
    targetText: "For that reason, the discussion is no longer only about whether AI should be used.",
    observation: "You usually sound more decisive. This line is clear, but it stays slightly more tentative than your baseline.",
    tradeoff: {
      gain: "More confident closing cadence.",
      loss: "Less of a deliberative tone.",
    },
    proposed:
      "For that reason, the discussion is no longer only about whether AI should be used. It is about how it should be used.",
  },
  {
    id: "s16",
    category: "Sentence Flow",
    severity: "low",
    excerpt:
      "The discussion is no longer only about whether AI should be used. It is about how it should be used...",
    paragraphIndex: 4,
    targetText:
      "It is about how it should be used, where its limits should be drawn, and how writers can preserve clarity, ownership, and voice while still benefiting from the speed it offers.",
    observation: "You usually keep closings more compact. This repetition is deliberate, but it reads a little slower than your norm.",
    tradeoff: {
      gain: "Quicker, more forceful closing rhythm.",
      loss: "Some of the measured repetition.",
    },
    proposed:
      "The discussion is no longer about whether AI should be used. It is about how it should be used.",
  },
  {
    id: "s17",
    category: "Word Choice",
    severity: "low",
    excerpt:
      "This essay uses several terms like 'novelty,' 'specificity,' and 'ownership.'",
    paragraphIndex: 4,
    targetText:
      "It is about how it should be used, where its limits should be drawn, and how writers can preserve clarity, ownership, and voice while still benefiting from the speed it offers.",
    observation: "You usually simplify a few of these terms. Here, the wording stays a bit more abstract than your usual register.",
    tradeoff: {
      gain: "Cleaner everyday diction.",
      loss: "A little less conceptual precision.",
    },
    proposed:
      "This essay uses several terms like 'change,' 'clarity,' and 'ownership.'",
  },
  {
    id: "s18",
    category: "Structure",
    severity: "low",
    excerpt:
      "Writers can now generate summaries, test outlines, and compare phrasings in seconds.",
    paragraphIndex: 1,
    targetText:
      "Writers can now generate summaries, test outlines, and compare phrasings in seconds, yet those efficiencies do not remove the need for judgment.",
    observation: "You typically let important claims stand apart more clearly. Here, the sentence stays embedded in the flow.",
    tradeoff: {
      gain: "A clearer structural break.",
      loss: "A slightly less seamless paragraph.",
    },
    proposed:
      "Writers can now generate summaries, test outlines, and compare phrasings in seconds. That speed changes the writing process itself.",
  },
  {
    id: "s19",
    category: "Punctuation",
    severity: "low",
    excerpt:
      "The rise of these systems has also altered the rhythm of scholarly composition.",
    paragraphIndex: 3,
    targetText:
      "Universities, journals, and individual writers are still deciding how to define responsible use, and those decisions will shape the norms that follow.",
    observation: "You usually lean on stronger punctuation breaks. This line uses a softer pause than your normal style.",
    tradeoff: {
      gain: "A more precise and balanced pause.",
      loss: "A slightly less casual cadence.",
    },
    proposed:
      "The rise of these systems has also altered the rhythm of scholarly composition; that change matters.",
  },
];
