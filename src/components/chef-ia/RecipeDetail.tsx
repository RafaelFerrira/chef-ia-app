"use client";

import { ArrowLeft, Clock, Users, ChefHat, ShoppingCart, Check, Star, Maximize2, ChevronLeft, ChevronRight, X, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface RecipeDetailProps {
  recipe: any;
  onBack: () => void;
  darkMode: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  detectedIngredients: string[];
}

export default function RecipeDetail({ 
  recipe, 
  onBack, 
  darkMode, 
  isFavorite, 
  onToggleFavorite,
  detectedIngredients 
}: RecipeDetailProps) {
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);
  const [kitchenMode, setKitchenMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shoppingList, setShoppingList] = useState<string[]>([]);

  const toggleStep = (index: number) => {
    setCheckedSteps((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const startKitchenMode = () => {
    setKitchenMode(true);
    setCurrentStep(0);
  };

  const exitKitchenMode = () => {
    setKitchenMode(false);
  };

  const nextStep = () => {
    if (currentStep < recipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      toggleStep(currentStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Identificar ingredientes faltantes
  const missingIngredients = recipe.ingredients.filter(
    (ingredient: string) => !detectedIngredients.some(detected => 
      ingredient.toLowerCase().includes(detected.toLowerCase()) ||
      detected.toLowerCase().includes(ingredient.toLowerCase())
    )
  );

  const addMissingToShoppingList = () => {
    const currentList = JSON.parse(localStorage.getItem("shoppingList") || "[]");
    const newItems = missingIngredients.filter(
      (item: string) => !currentList.some((existing: any) => existing.name === item)
    );
    const updatedList = [
      ...currentList,
      ...newItems.map((name: string) => ({
        id: Date.now() + Math.random(),
        name,
        checked: false,
      })),
    ];
    localStorage.setItem("shoppingList", JSON.stringify(updatedList));
    setShoppingList(newItems);
    setTimeout(() => setShoppingList([]), 3000);
  };

  // Sugestões de substituições
  const substitutions: { [key: string]: string[] } = {
    "Leite": ["Leite de amêndoas", "Leite de coco", "Leite de soja"],
    "Farinha de trigo": ["Farinha de aveia", "Farinha de arroz", "Farinha de amêndoas"],
    "Queijo mozzarella": ["Queijo prato", "Queijo muçarela light", "Queijo vegano"],
    "Frango": ["Peru", "Carne moída", "Tofu"],
    "Ovos": ["Chia com água", "Linhaça com água", "Banana amassada"],
  };

  // Modo Cozinha (Fullscreen)
  if (kitchenMode) {
    return (
      <div className={`fixed inset-0 z-50 flex flex-col ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}>
        {/* Header do Modo Cozinha */}
        <div className={`p-6 border-b ${
          darkMode ? "border-gray-700" : "border-orange-200"
        }`}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <h2 className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              Modo Cozinha
            </h2>
            <Button
              variant="outline"
              onClick={exitKitchenMode}
              className={`gap-2 ${darkMode ? "border-gray-600 hover:bg-gray-800" : ""}`}
            >
              <X className="w-5 h-5" />
              Sair
            </Button>
          </div>
        </div>

        {/* Conteúdo do Passo Atual */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="max-w-3xl w-full space-y-8">
            {/* Progresso */}
            <div className="text-center">
              <p className={`text-lg mb-2 ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}>
                Passo {currentStep + 1} de {recipe.steps.length}
              </p>
              <div className={`w-full h-3 rounded-full overflow-hidden ${
                darkMode ? "bg-gray-700" : "bg-gray-200"
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / recipe.steps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Passo Atual */}
            <Card className={`p-12 text-center ${
              darkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
            }`}>
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                checkedSteps.includes(currentStep)
                  ? "bg-green-500"
                  : "bg-gradient-to-br from-orange-400 to-amber-500"
              }`}>
                {checkedSteps.includes(currentStep) ? (
                  <Check className="w-10 h-10 text-white" />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {currentStep + 1}
                  </span>
                )}
              </div>
              <p className={`text-2xl md:text-3xl leading-relaxed ${
                darkMode ? "text-gray-200" : "text-gray-800"
              }`}>
                {recipe.steps[currentStep]}
              </p>
            </Card>
          </div>
        </div>

        {/* Botões de Navegação */}
        <div className={`p-6 border-t ${
          darkMode ? "border-gray-700" : "border-orange-200"
        }`}>
          <div className="max-w-4xl mx-auto flex gap-4">
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              size="lg"
              variant="outline"
              className={`flex-1 h-16 text-lg gap-2 ${
                darkMode ? "border-gray-600 hover:bg-gray-800" : ""
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
              Anterior
            </Button>
            <Button
              onClick={nextStep}
              disabled={currentStep === recipe.steps.length - 1}
              size="lg"
              className="flex-1 h-16 text-lg gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            >
              Próximo
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
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
          Voltar às Receitas
        </Button>

        <Button
          variant="outline"
          onClick={onToggleFavorite}
          className={`gap-2 ${
            isFavorite 
              ? "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200" 
              : darkMode 
                ? "border-gray-600 hover:bg-gray-800" 
                : "border-orange-200 hover:bg-orange-50"
          }`}
        >
          <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-500" : ""}`} />
          {isFavorite ? "Favoritado" : "Favoritar"}
        </Button>
      </div>

      <Card className={`overflow-hidden border-2 shadow-xl ${
        darkMode ? "bg-gray-800 border-gray-700" : "border-orange-100"
      }`}>
        {/* Imagem realista gerada por IA */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            Foto gerada por IA
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Título e Info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className={`text-3xl md:text-4xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                {recipe.name}
              </h1>
              <Badge className="bg-green-100 text-green-700 border-green-300 text-lg px-3 py-1">
                {recipe.matchPercentage}%
              </Badge>
            </div>

            <p className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              {recipe.description}
            </p>

            {/* Sobre esta receita */}
            <div className={`p-4 rounded-lg border ${
              darkMode 
                ? "bg-gray-700/50 border-gray-600" 
                : "bg-blue-50 border-blue-200"
            }`}>
              <h3 className={`font-semibold mb-2 flex items-center gap-2 ${
                darkMode ? "text-blue-300" : "text-blue-800"
              }`}>
                <Lightbulb className="w-5 h-5" />
                Sobre esta receita
              </h3>
              <p className={`text-sm ${
                darkMode ? "text-gray-300" : "text-blue-700"
              }`}>
                {recipe.about || `Esta receita de ${recipe.name} é perfeita para quem busca uma refeição ${recipe.difficulty.toLowerCase()} e saborosa. Com ${recipe.matchPercentage}% de compatibilidade com seus ingredientes, você pode preparar este prato delicioso em apenas ${recipe.time}.`}
              </p>
            </div>

            <div className={`flex flex-wrap items-center gap-6 ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">{recipe.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="font-semibold">{recipe.servings} porções</span>
              </div>
              <Badge variant="outline" className="text-sm">
                {recipe.difficulty}
              </Badge>
            </div>
          </div>

          <Separator className={darkMode ? "bg-gray-700" : "bg-orange-100"} />

          {/* Ingredientes */}
          <div className="space-y-4">
            <div className={`flex items-center gap-2 ${
              darkMode ? "text-orange-400" : "text-orange-600"
            }`}>
              <ShoppingCart className="w-6 h-6" />
              <h2 className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                Ingredientes
              </h2>
            </div>

            {missingIngredients.length > 0 && (
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? "bg-amber-900/20 border-amber-700" 
                  : "bg-amber-50 border-amber-200"
              }`}>
                <p className={`text-sm font-semibold mb-2 ${
                  darkMode ? "text-amber-300" : "text-amber-800"
                }`}>
                  ⚠️ Ingredientes faltantes: {missingIngredients.length}
                </p>
                <Button
                  onClick={addMissingToShoppingList}
                  size="sm"
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar à lista de compras
                </Button>
                {shoppingList.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {shoppingList.length} {shoppingList.length === 1 ? "item adicionado" : "itens adicionados"}!
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.ingredients.map((ingredient: string, index: number) => {
                const isMissing = missingIngredients.includes(ingredient);
                const hasSubstitution = substitutions[ingredient];
                
                return (
                  <div key={index}>
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        isMissing
                          ? darkMode
                            ? "bg-red-900/20 border-red-700"
                            : "bg-red-50 border-red-300"
                          : darkMode
                            ? "bg-gray-700 border-gray-600"
                            : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        isMissing ? "bg-red-500" : "bg-orange-500"
                      }`} />
                      <span className={darkMode ? "text-gray-200" : "text-gray-700"}>
                        {ingredient}
                      </span>
                    </div>
                    
                    {/* Substituições inteligentes */}
                    {isMissing && hasSubstitution && (
                      <div className={`mt-2 ml-5 p-2 rounded text-xs ${
                        darkMode 
                          ? "bg-blue-900/20 text-blue-300" 
                          : "bg-blue-50 text-blue-700"
                      }`}>
                        <p className="font-semibold mb-1">💡 Substitua por:</p>
                        <ul className="space-y-1">
                          {hasSubstitution.map((sub, i) => (
                            <li key={i}>• {sub}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className={darkMode ? "bg-gray-700" : "bg-orange-100"} />

          {/* Modo de Preparo */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-2 ${
                darkMode ? "text-orange-400" : "text-orange-600"
              }`}>
                <ChefHat className="w-6 h-6" />
                <h2 className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}>
                  Modo de Preparo
                </h2>
              </div>
              
              <Button
                onClick={startKitchenMode}
                className="gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Maximize2 className="w-4 h-4" />
                Iniciar Modo Cozinha
              </Button>
            </div>

            <div className="space-y-3">
              {recipe.steps.map((step: string, index: number) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                    checkedSteps.includes(index)
                      ? "bg-green-50 border-green-300"
                      : darkMode
                        ? "bg-gray-700 border-gray-600 hover:border-gray-500"
                        : "bg-white border-orange-200 hover:border-orange-300"
                  }`}
                  onClick={() => toggleStep(index)}
                >
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 font-bold transition-all duration-300 ${
                      checkedSteps.includes(index)
                        ? "bg-green-500 text-white"
                        : "bg-gradient-to-br from-orange-400 to-amber-500 text-white"
                    }`}
                  >
                    {checkedSteps.includes(index) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <p
                    className={`flex-1 ${
                      checkedSteps.includes(index) 
                        ? "line-through opacity-60" 
                        : darkMode 
                          ? "text-gray-200" 
                          : "text-gray-700"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Dica Final */}
          <div className={`rounded-lg p-4 text-sm border ${
            darkMode 
              ? "bg-blue-900/20 border-blue-700 text-blue-300" 
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}>
            <p className="font-semibold mb-1">💡 Dica do Chef:</p>
            <p>
              Clique nos passos para marcá-los como concluídos enquanto
              cozinha, ou use o Modo Cozinha para uma experiência fullscreen passo a passo. Bom apetite!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
