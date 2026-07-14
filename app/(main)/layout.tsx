import { SessionProvider } from "@/components/providers/SessionProvider";
import AppLayout from "@/components/layout/AppLayout";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AppLayout>{children}</AppLayout>
    </SessionProvider>
  );
}
