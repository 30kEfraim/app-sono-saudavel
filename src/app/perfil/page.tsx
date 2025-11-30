'use client';

import { useEffect, useState } from 'react';
import { getUserProfile, saveUserProfile } from '@/lib/sleep-storage';
import { UserProfile, SLEEP_GOALS } from '@/lib/types';
import { User, Target, Calendar, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PerfilPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    setMounted(true);
    const existingProfile = getUserProfile();
    if (existingProfile) {
      setProfile(existingProfile);
      setName(existingProfile.name);
      setAge(existingProfile.age.toString());
      setGoal(existingProfile.goal);
    } else {
      setIsEditing(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: UserProfile = {
      name,
      age: parseInt(age),
      goal,
    };
    saveUserProfile(newProfile);
    setProfile(newProfile);
    setIsEditing(false);
    
    // Se é primeiro cadastro, redireciona para home
    if (!profile) {
      setTimeout(() => router.push('/'), 500);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
          <User className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Perfil</h1>
        <p className="text-gray-600">
          {profile ? 'Suas informações pessoais' : 'Configure seu perfil'}
        </p>
      </div>

      {/* Profile View */}
      {profile && !isEditing ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <p className="text-gray-600">{profile.age} anos</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Objetivo</p>
                  <p className="text-gray-900">{profile.goal}</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        /* Profile Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Name */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-5 h-5 text-indigo-600" />
              Nome
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Digite seu nome"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Age */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Idade
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              min="1"
              max="120"
              placeholder="Digite sua idade"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Goal */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Target className="w-5 h-5 text-purple-600" />
              Objetivo com o sono
            </label>
            <div className="space-y-2">
              {SLEEP_GOALS.map((goalOption) => (
                <button
                  key={goalOption}
                  type="button"
                  onClick={() => setGoal(goalOption)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    goal === goalOption
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goalOption}</span>
                    {goal === goalOption && <Check className="w-5 h-5 text-indigo-600" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name || !age || !goal}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {profile ? 'Salvar Alterações' : 'Criar Perfil'}
          </button>

          {profile && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-full mt-3 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          )}
        </form>
      )}
    </div>
  );
}
