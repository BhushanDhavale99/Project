export type FAQCategory =
  | "Parking"
  | "Booking"
  | "Payments"
  | "Cancellation & Refunds"
  | "EV Charging"
  | "Entry & Exit"
  | "Parking AI";

export interface FAQItem {
  id: string;
  category: FAQCategory;
  subcategory: string;
  question: string;
  answer: string;
  badge?: string;
  importantNotice?: string;
  source: string;
  document: string;
  version: string;
  lastUpdated: string;
  relatedIds: string[];
  keywords: string[];
}

export interface CategoryInfo {
  id: FAQCategory;
  name: string;
  emoji: string;
  iconName: string;
  shortDesc: string;
  subcategories: string[];
}

export const FAQ_CATEGORIES: CategoryInfo[] = [
  {
    id: "Parking",
    name: "Parking",
    emoji: "🅿️",
    iconName: "CarFront",
    shortDesc: "Slots, floors, heavy vehicle guidelines, and 24/7 hours",
    subcategories: [
      "Available parking slots",
      "Slot colors/status",
      "Parking floors",
      "Heavy vehicle restrictions",
      "Operating hours",
      "Entrance and exit",
    ],
  },
  {
    id: "Booking",
    name: "Booking",
    emoji: "🎫",
    iconName: "Ticket",
    shortDesc: "Reserve slots, modifications, extensions, and digital passes",
    subcategories: [
      "How to book",
      "Slot selection",
      "Changing a booking",
      "Extending parking",
      "Viewing bookings",
    ],
  },
  {
    id: "Payments",
    name: "Payments",
    emoji: "💳",
    iconName: "CreditCard",
    shortDesc: "Rates, UPI/Card methods, automated calculations, and receipts",
    subcategories: [
      "Payment methods",
      "Parking fee calculation",
      "Failed payments",
      "Payment status",
    ],
  },
  {
    id: "Cancellation & Refunds",
    name: "Cancellation & Refunds",
    emoji: "❌",
    iconName: "RotateCcw",
    shortDesc: "Cancellation timelines, bank refund SLAs, and no-show policies",
    subcategories: [
      "Cancellation process",
      "Cancellation policy",
      "Refund process",
      "No-show policy",
    ],
  },
  {
    id: "EV Charging",
    name: "EV Charging",
    emoji: "⚡",
    iconName: "Zap",
    shortDesc: "Fast DC & AC chargers, tariffs, and real-time charging status",
    subcategories: [
      "EV charger availability",
      "Charger types",
      "Charging process",
      "Charging fees",
    ],
  },
  {
    id: "Entry & Exit",
    name: "Entry & Exit",
    emoji: "🚪",
    iconName: "ScanLine",
    shortDesc: "Contactless QR barriers, overstay guidance, and speed limits",
    subcategories: ["QR verification", "Entry process", "QR problems", "Exit process", "Overstay"],
  },
  {
    id: "Parking AI",
    name: "Parking AI",
    emoji: "🤖",
    iconName: "Bot",
    shortDesc: "24/7 smart concierge for live bay telemetry, rules, and guidance",
    subcategories: [
      "What Parking AI can do",
      "Live availability questions",
      "Parking-rule questions",
      "Booking-related questions",
    ],
  },
];

