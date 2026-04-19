import { cn } from "@/lib/utils";

type Props = {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  ring?: boolean;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const palette = [
  "from-flame-500 to-flame-700",
  "from-cyan-500 to-cyan-600",
  "from-gold-500 to-flame-600",
  "from-flame-400 to-cyan-500",
  "from-flame-600 to-cyan-500",
];

function hashIndex(s: string, mod: number) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
}

export function Avatar({ name, src, size = 40, className, ring }: Props) {
  const grad = palette[hashIndex(name, palette.length)];
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full font-semibold text-white shrink-0 bg-gradient-to-br",
        grad,
        ring && "ring-2 ring-white/15",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.38),
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full rounded-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
