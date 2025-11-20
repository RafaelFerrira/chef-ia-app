"use client";

import { Check, Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IngredientsDetectedProps {
  ingredients: string[];
  onViewRecipes: () => void;
  onRetake: () => void;
}

export default function IngredientsDetected({
  ingredients,
  onViewRecipes,
  onRetake,
}: IngredientsDetectedProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-block bg-gradient-to-br from-green-400 to-emerald-500 p-4 rounded-2xl mb-2">
          <Check className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Ingredientes Detectados
        </h2>
        <p className="text-gray-600">
          Encontramos {ingredients.length} ingredientes na sua foto
        </p>
      </div>

      <Card className="p-6 md:p-8 bg-white shadow-xl border-2 border-orange-100">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-orange-600 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Identificados pela IA</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ingredients.map((ingredient, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="p-3 text-sm justify-center bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 text-gray-700 hover:shadow-md transition-shadow"
              >
                {ingredient}
              </Badge>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={onViewRecipes}
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Ver Receitas
            </Button>
            
            <Button
              onClick={onRetake}
              variant="outline"
              className="sm:w-auto h-12 border-2 border-orange-200 hover:bg-orange-50"
            >
              <Camera className="w-5 h-5 mr-2" />
              Tirar Nova Foto
            </Button>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">💡 Dica:</p>
        <p>
          Quanto mais ingredientes você tiver, mais opções de receitas aparecerão!
        </p>
      </div>
    </div>
  );
}
