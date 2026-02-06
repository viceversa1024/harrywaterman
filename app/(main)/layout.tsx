import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="container">
        <div className="two-column">
          <Navigation />
          <div className="right-column">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
