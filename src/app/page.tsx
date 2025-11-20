"use client";

import { useState, useEffect } from "react";
import { Camera, ChefHat, ShoppingCart, Sparkles, Moon, Sun, Star, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import IngredientsDetected from "@/components/chef-ia/IngredientsDetected";
import RecipesList from "@/components/chef-ia/RecipesList";
import RecipeDetail from "@/components/chef-ia/RecipeDetail";
import ShoppingList from "@/components/chef-ia/ShoppingList";
import FavoriteRecipes from "@/components/chef-ia/FavoriteRecipes";
import CameraCapture from "@/components/chef-ia/CameraCapture";

type Screen = "onboarding" | "home" | "ingredients" | "recipes" | "recipe-detail" | "shopping" | "favorites";

interface OnboardingAnswers {
  experienceLevel: string;
  mainGoal: string;
  cookingTime: string;
  servings: string;
  dietType: string;
  restrictions: string;
}

const questions = [
  {
    id: 1,
    emoji: "👨‍🍳",
    question: "Qual é o teu nível de cozinha?",
    options: ["Total iniciante", "Sei fazer o básico", "Consigo seguir receitas", "Avançado"]
  },
  {
    id: 2,
    emoji: "🎯",
    question: "Qual é o teu objetivo principal com o Chef IA?",
    options: ["Cozinhar mais rápido", "Gastar menos dinheiro", "Aprender novas receitas", "Melhorar técnica culinária", "Comer mais saudável"]
  },
  {
    id: 3,
    emoji: "⏰",
    question: "Quanto tempo tens para cozinhar por dia?",
    options: ["Menos de 10 minutos", "10–20 minutos", "20–40 minutos", "Depende do dia"]
  },
  {
    id: 4,
    emoji: "👥",
    question: "Para quantas pessoas cozinhas normalmente?",
    options: ["Só para mim", "Para 2 pessoas", "Para a família", "Para grupos", "Outro"]
  },
  {
    id: 5,
    emoji: "🥗",
    question: "Qual é o teu tipo de alimentação?",
    options: ["Normal (sem restrições)", "Vegetariano", "Vegan", "Pescetariano", "Flexitariano", "Carnívoro", "Outro"]
  },
  {
    id: 6,
    emoji: "⚠️",
    question: "Tens alguma restrição ou condição alimentar?",
    subtitle: "(Sem pedir diagnósticos específicos)",
    options: ["Nenhuma", "Sensibilidade ao açúcar", "Dieta com pouco sal", "Intolerância à lactose", "Intolerância ao glúten", "Alergias alimentares", "Dieta recomendada por nutricionista", "Outro"]
  }
];

export default function ChefIA() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherInputValue, setOtherInputValue] = useState("");
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswers>({
    experienceLevel: "",
    mainGoal: "",
    cookingTime: "",
    servings: "",
    dietType: "",
    restrictions: ""
  });
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [favoriteRecipes, setFavoriteRecipes] = useState<number[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  // Verificar se já completou o onboarding
  useEffect(() => {
    const completedOnboarding = localStorage.getItem("completedOnboarding");
    if (completedOnboarding === "true") {
      setCurrentScreen("home");
    }
  }, []);

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const savedFavorites = localStorage.getItem("favoriteRecipes");
    const savedAnswers = localStorage.getItem("onboardingAnswers");
    
    setDarkMode(savedDarkMode);
    
    if (savedFavorites) {
      setFavoriteRecipes(JSON.parse(savedFavorites));
    }
    
    if (savedAnswers) {
      setOnboardingAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  // Salvar dark mode
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Salvar favoritos
  useEffect(() => {
    localStorage.setItem("favoriteRecipes", JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  const toggleFavorite = (recipeId: number) => {
    setFavoriteRecipes((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleAnswerSelect = (answer: string) => {
    if (answer === "Outro") {
      setShowOtherInput(true);
      return;
    }

    // Salvar resposta
    const answerKeys: (keyof OnboardingAnswers)[] = [
      "experienceLevel",
      "mainGoal",
      "cookingTime",
      "servings",
      "dietType",
      "restrictions"
    ];
    
    const updatedAnswers = {
      ...onboardingAnswers,
      [answerKeys[currentQuestion]]: answer
    };
    
    setOnboardingAnswers(updatedAnswers);
    localStorage.setItem("onboardingAnswers", JSON.stringify(updatedAnswers));

    // Avançar para próxima pergunta
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleOtherInputSubmit = () => {
    if (otherInputValue.trim()) {
      const answerKeys: (keyof OnboardingAnswers)[] = [
        "experienceLevel",
        "mainGoal",
        "cookingTime",
        "servings",
        "dietType",
        "restrictions"
      ];
      
      const updatedAnswers = {
        ...onboardingAnswers,
        [answerKeys[currentQuestion]]: otherInputValue
      };
      
      setOnboardingAnswers(updatedAnswers);
      localStorage.setItem("onboardingAnswers", JSON.stringify(updatedAnswers));

      setOtherInputValue("");
      setShowOtherInput(false);

      // Avançar para próxima pergunta
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }
  };

  const handleBackQuestion = () => {
    if (showOtherInput) {
      setShowOtherInput(false);
      setOtherInputValue("");
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem("completedOnboarding", "true");
    setCurrentScreen("home");
  };

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = async (imageData: string) => {
    setShowCamera(false);
    setIsAnalyzing(true);

    try {
      // Chamar API de análise de imagem com IA
      const response = await fetch("/api/analyze-ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (response.ok) {
        const data = await response.json();
        setDetectedIngredients(data.ingredients || []);
      } else {
        // Fallback para ingredientes simulados em caso de erro
        console.error("Erro ao analisar imagem");
        setDetectedIngredients([
          "Ovos",
          "Leite",
          "Farinha de trigo",
          "Tomate",
          "Queijo mozzarella",
          "Frango",
          "Alho",
          "Cebola",
          "Azeite",
          "Sal",
        ]);
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
      // Fallback para ingredientes simulados
      setDetectedIngredients([
        "Ovos",
        "Leite",
        "Farinha de trigo",
        "Tomate",
        "Queijo mozzarella",
        "Frango",
        "Alho",
        "Cebola",
        "Azeite",
        "Sal",
      ]);
    } finally {
      setIsAnalyzing(false);
      setCurrentScreen("ingredients");
    }
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
  };

  const handleViewRecipes = () => {
    setCurrentScreen("recipes");
  };

  const handleSelectRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setCurrentScreen("recipe-detail");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setDetectedIngredients([]);
    setSelectedRecipe(null);
  };

  const handleBackToRecipes = () => {
    setCurrentScreen("recipes");
  };

  const handleOpenShopping = () => {
    setCurrentScreen("shopping");
  };

  const handleOpenFavorites = () => {
    setCurrentScreen("favorites");
  };

  // Renderizar Onboarding
  if (currentScreen === "onboarding") {
    const isLastQuestion = currentQuestion === questions.length - 1;
    const allQuestionsAnswered = Object.values(onboardingAnswers).every(answer => answer !== "");
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex flex-col">
        {/* Barra de Progresso */}
        <div className="w-full h-2 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {!allQuestionsAnswered ? (
            <Card className="w-full max-w-2xl p-8 shadow-2xl border-2 border-orange-100">
              {/* Botão Voltar */}
              {(currentQuestion > 0 || showOtherInput) && (
                <Button
                  variant="ghost"
                  onClick={handleBackQuestion}
                  className="mb-6 gap-2 hover:bg-orange-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}

              {/* Emoji da Pergunta */}
              <div className="text-center mb-6">
                <div className="text-7xl mb-4">
                  {questions[currentQuestion].emoji}
                </div>
              </div>

              {/* Pergunta */}
              <div className="mb-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {questions[currentQuestion].question}
                </h2>
                {questions[currentQuestion].subtitle && (
                  <p className="text-sm text-gray-500 mt-2">
                    {questions[currentQuestion].subtitle}
                  </p>
                )}
              </div>

              {/* Opções ou Input "Outro" */}
              {showOtherInput ? (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Escreve a tua resposta..."
                    value={otherInputValue}
                    onChange={(e) => setOtherInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleOtherInputSubmit();
                      }
                    }}
                    className="h-14 text-lg border-2 border-orange-200 focus:border-orange-400"
                    autoFocus
                  />
                  <Button
                    onClick={handleOtherInputSubmit}
                    disabled={!otherInputValue.trim()}
                    className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Confirmar
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      variant="outline"
                      className="h-16 text-lg border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              )}
            </Card>
          ) : (
            // Tela Final
            <Card className="w-full max-w-2xl p-12 shadow-2xl border-2 border-orange-100 text-center">
              <div className="inline-block bg-gradient-to-br from-orange-400 to-amber-500 p-6 rounded-3xl shadow-2xl mb-6">
                <ChefHat className="w-20 h-20 text-white" />
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Perfeito! O Chef IA já sabe o que precisas.
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                Vamos começar a descobrir receitas incríveis para ti!
              </p>

              <Button
                onClick={handleCompleteOnboarding}
                className="w-full h-16 text-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continuar
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
        : "bg-gradient-to-br from-orange-50 via-white to-amber-50"
    }`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
        darkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-orange-100"
      }`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-orange-400 to-amber-500 p-2 rounded-xl">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Chef IA
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Toggle Dark Mode */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? "border-gray-600 hover:bg-gray-700" : ""}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            {currentScreen !== "home" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenFavorites}
                  className={`gap-2 ${darkMode ? "border-gray-600 hover:bg-gray-700" : ""}`}
                >
                  <Star className="w-4 h-4" />
                  <span className="hidden sm:inline">Favoritos</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenShopping}
                  className={`gap-2 ${darkMode ? "border-gray-600 hover:bg-gray-700" : ""}`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">Lista</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBackToHome}
                  className={darkMode ? "border-gray-600 hover:bg-gray-700" : ""}
                >
                  Início
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentScreen === "home" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="text-center space-y-4 max-w-2xl">
              <div className="inline-block bg-gradient-to-br from-orange-400 to-amber-500 p-6 rounded-3xl shadow-2xl mb-4">
                <ChefHat className="w-20 h-20 text-white" />
              </div>
              
              <h2 className={`text-4xl md:text-5xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}>
                Bem-vindo ao Chef IA
              </h2>
              
              <p className={`text-lg md:text-xl leading-relaxed ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Tire uma foto do seu frigorífico ou despensa e descubra receitas incríveis que você pode fazer agora mesmo!
              </p>
            </div>

            <Card className={`p-8 shadow-xl border-2 max-w-md w-full ${
              darkMode 
                ? "bg-gray-800 border-gray-700" 
                : "bg-white border-orange-100"
            }`}>
              <div className="space-y-6">
                <div className={`flex items-center gap-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Camera className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm">Tire uma foto dos ingredientes</p>
                </div>
                
                <div className={`flex items-center gap-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-sm">IA identifica automaticamente</p>
                </div>
                
                <div className={`flex items-center gap-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <ChefHat className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm">Receba receitas personalizadas</p>
                </div>

                <Button
                  onClick={handleTakePhoto}
                  disabled={isAnalyzing}
                  className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Tirar Foto
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>
        )}

        {currentScreen === "ingredients" && (
          <IngredientsDetected
            ingredients={detectedIngredients}
            onViewRecipes={handleViewRecipes}
            onRetake={handleBackToHome}
            darkMode={darkMode}
          />
        )}

        {currentScreen === "recipes" && (
          <RecipesList
            ingredients={detectedIngredients}
            onSelectRecipe={handleSelectRecipe}
            darkMode={darkMode}
            favoriteRecipes={favoriteRecipes}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {currentScreen === "recipe-detail" && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={handleBackToRecipes}
            darkMode={darkMode}
            isFavorite={favoriteRecipes.includes(selectedRecipe.id)}
            onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
            detectedIngredients={detectedIngredients}
          />
        )}

        {currentScreen === "shopping" && (
          <ShoppingList
            onBack={() => setCurrentScreen(currentScreen === "home" ? "home" : "recipes")}
            darkMode={darkMode}
          />
        )}

        {currentScreen === "favorites" && (
          <FavoriteRecipes
            favoriteRecipes={favoriteRecipes}
            onSelectRecipe={handleSelectRecipe}
            onBack={handleBackToRecipes}
            darkMode={darkMode}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={handleCameraCancel}
          darkMode={darkMode}
        />
      )}

      {/* Footer */}
      <footer className={`border-t mt-16 transition-colors duration-300 ${
        darkMode 
          ? "bg-gray-800 border-gray-700" 
          : "bg-white border-orange-100"
      }`}>
        <div className={`container mx-auto px-4 py-6 text-center text-sm ${
          darkMode ? "text-gray-400" : "text-gray-600"
        }`}>
          <p>Chef IA - Transforme ingredientes em receitas deliciosas ✨</p>
        </div>
      </footer>
    </div>
  );
}
