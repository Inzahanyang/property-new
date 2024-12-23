import "@/assets/styles/globals.css";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
};

export default MainLayout;
