export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "Arial, sans-serif",
        background: "#0a0a0a",
        color: "white",
        padding: "2rem",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "700px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Next.js Starter
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.85, lineHeight: 1.7 }}>
          This template is configured to run safely inside WebContainers using
          <code style={{ marginLeft: 6 }}>next dev --webpack</code>.
        </p>
      </div>
    </main>
  );
}
