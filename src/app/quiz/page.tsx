"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';

const questions = [
  {
    question: "Qual é o teu objetivo principal ao usar o Chef IA?",
    options: ["Comer mais saudável", "Poupar dinheiro", "Aproveitar ingredientes que já tens", "Aprender a cozinhar", "Perder peso", "Ganhar massa muscular", "Outro"],
    hasOther: true,
  },
  {
    question: "Tens alguma restrição alimentar?",
    options: ["Nenhuma", "Intolerância à lactose", "Intolerância ao glúten", "Diabetes / açúcar controlado", "Pressão alta / pouco sal", "Alergias", "Outro"],
    hasOther: true,
  },
  {
    question: "Qual é o teu tipo de alimentação?",
    options: ["Omnívoro", "Vegetariano", "Vegano", "Pescetariano", "Flexitariano", "Outro"],
    hasOther: true,
  },
  {
    question: "Tens alguma doença ou condição relacionada com alimentação?",
    options: ["Sim", "Não"],
    hasOther: false,
  },
  {
    question: "Qual é o teu nível de experiência na cozinha?",
    options: ["Sei o básico", "Intermédio", "Avançado", "Zero experiência"],
    hasOther: false,
  },
  {
    question: "Quantas refeições cozinhas por semana?",
    options: ["1–3", "4–6", "7–10", "Mais de 10", "Não tenho rotina fixa"],
    hasOther: false,
  },
  {
    question: "Para quantas pessoas costumas cozinhar?",
    options: ["Apenas para mim", "2 pessoas", "3–4 pessoas", "Mais de 5 pessoas"],
    hasOther: false,
  },
  {
    question: "Queres receitas mais…",
    options: ["Rápidas (0–15 min)", "Normais (20–30 min)", "Elaboradas (+40 min)", "Surpreende-me"],
    hasOther: false,
  },
  {
    question: "Preferes receitas com ingredientes…",
    options: ["Baratos / económicos", "Comuns / fáceis de encontrar", "Diferentes / criativos", "O que houver"],
    hasOther: false,
  },
  {
    question: "Alguma preferência culinária?",
    options: ["Mediterrânea", "Portuguesa", "Italiana", "Asiática", "Brasileira", "Low-carb", "Outro"],
    hasOther: true,
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherText, setOtherText] = useState('');
  const router = useRouter();

  const handleOptionClick = (option: string) => {
    if (option === 'Outro') {
      setShowOtherInput(true);
    } else {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = option;
      setAnswers(newAnswers);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Final
      }
    }
  };

  const handleOtherConfirm = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = otherText;
    setAnswers(newAnswers);
    setShowOtherInput(false);
    setOtherText('');
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    // Salvar answers, talvez localStorage
    localStorage.setItem('quizAnswers', JSON.stringify(answers));
    router.push('/home');
  };

  const question = questions[currentQuestion];

  if (currentQuestion === questions.length) {
    return (
      <div className="flex flex-col h-screen bg-white justify-center items-center px-6">
        <Header />
        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Perfeito! O Chef IA vai agora adaptar-se às tuas respostas para criar receitas personalizadas para ti.
          </p>
          <button
            onClick={handleFinish}
            className="bg-orange-500 text-white py-4 px-8 rounded-lg text-xl font-semibold shadow-lg hover:bg-orange-600 transition-colors"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white px-6 py-8">
      <Header />
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{question.question}</h2>
        {showOtherInput ? (
          <div className="space-y-4">
            <textarea
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Escreve aqui..."
              className="w-full p-3 border border-gray-300 rounded-lg text-lg"
              rows={4}
            />
            <button
              onClick={handleOtherConfirm}
              className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold"
            >
              Confirmar
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="w-full text-left p-4 border border-gray-300 rounded-lg text-lg hover:bg-gray-50"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      {currentQuestion > 0 && (
        <button
          onClick={handleBack}
          className="mt-4 bg-gray-200 text-gray-800 py-3 rounded-lg text-lg font-semibold"
        >
          Voltar à Pergunta Anterior
        </button>
      )}
    </div>
  );
}