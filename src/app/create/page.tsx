"use client";

import { useState } from "react";
import { Camera, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CameraCapture from "@/components/chef-ia/CameraCapture";
import BottomNav from "@/components/BottomNav";

export default function CreatePage() {
  const [showCamera, setShowCamera] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handleSelectFromGallery = () => {
    // TODO: Implementar seleção da galeria
    console.log("Selecionar da galeria");
  };

  const handleCameraCapture = async (imageData: string) => {
    setShowCamera(false);
    setIsAnalyzing(true);

    try {
      // TODO: Processar imagem e redirecionar para resultados
      console.log("Imagem capturada:", imageData);
    } catch (error) {
      console.error("Erro ao processar imagem:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCameraCancel = () => {
    setShowCamera(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Criar Receita
          </h1>
        </div>
      </div>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <Card className="p-8 shadow-xl border-2 border-orange-100 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Como deseja adicionar ingredientes?
            </h2>

            <div className="space-y-4">
              <Button
                onClick={handleTakePhoto}
                disabled={isAnalyzing}
                className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isAnalyzing ? "Analisando..." : "Tirar Foto"}
              </Button>

              <Button
                onClick={handleSelectFromGallery}
                variant="outline"
                className="w-full h-14 text-lg border-2 border-orange-200 hover:border-orange-400 hover:bg-orange-50"
              >
                <Image className="w-5 h-5 mr-2" />
                Selecionar da Galeria
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={handleCameraCancel}
          darkMode={false}
        />
      )}

      {/* Menu Inferior */}
      <BottomNav />
    </div>
  );
}