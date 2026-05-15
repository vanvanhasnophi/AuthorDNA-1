import { Settings2 } from 'lucide-react'

import { SectionCard } from './workspace-shared'
import { useAdminSession } from '@/stores/use-admin-session'

export default function WorkspaceSettings() {
  const session = useAdminSession((state) => state.session)

  return (
    <SectionCard title="Settings" description="Manage account, theme, and workspace preferences." icon={Settings2}>
      <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-2xl border border-border/80 bg-card/80 p-5">
          <div className="text-sm font-medium text-foreground">Account</div>
          <p className="mt-2 text-sm leading-6 text-foreground/50">Current account: {session?.username || 'AuthorDNA user'}</p>
        </div>
        <div className="rounded-2xl border border-border/80 bg-card/80 p-5">
          <div className="text-sm font-medium text-foreground">Preference</div>
          <p className="mt-2 text-sm leading-6 text-foreground/50">Theme switching, session management, and future personalization options can live here.</p>
        </div>
      </div>
    </SectionCard>
  )
}