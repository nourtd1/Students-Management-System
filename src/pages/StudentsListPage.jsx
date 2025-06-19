import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentContext } from '../contexts/StudentContext';
import ExportButtons from '../components/ExportButtons';

const StudentsListPage = () => {
  const navigate = useNavigate();
  const { students, deleteStudent, addNotification } = useStudentContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Obtenir la liste des programmes et niveaux uniques
  const uniquePrograms = [...new Set(students.map(s => s.program).filter(Boolean))];
  const uniqueLevels = [...new Set(students.map(s => s.level).filter(Boolean))];
  
  // Filtrer les étudiants en fonction des critères de recherche
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.firstName || student.nom || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.lastName || student.prenom || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.matricule || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProgram = selectedProgram ? student.program === selectedProgram : true;
    const matchesLevel = selectedLevel ? student.level === selectedLevel : true;
    
    return matchesSearch && matchesProgram && matchesLevel;
  });
  
  // Gérer la sélection d'un étudiant
  const handleSelectStudent = (id) => {
    setSelectedStudents(prev => {
      if (prev.includes(id)) {
        return prev.filter(studentId => studentId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Gérer la sélection de tous les étudiants
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(student => student.id));
    }
    setSelectAll(!selectAll);
  };
  
  // Gérer la suppression d'un étudiant
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet étudiant ?')) {
      deleteStudent(id);
    }
  };
  
  // Gérer la suppression en masse
  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) {
      addNotification('Veuillez sélectionner au moins un étudiant', 'warning');
      return;
    }
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedStudents.length} étudiant(s) ?`)) {
      selectedStudents.forEach(id => deleteStudent(id));
      setSelectedStudents([]);
      setSelectAll(false);
      addNotification(`${selectedStudents.length} étudiant(s) supprimé(s) avec succès`, 'success');
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Liste des étudiants</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {selectedStudents.length > 0 && (
            <button 
              className="danger"
              onClick={handleBulkDelete}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <i className="fa-solid fa-trash"></i>
              Supprimer ({selectedStudents.length})
            </button>
          )}
          <ExportButtons type="students" data={filteredStudents} />
        </div>
      </div>
      
      {/* Filtres */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Recherche */}
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label htmlFor="search">Rechercher :</label>
            <input
              id="search"
              type="text"
              placeholder="Nom, matricule ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 0 }}
              className="slide-in"
            />
          </div>
          
          {/* Filtre par programme */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="program-filter">Programme :</label>
            <select
              id="program-filter"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{ marginBottom: 0 }}
              className="slide-in"
            >
              <option key="all-programs" value="">Tous les programmes</option>
              {uniquePrograms.map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
          
          {/* Filtre par niveau */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="level-filter">Niveau :</label>
            <select
              id="level-filter"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{ marginBottom: 0 }}
              className="slide-in"
            >
              <option key="all-levels" value="">Tous les niveaux</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Tableau des étudiants */}
      {filteredStudents.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr key="header-row">
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectAll}
                    onChange={handleSelectAll}
                    title={selectAll ? "Désélectionner tout" : "Sélectionner tout"}
                  />
                </th>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Email</th>
                <th>Programme</th>
                <th>Niveau</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </td>
                  <td>{student.matricule}</td>
                  <td>{student.lastName || student.nom}</td>
                  <td>{student.firstName || student.prenom}</td>
                  <td>{student.email}</td>
                  <td>{student.program}</td>
                  <td>{student.level}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="primary" 
                        style={{ padding: '8px', margin: 0 }}
                        onClick={() => navigate(`/student-details?id=${student.id}`)}
                        title="Voir détails"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                      <button 
                        className="secondary" 
                        style={{ padding: '8px', margin: 0 }}
                        onClick={() => navigate(`/edit-student?id=${student.id}`)}
                        title="Modifier"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        className="danger" 
                        style={{ padding: '8px', margin: 0 }}
                        onClick={() => handleDelete(student.id)}
                        title="Supprimer"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Aucun étudiant ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default StudentsListPage; 