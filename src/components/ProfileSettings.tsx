import { useState } from 'react';
import { supabase, Entrepreneur } from '../lib/supabase';

type ProfileSettingsProps = {
  profile: Entrepreneur;
  onUpdate: () => void;
};

export function ProfileSettings({ profile, onUpdate }: ProfileSettingsProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    business_name: profile.business_name || '',
    business_sector: profile.business_sector || '',
    business_description: profile.business_description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase
        .from('entrepreneurs')
        .update({
          full_name: formData.full_name,
          business_name: formData.business_name,
          business_sector: formData.business_sector,
          business_description: formData.business_description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setEditing(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name,
      business_name: profile.business_name || '',
      business_sector: profile.business_sector || '',
      business_description: profile.business_description || '',
    });
    setEditing(false);
    setError('');
  };

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <h2>Profil Entrepreneur</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="edit-button">
            Modifier
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="settings-form">
          <div className="form-group">
            <label htmlFor="full_name">Nom Complet</label>
            <input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_name">Nom de l'Entreprise</label>
            <input
              id="business_name"
              type="text"
              value={formData.business_name}
              onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
              placeholder="Ex: Tech Solutions Guinée"
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_sector">Secteur d'Activité</label>
            <input
              id="business_sector"
              type="text"
              value={formData.business_sector}
              onChange={(e) => setFormData({ ...formData, business_sector: e.target.value })}
              placeholder="Ex: Technologie, Commerce, Agriculture..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_description">Description de l'Entreprise</label>
            <textarea
              id="business_description"
              value={formData.business_description}
              onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
              placeholder="Décrivez votre entreprise et ses activités..."
              rows={4}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              Annuler
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-view">
          <div className="profile-section">
            <h3>Informations Personnelles</h3>
            <div className="info-item">
              <span className="info-label">Nom:</span>
              <span className="info-value">{profile.full_name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{profile.email}</span>
            </div>
          </div>

          <div className="profile-section">
            <h3>Informations Entreprise</h3>
            <div className="info-item">
              <span className="info-label">Nom de l'entreprise:</span>
              <span className="info-value">{profile.business_name || 'Non renseigné'}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Secteur:</span>
              <span className="info-value">{profile.business_sector || 'Non renseigné'}</span>
            </div>
            {profile.business_description && (
              <div className="info-item">
                <span className="info-label">Description:</span>
                <p className="info-value">{profile.business_description}</p>
              </div>
            )}
          </div>

          <div className="profile-section">
            <h3>Informations Compte</h3>
            <div className="info-item">
              <span className="info-label">Membre depuis:</span>
              <span className="info-value">
                {new Date(profile.created_at).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
