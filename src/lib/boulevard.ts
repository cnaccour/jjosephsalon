/**
 * Triggers the Boulevard self-booking overlay.
 * Boulevard's injector.min.js is loaded globally in Layout.astro.
 */
export function openBooking(): void {
  const trigger = document.querySelector<HTMLAnchorElement>('a[href="#book-now"]');
  if (trigger) {
    trigger.click();
  } else {
    const w = window as any;
    if (w.Boulevard?.openBookingOverlay) {
      w.Boulevard.openBookingOverlay();
    } else {
      window.location.href = "/book";
    }
  }
}
