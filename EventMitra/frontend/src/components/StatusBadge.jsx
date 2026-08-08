export default function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  return <span className={`status ${key}`}>{status}</span>;
}
