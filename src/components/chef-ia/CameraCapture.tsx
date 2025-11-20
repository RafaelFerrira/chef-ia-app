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
  const [isLoading, setIsLoading] = useState(true);
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
      setIsLoading(true);

      // Verificar se a API está disponível
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError("Seu navegador não suporta acesso à câmera. Use um navegador moderno como Chrome, Firefox ou Safari.");
        setIsLoading(false);
        return;
      }

      // Listar dispositivos disponíveis primeiro
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        setError("Nenhuma câmera foi encontrada no seu dispositivo. Verifique se há uma câmera conectada.");
        setIsLoading(false);
        return;
      }

      console.log(`${videoDevices.length} câmera(s) encontrada(s):`, videoDevices);

      let mediaStream: MediaStream | null = null;

      // Estratégia 1: Tentar com configurações básicas primeiro (mais compatível)
      try {
        console.log("Tentando acesso básico à câmera...");
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
        console.log("✅ Câmera acessada com sucesso (modo básico)");
      } catch (basicErr: any) {
        console.log("Falha no modo básico:", basicErr.name);

        // Estratégia 2: Tentar com deviceId específico
        try {
          console.log("Tentando com deviceId específico...");
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { 
              deviceId: videoDevices[0].deviceId 
            },
            audio: false
          });
          console.log("✅ Câmera acessada com deviceId");
        } catch (deviceErr: any) {
          console.log("Falha com deviceId:", deviceErr.name);

          // Estratégia 3: Tentar com configurações ideais (não obrigatórias)
          try {
            console.log("Tentando com configurações ideais...");
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "environment"
              },
              audio: false
            });
            console.log("✅ Câmera acessada com configurações ideais");
          } catch (idealErr: any) {
            console.log("Falha com configurações ideais:", idealErr.name);
            throw idealErr; // Lançar erro para o catch principal
          }
        }
      }

      if (mediaStream) {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Aguardar o vídeo estar pronto
          videoRef.current.onloadedmetadata = () => {
            setIsLoading(false);
            console.log("✅ Vídeo carregado e pronto");
          };
        }
      }
    } catch (err: any) {
      console.error("❌ Erro ao acessar câmera:", err);
      setIsLoading(false);
      
      // Identificar tipo de erro
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionDenied(true);
        setError("Permissão negada para acessar a câmera.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setError("Nenhuma câmera foi encontrada no seu dispositivo. Verifique se há uma câmera conectada e funcionando.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setError("A câmera está sendo usada por outro aplicativo. Feche outros apps que possam estar usando a câmera e tente novamente.");
      } else if (err.name === "OverconstrainedError") {
        setError("Não foi possível iniciar a câmera com as configurações solicitadas. Tente com outra câmera.");
      } else if (err.name === "SecurityError") {
        setError("Acesso à câmera bloqueado por questões de segurança. Certifique-se de estar usando HTTPS ou localhost.");
      } else if (err.name === "AbortError") {
        setError("Acesso à câmera foi interrompido. Tente novamente.");
      } else {
        setError(`Erro ao acessar a câmera: ${err.message || "Verifique as permissões do navegador."}`);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        console.log("🛑 Track de câmera parado:", track.label);
      });
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Verificar se o vídeo está pronto
      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        setError("Aguarde a câmera carregar completamente antes de capturar.");
        return;
      }
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
        stopCamera();
        console.log("📸 Foto capturada com sucesso");
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
    setError(null);
    setPermissionDenied(false);
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
            ) : isLoading && !capturedImage ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-white font-semibold">Carregando câmera...</p>
                <p className="text-gray-400 text-sm mt-2">Aguarde alguns segundos</p>
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
          {!capturedImage && !error && !isLoading && (
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
                disabled={!!error || isLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isLoading ? "Aguarde..." : "Capturar Foto"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
