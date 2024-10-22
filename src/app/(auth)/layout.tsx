import "../globals.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen" suppressHydrationWarning={true}>
      {children}
    </section>
  );
}
