"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Camera, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/create", icon: Camera, label: "Criar" },
  { href: "/favorites", icon: Heart, label: "Favoritos" },
  { href: "/profile", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant="ghost"
              onClick={() => router.push(item.href)}
              className={`flex flex-col items-center gap-1 h-auto py-3 px-4 ${
                isActive
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}