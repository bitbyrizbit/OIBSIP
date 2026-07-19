export default function EmptyLine() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#14110F" }}>
      <p className="font-display" style={{ fontSize: "3rem", fontStyle: "italic", color: "rgba(242, 234, 216, 0.4)", letterSpacing: "-0.02em" }}>
        Who do you want to speak with?
      </p>
      <p style={{ fontFamily: "var(--font-work-sans)", fontSize: "1rem", color: "#C9724A", marginTop: "24px" }}>
        Ask the operator for a line.
      </p>
    </div>
  );
}