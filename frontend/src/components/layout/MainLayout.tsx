import { Header } from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
  onSearchClick?: () => void;
}

export const MainLayout = ({ children, onSearchClick }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Header onSearchClick={onSearchClick} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6">{children}</div>
      </main>
    </div>
  );
};
