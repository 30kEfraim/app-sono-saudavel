'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSleepRecord, calculateHoursSlept } from '@/lib/sleep-storage';
import { SleepQuality } from '@/lib/types';
import { Moon, Sun, Star, Check } from 'lucide-react';

export default function RegistroPage() {
  const router = useRouter();
  const [bedTime, setBedTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState<SleepQuality | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedTime || !wakeTime || !quality) return;

    setIsSubmitting(true);

    const hoursSlept = calculateHoursSlept(bedTime, wakeTime);
    const today = new Date().toISOString().split('T')[0];

    saveSleepRecord({
      date: today,
      bedTime,
      wakeTime,
      quality: quality as SleepQuality,
      hoursSlept,
    });

    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const qualityOptions: { value: SleepQuality; label: string; emoji: string; color: string }[] = [
    { value: 'ruim', label: 'Ruim', emoji: '😴', color: 'border-red-300 bg-red-50 text-red-700' },
    { value: 'regular', label: 'Regular', emoji: '😐', color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
    { value: 'bom', label: 'Bom', emoji: '😊', color: 'border-green-300 bg-green-50 text-green-700' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <Star className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrar Sono</h1>
        <p className="text-gray-600">Anote como foi sua noite de sono</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Bed Time */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Moon className="w-5 h-5 text-indigo-600" />
            Que horas você dormiu?
          </label>
          <input
            type="time"
            value={bedTime}
            onChange={(e) => setBedTime(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>

        {/* Wake Time */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Sun className="w-5 h-5 text-yellow-600" />
            Que horas você acordou?
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
          />
        </div>

        {/* Quality */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Star className="w-5 h-5 text-purple-600" />
            Como foi a qualidade do seu sono?
          </label>
          <div className="grid grid-cols-3 gap-3">
            {qualityOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setQuality(option.value)}
                className={`relative p-4 border-2 rounded-xl transition-all ${
                  quality === option.value
                    ? option.color + ' border-2'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {quality === option.value && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5" />
                  </div>
                )}
                <div className="text-3xl mb-2">{option.emoji}</div>
                <div className="text-sm font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!bedTime || !wakeTime || !quality || isSubmitting}
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Registro'}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-800">
          💡 <strong>Dica:</strong> Registre seu sono todos os dias para acompanhar sua evolução!
        </p>
      </div>
    </div>
  );
}
