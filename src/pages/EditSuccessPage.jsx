import React from 'react';
import { useNavigate } from 'react-router-dom';

const EditSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <div className="success" style={{ marginBottom: 24 }}>
        Informations mises à jour avec succès !
      </div>
      <button onClick={() => navigate('/add-result')} style={{ width: '100%' }}>
        Aller à l'ajout de résultats
      </button>
    </div>
  );
};

export default EditSuccessPage; 