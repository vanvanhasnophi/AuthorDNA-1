import { Sparkles } from 'lucide-react'

import { SectionCard } from './workspace-shared'

const dnaDimensions = [
  {
    name: 'Sentence Flow',
    summary: 'Compact, direct cadence',
    comparableWriter: 'Joan Didion',
    detail:
      'This dimension measures how smoothly one sentence hands off to the next. Strong sentence flow avoids unnecessary turns, keeps clause structure clear, and uses punctuation to control pace rather than decorate the page. In practice, this is the dimension that makes a paragraph feel effortless even when the underlying argument is complex.',
  },
  {
    name: 'Tone',
    summary: 'Controlled, measured confidence',
    comparableWriter: 'James Baldwin',
    detail:
      'Tone captures the emotional temperature of the page. It answers whether the text sounds reassuring, analytical, urgent, intimate, or detached. A strong tone stays consistent without becoming flat; it can soften hard claims, sharpen key points, or make a personal observation feel trustworthy. When tone is aligned, readers feel the author is speaking with intention, not just producing sentences.',
  },
  {
    name: 'Word Choice',
    summary: 'Precise, restrained vocabulary',
    comparableWriter: 'Maya Angelou',
    detail:
      'Word choice is the vocabulary layer of your voice. It reveals whether you prefer concrete nouns, abstract concepts, vivid verbs, or formal terminology. The best word choice is not the fanciest one; it is the one that matches the audience and the purpose of the sentence. This dimension should reflect whether your language feels exact, approachable, and emotionally consistent with the rest of the piece.',
  },
  {
    name: 'Structure',
    summary: 'Clear progression, early orientation',
    comparableWriter: 'George Orwell',
    detail:
      'Structure describes how your ideas are arranged across paragraphs and sections. It shows whether you lead with the point, build toward it, or circle around it before landing. A strong structure makes the path through the argument visible, so readers can predict the direction without losing interest. It is also the dimension that controls how quickly a page moves from context to insight.',
  },
  {
    name: 'Punctuation',
    summary: 'Intentional pacing and emphasis',
    comparableWriter: 'Virginia Woolf',
    detail:
      'Punctuation is the timing system of the page. Commas slow the reader down, dashes widen a thought, semicolons connect balanced ideas, and periods create authority through closure. When punctuation is consistent with your voice, the text feels confident and readable. This dimension also reveals whether you prefer smooth continuity, controlled interruption, or a more formal ending rhythm.',
  },
] as const

export default function WorkspaceWritingDna() {
  return (
    <SectionCard
      title="Writing DNA"
      description="Read your writing through the same five dimensions used in Calibration, with a compact summary and a deeper profile for each one."
      icon={Sparkles}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {dnaDimensions.map((dimension) => (
          <article key={dimension.name} className="rounded-3xl border border-border/80 bg-card/80 p-5 shadow-sm">
            <div className="border-b border-border/70 pb-4">
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/50">
                {dimension.name}
              </div>
              <h2 className="mt-1 text-xl font-semibold text-foreground">{dimension.summary}</h2>
              <p className="mt-2 text-sm leading-6 text-foreground/55">
                Comparable writer: {dimension.comparableWriter}
              </p>
            </div>

            <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-foreground/45">Detailed analysis</div>
              <p className="mt-2 text-sm leading-6 text-foreground/70">{dimension.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}