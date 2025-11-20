"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import BottomNav from "@/components/BottomNav";

// Mock recipes data (same as in FavoriteRecipes component)
const allRecipes = [
  {
    id: 1,
    name: "Omelete Caprese",
    description: "Omelete cremoso com tomate fresco e queijo mozzarella",
    time: "15 min",
    servings: 2,
    difficulty: "Fácil",
    image: "🍳",
  },
  {
    id: 2,
    name: "Frango ao Molho de Tomate",
    description: "Frango suculento com molho caseiro de tomate e ervas",
    time: "35 min",
    servings: 4,
    difficulty: "Médio",
    image: "🍗",
  },
  {
    id: 3,
    name: "Panquecas Clássicas",
    description: "Panquecas fofinhas perfeitas para o café da manhã",
    time: "20 min",
    servings: 4,
    difficulty: "Fácil",
    image: "🥞",
  },
  {
    id: 4,
    name: "Pizza Caseira Rápida",
    description: "Pizza deliciosa feita com ingredientes simples",
    time: "40 min",
    servings: 3,
    difficulty: "Médio",
    image: "🍕",
  },
  {
    id: 5,
    name: "Molho Branco Cremoso",
    description: "Molho versátil para massas e gratinados",
    time: "15 min",
    servings: 4,
    difficulty: "Fácil",
    image: "🥛",
  },
  {
    id: 6,
    name: "Refogado de Frango com Legumes",
    description: "Prato saudável e saboroso para o dia a dia",
    time: "30 min",
    servings: 3,
    difficulty: "Fácil",
    image: "🍲",
  },
  {
    id: 7,
    name: "Crepioca Recheada",
    description: "Combinação perfeita de crepe e tapioca",
    time: "10 min",
    servings: 1,
    difficulty: "Fácil",
    image: "🌮",
  },
  {
    id: 8,
    name: "Bruschetta de Tomate",
    description: "Entrada italiana clássica e refrescante",
    time: "15 min",
    servings: 4,
    difficulty: "Fácil",
    image: "🥖",
  },
];

export default function FavoritesPage() {
  const [favoriteRecipes, setFavoriteRecipes] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("favoriteRecipes");
    if (saved) {
      setFavoriteRecipes(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (recipeId: number) => {
    setFavoriteRecipes((prev) => {
      const newFavorites = prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId];
      localStorage.setItem("favoriteRecipes", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleSelectRecipe = (recipe: any) => {
    // TODO: Navigate to recipe detail page
    console.log("Selecionar receita:", recipe);
  };

  const recipes = allRecipes.filter((recipe) =>
    favoriteRecipes.includes(recipe.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Favoritos
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <Heart className="w-20 h-20 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Nenhum favorito ainda
            </h2>
            <p className="text-gray-500">
              Adicione receitas aos favoritos clicando no coração ❤️
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-100"
                onClick={() => handleSelectRecipe(recipe)}
              >
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-6 flex items-center justify-center">
                  <span className="text-4xl">{recipe.image}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-800">
                      {recipe.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(recipe.id);
                      }}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>⏰ {recipe.time}</span>
                    <span>👥 {recipe.servings}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Menu Inferior */}
      <BottomNav />
    </div>
  );
}