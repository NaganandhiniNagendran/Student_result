import { useState } from 'react';

const UsersManagement = ({
  selectedCollege,
  selectedDepartment,
  selectedYear,
  setColleges,
  colleges,
  setSuccessMessage
}) => {
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    password: '',
    role: 'student'
  });

  // Determine if we're managing college-level or department-level users
  const isDepartmentLevel = selectedDepartment && selectedYear;
  const currentUsers = isDepartmentLevel
    ? selectedDepartment[selectedYear]?.users || []
    : selectedCollege?.users || [];

  const handleUserSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      id: editingUser ? editingUser.id : Date.now(),
      username: userFormData.username,
      role: userFormData.role,
      status: 'active',
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0]
    };

    if (isDepartmentLevel) {
      // Update department-level user
      const updatedDepartment = {
        ...selectedDepartment,
        [selectedYear]: {
          ...selectedDepartment[selectedYear],
          users: editingUser
            ? selectedDepartment[selectedYear].users.map(u => u.id === editingUser.id ? newUser : u)
            : [...selectedDepartment[selectedYear].users, newUser]
        }
      };

      const updatedCollege = {
        ...selectedCollege,
        departments: selectedCollege.departments.map(d =>
          d.id === selectedDepartment.id ? updatedDepartment : d
        )
      };

      setColleges(colleges.map(c => c.id === selectedCollege.id ? updatedCollege : c));
    } else {
      // Update college-level user
      const updatedCollege = {
        ...selectedCollege,
        users: editingUser
          ? selectedCollege.users.map(u => u.id === editingUser.id ? newUser : u)
          : [...selectedCollege.users, newUser]
      };

      setColleges(colleges.map(c => c.id === selectedCollege.id ? updatedCollege : c));
    }

    setSuccessMessage(editingUser ? 'User updated successfully!' : 'User created successfully!');
    setEditingUser(null);
    setUserFormData({ username: '', password: '', role: 'student' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      password: '',
      role: user.role
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      if (isDepartmentLevel) {
        const updatedDepartment = {
          ...selectedDepartment,
          [selectedYear]: {
            ...selectedDepartment[selectedYear],
            users: selectedDepartment[selectedYear].users.filter(u => u.id !== userId)
          }
        };

        const updatedCollege = {
          ...selectedCollege,
          departments: selectedCollege.departments.map(d =>
            d.id === selectedDepartment.id ? updatedDepartment : d
          )
        };

        setColleges(colleges.map(c => c.id === selectedCollege.id ? updatedCollege : c));
      } else {
        const updatedCollege = {
          ...selectedCollege,
          users: selectedCollege.users.filter(u => u.id !== userId)
        };
        setColleges(colleges.map(c => c.id === selectedCollege.id ? updatedCollege : c));
      }

      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const toggleUserStatus = (userId) => {
    if (isDepartmentLevel) {
      const updatedDepartment = {
        ...selectedDepartment,
        [selectedYear]: {
          ...selectedDepartment[selectedYear],
          users: selectedDepartment[selectedYear].users.map(u =>
            u.id === userId
              ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
              : u
          )
        }
      };

      const updatedCollege = {
        ...selectedCollege,
        departments: selectedCollege.departments.map(d =>
          d.id === selectedDepartment.id ? updatedDepartment : d
        )
      };

      setColleges(colleges.map(c => c.id === selectedCollege.id ? updatedCollege : c));
    } else {
      const updatedCollege = {
        ...selectedCollege,
        users: selectedCollege.users.map(u =>
          u.id === userId
            ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
            : u
        )
      };
      setColleges(colleges.map(c => c.id === selectedCollege.id ? updatedCollege : c));
    }

    setSuccessMessage('User status updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-4">
      {/* User Form */}
      <div className="card">
        <div className="card-body">
          <h2 className="h5 mb-4">
            {editingUser ? 'Edit User' : 'Add New User'}
          </h2>

          <form onSubmit={handleUserSubmit} className="space-y-3">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={userFormData.username}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  id="role"
                  value={userFormData.role}
                  onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                  className="form-select"
                  required
                >
                  {isDepartmentLevel ? (
                    <>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </>
                  ) : (
                    <option value="admin">Admin</option>
                  )}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={userFormData.password}
                onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                className="form-control"
                required={!editingUser}
                placeholder={editingUser ? 'Leave blank to keep current password' : ''}
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingUser ? 'Update User' : 'Add User'}
              </button>
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setUserFormData({ username: '', password: '', role: 'student' });
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="h5 mb-0">
            All Users {isDepartmentLevel && `(${selectedDepartment.name} - Year ${selectedYear === 'year1' ? '1' : '2'})`}
          </h2>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td className="fw-medium">{user.username}</td>
                  <td>
                    <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'teacher' ? 'bg-info' : 'bg-success'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.createdAt}</td>
                  <td>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-sm btn-outline-danger me-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'} me-2`}
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
