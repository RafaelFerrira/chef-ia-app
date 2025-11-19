"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, X, RotateCcw, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  darkMode: boolean;
}

export default function CameraCapture({ onCapture, onCancel, darkMode }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setPermissionDenied(false);

      // Verificar se a API está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Seu navegador não suporta acesso à câmera. Use um navegador moderno como Chrome, Firefox ou Safari.");
        return;
      }

      let mediaStream: MediaStream | null = null;

      // Tentar primeiro com câmera traseira (ideal para mobile)
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: { ideal: "environment" }, // Usa 'ideal' em vez de obrigatório
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
        });
      } catch (err: any) {
        // Se falhar com facingMode, tentar sem especificar (qualquer câmera)
        console.log("Câmera traseira não encontrada, tentando qualquer câmera disponível...");
        
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
          });
        } catch (fallbackErr: any) {
          // Se ainda falhar, tentar com configurações mínimas
          console.log("Tentando com configurações mínimas...");
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true
          });
        }
      }

      if (mediaStream) {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }
    } catch (err: any) {
      console.error("Erro ao acessar câmera:", err);
      
      // Identificar tipo de erro
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionDenied(true);
        setError("Permissão negada para acessar a câmera.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Nenhuma câmera foi encontrada no seu dispositivo.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setError("A câmera está sendo usada por outro aplicativo. Feche outros apps e tente novamente.");
      } else if (err.name === "OverconstrainedError") {
        setError("Não foi possível iniciar a câmera com as configurações solicitadas.");
      } else if (err.name === "SecurityError") {
        setError("Acesso à câmera bloqueado por questões de segurança. Certifique-se de estar usando HTTPS.");
      } else {
        setError("Erro ao acessar a câmera. Verifique as permissões do navegador.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  const handleRetry = () => {
    startCamera();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <Card className={`w-full max-w-2xl ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      }`}>
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              {capturedImage ? "Foto Capturada" : "Tirar Foto"}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className={darkMode ? "hover:bg-gray-700" : ""}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Camera/Image Display */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-16 h-16 text-orange-500 mb-4" />
                <p className="text-white font-semibold mb-2">{error}</p>
                
                {permissionDenied && (
                  <div className="mt-4 space-y-3 text-sm text-gray-300 max-w-md">
                    <p className="font-semibold text-orange-400">Como permitir acesso à câmera:</p>
                    <div className="text-left space-y-2 bg-gray-900/50 p-4 rounded-lg">
                      <p><strong>Chrome/Edge:</strong> Clique no ícone 🔒 ou 🎥 na barra de endereço → Permitir câmera</p>
                      <p><strong>Firefox:</strong> Clique no ícone 🔒 na barra de endereço → Permissões → Câmera → Permitir</p>
                      <p><strong>Safari:</strong> Configurações do Safari → Sites → Câmera → Permitir</p>
                      <p><strong>Mobile:</strong> Configurações do dispositivo → Apps → Navegador → Permissões → Câmera → Permitir</p>
                    </div>
                    <p className="text-orange-400 mt-4">Após permitir, clique em "Tentar Novamente" abaixo</p>
                  </div>
                )}
              </div>
            ) : capturedImage ? (
              <img
                src={capturedImage}
                alt="Foto capturada"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Instructions */}
          {!capturedImage && !error && (
            <p className={`text-sm text-center ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              Posicione a câmera para capturar os ingredientes do seu frigorífico
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {error ? (
              <Button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            ) : capturedImage ? (
              <>
                <Button
                  onClick={retakePhoto}
                  variant="outline"
                  className={`flex-1 ${
                    darkMode ? "border-gray-600 hover:bg-gray-700" : ""
                  }`}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Tirar Novamente
                </Button>
                <Button
                  onClick={confirmPhoto}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar
                </Button>
              </>
            ) : (
              <Button
                onClick={capturePhoto}
                disabled={!!error}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capturar Foto
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
