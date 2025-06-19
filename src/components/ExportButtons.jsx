import React, { useState } from 'react';
import { exportToCSV, exportToJSON, prepareStudentsForExport, prepareResultsForExport } from '../utils/exportData';
import ImportData from './ImportData';

/**
 * Composant de boutons d'exportation et d'importation pour les données
 * @param {object} props - Propriétés du composant
 * @param {string} props.type - Type de données à exporter ('students' ou 'results')
 * @param {array} props.data - Données à exporter
 * @param {array} [props.students] - Liste des étudiants (nécessaire pour 'results')
 */
const ExportButtons = ({ type, data, students }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  
  // Gérer l'exportation en CSV
  const handleExportCSV = () => {
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }
    
    try {
      let exportData;
      let filename;
      
      if (type === 'students') {
        exportData = prepareStudentsForExport(data);
        filename = 'etudiants';
      } else if (type === 'results') {
        if (!students) {
          alert('Données d\'étudiants manquantes pour l\'exportation des résultats');
          return;
        }
        exportData = prepareResultsForExport(data, students);
        filename = 'resultats';
      } else {
        alert('Type d\'exportation non pris en charge');
        return;
      }
      
      // Ajouter un timestamp au nom du fichier
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      filename = `${filename}_${timestamp}`;
      
      exportToCSV(exportData, filename);
    } catch (error) {
      console.error('Erreur lors de l\'exportation CSV :', error);
      alert('Une erreur s\'est produite lors de l\'exportation');
    }
  };
  
  // Gérer l'exportation en JSON
  const handleExportJSON = () => {
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }
    
    try {
      let exportData;
      let filename;
      
      if (type === 'students') {
        exportData = prepareStudentsForExport(data);
        filename = 'etudiants';
      } else if (type === 'results') {
        if (!students) {
          alert('Données d\'étudiants manquantes pour l\'exportation des résultats');
          return;
        }
        exportData = prepareResultsForExport(data, students);
        filename = 'resultats';
      } else {
        alert('Type d\'exportation non pris en charge');
        return;
      }
      
      // Ajouter un timestamp au nom du fichier
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      filename = `${filename}_${timestamp}`;
      
      exportToJSON(exportData, filename);
    } catch (error) {
      console.error('Erreur lors de l\'exportation JSON :', error);
      alert('Une erreur s\'est produite lors de l\'exportation');
    }
  };
  
  // Ouvrir le modal d'importation
  const handleOpenImportModal = () => {
    setShowImportModal(true);
  };
  
  // Fermer le modal d'importation
  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  return (
    <>
      <div className="export-buttons" style={{ display: 'flex', gap: '10px' }}>
        <button 
          type="button"
          onClick={handleExportCSV}
          className="secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="fa-solid fa-file-csv"></i>
          Exporter en CSV
        </button>
        
        <button 
          type="button"
          onClick={handleExportJSON}
          className="secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="fa-solid fa-file-code"></i>
          Exporter en JSON
        </button>
        
        <button 
          type="button"
          onClick={handleOpenImportModal}
          className="primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="fa-solid fa-file-import"></i>
          Importer des données
        </button>
      </div>
      
      {showImportModal && (
        <div className="modal-overlay">
          <ImportData type={type} onClose={handleCloseImportModal} />
        </div>
      )}
    </>
  );
};

export default ExportButtons; 