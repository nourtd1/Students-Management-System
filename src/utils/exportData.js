/**
 * Utilitaire pour l'exportation de données en différents formats
 */

/**
 * Exporte les données au format CSV et déclenche le téléchargement
 * @param {Array} data - Tableau d'objets à exporter
 * @param {string} filename - Nom du fichier sans extension
 */
export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    console.error('Aucune donnée à exporter');
    return;
  }

  // Récupérer les en-têtes à partir des clés du premier objet
  const headers = Object.keys(data[0]);
  
  // Créer les lignes du CSV
  const csvRows = [];
  
  // Ajouter les en-têtes
  csvRows.push(headers.join(','));
  
  // Ajouter les données
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + (row[header] || '')).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Joindre les lignes avec des sauts de ligne
  const csvString = csvRows.join('\n');
  
  // Créer un objet Blob
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Télécharger le fichier
  downloadBlob(blob, `${filename}.csv`);
};

/**
 * Génère une table HTML à partir d'un tableau d'objets
 * @param {Array} data - Tableau d'objets 
 * @param {Array} headers - Tableau de définitions d'en-têtes {key, label}
 * @returns {HTMLTableElement} Table HTML
 */
export const generateTable = (data, headers) => {
  if (!data || !data.length) return null;
  
  // Créer la table
  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';
  table.style.marginBottom = '20px';
  
  // Créer l'en-tête
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header.label;
    th.style.backgroundColor = '#4361ee';
    th.style.color = 'white';
    th.style.padding = '10px';
    th.style.textAlign = 'left';
    th.style.fontWeight = 'bold';
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Créer le corps de la table
  const tbody = document.createElement('tbody');
  
  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white';
    
    headers.forEach(header => {
      const td = document.createElement('td');
      td.textContent = row[header.key] || '';
      td.style.padding = '8px';
      td.style.borderBottom = '1px solid #dee2e6';
      tr.appendChild(td);
    });
    
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  
  return table;
};

/**
 * Fonction générique pour télécharger un Blob
 * @param {Blob} blob - Objet Blob à télécharger
 * @param {string} filename - Nom du fichier
 */
const downloadBlob = (blob, filename) => {
  // Créer une URL pour le blob
  const url = window.URL.createObjectURL(blob);
  
  // Créer un lien invisible
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = url;
  link.download = filename;
  
  // Ajouter le lien au document
  document.body.appendChild(link);
  
  // Cliquer sur le lien
  link.click();
  
  // Nettoyer
  window.URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

/**
 * Formatte une date pour l'affichage
 * @param {Date} date - Objet Date 
 * @returns {string} Date au format JJ/MM/AAAA
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return date.toLocaleDateString();
};

/**
 * Prépare les données des étudiants pour l'exportation
 * @param {Array} students - Liste des étudiants
 * @returns {Array} Données formatées pour l'exportation
 */
export const prepareStudentsForExport = (students) => {
  return students.map(student => ({
    Matricule: student.matricule,
    Prénom: student.firstName || student.nom,
    Nom: student.lastName || student.prenom,
    Email: student.email,
    'Date de naissance': formatDate(student.dob),
    Programme: student.program,
    Niveau: student.level
  }));
};

/**
 * Prépare les données des résultats pour l'exportation
 * @param {Array} results - Liste des résultats
 * @param {Array} students - Liste des étudiants
 * @returns {Array} Données formatées pour l'exportation
 */
export const prepareResultsForExport = (results, students) => {
  return results.map(result => {
    const student = students.find(s => s.id === result.studentId || s.id === parseInt(result.studentId));
    return {
      Matricule: student ? student.matricule : '',
      Étudiant: student ? `${student.firstName || student.nom} ${student.lastName || student.prenom}` : 'Inconnu',
      Matière: result.subject,
      Note: result.score,
      Programme: student ? student.program : '',
      Niveau: student ? student.level : ''
    };
  });
};

/**
 * Exporte les données au format JSON et déclenche le téléchargement
 * @param {Array} data - Tableau d'objets à exporter
 * @param {string} filename - Nom du fichier sans extension
 */
export const exportToJSON = (data, filename) => {
  if (!data || !data.length) {
    console.error('Aucune donnée à exporter');
    return;
  }
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  downloadBlob(blob, `${filename}.json`);
};

/**
 * Parse un fichier CSV et retourne un tableau d'objets
 * @param {string} csvText - Contenu du fichier CSV
 * @returns {Array} Tableau d'objets
 */
export const parseCSV = (csvText) => {
  try {
    // Diviser le texte en lignes
    const lines = csvText.split(/\r\n|\n/);
    if (lines.length < 2) throw new Error('Le fichier CSV est vide ou mal formaté');
    
    // Extraire les en-têtes
    const headers = lines[0].split(',').map(header => 
      header.replace(/^"(.*)"$/, '$1').trim() // Supprimer les guillemets
    );
    
    // Analyser chaque ligne
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue; // Ignorer les lignes vides
      
      // Gérer les valeurs entre guillemets avec des virgules
      const values = [];
      let inQuotes = false;
      let currentValue = '';
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentValue.replace(/^"(.*)"$/, '$1')); // Supprimer les guillemets
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Ajouter la dernière valeur
      values.push(currentValue.replace(/^"(.*)"$/, '$1'));
      
      // Créer un objet avec les en-têtes comme clés
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j] || '';
      }
      
      result.push(obj);
    }
    
    return result;
  } catch (error) {
    console.error('Erreur lors de l\'analyse du CSV:', error);
    throw new Error('Le format du fichier CSV est invalide');
  }
};

