import ParkingGrid3D from "./ParkingGrid3D";
import { useMemo, useState } from "react";
import { CarFront, Zap, Accessibility, Bike, ArrowDown, Navigation, Check, CircleSlash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parkingSlots, type ParkingSlotData, type SlotStatus } from "@/lib/parking-data";

const statusClasses: Record<SlotStatus, string> = {
  available: "border-available/50 bg-available/10 text-available",
  occupied: "border-occupied/45 bg-occupied/10 text-occupied",
  reserved: "border-reserved/50 bg-reserved/10 text-reserved",
  selected: "border-selected bg-selected/20 text-selected shadow-[0_0_24px_var(--selected-glow)]",
  maintenance: "border-muted-foreground/40 bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: SlotStatus | "active" | "completed" | "cancelled" }) {
  const tones: Record<string, string> = {
    available: "bg-available/12 text-available", occupied: "bg-occupied/12 text-occupied",
    reserved: "bg-reserved/12 text-reserved", selected: "bg-selected/12 text-selected",
    active: "bg-selected/12 text-selected", completed: "bg-muted text-muted-foreground",
    cancelled: "bg-occupied/12 text-occupied", maintenance: "bg-muted text-muted-foreground",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase", tones[status])}>{status}</span>;
}

export function ParkingSlot({ slot, selected, onSelect, compact = false }: { slot: ParkingSlotData; selected?: boolean; onSelect?: (slot: ParkingSlotData) => void; compact?: boolean }) {
  const disabled = slot.status !== "available";
  const Icon = slot.type === "EV" ? Zap : slot.type === "Bike" ? Bike : slot.type === "Accessible" ? Accessibility : CarFront;
  const displayStatus = selected ? "selected" : slot.status;
  return (
    <button
      type="button"
      aria-label={`${slot.id}, ${slot.status}, ${slot.type}`}
      aria-pressed={!disabled ? Boolean(selected) : undefined}
      aria-describedby={`${slot.id}-status`}
      title={disabled ? `${slot.id} is ${slot.status} and cannot be selected` : `Select ${slot.id}, ₹${slot.price} per hour`}
      disabled={disabled}
      onClick={() => onSelect?.(slot)}
      className={cn(
        "group relative flex min-h-20 flex-col justify-between overflow-hidden border p-2.5 text-left transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75",
        compact ? "min-h-16" : "sm:min-h-24",
        statusClasses[displayStatus],
        !disabled && "hover:-translate-y-1 hover:scale-[1.02]",
      )}
    >
       <div className="flex w-full items-start justify-between gap-1"><span className="font-mono text-xs font-bold">{slot.id}</span>{selected ? <Check className="size-4" aria-hidden="true" /> : disabled ? <CircleSlash2 className="size-4" aria-hidden="true" /> : <Icon className="size-4" aria-hidden="true" />}</div>
       {!compact && <div id={`${slot.id}-status`}><p className="text-[10px] font-medium capitalize opacity-80">{slot.status}</p><p className="text-[10px] opacity-75">₹{slot.price}/hr</p></div>}
      <span className="absolute inset-x-2 bottom-1 h-px bg-current opacity-20" />
    </button>
  );
}

export function ParkingMap({
  preview = false,
  onSelection,
}: {
  preview?: boolean;
  onSelection?: (slot: ParkingSlotData) => void;
}) {
  const [floor, setFloor] = useState(1);
  const [zone, setZone] = useState<"All" | "A" | "B" | "EV">("All");
  const [selected, setSelected] = useState<ParkingSlotData | null>(null);
  const slots = useMemo(
    () =>
      parkingSlots
        .filter((slot) => slot.floor === floor && (zone === "All" || slot.zone === zone))
        .slice(0, preview ? 10 : 12),
    [floor, preview, zone],
  );
  const [announcement, setAnnouncement] = useState("");
  const choose = (slot: ParkingSlotData) => {
    setSelected(slot);
    setAnnouncement(`${slot.id} selected`);
    onSelection?.(slot);
  };
  return (
    <div className="parking-grid overflow-hidden border border-border bg-surface p-4 sm:p-6">
      {!preview && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-1" role="tablist" aria-label="Parking floor">
            {[1, 2, 3].map((item) => (
              <Button
                key={item}
                size="sm"
                role="tab"
                aria-selected={floor === item}
                variant={floor === item ? "default" : "ghost"}
                onClick={() => setFloor(item)}
              >
                Floor {item}
              </Button>
            ))}
          </div>
          <div className="flex gap-1" role="tablist" aria-label="Parking zone">
            {(["All", "A", "B", "EV"] as const).map((item) => (
              <Button
                key={item}
                size="sm"
                aria-pressed={zone === item}
                variant={zone === item ? "secondary" : "ghost"}
                onClick={() => setZone(item)}
              >
                {item === "EV" ? "EV Zone" : item === "All" ? "All zones" : `Zone ${item}`}
              </Button>
            ))}
          </div>
        </div>
      )}
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] uppercase text-muted-foreground">
        <span>Entrance</span>
        <span className="flex items-center gap-1">
          <Navigation className="size-3" /> One way
        </span>
        <span>Exit</span>
      </div>
      <ParkingGrid3D
        key={`${floor}-${zone}`}
        slots={slots}
        selectedSlot={selected}
        onSelectSlot={choose}
        activeFloor={floor}
      />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <div className="road-lane my-4 flex h-14 items-center justify-around border-y border-dashed border-road-line/30 bg-road/70 text-road-line">
        <ArrowDown className="size-4 rotate-90" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Drive lane · 8 km/h</span>
        <ArrowDown className="size-4 rotate-90" />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
        {["available", "occupied", "reserved", "selected"].map((item) => (
          <span key={item} className="flex items-center gap-1.5 capitalize">
            <i
              className={cn(
                "size-2 rounded-full",
                item === "available"
                  ? "bg-available"
                  : item === "occupied"
                    ? "bg-occupied"
                    : item === "reserved"
                      ? "bg-reserved"
                      : "bg-selected",
              )}
            />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy?: string }) {
  return <div className="max-w-2xl"><p className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">{eyebrow}</p><h2 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">{title}</h2>{copy && <p className="mt-4 max-w-xl leading-7 text-muted-foreground">{copy}</p>}</div>;
}