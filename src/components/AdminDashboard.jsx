import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import CollegesList from './CollegesList';
import UsersManagement from './UsersManagement';
import DepartmentsManagement from './DepartmentsManagement';
import ResultsManagement from './ResultsManagement';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('colleges-list');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [colleges, setColleges] = useState([]);
  const loading = false;

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedYear, setSelectedYear] = useState('year1');

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const collegesCollection = collection(db, 'colleges');
        const collegesSnapshot = await getDocs(collegesCollection);
        const collegesData = collegesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setColleges(collegesData);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []);

  if (loading) {
    return (
      <div className="min-vh-100 bg-white d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-bottom">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center py-3">
            <h1 className="h5 mb-0">Admin Dashboard</h1>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">Welcome, {user.username}</span>
              <button
                onClick={onLogout}
                className="btn btn-danger btn-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-4">
        {/* Navigation Tabs */}
        <div className="mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                onClick={() => {
                  setActiveTab('colleges-list');
                  setSelectedCollege(null);
                }}
                className={`nav-link ${activeTab === 'colleges-list' || activeTab.startsWith('colleges-') ? 'active' : ''}`}
              >
                Colleges
              </button>
            </li>
            {user.collegeId && (
              <li className="nav-item">
                <button
                  onClick={() => setActiveTab('results')}
                  className={`nav-link ${activeTab === 'results' ? 'active' : ''}`}
                >
                  Results
                </button>
              </li>
            )}
          </ul>
          {selectedCollege && (
            <div className="mt-3">
              <h5 className="text-muted mb-3">Managing: {selectedCollege.name}</h5>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab('colleges-users')}
                    className={`nav-link ${activeTab === 'colleges-users' ? 'active' : ''}`}
                  >
                    User Management
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab('colleges-departments')}
                    className={`nav-link ${activeTab === 'colleges-departments' ? 'active' : ''}`}
                  >
                    Department Management
                  </button>
                </li>
                {(user.role === 'admin' || user.role === 'head') && (
                  <li className="nav-item">
                    <button
                      onClick={() => setActiveTab('colleges-results')}
                      className={`nav-link ${activeTab === 'colleges-results' ? 'active' : ''}`}
                    >
                      Results
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
          {selectedDepartment && (
            <div className="mt-3">
              <h5 className="text-muted mb-3">Managing: {selectedDepartment.name} ({selectedCollege.name})</h5>
              <div className="d-flex gap-2 mb-3">
                <button
                  onClick={() => {
                    setSelectedYear('year1');
                    setActiveTab('departments-year1-users');
                  }}
                  className={`btn btn-sm ${selectedYear === 'year1' ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  Year 1
                </button>
                <button
                  onClick={() => {
                    setSelectedYear('year2');
                    setActiveTab('departments-year2-users');
                  }}
                  className={`btn btn-sm ${selectedYear === 'year2' ? 'btn-primary' : 'btn-outline-primary'}`}
                >
                  Year 2
                </button>
              </div>
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab(`departments-${selectedYear}-users`)}
                    className={`nav-link ${activeTab === `departments-${selectedYear}-users` ? 'active' : ''}`}
                  >
                    User Management
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Colleges List */}
        {activeTab === 'colleges-list' && (
          <CollegesList
            colleges={colleges}
            setColleges={setColleges}
            setSelectedCollege={setSelectedCollege}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Users Management */}
        {activeTab === 'colleges-users' && (
          <UsersManagement
            selectedCollege={selectedCollege}
            setColleges={setColleges}
            colleges={colleges}
            setSelectedCollege={setSelectedCollege}
          />
        )}

        {/* Subjects Management */}
        {activeTab === 'colleges-subjects' && (
          <SubjectsManagement
            selectedCollege={selectedCollege}
            setColleges={setColleges}
            colleges={colleges}
          />
        )}

        {/* Departments Management */}
        {activeTab === 'colleges-departments' && (
          <DepartmentsManagement
            selectedCollege={selectedCollege}
            setColleges={setColleges}
            colleges={colleges}
            setSelectedCollege={setSelectedCollege}
            setSelectedDepartment={setSelectedDepartment}
            setSelectedYear={setSelectedYear}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Department Users Management */}
        {(activeTab === 'departments-year1-users' || activeTab === 'departments-year2-users') && (
          <UsersManagement
            selectedCollege={selectedCollege}
            selectedDepartment={selectedDepartment}
            selectedYear={selectedYear}
            setColleges={setColleges}
            colleges={colleges}
            setSelectedCollege={setSelectedCollege}
            setSelectedDepartment={setSelectedDepartment}
          />
        )}

        {/* Results Management */}
        {activeTab === 'colleges-results' && (
          <ResultsManagement
            selectedCollege={selectedCollege}
            user={user}
          />
        )}

        {/* College-Level Admin Results Management */}
        {activeTab === 'results' && (
          <ResultsManagement
            selectedCollege={colleges.find(college => college.id === user.collegeId)}
            user={user}
          />
        )}


      </main>
    </div>
  );
};

export default AdminDashboard;
