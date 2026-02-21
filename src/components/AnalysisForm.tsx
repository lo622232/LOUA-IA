import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type AnalysisFormProps = {
  onAnalysisCreated: () => void;
};

export function AnalysisForm({ onAnalysisCreated }: AnalysisFormProps) {
  const { user } = useAuth();
  const [analysisType, setAnalysisType] = useState<string>('market');
  const [businessData, setBusinessData] = useState({
    revenue: '',
    expenses: '',
    customers: '',
    marketSize: '',
    competition: '',
    challenges: '',
    goals: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('business_analyses')
        .insert({
          entrepreneur_id: user.id,
          analysis_type: analysisType,
          business_data: businessData,
          status: 'pending',
        });

      if (insertError) throw insertError;

      setBusinessData({
        revenue: '',
        expenses: '',
        customers: '',
        marketSize: '',
        competition: '',
        challenges: '',
        goals: '',
      });

      onAnalysisCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="analysis-form-container">
      <div className="form-header">
        <h2>Nouvelle Analyse d'Entreprise</h2>
        <p>Fournissez les données de votre entreprise pour obtenir une analyse IA détaillée</p>
      </div>

      <form onSubmit={handleSubmit} className="analysis-form">
        <div className="form-group">
          <label htmlFor="analysisType">Type d'Analyse</label>
          <select
            id="analysisType"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="select-input"
          >
            <option value="market">Analyse de Marché</option>
            <option value="financial">Analyse Financière</option>
            <option value="operational">Analyse Opérationnelle</option>
            <option value="strategic">Analyse Stratégique</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="revenue">Revenus Mensuels (GNF)</label>
            <input
              id="revenue"
              type="text"
              value={businessData.revenue}
              onChange={(e) => setBusinessData({ ...businessData, revenue: e.target.value })}
              placeholder="Ex: 5000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="expenses">Dépenses Mensuelles (GNF)</label>
            <input
              id="expenses"
              type="text"
              value={businessData.expenses}
              onChange={(e) => setBusinessData({ ...businessData, expenses: e.target.value })}
              placeholder="Ex: 3000000"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customers">Nombre de Clients</label>
            <input
              id="customers"
              type="text"
              value={businessData.customers}
              onChange={(e) => setBusinessData({ ...businessData, customers: e.target.value })}
              placeholder="Ex: 50"
            />
          </div>

          <div className="form-group">
            <label htmlFor="marketSize">Taille du Marché Estimée</label>
            <input
              id="marketSize"
              type="text"
              value={businessData.marketSize}
              onChange={(e) => setBusinessData({ ...businessData, marketSize: e.target.value })}
              placeholder="Ex: 100000 clients potentiels"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="competition">Concurrence</label>
          <textarea
            id="competition"
            value={businessData.competition}
            onChange={(e) => setBusinessData({ ...businessData, competition: e.target.value })}
            placeholder="Décrivez vos principaux concurrents..."
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="challenges">Défis Actuels</label>
          <textarea
            id="challenges"
            value={businessData.challenges}
            onChange={(e) => setBusinessData({ ...businessData, challenges: e.target.value })}
            placeholder="Quels sont vos principaux défis?"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="goals">Objectifs</label>
          <textarea
            id="goals"
            value={businessData.goals}
            onChange={(e) => setBusinessData({ ...businessData, goals: e.target.value })}
            placeholder="Quels sont vos objectifs pour les 6-12 prochains mois?"
            rows={3}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Soumettre pour Analyse'}
        </button>
      </form>
    </div>
  );
}
