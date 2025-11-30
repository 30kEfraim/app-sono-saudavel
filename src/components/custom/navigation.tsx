'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Plus, Lightbulb, Moon, Calendar, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/registro', icon: Plus, label: 'Registrar' },
  { href: '/dicas', icon: Lightbulb, label: 'Dicas' },
  { href: '/rotina', icon: Moon, label: 'Rotina' },
  { href: '/calendario', icon: Calendar, label: 'Histórico' },
  { href: '/perfil', icon: User, label: 'Perfil' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center md:gap-8 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
