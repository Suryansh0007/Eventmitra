export function formatCurrency(amount) {
  const n = Number(amount) || 0;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatTime(timeStr) {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix} Onwards`;
}

export function categoryLabel(cat) {
  if (!cat) return "";
  return cat.charAt(0) + cat.slice(1).toLowerCase();
}

export function bookingStatusBadgeClass(status) {
  if (status === "CONFIRMED") return "badge-green";
  if (status === "CANCELLED") return "badge-red";
  return "badge-amber";
}
