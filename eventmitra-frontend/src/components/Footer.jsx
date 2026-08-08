export default function Footer() {
  return (
    <footer style={{ background: "var(--navy)", color: "rgba(255,255,255,0.6)", marginTop: 40 }}>
      <div className="container" style={{ padding: "26px 24px", fontSize: 13.5, textAlign: "center" }}>
        © {new Date().getFullYear()} EventMitra — Book tickets for concerts, workshops, sports, and more.
      </div>
    </footer>
  );
}
