export type SupportCategory =
  | "Booking / Parking"
  | "Payment"
  | "Slot Issue"
  | "EV Charging"
  | "Entry / Exit"
  | "Account"
  | "Other";

export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export type TicketPriority = "Low" | "Normal" | "High" | "Urgent";

export interface SupportTicket {
  ticketId: string;
  userId: string;
  name: string;
  email: string;
  bookingId?: string | undefined;
  category: SupportCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string | undefined;
}

export const SUPPORT_CATEGORIES: { id: SupportCategory; label: string; icon: string; defaultPriority: TicketPriority; placeholder: string }[] = [
  {
    id: "Booking / Parking",
    label: "Booking / Parking",
    icon: "🅿️",
    defaultPriority: "Normal",
    placeholder: "Issues modifying booking, dates, or slot reassignments",
  },
  {
    id: "Payment",
    label: "Payment",
    icon: "💳",
    defaultPriority: "High",
    placeholder: "Deductions without confirmation, UPI timeouts, GST invoice requests",
  },
  {
    id: "Slot Issue",
    label: "Slot Issue",
    icon: "🚗",
    defaultPriority: "Urgent",
    placeholder: "Another vehicle parked in your assigned bay, physical obstruction",
  },
  {
    id: "EV Charging",
    label: "EV Charging",
    icon: "⚡",
    defaultPriority: "High",
    placeholder: "Charger connector locked, dispensing error, tariff discrepancy",
  },
  {
    id: "Entry / Exit",
    label: "Entry / Exit",
    icon: "🚪",
    defaultPriority: "Urgent",
    placeholder: "QR barrier not lifting, ticket scanner error, overstay adjustment",
  },
  {
    id: "Account",
    label: "Account",
    icon: "👤",
    defaultPriority: "Low",
    placeholder: "Profile details, vehicle plate updates, notification preferences",
  },
  {
    id: "Other",
    label: "Other",
    icon: "❓",
    defaultPriority: "Normal",
    placeholder: "General feedback, corporate parking inquiries, lost and found",
  },
];

const STORAGE_KEY = "parkgrid_support_tickets_v1";

const INITIAL_TICKETS: SupportTicket[] = [
  {
    ticketId: "PG-SUP-2026-1042",
    userId: "BD-9941",
    name: "Bhushan Dhavale",
    email: "bhushan@example.com",
    bookingId: "SP-10231",
    category: "Payment",
    subject: "GST invoice copy for Corporate Expense",
    message: "Kindly email the official B2B GST tax invoice for booking SP-10231 with company tax registration details.",
    status: "Resolved",
    priority: "Normal",
    createdAt: "2026-09-24T10:15:00.000Z",
    updatedAt: "2026-09-24T12:30:00.000Z",
    resolutionNotes: "Automated GST Tax Invoice PDF dispatched to registered email.",
  },
];

export function getStoredTickets(): SupportTicket[] {
  if (typeof window === "undefined") return INITIAL_TICKETS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return JSON.parse(raw) as SupportTicket[];
  } catch {
    return INITIAL_TICKETS;
  }
}

export function saveStoredTickets(tickets: SupportTicket[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error("Failed to persist support tickets", e);
  }
}

export function createSupportTicket(input: {
  name: string;
  email: string;
  bookingId?: string | undefined;
  category: SupportCategory;
  subject: string;
  message: string;
  userId?: string | undefined;
}): SupportTicket {
  const existing = getStoredTickets();
  const nextSeq = 1043 + existing.length;
  const ticketId = `PG-SUP-2026-${nextSeq}`;
  const now = new Date().toISOString();

  // Automatic priority assignment based on category urgency
  const catConfig = SUPPORT_CATEGORIES.find((c) => c.id === input.category);
  const priority = catConfig ? catConfig.defaultPriority : "Normal";

  const newTicket: SupportTicket = {
    ticketId,
    userId: input.userId || "GUEST-USER",
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    bookingId: input.bookingId?.trim() ? input.bookingId.trim().toUpperCase() : undefined,
    category: input.category,
    subject: input.subject.trim(),
    message: input.message.trim(),
    status: "Open",
    priority,
    createdAt: now,
    updatedAt: now,
  };

  const updatedList = [newTicket, ...existing];
  saveStoredTickets(updatedList);
  return newTicket;
}
