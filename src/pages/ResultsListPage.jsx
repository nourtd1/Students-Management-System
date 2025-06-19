import React, { useState, useEffect } from 'react';
import { useStudentContext } from '../contexts/StudentContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import ExportButtons from '../components/ExportButtons';

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ResultsListPage = () => {
  const { students, results } = useStudentContext();
  
  // État pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedMinGrade, setSelectedMinGrade] = useState('');
  const [sortBy, setSortBy] = useState('studentName');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Liste des matières uniques
  const [subjects, setSubjects] = useState([]);
  
  // Calculer les notes moyennes par matière
  const [averagesBySubject, setAveragesBySubject] = useState({});
  
  // État pour les résultats combinés (avec informations sur les étudiants)
  const [combinedResults, setCombinedResults] = useState([]);
  
  // Calculer les données pour le graphique
  useEffect(() => {
    // Obtenir la liste des matières uniques
    const uniqueSubjects = [...new Set(results.map(r => r.subject))];
    setSubjects(uniqueSubjects);
    
    // Calculer les moyennes par matière
    const averages = {};
    uniqueSubjects.forEach(subject => {
      const subjectResults = results.filter(r => r.subject === subject);
      const sum = subjectResults.reduce((total, result) => total + parseFloat(result.score), 0);
      averages[subject] = subjectResults.length > 0 ? (sum / subjectResults.length).toFixed(2) : 0;
    });
    setAveragesBySubject(averages);
    
    // Combiner les résultats avec les informations des étudiants
    const combined = results.map(result => {
      const student = students.find(s => s.id === result.studentId || s.id === parseInt(result.studentId));
      return {
        ...result,
        studentName: student ? `${student.firstName || student.nom} ${student.lastName || student.prenom}` : 'Étudiant inconnu',
        program: student ? student.program : 'Non défini',
        level: student ? student.level : 'Non défini'
      };
    });
    setCombinedResults(combined);
  }, [results, students]);
  
  // Filtrer et trier les résultats
  const filteredResults = combinedResults.filter(result => {
    // Filtre de recherche
    const matchesSearch = result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          result.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filtre par matière
    const matchesSubject = selectedSubject ? result.subject === selectedSubject : true;
    
    // Filtre par note minimale
    const matchesGrade = selectedMinGrade ? parseFloat(result.score) >= parseFloat(selectedMinGrade) : true;
    
    return matchesSearch && matchesSubject && matchesGrade;
  }).sort((a, b) => {
    // Tri des résultats
    if (sortBy === 'studentName') {
      return sortOrder === 'asc' 
        ? a.studentName.localeCompare(b.studentName)
        : b.studentName.localeCompare(a.studentName);
    } else if (sortBy === 'subject') {
      return sortOrder === 'asc'
        ? a.subject.localeCompare(b.subject)
        : b.subject.localeCompare(a.subject);
    } else if (sortBy === 'score') {
      return sortOrder === 'asc'
        ? parseFloat(a.score) - parseFloat(b.score)
        : parseFloat(b.score) - parseFloat(a.score);
    }
    return 0;
  });
  
  // Données pour le graphique en camembert (répartition des notes)
  const pieData = {
    labels: ['Excellent (≥ 16)', 'Très bien (≥ 14)', 'Bien (≥ 12)', 'Assez bien (≥ 10)', 'Passable (≥ 8)', 'Insuffisant (< 8)'],
    datasets: [
      {
        label: 'Répartition des notes',
        data: [
          results.filter(r => parseFloat(r.score) >= 16).length,
          results.filter(r => parseFloat(r.score) >= 14 && parseFloat(r.score) < 16).length,
          results.filter(r => parseFloat(r.score) >= 12 && parseFloat(r.score) < 14).length,
          results.filter(r => parseFloat(r.score) >= 10 && parseFloat(r.score) < 12).length,
          results.filter(r => parseFloat(r.score) >= 8 && parseFloat(r.score) < 10).length,
          results.filter(r => parseFloat(r.score) < 8).length,
        ],
        backgroundColor: [
          '#4361ee',
          '#4895ef',
          '#4cc9f0',
          '#34d399',
          '#fbbf24',
          '#f87171',
        ],
      },
    ],
  };
  
  // Données pour le graphique en barres (moyennes par matière)
  const barData = {
    labels: Object.keys(averagesBySubject),
    datasets: [
      {
        label: 'Moyenne par matière',
        data: Object.values(averagesBySubject),
        backgroundColor: 'rgba(67, 97, 238, 0.6)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Liste des résultats</h2>
        <ExportButtons type="results" data={filteredResults} students={students} />
      </div>
      
      {/* Graphiques */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
        <div className="card" style={{ flex: 1, minWidth: '300px', padding: '1.5rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Répartition des notes</h3>
          <div style={{ height: '250px', position: 'relative' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="card" style={{ flex: 1, minWidth: '300px', padding: '1.5rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Moyennes par matière</h3>
          <div style={{ height: '250px', position: 'relative' }}>
            <Bar 
              data={barData} 
              options={{ 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 20
                  }
                } 
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Filtres et options de tri */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          {/* Recherche */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="search">Rechercher :</label>
            <input
              id="search"
              type="text"
              placeholder="Nom ou matière..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          
          {/* Filtre par matière */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="subject-filter">Matière :</label>
            <select
              id="subject-filter"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="">Toutes les matières</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          {/* Filtre par note minimale */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="grade-filter">Note minimale :</label>
            <select
              id="grade-filter"
              value={selectedMinGrade}
              onChange={(e) => setSelectedMinGrade(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="">Toutes les notes</option>
              <option value="16">Excellent (≥ 16)</option>
              <option value="14">Très bien (≥ 14)</option>
              <option value="12">Bien (≥ 12)</option>
              <option value="10">Assez bien (≥ 10)</option>
              <option value="8">Passable (≥ 8)</option>
              <option value="0">Insuffisant (&lt; 8)</option>
            </select>
          </div>
          
          {/* Options de tri */}
          <div style={{ flex: 1, minWidth: '200px', display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 2 }}>
              <label htmlFor="sort-by">Trier par :</label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ marginBottom: 0 }}
              >
                <option value="studentName">Étudiant</option>
                <option value="subject">Matière</option>
                <option value="score">Note</option>
              </select>
            </div>
            
            <div style={{ flex: 1 }}>
              <label htmlFor="sort-order">Ordre :</label>
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ marginBottom: 0 }}
              >
                <option value="asc">↑ Croissant</option>
                <option value="desc">↓ Décroissant</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tableau des résultats */}
      {filteredResults.length > 0 ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Matière</th>
                <th>Note</th>
                <th>Programme</th>
                <th>Niveau</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.studentName}</td>
                  <td>{result.subject}</td>
                  <td style={{ 
                    fontWeight: 'bold', 
                    color: parseFloat(result.score) >= 10 ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {result.score}/20
                  </td>
                  <td>{result.program}</td>
                  <td>{result.level}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Aucun résultat ne correspond à vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
};

export default ResultsListPage; 