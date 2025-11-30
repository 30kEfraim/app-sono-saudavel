import type { Metadata } from "next";
import "./globals.css";
import { Home, Calendar, User, Moon } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: "SleepTracker - Melhore seu sono",
  description: "Acompanhe e melhore a qualidade do seu sono",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-[#0a0a0a]">
        {children}
        
        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a1a] border-t border-gray-800 shadow-2xl">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex items-center justify-around py-3">
              <Link 
                href="/" 
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                <Home className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-indigo-400 transition-colors font-medium">Início</span>
              </Link>
              
              <Link 
                href="/registro" 
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                <div className="w-14 h-14 -mt-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                  <Moon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-gray-400 group-hover:text-indigo-400 transition-colors font-medium mt-1">Registrar</span>
              </Link>
              
              <Link 
                href="/calendario" 
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                <Calendar className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-indigo-400 transition-colors font-medium">Calendário</span>
              </Link>
              
              <Link 
                href="/perfil" 
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                <User className="w-6 h-6 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                <span className="text-xs text-gray-400 group-hover:text-indigo-400 transition-colors font-medium">Perfil</span>
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Spacer for bottom nav */}
        <div className="h-20"></div>
      </body>
    </html>
  );
}