export const FAQ_DATABASE: FAQItem[] = [
  // ── 1. PARKING ─────────────────────────────────────────────────────────────
  {
    id: "prk-01",
    category: "Parking",
    subcategory: "Available parking slots",
    question: "How many parking slots are available and how can I check in real-time?",
    answer:
      "ParkGrid One at Bandra Kurla Complex (BKC) features 150 automated sensor-tracked parking bays. Live capacity typically shows 73 available, 62 occupied, and 15 reserved spaces. You can inspect live bay counts by floor and zone directly on the interactive Parking map or ask the AI Concierge.",
    badge: "150 Total Bays",
    source: "ParkGrid Facility Telemetry & Operations Manual v2.4",
    document: "ParkGrid_BKC_Facility_Specs.pdf",
    version: "2.4.1",
    lastUpdated: "September 2026",
    relatedIds: ["prk-02", "prk-03", "ai-02"],
    keywords: ["capacity", "available", "slots", "spaces", "real-time", "bays", "bkc"],
  },
  {
    id: "prk-02",
    category: "Parking",
    subcategory: "Slot colors/status",
    question: "What do the slot colors and statuses mean on the parking map?",
    answer:
      "The parking map uses standard intuitive color codes: Green indicates 'Available' and ready to book; Red indicates 'Occupied' by an active vehicle; Amber/Yellow indicates 'Reserved' for an incoming arrival; Cyan/Blue indicates your currently 'Selected' slot during booking; and Grey/Orange indicates a bay undergoing scheduled maintenance or sensor calibration.",
    badge: "Color Indicators",
    source: "ParkGrid UI Standards & Driver Signage Guide",
    document: "ParkGrid_Signage_Manual.pdf",
    version: "2.1.0",
    lastUpdated: "September 2026",
    relatedIds: ["prk-01", "bok-02"],
    keywords: ["colors", "green", "red", "amber", "status", "legend", "map"],
  },
  {
    id: "prk-03",
    category: "Parking",
    subcategory: "Parking floors",
    question: "How are the parking floors arranged across the BKC facility?",
    answer:
      "The facility comprises five distinct levels: B1 and B2 (Underground Basement parking), G1 (Ground Floor level), and L1 and L2 (Upper Elevated parking decks). Each level includes direct elevator lobbies, pedestrian walkways, LED directional signs, and accessible handicap parking adjacent to lifts.",
    badge: "B1 · B2 · G1 · L1 · L2",
    source: "BKC Facility Structural & Architectural Blueprint",
    document: "ParkGrid_Architectural_Layout.pdf",
    version: "3.0",
    lastUpdated: "September 2026",
    relatedIds: ["prk-04", "prk-06"],
    keywords: ["floors", "basement", "ground", "upper", "b1", "b2", "g1", "l1", "l2", "levels"],
  },
  {
    id: "prk-04",
    category: "Parking",
    subcategory: "Heavy vehicle restrictions",
    question: "What are the restrictions and designated zones for heavy vehicles?",
    answer:
      "For structural and vertical clearance safety, heavy vehicles (SUVs with roof-racks exceeding 2.1m, commercial vans, tempos, and multi-axle vehicles) are permitted only on Ground (G1) and Basement (B1 & B2) levels. Upper decks (L1 and L2) have a strict 2.0-meter height ceiling and weight thresholds dedicated to standard passenger cars and motorcycles.",
    badge: "Notice: G1 & B1/B2 Only",
    importantNotice:
      "Heavy vehicles are allowed only on Ground (G1) and Basement (B1/B2) levels. Height limit on L1/L2 is 2.0 meters.",
    source: "Municipal Corporation of Greater Mumbai (MCGM) & ParkGrid Safety Code",
    document: "Heavy_Vehicle_Compliance_BKC.pdf",
    version: "2.2.0",
    lastUpdated: "September 2026",
    relatedIds: ["prk-03", "ent-02"],
    keywords: [
      "heavy vehicles",
      "suv",
      "height clearance",
      "restrictions",
      "trucks",
      "vans",
      "g1",
      "basement",
    ],
  },
  {
    id: "prk-05",
    category: "Parking",
    subcategory: "Operating hours",
    question: "What are the facility operating hours and on-site staff availability?",
    answer:
      "ParkGrid One operates 24 hours a day, 7 days a week, 365 days a year without closure. Automated boom barriers, high-definition CCTV surveillance, license plate cameras, and emergency intercom stations operate continuously. Dedicated facility marshals and technical support staff are stationed on Ground (G1) round the clock.",
    badge: "Open 24/7",
    source: "ParkGrid Facility Operations Manual v2.4",
    document: "ParkGrid_BKC_Facility_Specs.pdf",
    version: "2.4.1",
    lastUpdated: "September 2026",
    relatedIds: ["prk-01", "ent-02"],
    keywords: ["operating hours", "24/7", "timing", "open", "night", "weekend", "holidays"],
  },
  {
    id: "prk-06",
    category: "Parking",
    subcategory: "Entrance and exit",
    question: "Where are the vehicular entrance and exit points located in BKC?",
    answer:
      "The vehicular entrance is located on the main BKC access arterial road (near G-Block, Bandra East) with dedicated RFID and QR entry lanes. Exits lead directly onto the perimeter boulevard to ensure smooth vehicular flow without queuing. The internal facility speed limit is strictly enforced at 8 km/h.",
    badge: "Speed Limit: 8 km/h",
    source: "BKC Traffic Integration & Traffic Police NOC",
    document: "ParkGrid_Traffic_Flow_Plan.pdf",
    version: "1.9",
    lastUpdated: "September 2026",
    relatedIds: ["ent-01", "ent-02", "prk-04"],
    keywords: ["entrance", "exit", "bkc access", "g block", "traffic", "speed limit", "directions"],
  },

  // ── 2. BOOKING ─────────────────────────────────────────────────────────────
  {
    id: "bok-01",
    category: "Booking",
    subcategory: "How to book",
    question: "How do I reserve a parking slot in advance?",
    answer:
      "Reserving a slot takes under 60 seconds: Navigate to the 'Parking' page, choose your entry date and time duration, select your vehicle type (Car, Bike, or EV), browse the interactive floor map to pick your desired bay, enter your vehicle registration plate number, and proceed to checkout with instant digital confirmation.",
    badge: "Instant Confirmation",
    source: "ParkGrid Digital Booking Manual",
    document: "ParkGrid_User_Guide_2026.pdf",
    version: "2.3",
    lastUpdated: "September 2026",
    relatedIds: ["bok-02", "pay-01"],
    keywords: ["how to book", "reservation", "advance", "step by step", "vehicle", "checkout"],
  },
  {
    id: "bok-02",
    category: "Booking",
    subcategory: "Slot selection",
    question: "Can I choose my specific bay, floor, or EV charging spot?",
    answer:
      "Yes. Unlike conventional car parks that assign random bays, ParkGrid gives you full control. You can filter by Floor (B1, B2, G1, L1, L2) and Zone (Zone A, Zone B, EV Zone). Clicking any green bay reveals its slot ID, proximity to lifts, price per hour, and charging specifications.",
    badge: "Interactive Choice",
    source: "ParkGrid Digital Booking Manual",
    document: "ParkGrid_User_Guide_2026.pdf",
    version: "2.3",
    lastUpdated: "September 2026",
    relatedIds: ["bok-01", "ev-01", "prk-03"],
    keywords: ["slot selection", "pick bay", "choose floor", "zone a", "zone b", "ev zone"],
  },
  {
    id: "bok-03",
    category: "Booking",
    subcategory: "Changing a booking",
    question: "Can I change my booked vehicle number, arrival time, or assigned slot?",
    answer:
      "You can modify your booking details (arrival time window, license plate number, or change to another available slot of the same tier) up to 30 minutes before your scheduled start time without any modification fee via 'My Bookings'. If switching to an EV bay, the tariff difference is adjusted at checkout.",
    badge: "Free Changes ≤ 30m",
    source: "ParkGrid Reservation & Customer Terms",
    document: "Booking_Terms_Conditions_2026.pdf",
    version: "1.4",
    lastUpdated: "September 2026",
    relatedIds: ["bok-04", "can-02"],
    keywords: ["modify", "change", "edit booking", "reschedule", "license plate", "update"],
  },
  {
    id: "bok-04",
    category: "Booking",
    subcategory: "Extending parking",
    question: "How do I extend my parking session if I am running late?",
    answer:
      "You can extend an active parking session anytime before your scheduled departure. Simply open 'My Bookings', tap 'Extend Parking', select the additional hours needed, and approve the payment. If your current bay has an immediate subsequent reservation, the system will offer you an alternative convenient bay.",
    badge: "In-App Extension",
    source: "ParkGrid Reservation & Customer Terms",
    document: "Booking_Terms_Conditions_2026.pdf",
    version: "1.4",
    lastUpdated: "September 2026",
    relatedIds: ["bok-03", "ent-05"],
    keywords: ["extend", "running late", "prolong", "extra hours", "overtime", "session"],
  },
  {
    id: "bok-05",
    category: "Booking",
    subcategory: "Viewing bookings",
    question: "Where can I view my active passes, upcoming bookings, and history?",
    answer:
      "All your reservations are organized chronologically on the 'My Bookings' page under four tabs: Upcoming (with your ready-to-scan QR pass), Active (with live countdown timer), Completed (with downloadable tax invoices), and Cancelled (with refund tracking).",
    badge: "My Bookings Hub",
    source: "ParkGrid Digital Booking Manual",
    document: "ParkGrid_User_Guide_2026.pdf",
    version: "2.3",
    lastUpdated: "September 2026",
    relatedIds: ["bok-01", "ent-01"],
    keywords: ["view bookings", "history", "passes", "qr code", "invoice", "receipt"],
  },

  // ── 3. PAYMENTS ────────────────────────────────────────────────────────────
  {
    id: "pay-01",
    category: "Payments",
    subcategory: "Payment methods",
    question: "Which payment methods are accepted at ParkGrid One?",
    answer:
      "We accept all major secure Indian and international payment gateways: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit and Debit cards (Visa, MasterCard, RuPay, American Express), Net Banking across 50+ banks, and ParkGrid FastPass digital wallet balances.",
    badge: "UPI · Cards · NetBanking",
    source: "ParkGrid Financial & Payment Compliance Policy",
    document: "Payment_Terms_and_Gateway_Policy.pdf",
    version: "2.0",
    lastUpdated: "September 2026",
    relatedIds: ["pay-02", "pay-03"],
    keywords: [
      "payment methods",
      "upi",
      "google pay",
      "phonepe",
      "credit card",
      "debit card",
      "rupay",
    ],
  },
  {
    id: "pay-02",
    category: "Payments",
    subcategory: "Parking fee calculation",
    question: "How are parking fees calculated and are taxes included?",
    answer:
      "Standard parking is priced at ₹50 per hour. EV charging bays are ₹70 per hour (electric energy consumed is billed separately at ₹12/kWh). All rates are subject to 18% statutory GST, which is itemized transparently during checkout and on official GST tax invoices.",
    badge: "₹50/hr Standard · ₹70/hr EV",
    source: "ParkGrid Tariff Schedule & Commercial Policy",
    document: "ParkGrid_Tariff_Schedule_BKC.pdf",
    version: "2.1",
    lastUpdated: "September 2026",
    relatedIds: ["ev-04", "bok-01"],
    keywords: ["pricing", "cost", "fee calculation", "rates", "gst", "hourly tariff", "tax"],
  },
  {
    id: "pay-03",
    category: "Payments",
    subcategory: "Failed payments",
    question: "What happens if money is deducted but the booking shows failed?",
    answer:
      "If your bank debits your account but gateway confirmation times out, the funds remain safely protected. Most automated banking reconciliations auto-refund within 24 to 48 hours. If the booking did not generate, submit a ticket on our 'Contact Support' page with your bank UTR or transaction ID.",
    badge: "Auto-Reconciliation",
    source: "ParkGrid Financial & Payment Compliance Policy",
    document: "Payment_Terms_and_Gateway_Policy.pdf",
    version: "2.0",
    lastUpdated: "September 2026",
    relatedIds: ["pay-01", "pay-04", "can-03"],
    keywords: [
      "failed payment",
      "money deducted",
      "gateway error",
      "utr",
      "pending",
      "reconciliation",
    ],
  },
  {
    id: "pay-04",
    category: "Payments",
    subcategory: "Payment status",
    question: "How do I check the payment status of my transaction or get a GST invoice?",
    answer:
      "Upon successful payment, an automated confirmation screen displays the Transaction Reference, Payment Gateway ID, and Amount Paid. You can download the GST invoice at any time from 'My Bookings' or receive it via your registered email address.",
    badge: "GST Invoices",
    source: "ParkGrid Financial & Payment Compliance Policy",
    document: "Payment_Terms_and_Gateway_Policy.pdf",
    version: "2.0",
    lastUpdated: "September 2026",
    relatedIds: ["pay-01", "bok-05"],
    keywords: ["payment status", "invoice", "receipt", "gst bill", "tax invoice", "transaction id"],
  },

  // ── 4. CANCELLATION & REFUNDS ──────────────────────────────────────────────
  {
    id: "can-01",
    category: "Cancellation & Refunds",
    subcategory: "Cancellation process",
    question: "How do I cancel my parking reservation?",
    answer:
      "To cancel a booking: Open the 'My Bookings' page, locate your upcoming reservation under the 'Upcoming' tab, tap 'View Details', and click 'Cancel Reservation'. You will be shown the applicable refund calculation before confirming the cancellation.",
    badge: "Self-Service",
    source: "ParkGrid Customer Service & Cancellation Protocol",
    document: "Cancellation_and_Refund_Policy_2026.pdf",
    version: "2.2",
    lastUpdated: "September 2026",
    relatedIds: ["can-02", "can-03"],
    keywords: ["cancel booking", "cancellation process", "how to cancel", "refund request"],
  },
  {
    id: "can-02",
    category: "Cancellation & Refunds",
    subcategory: "Cancellation policy",
    question: "What is the ParkGrid cancellation and refund policy timeline?",
    answer:
      "Cancellations made more than 2 hours prior to scheduled arrival receive a 100% full refund. Cancellations made between 30 minutes and 2 hours prior to arrival receive a 50% refund. Cancellations requested less than 30 minutes before arrival or after scheduled start are non-refundable.",
    badge: "100% Refund > 2 hrs",
    importantNotice:
      "100% refund for cancellations > 2 hours prior. 50% refund between 30 mins and 2 hours. Non-refundable within 30 mins of arrival.",
    source: "ParkGrid Customer Service & Cancellation Protocol",
    document: "Cancellation_and_Refund_Policy_2026.pdf",
    version: "2.2",
    lastUpdated: "September 2026",
    relatedIds: ["can-01", "can-03", "can-04"],
    keywords: ["cancellation policy", "refund percentage", "2 hours", "terms", "deadline"],
  },
  {
    id: "can-03",
    category: "Cancellation & Refunds",
    subcategory: "Refund process",
    question: "How long does it take for the refund to reflect in my bank account?",
    answer:
      "Approved refunds are processed through the payment gateway within 1 hour. Depending on your bank's clearance cycle: UPI refunds typically credit within 2 to 4 hours, whereas Credit/Debit Card and Net Banking reversals reflect within 3 to 5 banking business days.",
    badge: "3-5 Business Days",
    source: "ParkGrid Customer Service & Cancellation Protocol",
    document: "Cancellation_and_Refund_Policy_2026.pdf",
    version: "2.2",
    lastUpdated: "September 2026",
    relatedIds: ["can-01", "can-02", "pay-03"],
    keywords: ["refund time", "sla", "banking days", "upi refund", "credit card refund"],
  },
  {
    id: "can-04",
    category: "Cancellation & Refunds",
    subcategory: "No-show policy",
    question: "What happens if I do not arrive for my booked reservation (No-Show)?",
    answer:
      "Your reserved slot is held exclusively for you for 45 minutes past your scheduled start time. If you do not scan into the facility within this 45-minute grace window without rescheduling, the bay is marked as a 'No-Show' and released for dynamic assignment, with no refund eligible.",
    badge: "45m Grace Window",
    source: "ParkGrid Reservation & Customer Terms",
    document: "Booking_Terms_Conditions_2026.pdf",
    version: "1.4",
    lastUpdated: "September 2026",
    relatedIds: ["can-02", "ent-02"],
    keywords: ["no show", "grace period", "late arrival", "missed booking", "forfeited"],
  },

  // ── 5. EV CHARGING ─────────────────────────────────────────────────────────
  {
    id: "ev-01",
    category: "EV Charging",
    subcategory: "EV charger availability",
    question: "How many EV charging bays are available and where are they located?",
    answer:
      "ParkGrid One provides six dedicated ultra-fast EV charging bays (bays E01 through E06) located on Ground (G1) and Basement (B1). All EV spots are equipped with overhead digital presence sensors, cable management holsters, and live battery level telemetry.",
    badge: "6 Dedicated Bays",
    source: "ParkGrid Clean Mobility Infrastructure Spec",
    document: "EV_Infrastructure_Manual_BKC.pdf",
    version: "2.0",
    lastUpdated: "September 2026",
    relatedIds: ["ev-02", "ev-03", "prk-03"],
    keywords: ["ev charging", "electric vehicle", "chargers", "e01", "bays", "b1", "g1"],
  },
  {
    id: "ev-02",
    category: "EV Charging",
    subcategory: "Charger types",
    question: "What connector standards and charging speeds are supported?",
    answer:
      "Our charging infrastructure features high-capacity Dual CCS2 DC Fast Chargers supporting speeds up to 60 kW (delivering 20% to 80% charge in ~35-45 minutes), alongside Type-2 AC destination chargers operating at up to 22 kW for longer parking durations.",
    badge: "CCS2 (60kW) & Type-2",
    source: "ParkGrid Clean Mobility Infrastructure Spec",
    document: "EV_Infrastructure_Manual_BKC.pdf",
    version: "2.0",
    lastUpdated: "September 2026",
    relatedIds: ["ev-01", "ev-03"],
    keywords: ["ccs2", "type 2", "fast charger", "kw", "connector", "tata", "mg", "hyundai", "byd"],
  },
  {
    id: "ev-03",
    category: "EV Charging",
    subcategory: "Charging process",
    question: "How do I initiate an EV charging session upon arrival?",
    answer:
      "After parking in your booked EV bay, plug the corresponding CCS2 or Type-2 connector securely into your vehicle socket. Scan the QR code located on the charger totem using the ParkGrid app, verify your charging target (e.g. 80% or 100%), and tap 'Start Session'. Live kWh usage and battery metrics update in real-time.",
    badge: "Plug & Scan",
    source: "ParkGrid Clean Mobility Infrastructure Spec",
    document: "EV_Infrastructure_Manual_BKC.pdf",
    version: "2.0",
    lastUpdated: "September 2026",
    relatedIds: ["ev-01", "ev-04"],
    keywords: ["charging process", "plug in", "start session", "kwh telemetry", "qr scan"],
  },
  {
    id: "ev-04",
    category: "EV Charging",
    subcategory: "Charging fees",
    question: "What are the tariffs for EV parking and electricity consumption?",
    answer:
      "EV bays are billed at ₹70 per hour for parking bay occupancy. Electricity consumed is billed transparently at ₹12 per kWh with zero hidden surcharge. Upon completion of charging, you have a 15-minute complimentary disconnect window before standard idle fees apply.",
    badge: "₹12/kWh + ₹70/hr Bay",
    source: "ParkGrid Tariff Schedule & Commercial Policy",
    document: "ParkGrid_Tariff_Schedule_BKC.pdf",
    version: "2.1",
    lastUpdated: "September 2026",
    relatedIds: ["pay-02", "ev-03"],
    keywords: ["ev tariff", "electricity cost", "per kwh", "idle fees", "charging rate"],
  },

  // ── 6. ENTRY & EXIT ────────────────────────────────────────────────────────
  {
    id: "ent-01",
    category: "Entry & Exit",
    subcategory: "QR verification",
    question: "How does the contactless QR verification barrier work?",
    answer:
      "Every reservation includes a dynamic encrypted QR parking pass. As you pull up to the entrance barrier kiosk, hold your mobile phone screen approximately 15 cm in front of the optical laser scanner. The system authenticates your booking in under 800 milliseconds and activates the barrier arm.",
    badge: "Contactless Scan",
    source: "ParkGrid Barrier Hardware & Access Control Manual",
    document: "ParkGrid_Access_Control_Spec.pdf",
    version: "3.1",
    lastUpdated: "September 2026",
    relatedIds: ["ent-02", "ent-03"],
    keywords: ["qr verification", "scanner", "pass", "contactless", "barrier", "mobile pass"],
  },
  {
    id: "ent-02",
    category: "Entry & Exit",
    subcategory: "Entry process",
    question: "What is the step-by-step entry process when arriving at the facility?",
    answer:
      "1. Approach the main BKC entrance lane at ≤ 8 km/h.\n2. Stop at the boom barrier kiosk marked 'ParkGrid Entry'.\n3. Present your QR pass to the optical scanner or let our ANPR cameras match your license plate.\n4. Once the boom barrier rises, follow overhead illuminated green arrows to your designated level (B1, B2, G1, L1, or L2) and bay number.",
    badge: "Step-by-Step",
    source: "ParkGrid Barrier Hardware & Access Control Manual",
    document: "ParkGrid_Access_Control_Spec.pdf",
    version: "3.1",
    lastUpdated: "September 2026",
    relatedIds: ["ent-01", "prk-03", "prk-06"],
    keywords: ["entry process", "how to enter", "barrier gate", "overhead guidance", "find slot"],
  },
  {
    id: "ent-03",
    category: "Entry & Exit",
    subcategory: "QR problems",
    question: "What should I do if my phone battery dies or the QR code won't scan?",
    answer:
      "Do not worry: You can manually key in your 6-character alphanumeric Booking Reference code (e.g. SP-10231) on the kiosk touchscreen keypad. Alternatively, press the red 'Assistance' call button directly on the barrier totem to speak with our 24/7 on-site control team, who can verify your vehicle plate number instantly.",
    badge: "24/7 Intercom Backup",
    source: "ParkGrid Barrier Hardware & Access Control Manual",
    document: "ParkGrid_Access_Control_Spec.pdf",
    version: "3.1",
    lastUpdated: "September 2026",
    relatedIds: ["ent-01", "ent-02"],
    keywords: [
      "qr problems",
      "dead battery",
      "cannot scan",
      "touchscreen",
      "help button",
      "assistance",
    ],
  },
  {
    id: "ent-04",
    category: "Entry & Exit",
    subcategory: "Exit process",
    question: "How do I exit the facility after my parking session?",
    answer:
      "Drive towards the designated exit lanes following illuminated exit signage. Present your QR pass at the exit barrier scanner. If your session is within the booked duration or grace period, the barrier will open immediately. If an overstay balance is due, you can tap to pay via UPI or card directly at the terminal.",
    badge: "Quick Exit",
    source: "ParkGrid Barrier Hardware & Access Control Manual",
    document: "ParkGrid_Access_Control_Spec.pdf",
    version: "3.1",
    lastUpdated: "September 2026",
    relatedIds: ["ent-01", "ent-05"],
    keywords: ["exit process", "how to exit", "leaving", "exit totem", "barrier"],
  },
  {
    id: "ent-05",
    category: "Entry & Exit",
    subcategory: "Overstay",
    question: "What is the grace period and fee structure for overstaying a booking?",
    answer:
      "Every booking includes a complimentary 15-minute exit grace period after scheduled departure. If you exceed this 15-minute window without extending through the app, overstay is billed at standard hourly rates rounded up to the nearest hour. You can settle the balance seamlessly at the exit kiosk.",
    badge: "15m Grace Period",
    importantNotice:
      "15-minute complimentary departure grace period. Unextended overstay is billed at standard hourly rates at the exit barrier.",
    source: "ParkGrid Reservation & Customer Terms",
    document: "Booking_Terms_Conditions_2026.pdf",
    version: "1.4",
    lastUpdated: "September 2026",
    relatedIds: ["bok-04", "ent-04"],
    keywords: ["overstay", "grace period", "late exit", "extra charge", "delayed"],
  },

  // ── 7. PARKING AI ──────────────────────────────────────────────────────────
  {
    id: "ai-01",
    category: "Parking AI",
    subcategory: "What Parking AI can do",
    question: "What capabilities does the ParkGrid AI Concierge offer?",
    answer:
      "The ParkGrid AI Concierge is a conversational smart assistant powered by retrieval-augmented generation (RAG) over official facility documentation. It can tell you real-time bay availability, compute parking tariffs, explain EV charging compatibility, outline heavy vehicle rules, and guide you through booking modifications.",
    badge: "RAG Powered",
    source: "ParkGrid AI Assistant Architecture & RAG Specification",
    document: "ParkGrid_AI_System_Architecture.pdf",
    version: "1.2",
    lastUpdated: "September 2026",
    relatedIds: ["ai-02", "ai-03", "ai-04"],
    keywords: ["parking ai", "concierge", "chatbot", "capabilities", "features", "rag"],
  },
  {
    id: "ai-02",
    category: "Parking AI",
    subcategory: "Live availability questions",
    question: "Can I query Parking AI for live floor-by-floor availability?",
    answer:
      "Yes! You can ask specific real-time questions such as 'Are there EV bays open right now?' or 'How many slots are available on Basement B1?' The AI checks the live sensor telemetry database to return accurate, up-to-the-minute bay counts.",
    badge: "Live Telemetry",
    source: "ParkGrid AI Assistant Architecture & RAG Specification",
    document: "ParkGrid_AI_System_Architecture.pdf",
    version: "1.2",
    lastUpdated: "September 2026",
    relatedIds: ["prk-01", "ai-01"],
    keywords: ["live availability", "telemetry", "ask ai", "slots query", "b1 count"],
  },
  {
    id: "ai-03",
    category: "Parking AI",
    subcategory: "Parking-rule questions",
    question: "Can Parking AI explain facility rules, speed limits, and vehicle restrictions?",
    answer:
      "Yes. Parking AI has direct access to our safety handbook and municipal compliance documents. It can answer questions about the 8 km/h speed limit, overnight parking safety, height clearances on L1/L2, and heavy vehicle parking rules on G1 and B1/B2.",
    badge: "Policy Knowledge",
    source: "ParkGrid AI Assistant Architecture & RAG Specification",
    document: "ParkGrid_AI_System_Architecture.pdf",
    version: "1.2",
    lastUpdated: "September 2026",
    relatedIds: ["prk-04", "prk-06", "ai-01"],
    keywords: ["rules", "regulations", "speed limit", "height clearance", "safety", "ai knowledge"],
  },
  {
    id: "ai-04",
    category: "Parking AI",
    subcategory: "Booking-related questions",
    question: "Can Parking AI help me with booking, modification, or refund inquiries?",
    answer:
      "Yes. You can ask Parking AI how to extend your parking, the exact refund eligibility for your cancellation window, or how to locate your QR pass. Note: In compliance with privacy standards, the AI does not expose private customer passwords or credit card numbers.",
    badge: "Booking Help",
    source: "ParkGrid AI Assistant Architecture & RAG Specification",
    document: "ParkGrid_AI_System_Architecture.pdf",
    version: "1.2",
    lastUpdated: "September 2026",
    relatedIds: ["bok-03", "can-02", "ai-01"],
    keywords: [
      "booking help",
      "cancellation inquiry",
      "how to extend",
      "privacy",
      "pass assistance",
    ],
  },
];

