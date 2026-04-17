import { openBooking } from "@lib/boulevard";

interface BookButtonProps {
  variant?: "nav" | "mobile" | "inline";
  className?: string;
}

const variantClass: Record<string, string> = {
  nav: "btn-book-nav",
  mobile: "btn-book-mobile",
  inline: "btn-book-inline",
};

export default function BookButton({
  variant = "nav",
  className = "",
}: BookButtonProps) {
  return (
    <button
      type="button"
      onClick={openBooking}
      className={`${variantClass[variant]} ${className}`}
    >
      Book Now
    </button>
  );
}
