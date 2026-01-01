export const metadata = {
  title: "Admin - Blueprint XYZ",
  description: "Admin dashboard for Blueprint XYZ",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}