'use client';

import { useState } from 'react';
import { Wind, Sparkles, Moon, Check } from 'lucide-react';

const steps = [
  {
    id: 1,
    icon: Wind,
    title: 'Respiração',
    duration: '5 minutos',
    description: 'Respire fundo e devagar',
    instructions: [
      'Sente-se confortavelmente',
      'Inspire pelo nariz contando até 4',
      'Segure o ar por 4 segundos',
      'Expire pela boca contando até 6',
      'Repita por 5 minutos',
    ],
    color: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    id: 2,
    icon: Sparkles,
    title: 'Alongamento leve',
    duration: '5 minutos',
    description: 'Relaxe o corpo',
    instructions: [
      'Alongue os braços para cima',
      'Gire o pescoço suavemente',
      'Alongue as pernas',
      'Respire profundamente',
      'Movimentos lentos e suaves',
    ],
    color: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    id: 3,
    icon: Moon,
    title: 'Ambiente tranquilo',
    duration: '5 minutos',
    description: 'Prepare o quarto',
    instructions: [
      'Apague as luzes fortes',
      'Deixe o quarto fresco',
      'Silencie o celular',
      'Use cortinas ou máscara',
      'Deixe tudo organizado',
    ],
    color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
];

export default function RotinaPage() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter((id) => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const allCompleted = completedSteps.length === steps.length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Moon className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Rotina Noturna</h1>
        <p className="text-gray-600">Siga estes 3 passos antes de dormir</p>
      </div>

      {/* Progress */}
      <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso</span>
          <span className="text-sm font-semibold text-indigo-600">
            {completedSteps.length} de {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4 mb-6">
        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = completedSteps.includes(step.id);

          return (
            <div
              key={step.id}
              className={`bg-white rounded-xl shadow-sm border-2 transition-all ${
                isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'
              }`}
            >
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full p-6 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.color} border-2 flex items-center justify-center`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <Icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <span className="text-xs text-gray-500">{step.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <ul className="space-y-1">
                      {step.instructions.map((instruction, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {allCompleted && (
        <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white text-center animate-in fade-in duration-500">
          <div className="text-4xl mb-2">🎉</div>
          <h3 className="text-xl font-semibold mb-2">Parabéns!</h3>
          <p className="text-green-100">
            Você completou sua rotina noturna. Agora é hora de dormir bem!
          </p>
        </div>
      )}
    </div>
  );
}
