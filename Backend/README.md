# Ticketing & Email Support Backend

## Setup

1. Install dependencies: `npm install`
2. Create `.env` from `.env.example` and set `MONGODB_URI`, `JWT_SECRET`, email settings, and `INBOUND_EMAIL_WEBHOOK_SECRET`.
3. Seed the four default categories: `npm run seed:categories`
4. Start development server: `npm run dev`

The category collection provides the dropdown options, while each ticket stores the selected category **name as a string** (`Technical Support`, `Account`, `Billing`, or `General Inquiry`). It does not store a Category ObjectId in the Ticket document.

## Authentication
All routes below require `Authorization: Bearer <access-token>` except `POST /api/email/inbound`, which uses `x-inbound-webhook-secret`.

## Ticket APIs

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| POST | `/api/tickets` | Create a ticket | Customer |
| GET | `/api/tickets` | List tickets | Customer: own; Agent: assigned; Admin: all |
| GET | `/api/tickets/:ticketId` | Get ticket details | Ticket participants/Admin |
| PATCH | `/api/tickets/:ticketId` | Update permitted ticket fields | Customer/assigned Agent/Admin |
| POST | `/api/tickets/:ticketId/assign` | Assign/reassign/unassign | Admin |
| POST | `/api/tickets/:ticketId/resolve` | Resolve ticket | Assigned Agent/Admin |
| POST | `/api/tickets/:ticketId/reopen` | Reopen resolved/closed ticket | Owner/assigned Agent/Admin |
| POST | `/api/tickets/:ticketId/close` | Close ticket | Owner/assigned Agent/Admin |
| GET | `/api/tickets/:ticketId/messages` | Get conversation | Ticket participants; customers see public replies only |
| POST | `/api/tickets/:ticketId/messages` | Add public reply/internal note | Ticket participants; customer public only |
| GET | `/api/tickets/:ticketId/activity` | Get activity timeline | Ticket participants; customers see public activity only |

## Other APIs

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/categories` | List active categories for the ticket form |
| GET | `/api/dashboard/summary` | Role-scoped dashboard counts |
| POST | `/api/email/inbound` | Receive a normalized inbound email reply |

## Example request bodies

Create ticket (`POST /api/tickets`):

```json
{
  "subject": "Unable to login to my account",
  "description": "I cannot log in to my account. Please help me.",
  "category": "Technical Support",
  "priority": "high"
}
```

Assign/reassign (`POST /api/tickets/:ticketId/assign`, Admin):

```json
{ "assignedTo": "SUPPORT_AGENT_USER_OBJECT_ID" }
```

Use `{ "assignedTo": null }` to unassign.

Reply (`POST /api/tickets/:ticketId/messages`):

```json
{ "body": "We are checking this issue and will update you shortly.", "type": "public" }
```

Internal note (Agent/Admin only):

```json
{ "body": "Customer needs an account reset; verify identity before proceeding.", "type": "internal" }
```

Inbound email (`POST /api/email/inbound`):

Header: `x-inbound-webhook-secret: <INBOUND_EMAIL_WEBHOOK_SECRET>`

```json
{
  "ticketNumber": "TKT-EXAMPLE",
  "from": "verified-requester@example.com",
  "subject": "Re: Unable to login",
  "text": "I tried again and the issue is still happening.",
  "messageId": "provider-unique-message-id"
}
```

The inbound endpoint is a provider-neutral adapter, not a direct SendGrid/Mailgun/SES integration. Configure your provider to call this endpoint and map its verified inbound event to these fields. The sender must match the ticket requester or assigned agent, and `messageId` is used to prevent duplicate processing.

## Status and permissions

- Customers can create tickets, read their own tickets, send public replies, close their own tickets, and reopen their own resolved/closed tickets.
- Support agents can read tickets assigned to them, reply, add internal notes, resolve/reopen/close assigned tickets, and update priority/status through the existing PATCH route.
- Admins can read all tickets, assign/reassign/unassign agents, and perform ticket lifecycle operations.
- Categories are seeded in the `categories` collection. The frontend should call `GET /api/categories`, display each category name, and submit the selected name as a string.

## Important

If you already have old ticket documents whose `category` field is an ObjectId, those existing documents need a migration to category names before relying on the new string schema. Back up your database before running any migration.

## Admin user APIs (added for the integrated frontend)

These routes require a valid admin bearer token:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/admin/users` | List all users (supports `page`, `limit`, and `search`) |
| GET | `/api/admin/agents` | List support agents (supports `page`, `limit`, and `search`) |
| PATCH | `/api/admin/users/:userId/status` | Activate/deactivate an account with `{ "isActive": true }` or `{ "isActive": false }` |

The status endpoint does not allow an administrator to deactivate their own account. The API returns only public account fields and never returns password hashes.