export interface RAGDocument {
  name: string;
  category: FAQCategory;
  description: string;
  chunksCount: number;
  lastUpdated: string;
  version: string;
  fileSize: string;
}

export const RAG_DOCUMENTS: RAGDocument[] = [
  {
    name: "Parking_Rules_BKC.pdf",
    category: "Parking",
    description:
      "Facility specs, slot allocations, floor structure (B1-L2), and heavy vehicle regulations.",
    chunksCount: 6,
    lastUpdated: "September 2026",
    version: "2.4",
    fileSize: "1.8 MB",
  },
  {
    name: "Booking_Terms_2026.pdf",
    category: "Booking",
    description:
      "Advance booking rules, slot reservations, in-app extensions, and customer policies.",
    chunksCount: 5,
    lastUpdated: "September 2026",
    version: "2.3",
    fileSize: "1.2 MB",
  },
  {
    name: "Payment_Refund_Policy.pdf",
    category: "Payments",
    description:
      "Tariff calculations, GST compliance, payment gateway reconciliation, and refund SLAs.",
    chunksCount: 8,
    lastUpdated: "September 2026",
    version: "2.2",
    fileSize: "950 KB",
  },
  {
    name: "EV_Charging_Guide.pdf",
    category: "EV Charging",
    description:
      "60 kW CCS2 & 22 kW Type-2 charger specs, tariffs (₹12/kWh), and session telemetry.",
    chunksCount: 4,
    lastUpdated: "September 2026",
    version: "2.0",
    fileSize: "2.4 MB",
  },
  {
    name: "Access_Control_and_Barriers.pdf",
    category: "Entry & Exit",
    description:
      "Contactless QR protocols, license plate ANPR cameras, 8 km/h limits, and overstay fees.",
    chunksCount: 5,
    lastUpdated: "September 2026",
    version: "3.1",
    fileSize: "1.5 MB",
  },
  {
    name: "Parking_AI_Architecture.pdf",
    category: "Parking AI",
    description:
      "RAG index schema, system prompt embeddings, live telemetry hooks, and guardrails.",
    chunksCount: 4,
    lastUpdated: "September 2026",
    version: "1.2",
    fileSize: "820 KB",
  },
];
