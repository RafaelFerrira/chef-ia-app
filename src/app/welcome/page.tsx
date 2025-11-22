'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Assumindo que há um componente Button

export default function WelcomePage() {
  const router = useRouter();

  const handleCreateAccount = () => {
    router.push('/signup');
  };

  const handleContinueWithoutAccount = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bem-vindo ao Chef IA!</h1>
        <p className="text-gray-600 mb-8">Escolha como deseja continuar:</p>
        <div className="space-y-4">
          <Button onClick={handleCreateAccount} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Criar Conta
          </Button>
          <Button onClick={handleContinueWithoutAccount} variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">
            Continuar sem Conta
          </Button>
        </div>
      </div>
    </div>
  );
}