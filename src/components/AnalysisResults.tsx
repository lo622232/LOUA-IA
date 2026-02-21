import { BusinessAnalysis } from '../lib/supabase';

type AnalysisResultsProps = {
  analyses: BusinessAnalysis[];
  onRefresh: () => void;
};

export function AnalysisResults({ analyses, onRefresh }: AnalysisResultsProps) {
  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'status-pending',
      processing: 'status-processing',
      completed: 'status-completed',
      failed: 'status-failed',
    };

    const statusLabels = {
      pending: 'En attente',
      processing: 'En cours',
      completed: 'Terminé',
      failed: 'Échec',
    };

    return (
      <span className={`status-badge ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusLabels[status as keyof typeof statusLabels]}
      </span>
    );
  };

  const getAnalysisTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      market: 'Analyse de Marché',
      financial: 'Analyse Financière',
      operational: 'Analyse Opérationnelle',
      strategic: 'Analyse Stratégique',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (analyses.length === 0) {
    return (
      <div className="empty-state">
        <h3>Aucune analyse pour le moment</h3>
        <p>Créez votre première analyse pour commencer à obtenir des insights sur votre entreprise.</p>
      </div>
    );
  }

  return (
    <div className="analysis-results">
      <div className="results-header">
        <h2>Historique des Analyses</h2>
        <button onClick={onRefresh} className="refresh-button">
          Actualiser
        </button>
      </div>

      <div className="analysis-list">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="analysis-card">
            <div className="analysis-card-header">
              <div>
                <h3>{getAnalysisTypeLabel(analysis.analysis_type)}</h3>
                <p className="analysis-date">{formatDate(analysis.created_at)}</p>
              </div>
              {getStatusBadge(analysis.status)}
            </div>

            <div className="analysis-card-content">
              <div className="business-data-summary">
                <h4>Données fournies:</h4>
                <div className="data-grid">
                  {analysis.business_data.revenue && (
                    <div className="data-item">
                      <span className="data-label">Revenus:</span>
                      <span className="data-value">{analysis.business_data.revenue} GNF</span>
                    </div>
                  )}
                  {analysis.business_data.expenses && (
                    <div className="data-item">
                      <span className="data-label">Dépenses:</span>
                      <span className="data-value">{analysis.business_data.expenses} GNF</span>
                    </div>
                  )}
                  {analysis.business_data.customers && (
                    <div className="data-item">
                      <span className="data-label">Clients:</span>
                      <span className="data-value">{analysis.business_data.customers}</span>
                    </div>
                  )}
                </div>
              </div>

              {analysis.status === 'completed' && analysis.analysis_result && (
                <div className="analysis-result">
                  <h4>Résultats de l'analyse:</h4>
                  <div className="result-content">
                    <p className="placeholder-text">
                      L'analyse IA sera disponible ici une fois le système d'analyse configuré.
                      Les recommandations personnalisées apparaîtront basées sur vos données.
                    </p>
                  </div>
                </div>
              )}

              {analysis.status === 'pending' && (
                <p className="status-message">En attente de traitement...</p>
              )}

              {analysis.status === 'processing' && (
                <p className="status-message">Analyse en cours...</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
