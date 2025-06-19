import React, { useState } from 'react';
import { readFileContent, parseCSV, validateImportedData, formatImportedData } from '../utils/exportData';
import { useStudentContext } from '../contexts/StudentContext';

/**
 * Composant pour l'importation de données
 * @param {object} props - Propriétés du composant
 * @param {string} props.type - Type de données à importer ('students' ou 'results')
 * @param {function} props.onClose - Fonction à appeler pour fermer le modal
 */
const ImportData = ({ type, onClose }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [errors, setErrors] = useState([]);
  const [importStep, setImportStep] = useState('select'); // 'select', 'preview', 'confirm'
  
  const { addStudent, addResult, students, addNotification } = useStudentContext();
  
  // Gérer la sélection de fichier
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setErrors([]);
    
    // Vérifier le type de fichier
    const isCSV = selectedFile.name.endsWith('.csv') || selectedFile.type === 'text/csv';
    const isJSON = selectedFile.type === 'application/json';
    
    if (!isCSV && !isJSON) {
      setErrors(['Format de fichier non pris en charge. Veuillez sélectionner un fichier CSV ou JSON.']);
      setFile(null);
      return;
    }
  };
  
  // Prévisualiser les données
  const handlePreview = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setErrors([]);
    
    try {
      const content = await readFileContent(file);
      let data;
      
      if (file.type === 'application/json') {
        data = JSON.parse(content);
      } else {
        data = parseCSV(content);
      }
      
      // Valider les données
      const validation = validateImportedData(data, type);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsLoading(false);
        return;
      }
      
      // Formater les données pour l'aperçu
      const formattedData = formatImportedData(data, type);
      setPreview(formattedData.slice(0, 5)); // Limiter l'aperçu à 5 éléments
      setImportStep('preview');
    } catch (error) {
      setErrors([`Erreur lors de la lecture du fichier: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Importer les données
  const handleImport = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setErrors([]);
    
    try {
      const content = await readFileContent(file);
      let data;
      
      if (file.type === 'application/json') {
        data = JSON.parse(content);
      } else {
        data = parseCSV(content);
      }
      
      // Valider les données
      const validation = validateImportedData(data, type);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsLoading(false);
        return;
      }
      
      // Formater les données pour l'importation
      const formattedData = formatImportedData(data, type);
      
      // Importer les données selon le type
      if (type === 'students') {
        formattedData.forEach(student => {
          addStudent(student);
        });
        addNotification(`${formattedData.length} étudiants importés avec succès`, 'success');
      } else if (type === 'results') {
        // Pour les résultats, nous devons associer les matricules aux IDs d'étudiants
        formattedData.forEach(result => {
          // Trouver l'étudiant correspondant au matricule
          const matricule = result.studentId;
          const student = students.find(s => s.matricule === matricule);
          
          if (student) {
            const resultWithStudentId = {
              ...result,
              studentId: student.id
            };
            addResult(resultWithStudentId);
          }
        });
        addNotification(`${formattedData.length} résultats importés avec succès`, 'success');
      }
      
      setImportStep('confirm');
    } catch (error) {
      setErrors([`Erreur lors de l'importation: ${error.message}`]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fermer et réinitialiser
  const handleClose = () => {
    onClose();
  };
  
  return (
    <div className="import-data-modal">
      <div className="modal-header">
        <h3>Importer des {type === 'students' ? 'étudiants' : 'résultats'}</h3>
        <button className="close-button" onClick={handleClose}>
          <i className="fa-solid fa-times"></i>
        </button>
      </div>
      
      <div className="modal-content">
        {importStep === 'select' && (
          <>
            <div className="file-upload-container">
              <label className="file-upload-label">
                <i className="fa-solid fa-file-import"></i>
                <span>Sélectionner un fichier CSV ou JSON</span>
                <input 
                  type="file" 
                  accept=".csv,application/json" 
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              {file && (
                <div className="selected-file">
                  <i className="fa-solid fa-file"></i>
                  <span>{file.name}</span>
                </div>
              )}
            </div>
            
            {errors.length > 0 && (
              <div className="error-container">
                <h4>Erreurs:</h4>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="button-container">
              <button 
                className="secondary" 
                onClick={handleClose}
              >
                Annuler
              </button>
              <button 
                className="primary" 
                onClick={handlePreview} 
                disabled={!file || isLoading}
              >
                {isLoading ? 'Chargement...' : 'Prévisualiser'}
              </button>
            </div>
          </>
        )}
        
        {importStep === 'preview' && (
          <>
            <div className="preview-container">
              <h4>Aperçu des données (5 premiers éléments)</h4>
              
              <div className="preview-table-container">
                <table className="preview-table">
                  <thead>
                    <tr>
                      {preview.length > 0 && Object.keys(preview[0]).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((item, index) => (
                      <tr key={index}>
                        {Object.values(item).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="preview-info">
                {type === 'students' 
                  ? `Total: ${preview.length} étudiants à importer.` 
                  : `Total: ${preview.length} résultats à importer.`}
              </p>
            </div>
            
            <div className="button-container">
              <button 
                className="secondary" 
                onClick={() => setImportStep('select')}
              >
                Retour
              </button>
              <button 
                className="success" 
                onClick={handleImport} 
                disabled={isLoading}
              >
                {isLoading ? 'Importation...' : 'Importer les données'}
              </button>
            </div>
          </>
        )}
        
        {importStep === 'confirm' && (
          <div className="confirm-container">
            <div className="success-message">
              <i className="fa-solid fa-check-circle"></i>
              <h4>Importation réussie!</h4>
              <p>Les données ont été importées avec succès.</p>
            </div>
            
            <button 
              className="primary" 
              onClick={handleClose}
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportData;
