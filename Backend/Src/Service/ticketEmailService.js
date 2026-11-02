
import transporter from "../Config/email.js";

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);

const sendTicketEmail = async ({ to, subject, html }) => {
  if (!to) return;

  try {
    await transporter.sendMail({
      from: `"Ticket Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Ticket notification email failed:", error.message);
  }
};

// Notify all active admins when a customer creates a ticket.
const notifyAdminsNewTicket = async (ticket, admins) => {
  const recipients = admins.map((admin) => admin.email).filter(Boolean);

  if (!recipients.length) return;

  await sendTicketEmail({
    to: recipients.join(","),
    subject: `New Ticket Created - ${ticket.ticketNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;padding:20px">
        <h2>New Support Ticket</h2>
        <p>A customer has created a new support ticket.</p>
        <p><strong>Ticket:</strong> ${escapeHtml(ticket.ticketNumber)}</p>
        <p><strong>Customer:</strong> ${escapeHtml(ticket.requester?.name || "Customer")}</p>
        <p><strong>Email:</strong> ${escapeHtml(ticket.requester?.email || "")}</p>
        <p><strong>Subject:</strong> ${escapeHtml(ticket.subject)}</p>
        <p><strong>Category:</strong> ${escapeHtml(ticket.category)}</p>
        <p><strong>Priority:</strong> ${escapeHtml(ticket.priority)}</p>
        <p><strong>Status:</strong> ${escapeHtml(ticket.status)}</p>
      </div>
    `,
  });
};

// Notify the customer and active admins when ticket status changes.
const notifyTicketStatusChanged = async (ticket, oldStatus, newStatus, admins) => {
  if (!ticket || oldStatus === newStatus) return;

  const recipients = [
    ticket.requester?.email,
    ...admins.map((admin) => admin.email),
  ].filter(Boolean);

  const uniqueRecipients = [...new Set(recipients)];

  if (!uniqueRecipients.length) return;

  const subject = `Ticket Status Updated - ${ticket.ticketNumber}`;

  const html = `
    <div style="font-family:Arial,sans-serif;padding:20px">
      <h2>Ticket Status Updated</h2>
      <p>The status of your support ticket has been changed.</p>
      <p><strong>Ticket:</strong> ${escapeHtml(ticket.ticketNumber)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(ticket.subject)}</p>
      <p><strong>Previous Status:</strong> ${escapeHtml(oldStatus)}</p>
      <p><strong>New Status:</strong> ${escapeHtml(newStatus)}</p>
    </div>
  `;

  // Send separate emails so recipients cannot see each other's addresses.
  await Promise.all(
    uniqueRecipients.map((email) =>
      sendTicketEmail({
        to: email,
        subject,
        html,
      })
    )
  );
};

export default {
  sendTicketEmail,
  notifyAdminsNewTicket,
  notifyTicketStatusChanged,
};
