import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudentContext } from '../contexts/StudentContext';
import PrintableReport from '../components/PrintableReport';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const StudentDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, results, deleteStudent, theme } = useStudentContext();
  
  // État pour le rapport imprimable
  const [showReport, setShowReport] = useState(false);
  
  // Récupérer l'ID de l'étudiant depuis l'URL
  const studentId = parseInt(new URLSearchParams(location.search).get('id'));
  
  // Récupérer les données de l'étudiant
  const student = students.find(s => s.id === studentId);
  
  // Récupérer les résultats de l'étudiant
  const studentResults = results.filter(r => 
    r.studentId === studentId || parseInt(r.studentId) === studentId
  );
  
  // Rediriger si l'étudiant n'existe pas
  useEffect(() => {
    if (!student) {
      navigate('/students');
    }
  }, [student, navigate]);
  
  // Calculer la moyenne générale
  const calculateAverage = () => {
    if (studentResults.length === 0) return 0;
    const sum = studentResults.reduce((acc, result) => acc + parseFloat(result.score || 0), 0);
    return (sum / studentResults.length).toFixed(2);
  };
  
  // Formater une date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Gérer la suppression de l'étudiant
  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${student.firstName || student.nom} ${student.lastName || student.prenom} ?`)) {
      deleteStudent(studentId);
      navigate('/students');
    }
  };
  
  // Données pour le graphique des résultats
  const chartData = {
    labels: studentResults.map(r => r.subject),
    datasets: [
      {
        label: 'Notes',
        data: studentResults.map(r => r.score),
        backgroundColor: 'rgba(67, 97, 238, 0.6)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        ticks: {
          color: theme === 'dark' ? '#d1d5db' : '#6c757d'
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: theme === 'dark' ? '#d1d5db' : '#6c757d'
        },
        grid: {
          color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };
  
  // Si l'étudiant n'existe pas, afficher un message de chargement
  if (!student) {
    return (
      <div className="fade-in" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Chargement des informations de l'étudiant...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Détails de l'étudiant</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className="primary"
            onClick={() => setShowReport(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-print"></i>
            Imprimer rapport
          </button>
          <button 
            className="secondary"
            onClick={() => navigate(`/edit-student?id=${studentId}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            Modifier
          </button>
          <button 
            className="danger"
            onClick={handleDelete}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fa-solid fa-trash"></i>
            Supprimer
          </button>
        </div>
      </div>
      
      {/* Informations personnelles */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Informations personnelles</h3>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div>
            <p><strong>Matricule:</strong> {student.matricule}</p>
            <p><strong>Nom:</strong> {student.lastName || student.nom}</p>
            <p><strong>Prénom:</strong> {student.firstName || student.prenom}</p>
            <p><strong>Date de naissance:</strong> {formatDate(student.dob)}</p>
          </div>
          <div>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Programme:</strong> {student.program || 'Non spécifié'}</p>
            <p><strong>Niveau:</strong> {student.level || 'Non spécifié'}</p>
            <p><strong>Date d'inscription:</strong> {formatDate(student.createdAt)}</p>
          </div>
        </div>
      </div>
      
      {/* Résultats académiques */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Résultats académiques</h3>
        
        {studentResults.length > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                padding: '1rem 2rem', 
                borderRadius: '8px', 
                backgroundColor: parseFloat(calculateAverage()) >= 10 ? 'var(--success)' : 'var(--danger)',
                color: 'white',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>Moyenne générale</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: 'bold' }}>{calculateAverage()}/20</p>
              </div>
            </div>
            
            <div style={{ height: '300px', marginBottom: '2rem' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Matière</th>
                  <th>Note</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {studentResults.map((result) => (
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
          </>
        ) : (
          <p style={{ textAlign: 'center' }}>Aucun résultat disponible pour cet étudiant.</p>
        )}
      </div>
      
      {/* Bouton de retour */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button 
          className="secondary"
          onClick={() => navigate('/students')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="fa-solid fa-arrow-left"></i>
          Retour à la liste des étudiants
        </button>
      </div>
      
      {/* Rapport imprimable */}
      {showReport && (
        <PrintableReport 
          student={student} 
          results={studentResults} 
          onClose={() => setShowReport(false)} 
        />
      )}
    </div>
  );
};

export default StudentDetailsPage;