// Decorative overlay for dark Finexy panels: the same faint 16px dot grid the reference
// lays over its dark card texture.
export default function GridShape() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]"
    />
  );
}