/**
 * Convertit les données importées en format compatible avec l'application
 * @param {Array} importedData - Données importées
 * @param {string} type - Type de données ('students' ou 'results')
 * @returns {Array} Données formatées pour l'application
 */
export const formatImportedData = (importedData, type) => {
  if (type === 'students') {
    return importedData.map((item, index) => ({
      id: Date.now() + index, // Générer un ID unique
      firstName: item['Prénom'] || item['Prenom'] || item['FirstName'] || '',
      lastName: item['Nom'] || item['LastName'] || '',
      matricule: item['Matricule'] || item['ID'] || '',
      email: item['Email'] || '',
      dob: item['Date de naissance'] || item['DateOfBirth'] || '',
      program: item['Programme'] || item['Program'] || '',
      level: item['Niveau'] || item['Level'] || '',
      createdAt: new Date().toISOString()
    }));
  } else if (type === 'results') {
    return importedData.map((item, index) => ({
      id: Date.now() + index, // Générer un ID unique
      studentId: item['StudentID'] || '', // Nécessite une étape supplémentaire pour associer à l'ID correct
      subject: item['Matière'] || item['Subject'] || '',
      score: item['Note'] || item['Score'] || 0,
      createdAt: new Date().toISOString()
    }));
  }
  
  return [];
};

/**
 * Valide les données importées pour s'assurer qu'elles sont compatibles
 * @param {Array} data - Données importées
 * @param {string} type - Type de données ('students' ou 'results')
 * @returns {Object} Résultat de la validation {isValid, errors}
 */
export const validateImportedData = (data, type) => {
  const errors = [];
  
  if (!Array.isArray(data) || data.length === 0) {
    errors.push('Aucune donnée valide trouvée');
    return { isValid: false, errors };
  }
  
  if (type === 'students') {
    // Vérifier les champs requis pour les étudiants
    data.forEach((item, index) => {
      const hasName = (item['Prénom'] || item['Prenom'] || item['FirstName']) && 
                     (item['Nom'] || item['LastName']);
      const hasID = item['Matricule'] || item['ID'];
      
      if (!hasName) {
        errors.push(`Ligne ${index + 1}: Nom ou prénom manquant`);
      }
      
      if (!hasID) {
        errors.push(`Ligne ${index + 1}: Matricule manquant`);
      }
    });
  } else if (type === 'results') {
    // Vérifier les champs requis pour les résultats
    data.forEach((item, index) => {
      const hasStudentID = item['StudentID'] || item['Matricule'];
      const hasSubject = item['Matière'] || item['Subject'];
      const hasScore = item['Note'] || item['Score'];
      
      if (!hasStudentID) {
        errors.push(`Ligne ${index + 1}: ID étudiant manquant`);
      }
      
      if (!hasSubject) {
        errors.push(`Ligne ${index + 1}: Matière manquante`);
      }
      
      if (!hasScore) {
        errors.push(`Ligne ${index + 1}: Note manquante`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Lit un fichier et retourne son contenu
 * @param {File} file - Objet File
 * @returns {Promise<string>} Contenu du fichier
 */
export const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    if (file.type === 'application/json') {
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv') || file.type === 'text/csv') {
      reader.readAsText(file);
    } else {
      reject(new Error('Format de fichier non pris en charge'));
    }
  });
}; 