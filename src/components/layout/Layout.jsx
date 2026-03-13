import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:ml-64">
        <Navbar />
        <main className="pt-16">
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};