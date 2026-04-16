import { openBooking } from "@lib/boulevard";

interface BookButtonProps {
  variant?: "nav" | "mobile" | "inline";
  className?: string;
}

const base =
  "font-heading uppercase tracking-[0.14em] transition-colors duration-300 cursor-none";

const variants: Record<string, string> = {
  nav: [
    base,
    "text-[0.7rem] px-5 py-2 border border-gold text-gold bg-transparent",
    "hover:bg-gold hover:text-black",
  ].join(" "),
  mobile: [
    base,
    "w-full py-4 text-[0.85rem] bg-gold text-black text-center",
  ].join(" "),
  inline: [
    base,
    "px-8 py-3 text-[0.8rem] bg-gold text-black",
    "hover:bg-gold-soft",
  ].join(" "),
};

export default function BookButton({
  variant = "nav",
  className = "",
}: BookButtonProps) {
  return (
    <button
      type="button"
      onClick={openBooking}
      className={`${variants[variant]} ${className}`}
    >
      Book Now
    </button>
  );
}
