import DarkModeToggle from './components/DarkModeToggle';

export default function ReaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="reader-container">
      <DarkModeToggle />
      {children}
    </div>
  );
}
