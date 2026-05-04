"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#F5F3EF" }}>
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>Something went wrong</h2>
            <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>{error.message}</p>
            <button
              onClick={reset}
              style={{ padding: "0.75rem 1.5rem", borderRadius: "0.75rem", backgroundColor: "#B8621B", color: "white", fontWeight: 600, border: "none", cursor: "pointer" }}
            >
              ลองใหม่
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
