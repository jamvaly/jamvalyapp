import BottomNav from "@/components/bottomNav";
import NavBar from "@/components/navBar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <NavBar />
      <main className="container z-0 mx-auto max-w-7xl px-6 flex-grow pt-5">
        {children}
      </main>
      <BottomNav />
      <footer className="w-full flex items-center justify-center py-3">

      </footer>
      
    </div>
  );
}
