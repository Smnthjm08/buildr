import Navbar from "@/components/navbar";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <div>{children}</div>
    </main>
  );
}
