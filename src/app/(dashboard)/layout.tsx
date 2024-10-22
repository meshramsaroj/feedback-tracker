import Navbar from "@/components/Navbar";
import "../globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen" suppressHydrationWarning={true}>
      <Navbar />
      {children}
    </section>
  );
}
