"use client";

import { ArrowLeft, Clock, Users, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FavoriteRecipesProps {
  favoriteRecipes: number[];
  onSelectRecipe: (recipe: any) => void;
  onBack: () => void;
  darkMode: boolean;
  onToggleFavorite: (recipeId: number) => void;
}

export default function FavoriteRecipes({
  favoriteRecipes,
  onSelectRecipe,
  onBack,
  darkMode,
  onToggleFavorite,
}: FavoriteRecipesProps) {
  // Todas as receitas disponíveis
  const allRecipes = [
    {
      id: 1,
      name: "Omelete Caprese",
      description: "Omelete cremoso com tomate fresco e queijo mozzarella",
      about: "Um clássico italiano adaptado para o café da manhã. Esta receita combina a cremosidade dos ovos com a frescura do tomate e a suavidade do queijo mozzarella.",
      time: "15 min",
      servings: 2,
      difficulty: "Fácil",
      matchPercentage: 100,
      image: "🍳",
      ingredients: ["Ovos", "Tomate", "Queijo mozzarella", "Sal", "Azeite"],
      steps: [
        "Bata 4 ovos em uma tigela com sal a gosto",
        "Corte o tomate em cubos pequenos",
        "Aqueça uma frigideira com azeite em fogo médio",
        "Despeje os ovos batidos e deixe cozinhar por 2 minutos",
        "Adicione o tomate e o queijo mozzarella por cima",
        "Dobre a omelete ao meio e sirva quente",
      ],
    },
    {
      id: 2,
      name: "Frango ao Molho de Tomate",
      description: "Frango suculento com molho caseiro de tomate e ervas",
      about: "Receita tradicional brasileira que combina proteína de qualidade com um molho rico e aromático. Perfeito para almoços em família.",
      time: "35 min",
      servings: 4,
      difficulty: "Médio",
      matchPercentage: 95,
      image: "🍗",
      ingredients: ["Frango", "Tomate", "Alho", "Cebola", "Azeite", "Sal"],
      steps: [
        "Tempere o frango com sal e deixe descansar por 10 minutos",
        "Pique o alho e a cebola finamente",
        "Aqueça o azeite em uma panela e doure o frango",
        "Retire o frango e refogue o alho e a cebola",
        "Adicione os tomates picados e cozinhe por 10 minutos",
        "Retorne o frango à panela e cozinhe por mais 15 minutos",
        "Sirva quente com arroz ou massa",
      ],
    },
    {
      id: 3,
      name: "Panquecas Clássicas",
      description: "Panquecas fofinhas perfeitas para o café da manhã",
      about: "Receita americana tradicional que agrada todas as idades. Massa leve e aerada que derrete na boca, ideal para começar o dia com energia.",
      time: "20 min",
      servings: 4,
      difficulty: "Fácil",
      matchPercentage: 90,
      image: "🥞",
      ingredients: ["Ovos", "Leite", "Farinha de trigo", "Sal"],
      steps: [
        "Misture 2 xícaras de farinha com uma pitada de sal",
        "Adicione 2 ovos e 1 xícara de leite",
        "Bata até obter uma massa homogênea",
        "Aqueça uma frigideira antiaderente",
        "Despeje porções da massa e cozinhe até dourar",
        "Vire e cozinhe o outro lado",
        "Sirva com mel, frutas ou geleia",
      ],
    },
    {
      id: 4,
      name: "Pizza Caseira Rápida",
      description: "Pizza deliciosa feita com ingredientes simples",
      about: "Versão caseira e rápida da pizza italiana. Massa crocante por fora e macia por dentro, com cobertura generosa de queijo derretido.",
      time: "40 min",
      servings: 3,
      difficulty: "Médio",
      matchPercentage: 85,
      image: "🍕",
      ingredients: [
        "Farinha de trigo",
        "Tomate",
        "Queijo mozzarella",
        "Azeite",
        "Sal",
      ],
      steps: [
        "Prepare a massa misturando farinha, água, sal e azeite",
        "Deixe descansar por 15 minutos",
        "Abra a massa em formato circular",
        "Espalhe molho de tomate caseiro",
        "Adicione queijo mozzarella generosamente",
        "Asse em forno pré-aquecido a 220°C por 15-20 minutos",
      ],
    },
    {
      id: 5,
      name: "Molho Branco Cremoso",
      description: "Molho versátil para massas e gratinados",
      about: "Base essencial da culinária francesa adaptada para o dia a dia. Textura aveludada que transforma qualquer prato em uma experiência gourmet.",
      time: "15 min",
      servings: 4,
      difficulty: "Fácil",
      matchPercentage: 80,
      image: "🥛",
      ingredients: ["Leite", "Farinha de trigo", "Queijo mozzarella", "Sal"],
      steps: [
        "Derreta manteiga em uma panela",
        "Adicione 2 colheres de farinha e mexa bem",
        "Despeje o leite aos poucos, mexendo sempre",
        "Cozinhe até engrossar",
        "Adicione o queijo ralado e sal a gosto",
        "Sirva sobre massas ou legumes",
      ],
    },
    {
      id: 6,
      name: "Refogado de Frango com Legumes",
      description: "Prato saudável e saboroso para o dia a dia",
      about: "Opção nutritiva e equilibrada que combina proteína magra com vegetais frescos. Ideal para quem busca alimentação saudável sem abrir mão do sabor.",
      time: "30 min",
      servings: 3,
      difficulty: "Fácil",
      matchPercentage: 90,
      image: "🍲",
      ingredients: ["Frango", "Tomate", "Cebola", "Alho", "Azeite", "Sal"],
      steps: [
        "Corte o frango em cubos médios",
        "Pique a cebola, o alho e o tomate",
        "Aqueça o azeite e doure o alho e a cebola",
        "Adicione o frango e deixe dourar",
        "Acrescente o tomate e tempere com sal",
        "Cozinhe em fogo baixo por 15 minutos",
        "Sirva com arroz branco",
      ],
    },
    {
      id: 7,
      name: "Crepioca Recheada",
      description: "Combinação perfeita de crepe e tapioca",
      about: "Fusão brasileira que une o melhor de dois mundos. Leve, proteica e versátil, perfeita para qualquer refeição do dia.",
      time: "10 min",
      servings: 1,
      difficulty: "Fácil",
      matchPercentage: 75,
      image: "🌮",
      ingredients: ["Ovos", "Queijo mozzarella"],
      steps: [
        "Bata 2 ovos em uma tigela",
        "Aqueça uma frigideira antiaderente",
        "Despeje os ovos e espalhe bem",
        "Adicione queijo ralado por cima",
        "Dobre ao meio quando começar a firmar",
        "Sirva quente com recheio de sua preferência",
      ],
    },
    {
      id: 8,
      name: "Bruschetta de Tomate",
      description: "Entrada italiana clássica e refrescante",
      about: "Aperitivo tradicional da Toscana que celebra a simplicidade dos ingredientes frescos. Crocante, aromático e irresistível.",
      time: "15 min",
      servings: 4,
      difficulty: "Fácil",
      matchPercentage: 85,
      image: "🥖",
      ingredients: ["Tomate", "Alho", "Azeite", "Sal"],
      steps: [
        "Corte os tomates em cubos pequenos",
        "Pique o alho finamente",
        "Misture tomate, alho, azeite e sal",
        "Deixe marinar por 10 minutos",
        "Torre fatias de pão",
        "Coloque a mistura sobre o pão torrado",
        "Sirva imediatamente",
      ],
    },
  ];

  // Filtrar apenas receitas favoritas
  const recipes = allRecipes.filter((recipe) =>
    favoriteRecipes.includes(recipe.id)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Button
        variant="outline"
        onClick={onBack}
        className={`gap-2 border-2 ${
          darkMode
            ? "border-gray-600 hover:bg-gray-800"
            : "border-orange-200 hover:bg-orange-50"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Button>

      <div className="text-center space-y-2">
        <div className="inline-block bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-2xl mb-2">
          <Star className="w-12 h-12 text-white fill-white" />
        </div>
        <h2
          className={`text-3xl md:text-4xl font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Receitas Favoritas
        </h2>
        <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
          {recipes.length === 0
            ? "Você ainda não tem receitas favoritas"
            : `${recipes.length} ${
                recipes.length === 1 ? "receita salva" : "receitas salvas"
              }`}
        </p>
      </div>

      {recipes.length === 0 ? (
        <Card
          className={`p-12 text-center ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-orange-100"
          }`}
        >
          <Heart className={`w-20 h-20 mx-auto mb-4 ${
            darkMode ? "text-gray-600" : "text-gray-300"
          }`} />
          <h3
            className={`text-xl font-semibold mb-2 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            Nenhuma receita favorita ainda
          </h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
            Clique no ícone de estrela nas receitas para salvá-las aqui!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <Card
              key={recipe.id}
              className={`overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 group relative ${
                darkMode
                  ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                  : "border-orange-100 hover:border-orange-300"
              }`}
            >
              {/* Botão de Desfavoritar */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(recipe.id);
                }}
                className="absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 bg-amber-100 text-amber-600 hover:bg-amber-200"
              >
                <Star className="w-5 h-5 fill-amber-500" />
              </button>

              <div
                onClick={() => onSelectRecipe(recipe)}
                className="cursor-pointer"
              >
                <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-8 flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {recipe.image}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className={`font-bold text-lg group-hover:text-orange-600 transition-colors ${
                        darkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {recipe.name}
                    </h3>
                    <Badge className="bg-green-100 text-green-700 border-green-300 shrink-0">
                      {recipe.matchPercentage}%
                    </Badge>
                  </div>

                  <p
                    className={`text-sm line-clamp-2 ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {recipe.description}
                  </p>

                  <div
                    className={`flex items-center gap-4 text-sm pt-2 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings}</span>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
