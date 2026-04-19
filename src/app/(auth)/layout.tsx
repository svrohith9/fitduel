import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="orb"
        style={{
          width: 520,
          height: 520,
          top: -160,
          right: -120,
          background: "#ff3d7f",
        }}
      />
      <div
        className="orb"
        style={{
          width: 420,
          height: 420,
          bottom: -120,
          left: -100,
          background: "#00f0ff",
          opacity: 0.25,
        }}
      />
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6">
        <Logo />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        {children}
      </main>
    </div>
  );
}
