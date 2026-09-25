export type SlotStatus = "available" | "occupied" | "reserved" | "selected" | "maintenance";

export type ParkingSlotData = {
  id: string;
  floor: number;
  /** Stable zero-based position within each floor: one row per zone. */
  row: number;
  col: number;
  zone: "A" | "B" | "EV";
  status: SlotStatus;
  type: "Car" | "Bike" | "EV" | "Accessible";
  price: number;
};

const states: SlotStatus[] = [
  "available",
  "occupied",
  "available",
  "reserved",
  "available",
  "occupied",
  "available",
  "occupied",
  "available",
  "reserved",
];

export const parkingSlots: ParkingSlotData[] = Array.from({ length: 36 }, (_, index) => {
  const floor = Math.floor(index / 12) + 1;
  const localIndex = index % 12;
  const zone = localIndex >= 8 ? "EV" : localIndex >= 4 ? "B" : "A";
  const prefix = zone === "EV" ? "E" : zone;
  return {
    id: `${prefix}${String(index + 1).padStart(2, "0")}`,
    floor,
    row: Math.floor(localIndex / 4),
    col: localIndex % 4,
    zone,
    status: states[(index * 3 + floor) % states.length] ?? "available",
    type: zone === "EV" ? "EV" : index % 11 === 0 ? "Accessible" : index % 7 === 0 ? "Bike" : "Car",
    price: zone === "EV" ? 70 : 50,
  };
});

export const facility = {
  name: "ParkGrid One",
  location: "High Street, Baner, Pune",
  address: "18 High Street, Baner, Pune, Maharashtra 411045",
  slots: 150,
  available: 73,
  occupied: 62,
  reserved: 15,
};

export const facilities = [
  ["CCTV Security", "Continuous coverage across every floor and entrance."],
  ["24/7 Monitoring", "On-site response team and intelligent alerts."],
  ["EV Charging", "Six fast chargers with CCS and Type 2 support."],
  ["Accessible Parking", "Wide bays beside lifts on every level."],
  ["Digital Payments", "UPI, cards, and secure digital receipts."],
  ["QR Entry", "Fast, contactless entry with your parking pass."],
  ["Smart Guidance", "Live signs guide you directly to your bay."],
  ["Emergency Assistance", "One-touch help points throughout the facility."],
] as const;
