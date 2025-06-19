import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

/**
 * Composant pour générer un rapport imprimable d'un étudiant
 * @param {object} props - Propriétés du composant
 * @param {object} props.student - Données de l'étudiant
 * @param {array} props.results - Résultats de l'étudiant
 * @param {function} props.onClose - Fonction à appeler pour fermer le rapport
 */
const PrintableReport = ({ student, results, onClose }) => {
  const componentRef = useRef();
  
  // Configuration de l'impression
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Rapport_${student.firstName || student.nom}_${student.lastName || student.prenom}`,
    onAfterPrint: () => console.log('Impression terminée')
  });
  
  // Calculer la moyenne générale
  const calculateAverage = () => {
    if (!results || results.length === 0) return 0;
    const sum = results.reduce((acc, result) => acc + parseFloat(result.score || 0), 0);
    return (sum / results.length).toFixed(2);
  };
  
  // Grouper les résultats par matière
  const groupResultsBySubject = () => {
    const grouped = {};
    
    results.forEach(result => {
      if (!grouped[result.subject]) {
        grouped[result.subject] = [];
      }
      grouped[result.subject].push(result);
    });
    
    return grouped;
  };
  
  // Formater une date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const average = calculateAverage();
  const groupedResults = groupResultsBySubject();
  
  return (
    <div className="printable-report-overlay">
      <div className="printable-report-container">
        <div className="printable-report-actions">
          <button className="primary" onClick={handlePrint}>
            <i className="fa-solid fa-print"></i> Imprimer
          </button>
          <button className="secondary" onClick={onClose}>
            <i className="fa-solid fa-times"></i> Fermer
          </button>
        </div>
        
        <div className="printable-report" ref={componentRef}>
          <div className="report-header">
            <h1>Rapport académique</h1>
            <div className="school-info">
              <p>École Supérieure de Gestion</p>
              <p>Année académique {new Date().getFullYear()}</p>
            </div>
          </div>
          
          <div className="student-info">
            <h2>Informations de l'étudiant</h2>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Matricule:</span>
                <span className="info-value">{student.matricule}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Nom:</span>
                <span className="info-value">{student.lastName || student.nom}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Prénom:</span>
                <span className="info-value">{student.firstName || student.prenom}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date de naissance:</span>
                <span className="info-value">{formatDate(student.dob)}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{student.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Programme:</span>
                <span className="info-value">{student.program || 'Non spécifié'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Niveau:</span>
                <span className="info-value">{student.level || 'Non spécifié'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Date d'inscription:</span>
                <span className="info-value">{formatDate(student.createdAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="academic-results">
            <h2>Résultats académiques</h2>
            
            {results && results.length > 0 ? (
              <>
                <div className="average-container">
                  <div className="average-badge" style={{ 
                    backgroundColor: parseFloat(average) >= 10 ? 'var(--success)' : 'var(--danger)'
                  }}>
                    <span className="average-label">Moyenne générale</span>
                    <span className="average-value">{average}/20</span>
                  </div>
                </div>
                
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th>Note</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td>{result.subject}</td>
                        <td style={{ 
                          fontWeight: 'bold', 
                          color: parseFloat(result.score) >= 10 ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {result.score}/20
                        </td>
                        <td>{formatDate(result.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <h3>Analyse par matière</h3>
                <div className="subjects-grid">
                  {Object.entries(groupedResults).map(([subject, subjectResults]) => {
                    const subjectAvg = (subjectResults.reduce((sum, r) => sum + parseFloat(r.score || 0), 0) / subjectResults.length).toFixed(2);
                    return (
                      <div key={subject} className="subject-card">
                        <h4>{subject}</h4>
                        <div className="subject-stats">
                          <div className="stat">
                            <span className="stat-label">Moyenne:</span>
                            <span className="stat-value" style={{ 
                              color: parseFloat(subjectAvg) >= 10 ? 'var(--success)' : 'var(--danger)'
                            }}>
                              {subjectAvg}/20
                            </span>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Évaluations:</span>
                            <span className="stat-value">{subjectResults.length}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="no-results">Aucun résultat disponible pour cet étudiant.</p>
            )}
          </div>
          
          <div className="report-footer">
            <p>Document généré le {new Date().toLocaleDateString()} à {new Date().toLocaleTimeString()}</p>
            <p>Ce document est confidentiel et destiné uniquement à l'usage interne de l'établissement.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableReport;