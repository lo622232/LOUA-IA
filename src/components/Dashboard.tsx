import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Entrepreneur, BusinessAnalysis } from '../lib/supabase';
import { AnalysisForm } from './AnalysisForm';
import { AnalysisResults } from './AnalysisResults';
import { ProfileSettings } from './ProfileSettings';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Entrepreneur | null>(null);
  const [analyses, setAnalyses] = useState<BusinessAnalysis[]>([]);
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'profile'>('new');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadAnalyses();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('entrepreneurs')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const loadAnalyses = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('business_analyses')
      .select('*')
      .eq('entrepreneur_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setAnalyses(data);
    }
  };

  const handleAnalysisCreated = () => {
    loadAnalyses();
    setActiveTab('history');
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>LOUA IA</h1>
            <p>Assistant Entrepreneurial</p>
          </div>
          <div className="user-section">
            <span className="user-name">{profile?.full_name || user?.email}</span>
            <button onClick={signOut} className="logout-button">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            onClick={() => setActiveTab('new')}
            className={`nav-button ${activeTab === 'new' ? 'active' : ''}`}
          >
            Nouvelle Analyse
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`nav-button ${activeTab === 'history' ? 'active' : ''}`}
          >
            Historique ({analyses.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
          >
            Profil
          </button>
        </nav>

        <main className="dashboard-main">
          {activeTab === 'new' && (
            <AnalysisForm onAnalysisCreated={handleAnalysisCreated} />
          )}
          {activeTab === 'history' && (
            <AnalysisResults analyses={analyses} onRefresh={loadAnalyses} />
          )}
          {activeTab === 'profile' && profile && (
            <ProfileSettings profile={profile} onUpdate={loadProfile} />
          )}
        </main>
      </div>
    </div>
  );
}
