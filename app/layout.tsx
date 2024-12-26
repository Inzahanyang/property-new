import "@/assets/styles/globals.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Property Pulse",
  keywords: "rental, property, real estate",
  description: "Find the perfect rental property",
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
};

export default MainLayout;
