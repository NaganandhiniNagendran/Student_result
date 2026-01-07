import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CollegesList from './CollegesList';
import UsersManagement from './UsersManagement';
import DepartmentsManagement from './DepartmentsManagement';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('colleges-list');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedYear, setSelectedYear] = useState('year1');

  useEffect(() => {
    // Mock data - in real app, this would be API calls
    setTimeout(() => {
      const mockColleges = [
        {
          id: 1,
          name: 'Engineering College',
          code: 'ENG',
          description: 'College of Engineering and Technology',
          location: 'Main Campus',
          domain: 'engineering.edu',
          users: [
            { id: 1, username: 'eng_student', role: 'student', status: 'active', createdAt: '2024-01-01' },
            { id: 2, username: 'eng_teacher', role: 'teacher', status: 'active', createdAt: '2024-01-02' },
          ],
          subjects: [
            { id: 1, name: 'Mathematics', code: 'MATH101', description: 'Basic mathematics course' },
            { id: 2, name: 'Physics', code: 'PHYS101', description: 'Introduction to physics' },
          ],
          departments: [
            { 
              id: 1, 
              name: 'Computer Science', 
              code: 'CS', 
              description: 'Department of Computer Science',
              year1: {
                users: [
                  { id: 101, username: 'cs_year1_student1', role: 'student', status: 'active', createdAt: '2024-01-01' },
                  { id: 102, username: 'cs_year1_student2', role: 'student', status: 'active', createdAt: '2024-01-02' },
                  { id: 103, username: 'cs_year1_teacher', role: 'teacher', status: 'active', createdAt: '2024-01-03' }
                ],
                subjects: [
                  { id: 201, name: 'Programming Fundamentals', code: 'CS101', description: 'Introduction to programming' },
                  { id: 202, name: 'Data Structures', code: 'CS102', description: 'Basic data structures' }
                ]
              },
              year2: {
                users: [
                  { id: 104, username: 'cs_year2_student1', role: 'student', status: 'active', createdAt: '2024-01-04' },
                  { id: 105, username: 'cs_year2_teacher', role: 'teacher', status: 'active', createdAt: '2024-01-05' }
                ],
                subjects: [
                  { id: 203, name: 'Algorithms', code: 'CS201', description: 'Algorithm design and analysis' },
                  { id: 204, name: 'Database Systems', code: 'CS202', description: 'Database design and management' }
                ]
              }
            },
            { 
              id: 2, 
              name: 'Electrical Engineering', 
              code: 'EE', 
              description: 'Department of Electrical Engineering',
              year1: {
                users: [
                  { id: 106, username: 'ee_year1_student1', role: 'student', status: 'active', createdAt: '2024-01-06' },
                  { id: 107, username: 'ee_year1_teacher', role: 'teacher', status: 'active', createdAt: '2024-01-07' }
                ],
                subjects: [
                  { id: 205, name: 'Circuit Analysis', code: 'EE101', description: 'Basic circuit theory' },
                  { id: 206, name: 'Electronics', code: 'EE102', description: 'Electronic devices and circuits' }
                ]
              },
              year2: {
                users: [
                  { id: 108, username: 'ee_year2_student1', role: 'student', status: 'active', createdAt: '2024-01-08' }
                ],
                subjects: [
                  { id: 207, name: 'Power Systems', code: 'EE201', description: 'Electrical power systems' }
                ]
              }
            },
          ]
        },
        {
          id: 2,
          name: 'Business College',
          code: 'BUS',
          description: 'College of Business and Management',
          location: 'Downtown Campus',
          domain: 'business.edu',
          users: [
            { id: 3, username: 'bus_admin', role: 'admin', status: 'active', createdAt: '2024-01-03' },
            { id: 4, username: 'bus_student', role: 'student', status: 'active', createdAt: '2024-01-10' },
          ],
          subjects: [
            { id: 3, name: 'Business Ethics', code: 'BUS101', description: 'Introduction to business ethics' },
            { id: 4, name: 'Marketing', code: 'MKT101', description: 'Principles of marketing' },
          ],
          departments: [
            { 
              id: 3, 
              name: 'Business Administration', 
              code: 'BA', 
              description: 'Department of Business Administration',
              year1: {
                users: [
                  { id: 301, username: 'ba_year1_student1', role: 'student', status: 'active', createdAt: '2024-01-01' },
                  { id: 302, username: 'ba_year1_teacher', role: 'teacher', status: 'active', createdAt: '2024-01-02' }
                ],
                subjects: [
                  { id: 301, name: 'Business Fundamentals', code: 'BA101', description: 'Introduction to business' },
                  { id: 302, name: 'Accounting', code: 'BA102', description: 'Basic accounting principles' }
                ]
              },
              year2: {
                users: [
                  { id: 303, username: 'ba_year2_student1', role: 'student', status: 'active', createdAt: '2024-01-03' }
                ],
                subjects: [
                  { id: 303, name: 'Marketing', code: 'BA201', description: 'Marketing strategies' }
                ]
              }
            },
          ]
        },
        {
          id: 3,
          name: 'Arts and Sciences College',
          code: 'ASC',
          description: 'College of Arts and Sciences',
          location: 'North Campus',
          domain: 'arts.edu',
          users: [
            { id: 5, username: 'arts_teacher', role: 'teacher', status: 'inactive', createdAt: '2024-01-15' },
          ],
          subjects: [
            { id: 5, name: 'English', code: 'ENG101', description: 'English language and literature' },
            { id: 6, name: 'History', code: 'HIST101', description: 'World history' },
          ],
          departments: [
            { id: 4, name: 'English Literature', code: 'EL', description: 'Department of English Literature' },
            { id: 5, name: 'History', code: 'HIST', description: 'Department of History' },
          ]
        },
      ];

      setColleges(mockColleges);
      setLoading(false);
    }, 1000);
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
        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

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
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
          />
        )}

        {/* Users Management */}
        {activeTab === 'colleges-users' && (
          <UsersManagement
            selectedCollege={selectedCollege}
            setColleges={setColleges}
            colleges={colleges}
            setSuccessMessage={setSuccessMessage}
          />
        )}

        {/* Subjects Management */}
        {activeTab === 'colleges-subjects' && (
          <SubjectsManagement
            selectedCollege={selectedCollege}
            setColleges={setColleges}
            colleges={colleges}
            setSuccessMessage={setSuccessMessage}
          />
        )}

        {/* Departments Management */}
        {activeTab === 'colleges-departments' && (
          <DepartmentsManagement
            selectedCollege={selectedCollege}
            setColleges={setColleges}
            colleges={colleges}
            setSuccessMessage={setSuccessMessage}
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
            setSuccessMessage={setSuccessMessage}
          />
        )}


      </main>
    </div>
  );
};

export default AdminDashboard;
