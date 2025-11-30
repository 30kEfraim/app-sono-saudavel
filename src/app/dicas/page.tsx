'use client';

import { Lightbulb, Moon, Sun, Wind, Book } from 'lucide-react';

const tips = [
  {
    icon: Moon,
    title: 'Evite telas antes de dormir',
    description: 'Desligue celular, TV e computador pelo menos 1 hora antes de dormir. A luz azul atrapalha o sono.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    icon: Wind,
    title: 'Pratique respiração profunda',
    description: 'Respire fundo e devagar por 5 minutos. Isso acalma o corpo e prepara para o sono.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Sun,
    title: 'Mantenha horários regulares',
    description: 'Tente dormir e acordar sempre no mesmo horário, até nos fins de semana.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Moon,
    title: 'Ambiente tranquilo',
    description: 'Deixe o quarto escuro, silencioso e com temperatura agradável (18-22°C é ideal).',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: Book,
    title: 'Leia antes de dormir',
    description: 'Ler um livro físico ajuda a relaxar e desacelerar a mente.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Lightbulb,
    title: 'Evite cafeína à tarde',
    description: 'Café, chá preto e refrigerantes podem atrapalhar o sono. Evite após as 15h.',
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function DicasPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Lightbulb className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dicas de Sono</h1>
        <p className="text-gray-600">Aprenda hábitos simples para dormir melhor</p>
      </div>

      {/* Tips List */}
      <div className="space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${tip.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white text-center">
        <h3 className="text-xl font-semibold mb-2">Coloque em prática!</h3>
        <p className="text-blue-100">
          Escolha 2 ou 3 dicas e comece hoje mesmo. Pequenas mudanças fazem grande diferença.
        </p>
      </div>
    </div>
  );
}
