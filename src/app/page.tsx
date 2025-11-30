'use client';

import { useEffect, useState } from 'react';
import { getTodayRecord, getUserProfile, getSleepRecords } from '@/lib/sleep-storage';
import { SleepRecord, UserProfile } from '@/lib/types';
import { Moon, Sun, Clock, TrendingUp, Sparkles, Trophy, Target, Zap, Award, Mic, Activity, AlertTriangle, Play, Square, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [todayRecord, setTodayRecord] = useState<SleepRecord | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [snoreDetected, setSnoreDetected] = useState(0);
  const [apneaEvents, setApneaEvents] = useState(0);

  useEffect(() => {
    setMounted(true);
    setTodayRecord(getTodayRecord());
    setProfile(getUserProfile());
    
    // Calculate streak and weekly average
    const records = getSleepRecords();
    calculateStreak(records);
    calculateWeeklyAverage(records);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
        // Simulate detection (in real app, this would be actual audio analysis)
        if (Math.random() > 0.95) {
          setSnoreDetected(prev => prev + 1);
        }
        if (Math.random() > 0.98) {
          setApneaEvents(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const calculateStreak = (records: SleepRecord[]) => {
    const sortedRecords = records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let currentStreak = 0;
    let currentDate = new Date();
    
    for (const record of sortedRecords) {
      const recordDate = new Date(record.date);
      const diffDays = Math.floor((currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    setStreak(currentStreak);
  };

  const calculateWeeklyAverage = (records: SleepRecord[]) => {
    const lastWeek = records.filter(r => {
      const recordDate = new Date(r.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return recordDate >= weekAgo;
    });
    
    if (lastWeek.length === 0) {
      setWeeklyAverage(0);
      return;
    }
    
    const total = lastWeek.reduce((sum, r) => sum + r.hoursSlept, 0);
    setWeeklyAverage(Math.round((total / lastWeek.length) * 10) / 10);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingDuration(0);
      setSnoreDetected(0);
      setApneaEvents(0);
      // In a real app, you would process the audio stream here
      console.log('Recording started', stream);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Save recording data
    alert(`Gravação finalizada!\n\nDuração: ${Math.floor(recordingDuration / 60)}min\nRoncos detectados: ${snoreDetected}\nEventos de apneia: ${apneaEvents}`);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Carregando...</div>
      </div>
    );
  }

  const qualityColors = {
    ruim: 'bg-red-500/10 text-red-400 border-red-500/20',
    regular: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    bom: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const qualityEmoji = {
    ruim: '😴',
    regular: '😐',
    bom: '😊',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mb-4 shadow-lg shadow-indigo-500/20 animate-pulse">
            <Moon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">SleepTracker Pro</h1>
          {profile ? (
            <p className="text-gray-400 text-lg">Olá, {profile.name}! Monitore seu sono completo.</p>
          ) : (
            <p className="text-gray-400 text-lg">Bem-vindo! Configure seu perfil para começar.</p>
          )}
        </div>

        {/* Sleep Monitoring Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-3xl p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Monitoramento Noturno</h2>
              <p className="text-gray-400">Detecte ronco e apneia em tempo real</p>
            </div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <Mic className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-full py-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 hover:scale-105 flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6" />
              Iniciar Monitoramento
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">Gravando</span>
                  </div>
                  <span className="text-2xl font-mono text-white">{formatDuration(recordingDuration)}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-xl mb-2 border border-blue-500/20">
                      <Activity className="w-6 h-6 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{snoreDetected}</p>
                    <p className="text-xs text-gray-400">Roncos</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-500/10 rounded-xl mb-2 border border-red-500/20">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{apneaEvents}</p>
                    <p className="text-xs text-gray-400">Apneias</p>
                  </div>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/10 rounded-xl mb-2 border border-emerald-500/20">
                      <BarChart3 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">{Math.max(0, 100 - (apneaEvents * 10))}%</p>
                    <p className="text-xs text-gray-400">Qualidade</p>
                  </div>
                </div>

                {/* Audio Visualization Simulation */}
                <div className="flex items-center justify-center gap-1 h-16 bg-gray-900/50 rounded-xl p-2">
                  {[...Array(40)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-indigo-500 to-purple-600 rounded-full transition-all duration-150"
                      style={{
                        height: `${Math.random() * 100}%`,
                        opacity: 0.3 + Math.random() * 0.7,
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={stopRecording}
                className="w-full py-6 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-red-600 hover:to-pink-700 transition-all shadow-lg shadow-red-500/30 hover:scale-105 flex items-center justify-center gap-3"
              >
                <Square className="w-6 h-6" />
                Parar Monitoramento
              </button>
            </div>
          )}

          {apneaEvents > 5 && isRecording && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 font-semibold mb-1">Alerta de Saúde</p>
                <p className="text-sm text-gray-300">Múltiplos eventos de apneia detectados. Considere consultar um especialista em sono.</p>
              </div>
            </div>
          )}
        </div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-xl mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{streak}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Dias seguidos</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-4 text-center hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-2">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{weeklyAverage}h</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Média semanal</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-4 text-center hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-xl mb-2">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{getSleepRecords().length}</p>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total registros</p>
          </div>
        </div>

        {/* Today's Summary */}
        {todayRecord ? (
          <div className="bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800 p-8 mb-6 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Resumo de Hoje</h2>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${qualityColors[todayRecord.quality]} animate-pulse`}>
                {qualityEmoji[todayRecord.quality]} {todayRecord.quality.charAt(0).toUpperCase() + todayRecord.quality.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/10 rounded-2xl mb-3 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
                  <Moon className="w-8 h-8 text-indigo-400" />
                </div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Dormiu</p>
                <p className="text-2xl font-bold text-white">{todayRecord.bedTime}</p>
              </div>

              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-2xl mb-3 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-all">
                  <Sun className="w-8 h-8 text-yellow-400" />
                </div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Acordou</p>
                <p className="text-2xl font-bold text-white">{todayRecord.wakeTime}</p>
              </div>

              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl mb-3 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                  <Clock className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Duração</p>
                <p className="text-2xl font-bold text-white">{todayRecord.hoursSlept}h</p>
              </div>
            </div>

            {/* Progress towards goal */}
            {profile && profile.sleepGoal && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Meta diária: {profile.sleepGoal}h</span>
                  <span className="text-sm font-semibold text-white">
                    {Math.round((todayRecord.hoursSlept / profile.sleepGoal) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((todayRecord.hoursSlept / profile.sleepGoal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-3xl shadow-2xl border border-gray-800 p-10 mb-6 text-center hover:border-indigo-500/30 transition-all">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-2xl mb-6">
              <Moon className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Nenhum registro hoje</h3>
            <p className="text-gray-400 mb-6 text-lg">Registre seu sono para começar a acompanhar sua rotina</p>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20 hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Registrar Sono
            </Link>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Link
            href="/dicas"
            className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 p-6 hover:border-blue-500/30 transition-all group hover:scale-105"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Sparkles className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="font-bold text-white mb-2 text-lg">Dicas de Sono</h3>
            <p className="text-sm text-gray-400">Aprenda a dormir melhor</p>
          </Link>

          <Link
            href="/rotina"
            className="bg-[#1a1a1a] rounded-2xl shadow-xl border border-gray-800 p-6 hover:border-purple-500/30 transition-all group hover:scale-105"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/10 rounded-2xl mb-4 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
              <Moon className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="font-bold text-white mb-2 text-lg">Rotina Noturna</h3>
            <p className="text-sm text-gray-400">Prepare-se para dormir</p>
          </Link>
        </div>

        {/* Achievements Section */}
        {streak >= 3 && (
          <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-red-500/10 border border-yellow-500/20 rounded-3xl p-6 mb-6 text-center animate-pulse">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">🎉 Conquista Desbloqueada!</h3>
            <p className="text-gray-300">Você manteve {streak} dias seguidos de registros!</p>
          </div>
        )}

        {/* Profile Setup CTA */}
        {!profile && (
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl shadow-2xl shadow-indigo-500/20 p-8 text-white text-center hover:scale-105 transition-transform">
            <Target className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Configure seu perfil</h3>
            <p className="text-indigo-100 mb-6 text-lg">Personalize sua experiência e defina seus objetivos</p>
            <Link
              href="/perfil"
              className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Criar Perfil
            </Link>
          </div>
        )}

        {/* Social Sharing Teaser */}
        {todayRecord && streak >= 7 && (
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-6 text-center">
            <Sparkles className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Compartilhe sua conquista!</h3>
            <p className="text-sm text-gray-400 mb-4">Mostre aos seus amigos sua dedicação</p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all">
              Compartilhar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
