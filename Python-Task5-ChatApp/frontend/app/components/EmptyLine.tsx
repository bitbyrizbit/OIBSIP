export default function EmptyLine() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0C0D11",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,150,74,0.04) 0%, transparent 70%)",
          animation: "ambient-breathe 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* The Ticket - retained from previous version, but refined */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          background: "#111318",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "2px",
          overflow: "hidden",
          boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
          maxWidth: "480px",
          width: "100%",
          margin: "0 24px",
        }}
      >
        {/* Ticket header */}
        <div
          style={{
            background: "rgba(201,150,74,0.06)",
            borderBottom: "1px solid rgba(201,150,74,0.15)",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            className="font-sans"
            style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#C9964A", textTransform: "uppercase" }}
          >
            No Active Connection
          </span>
          <div style={{ display: "flex", gap: "2px", alignItems: "center", opacity: 0.4 }}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} style={{ width: i % 3 === 0 ? "3px" : "1.5px", height: "12px", background: "#C9964A" }} />
            ))}
          </div>
        </div>

        <div style={{ padding: "36px 28px 40px", textAlign: "center" }}>
          <h2
            className="font-display"
            style={{
              fontSize: "2.8rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#F4F0E8",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Standby
          </h2>
          <p
            className="font-sans"
            style={{
              marginTop: "16px",
              fontSize: "13px",
              letterSpacing: "0.05em",
              color: "#7A8A9E",
              lineHeight: 1.6,
            }}
          >
            Select a connection from the switchboard<br />to begin transmitting.
          </p>
        </div>

        {/* Right accent rail */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "2px",
            height: "100%",
            background: "linear-gradient(to bottom, #C9964A, transparent)",
          }}
        />
      </div>
    </div>
  );
}