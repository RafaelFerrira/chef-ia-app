"use client";

import { User } from "lucide-react";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Perfil
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <Card className="p-8 shadow-xl border-2 border-orange-100 max-w-md w-full text-center">
            <div className="inline-block bg-gradient-to-br from-orange-400 to-amber-500 p-6 rounded-3xl shadow-2xl mb-4">
              <User className="w-20 h-20 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Perfil do Usuário
            </h2>
            <p className="text-gray-600">
              Funcionalidades premium disponíveis em breve!
            </p>
          </Card>
        </div>
      </main>

      {/* Menu Inferior */}
      <BottomNav />
    </div>
  );
}