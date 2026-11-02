# SupportDesk Frontend / Backend Integration

The frontend uses the supplied Express backend. Configure `VITE_API_URL` in `.env` (default: `http://localhost:5000/api`). All protected requests use the bearer token saved after login.

## Connected actions

- Register as Customer or Support Agent, verify the registration email OTP, then sign in with email/password.
- Request a password-reset OTP and submit it with a new password.
- Role-based customer, support-agent, and admin dashboards with live dashboard counts and recent tickets.
- Customer: fetch active categories, create a ticket, search/filter/paginate own tickets, view conversation/activity, send public replies, close and reopen own tickets.
- Support Agent: list assigned tickets, view conversation/activity, send public replies/internal notes, update status/priority, resolve/reopen/close assigned tickets.
- Admin: view all tickets, assign/reassign/unassign tickets using a list of active support agents, view ticket conversations/activity, manage user/agent account activation.
- Protected frontend routes and a shared Axios client that adds the access token and handles expired sessions.

## API routes used by the frontend

- `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/login`
- `POST /auth/forgot-password`, `POST /auth/reset-password`
- `GET /auth/profile`
- `GET /categories`, `GET /dashboard/summary`
- `GET /tickets`, `POST /tickets`, `GET /tickets/:ticketId`, `PATCH /tickets/:ticketId`
- `POST /tickets/:ticketId/assign`, `/resolve`, `/reopen`, `/close`
- `GET /tickets/:ticketId/messages`, `POST /tickets/:ticketId/messages`, `GET /tickets/:ticketId/activity`
- `GET /admin/users`, `GET /admin/agents`, `PATCH /admin/users/:userId/status`

The `/admin/*` endpoints are included in the companion updated backend ZIP and are admin-only.

## Features not supported by the supplied backend

These are deliberately not shown as working frontend controls because the backend has no matching APIs/services yet:

- Phone OTP verification/login and OTP resend.
- Ticket/message attachment upload and download.
- Notifications and read/unread notification state.
- Refresh-token rotation and server-side logout (the current access-token logout clears the browser session).
- Outbound email notifications for ticket creation/replies/status changes. The inbound email endpoint is only a provider-neutral webhook adapter and requires an email provider configuration.
- Admin creation of new users/agents, category CRUD, SLA configuration, and audit-log administration. Admin can list users/agents and activate/deactivate accounts; tickets already support an activity timeline.

## Run locally

1. Start MongoDB and configure `Backend/.env` using `Backend/.env.example`.
2. In `Backend`, run `npm install`, `npm run seed:categories` (first setup only), and `npm run dev`.
3. In `FrontEnd`, run `npm install` and `npm run dev`.
4. Ensure backend `CLIENT_URL` includes the Vite origin (normally `http://localhost:5173`).
