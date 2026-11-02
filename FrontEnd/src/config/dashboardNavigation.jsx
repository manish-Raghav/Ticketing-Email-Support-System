import { LayoutDashboard, Ticket, PlusCircle, ClipboardList, Users, UserCog } from 'lucide-react';

// Only show screens backed by routes and APIs that exist in the current backend.
export const dashboardNavigation = {
  customer: [
    { label: 'Dashboard', path: '/customer/dashboard', icon: LayoutDashboard },
    { label: 'My Tickets', path: '/customer/tickets', icon: Ticket },
    { label: 'Create Ticket', path: '/customer/tickets/create', icon: PlusCircle },
  ],
  support_agent: [
    { label: 'Dashboard', path: '/agent/dashboard', icon: LayoutDashboard },
    { label: 'Assigned Tickets', path: '/agent/tickets', icon: Ticket },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'All Tickets', path: '/admin/tickets', icon: ClipboardList },
    { label: 'Manage Users', path: '/admin/users', icon: Users },
    { label: 'Manage Agents', path: '/admin/agents', icon: UserCog },
  ],
};
