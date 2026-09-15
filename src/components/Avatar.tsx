export function Avatar({ initials, colour, size = 28 }: { initials: string; colour: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ backgroundColor: colour, width: size, height: size, fontSize: size * 0.4 }}
      title={initials}
    >
      {initials}
    </span>
  )
}
