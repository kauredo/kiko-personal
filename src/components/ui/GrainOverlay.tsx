export function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998]"
      style={{
        opacity: "var(--grain-opacity)",
        backgroundImage: "url(/textures/grain.png)",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
    />
  );
}
