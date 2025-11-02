export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center flex-row min-h-screen justify-center">
      <div>{children}</div>
    </div>
  );
}
