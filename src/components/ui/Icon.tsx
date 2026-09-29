import type { SVGProps } from 'react'

export type IconName = 'dashboard' | 'users' | 'applications' | 'loans' | 'collections' | 'reports' | 'settings' | 'admin' | 'search' | 'plus' | 'moon' | 'sun' | 'arrow-right' | 'refresh' | 'menu'

const paths: Record<IconName, string> = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  applications: 'M6 3h9l3 3v15H6zM14 3v4h4M9 12h6M9 16h6',
  loans: 'M3 10h18M5 10v8M19 10v8M3 18h18M12 3l9 5H3z',
  collections: 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h4',
  reports: 'M4 19V5M10 19V9M16 19V3M22 19V12',
  settings: 'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06-1.42 1.42-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V19.5h-2v-.08A1.65 1.65 0 0 0 12.5 18a1.65 1.65 0 0 0-1.82.33l-.06.06-1.42-1.42.06-.06A1.65 1.65 0 0 0 9.59 15a1.65 1.65 0 0 0-1.51-1H8V12h.08a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82L9.2 9.12l1.42-1.42.06.06A1.65 1.65 0 0 0 12.5 8a1.65 1.65 0 0 0 1-1.51V6.5h2v-.01A1.65 1.65 0 0 0 16.5 8a1.65 1.65 0 0 0 1.82-.33l.06-.06 1.42 1.42-.06.06a1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21v2h-.08A1.65 1.65 0 0 0 19.4 15Z',
  admin: 'M12 3l8 3v6c0 4.97-3.37 8.95-8 9-4.63-.05-8-4.03-8-9V6zM9 12l2 2 4-4',
  search: 'm21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  plus: 'M12 5v14M5 12h14',
  moon: 'M20.8 14.5A8 8 0 0 1 9.5 3.2 8.5 8.5 0 1 0 20.8 14.5Z',
  sun: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  refresh: 'M20 11a8 8 0 0 0-14.9-3L3 10M3 5v5h5M4 13a8 8 0 0 0 14.9 3L21 14m0 5v-5h-5',
  menu: 'M4 6h16M4 12h16M4 18h16',
}

export function Icon({ name, size = 18, ...props }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      <path d={paths[name]} />
    </svg>
  )
}
