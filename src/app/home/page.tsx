"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ChefHat, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    // TODO: Implementar busca
    console.log("Buscando:", searchQuery);
  };

  const handleCreateRecipe = () => {
    router.push("/create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Barra de Pesquisa */}
      <div className="sticky top-0 z-50 bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Pesquisar receitas, ingredientes ou pratos…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10 h-12 text-lg border-2 border-orange-200 focus:border-orange-400"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <div className="text-center space-y-4 max-w-2xl">
            <div className="inline-block bg-gradient-to-br from-orange-400 to-amber-500 p-6 rounded-3xl shadow-2xl mb-4">
              <ChefHat className="w-20 h-20 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              Bem-vindo ao Chef IA
            </h2>

            <p className="text-lg md:text-xl leading-relaxed text-gray-600">
              Tire uma foto dos seus ingredientes e descubra receitas incríveis!
            </p>
          </div>

          {/* Botão Principal */}
          <Button
            onClick={handleCreateRecipe}
            className="w-full max-w-md h-16 text-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Camera className="w-6 h-6 mr-3" />
            Criar Receita pela Foto
          </Button>
        </div>
      </main>

      {/* Menu Inferior */}
      <BottomNav />
    </div>
  );
}