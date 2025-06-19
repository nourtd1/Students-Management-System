import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudentContext } from '../contexts/StudentContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const Dashboard = () => {
  const { students, results, theme } = useStudentContext();
  const navigate = useNavigate();
  
  // État pour les statistiques et données de graphiques
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalResults: 0,
    averageScore: 0,
    passRate: 0,
    recentActivity: [],
    topPerformers: [],
    programStats: {},
    levelStats: {},
    scoreDistribution: {},
    monthlyRegistrations: {},
    performanceByProgram: {}
  });
  
  // État pour les filtres
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');
  
  // Calculer les statistiques
  useEffect(() => {
    // Statistiques de base
    const totalStudents = students.length;
    const totalResults = results.length;
    
    // Moyenne générale
    const totalScores = results.reduce((sum, result) => sum + parseFloat(result.score || 0), 0);
    const averageScore = totalResults > 0 ? (totalScores / totalResults).toFixed(2) : 0;
    
    // Taux de réussite (note >= 10)
    const passingResults = results.filter(result => parseFloat(result.score || 0) >= 10);
    const passRate = totalResults > 0 ? ((passingResults.length / totalResults) * 100).toFixed(1) : 0;
    
    // Répartition par programme
    const programStats = students.reduce((acc, student) => {
      const program = student.program || 'Non défini';
      acc[program] = (acc[program] || 0) + 1;
      return acc;
    }, {});
    
    // Répartition par niveau
    const levelStats = students.reduce((acc, student) => {
      const level = student.level || 'Non défini';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    // Distribution des notes
    const scoreDistribution = {
      'Excellent (16-20)': results.filter(r => parseFloat(r.score || 0) >= 16).length,
      'Très bien (14-16)': results.filter(r => parseFloat(r.score || 0) >= 14 && parseFloat(r.score || 0) < 16).length,
      'Bien (12-14)': results.filter(r => parseFloat(r.score || 0) >= 12 && parseFloat(r.score || 0) < 14).length,
      'Assez bien (10-12)': results.filter(r => parseFloat(r.score || 0) >= 10 && parseFloat(r.score || 0) < 12).length,
      'Passable (8-10)': results.filter(r => parseFloat(r.score || 0) >= 8 && parseFloat(r.score || 0) < 10).length,
      'Insuffisant (0-8)': results.filter(r => parseFloat(r.score || 0) < 8).length
    };
    
    // Inscriptions mensuelles (derniers 6 mois)
    const monthlyRegistrations = {};
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleDateString('fr-FR', { month: 'short' });
      monthlyRegistrations[monthName] = 0;
    }
    
    students.forEach(student => {
      if (student.createdAt) {
        const studentDate = new Date(student.createdAt);
        const monthName = studentDate.toLocaleDateString('fr-FR', { month: 'short' });
        if (monthlyRegistrations.hasOwnProperty(monthName)) {
          monthlyRegistrations[monthName]++;
        }
      }
    });
    
    // Performance par programme
    const performanceByProgram = {};
    Object.keys(programStats).forEach(program => {
      const programStudentIds = students
        .filter(s => s.program === program)
        .map(s => s.id);
      
      const programResults = results.filter(r => 
        programStudentIds.includes(r.studentId) || 
        programStudentIds.includes(parseInt(r.studentId))
      );
      
      const totalProgramScores = programResults.reduce((sum, result) => sum + parseFloat(result.score || 0), 0);
      performanceByProgram[program] = programResults.length > 0 
        ? (totalProgramScores / programResults.length).toFixed(2) 
        : 0;
    });
    
    // Meilleurs étudiants (top 5)
    const studentAverages = students.map(student => {
      const studentResults = results.filter(r => 
        r.studentId === student.id || 
        parseInt(r.studentId) === student.id
      );
      
      const totalStudentScores = studentResults.reduce((sum, result) => sum + parseFloat(result.score || 0), 0);
      const average = studentResults.length > 0 ? totalStudentScores / studentResults.length : 0;
      
      return {
        id: student.id,
        name: `${student.firstName || student.nom} ${student.lastName || student.prenom}`,
        average: average.toFixed(2),
        program: student.program || 'Non défini',
        resultsCount: studentResults.length
      };
    })
    .filter(student => student.resultsCount > 0)
    .sort((a, b) => b.average - a.average)
    .slice(0, 5);
    
    // Activité récente (derniers 5 résultats)
    const recentActivity = [...results]
      .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
      .slice(0, 5)
      .map(result => {
        const student = students.find(s => s.id === result.studentId || s.id === parseInt(result.studentId));
        return {
          id: result.id,
          studentName: student 
            ? `${student.firstName || student.nom} ${student.lastName || student.prenom}` 
            : 'Étudiant inconnu',
          subject: result.subject,
          score: result.score,
          date: result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Date inconnue'
        };
      });
    
    // Mettre à jour l'état
    setStats({
      totalStudents,
      totalResults,
      averageScore,
      passRate,
      recentActivity,
      topPerformers: studentAverages,
      programStats,
      levelStats,
      scoreDistribution,
      monthlyRegistrations,
      performanceByProgram
    });
    
  }, [students, results, selectedTimeframe, selectedProgram]);
  
  // Données pour le graphique en camembert (répartition par programme)
  const programChartData = {
    labels: Object.keys(stats.programStats),
    datasets: [
      {
        data: Object.values(stats.programStats),
        backgroundColor: [
          '#4361ee',
          '#4895ef',
          '#4cc9f0',
          '#34d399',
          '#fbbf24',
          '#f87171',
          '#a78bfa',
          '#ec4899',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Données pour le graphique en barres (répartition des notes)
  const scoreDistributionData = {
    labels: Object.keys(stats.scoreDistribution),
    datasets: [
      {
        label: 'Nombre d\'étudiants',
        data: Object.values(stats.scoreDistribution),
        backgroundColor: 'rgba(67, 97, 238, 0.6)',
        borderColor: 'rgba(67, 97, 238, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // Données pour le graphique en ligne (inscriptions mensuelles)
  const registrationsChartData = {
    labels: Object.keys(stats.monthlyRegistrations),
    datasets: [
      {
        label: 'Nouvelles inscriptions',
        data: Object.values(stats.monthlyRegistrations),
        fill: false,
        borderColor: 'rgba(76, 201, 240, 1)',
        backgroundColor: 'rgba(76, 201, 240, 0.2)',
        tension: 0.3,
        pointBackgroundColor: 'rgba(76, 201, 240, 1)',
        pointRadius: 4,
      },
    ],
  };
  
  // Données pour le graphique en barres (performance par programme)
  const performanceChartData = {
    labels: Object.keys(stats.performanceByProgram),
    datasets: [
      {
        label: 'Moyenne par programme',
        data: Object.values(stats.performanceByProgram),
        backgroundColor: 'rgba(52, 211, 153, 0.6)',
        borderColor: 'rgba(52, 211, 153, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Cartes d'action rapide
  const quickActionCards = [
    { 
      title: 'Inscrire un étudiant', 
      icon: 'fa-solid fa-user-plus', 
      color: 'var(--primary)',
      action: () => navigate('/register')
    },
    { 
      title: 'Rechercher un étudiant', 
      icon: 'fa-solid fa-magnifying-glass', 
      color: 'var(--secondary)',
      action: () => navigate('/search') 
    },
    { 
      title: 'Ajouter un résultat', 
      icon: 'fa-solid fa-chart-simple', 
      color: 'var(--success)',
      action: () => navigate('/add-result') 
    },
    { 
      title: 'Voir tous les étudiants', 
      icon: 'fa-solid fa-users', 
      color: 'var(--warning)',
      action: () => navigate('/students') 
    }
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 1200, margin: '2rem auto', padding: '0 1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Tableau de bord analytique</h2>
      
      {/* Filtres */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="timeframe-filter">Période :</label>
            <select
              id="timeframe-filter"
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="all">Toutes les périodes</option>
              <option value="month">Dernier mois</option>
              <option value="quarter">Dernier trimestre</option>
              <option value="year">Dernière année</option>
            </select>
          </div>
          
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label htmlFor="program-filter">Programme :</label>
            <select
              id="program-filter"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{ marginBottom: 0 }}
            >
              <option value="all">Tous les programmes</option>
              {Object.keys(stats.programStats).map(program => (
                <option key={program} value={program}>{program}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Statistiques globales */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <i className="fa-solid fa-users" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>{stats.totalStudents}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Étudiants inscrits</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <i className="fa-solid fa-list-check" style={{ fontSize: '2.5rem', color: 'var(--success)', marginBottom: '1rem' }}></i>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>{stats.totalResults}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Résultats enregistrés</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <i className="fa-solid fa-chart-line" style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}></i>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>{stats.averageScore}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Moyenne générale</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <i className="fa-solid fa-award" style={{ fontSize: '2.5rem', color: 'var(--warning)', marginBottom: '1rem' }}></i>
          <h3 style={{ margin: '0.5rem 0', fontSize: '2rem' }}>{stats.passRate}%</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Taux de réussite</p>
        </div>
      </div>
      
      {/* Graphiques */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Analyse des données</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          {/* Répartition par programme */}
          <div className="card" style={{ flex: 1, minWidth: '300px', padding: '1.5rem' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Répartition par programme</h4>
            <div style={{ height: '250px', position: 'relative' }}>
              <Pie 
                data={programChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: theme === 'dark' ? '#f3f4f6' : '#343a40'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
          
          {/* Distribution des notes */}
          <div className="card" style={{ flex: 1, minWidth: '300px', padding: '1.5rem' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Distribution des notes</h4>
            <div style={{ height: '250px', position: 'relative' }}>
              <Bar 
                data={scoreDistributionData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
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
                }} 
              />
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
          {/* Inscriptions mensuelles */}
          <div className="card" style={{ flex: 1, minWidth: '300px', padding: '1.5rem' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Inscriptions mensuelles</h4>
            <div style={{ height: '250px', position: 'relative' }}>
              <Line 
                data={registrationsChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
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
                }} 
              />
            </div>
          </div>
          
          {/* Performance par programme */}
          <div className="card" style={{ flex: 1, minWidth: '300px', padding: '1.5rem' }}>
            <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>Performance par programme</h4>
            <div style={{ height: '250px', position: 'relative' }}>
              <Bar 
                data={performanceChartData} 
                options={{ 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
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
                }} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Meilleurs étudiants */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Top 5 des étudiants</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Programme</th>
                <th>Moyenne</th>
                <th>Nb. résultats</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPerformers.length > 0 ? (
                stats.topPerformers.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.program}</td>
                    <td style={{ 
                      fontWeight: 'bold', 
                      color: parseFloat(student.average) >= 10 ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {student.average}/20
                    </td>
                    <td>{student.resultsCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Aucun résultat disponible</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Activité récente */}
      <div style={{ marginTop: '2.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Activité récente</h3>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Matière</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.studentName}</td>
                    <td>{activity.subject}</td>
                    <td style={{ 
                      fontWeight: 'bold', 
                      color: parseFloat(activity.score) >= 10 ? 'var(--success)' : 'var(--danger)'
                    }}>
                      {activity.score}/20
                    </td>
                    <td>{activity.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>Aucune activité récente</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Actions rapides */}
      <h3 style={{ margin: '2.5rem 0 1.5rem', textAlign: 'center' }}>Actions rapides</h3>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
        {quickActionCards.map((card, index) => (
          <div 
            key={index} 
            className="card" 
            style={{ 
              cursor: 'pointer', 
              padding: '1.5rem', 
              textAlign: 'center',
              transition: 'all 0.3s ease'
            }}
            onClick={card.action}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
          >
            <i className={card.icon} style={{ fontSize: '2rem', color: card.color, marginBottom: '1rem' }}></i>
            <h4 style={{ margin: '0.5rem 0' }}>{card.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 
