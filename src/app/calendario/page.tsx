'use client';

import { useEffect, useState } from 'react';
import { getSleepRecords } from '@/lib/sleep-storage';
import { SleepRecord } from '@/lib/types';
import { Calendar, TrendingUp, Moon } from 'lucide-react';

export default function CalendarioPage() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const allRecords = getSleepRecords();
    setRecords(allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando...</div>
      </div>
    );
  }

  const qualityColors = {
    ruim: 'bg-red-100 text-red-700 border-red-200',
    regular: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    bom: 'bg-green-100 text-green-700 border-green-200',
  };

  const qualityEmoji = {
    ruim: '😴',
    regular: '😐',
    bom: '😊',
  };

  // Calcular estatísticas
  const avgHours = records.length > 0
    ? (records.reduce((sum, r) => sum + r.hoursSlept, 0) / records.length).toFixed(1)
    : '0';

  const goodNights = records.filter(r => r.quality === 'bom').length;
  const goodPercentage = records.length > 0
    ? Math.round((goodNights / records.length) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Histórico</h1>
        <p className="text-gray-600">Acompanhe sua evolução</p>
      </div>

      {/* Statistics */}
      {records.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mb-3">
              <Moon className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Média de sono</p>
            <p className="text-2xl font-bold text-gray-900">{avgHours}h</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-full mb-3">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Noites boas</p>
            <p className="text-2xl font-bold text-gray-900">{goodPercentage}%</p>
          </div>
        </div>
      )}

      {/* Records List */}
      {records.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Registros</h2>
          {records.map((record) => {
            const date = new Date(record.date + 'T00:00:00');
            const formattedDate = date.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={record.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">{formattedDate}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${qualityColors[record.quality]}`}>
                    {qualityEmoji[record.quality]} {record.quality.charAt(0).toUpperCase() + record.quality.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Dormiu</p>
                    <p className="text-sm font-semibold text-gray-900">{record.bedTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Acordou</p>
                    <p className="text-sm font-semibold text-gray-900">{record.wakeTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duração</p>
                    <p className="text-sm font-semibold text-gray-900">{record.hoursSlept}h</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum registro ainda</h3>
          <p className="text-gray-600">Comece a registrar seu sono para ver seu histórico aqui</p>
        </div>
      )}
    </div>
  );
}
