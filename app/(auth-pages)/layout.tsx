export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6">
      {children}
    </div>
  );
}
