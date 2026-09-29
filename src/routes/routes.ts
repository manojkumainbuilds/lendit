import type { IconName } from '../components/ui/Icon'

export interface NavItem { path: string; label: string; icon: IconName }

export const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/customers', label: 'Customers', icon: 'users' },
  { path: '/applications', label: 'Applications', icon: 'applications' },
  { path: '/loans', label: 'Loans', icon: 'loans' },
  { path: '/collections', label: 'Collections', icon: 'collections' },
  { path: '/reports', label: 'Reports', icon: 'reports' },
  { path: '/configuration', label: 'Configuration', icon: 'settings' },
  { path: '/administration', label: 'Administration', icon: 'admin' },
]
