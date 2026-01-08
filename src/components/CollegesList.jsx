import { useState } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

const CollegesList = ({ colleges, setColleges, setSelectedCollege, setActiveTab }) => {
  const [editingCollege, setEditingCollege] = useState(null);
  const [collegeFormData, setCollegeFormData] = useState({
    name: '',
    code: '',
    description: '',
    location: '',
    domain: ''
  });

  const handleCollegeSubmit = async (e) => {
    e.preventDefault();

    try {
      const collegeData = {
        name: collegeFormData.name,
        code: collegeFormData.code,
        description: collegeFormData.description,
        location: collegeFormData.location,
        domain: collegeFormData.domain,
        users: editingCollege ? editingCollege.users : [],
        subjects: editingCollege ? editingCollege.subjects : [],
        departments: editingCollege ? editingCollege.departments : []
      };

      if (editingCollege) {
        // Update existing college in Firebase
        const collegeRef = doc(db, 'colleges', editingCollege.id);
        await updateDoc(collegeRef, collegeData);

        // Update local state
        setColleges(colleges.map(c => c.id === editingCollege.id ? { ...collegeData, id: editingCollege.id } : c));
        setEditingCollege(null);
      } else {
        // Add new college to Firebase
        const docRef = await addDoc(collection(db, 'colleges'), collegeData);

        // Update local state with the new document ID
        const newCollege = { ...collegeData, id: docRef.id };
        setColleges([...colleges, newCollege]);
      }

      setCollegeFormData({ name: '', code: '', description: '', location: '', domain: '' });
    } catch (error) {
      console.error('Error saving college:', error);
      alert('Error saving college. Please try again.');
    }
  };

  const handleEditCollege = (college) => {
    setEditingCollege(college);
    setCollegeFormData({
      name: college.name,
      code: college.code,
      description: college.description,
      location: college.location,
      domain: college.domain || ''
    });
    setActiveTab('colleges-list');
  };

  const handleDeleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        // Delete from Firebase
        const collegeRef = doc(db, 'colleges', collegeId);
        await deleteDoc(collegeRef);

        // Update local state
        setColleges(colleges.filter(c => c.id !== collegeId));
      } catch (error) {
        console.error('Error deleting college:', error);
        alert('Error deleting college. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* College Form */}
      <div className="card">
        <div className="card-body">
          <h2 className="h5 mb-4">
            {editingCollege ? 'Edit College' : 'Add New College'}
          </h2>

          <form onSubmit={handleCollegeSubmit} className="space-y-3">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="collegeName" className="form-label">
                  College Name
                </label>
                <input
                  id="collegeName"
                  type="text"
                  value={collegeFormData.name}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="collegeCode" className="form-label">
                  College Code
                </label>
                <input
                  id="collegeCode"
                  type="text"
                  value={collegeFormData.code}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, code: e.target.value })}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="collegeLocation" className="form-label">
                  Location
                </label>
                <input
                  id="collegeLocation"
                  type="text"
                  value={collegeFormData.location}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, location: e.target.value })}
                  className="form-control"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="collegeDomain" className="form-label">
                  Domain
                </label>
                <input
                  id="collegeDomain"
                  type="text"
                  value={collegeFormData.domain}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, domain: e.target.value })}
                  className="form-control"
                  placeholder="e.g., engineering.edu, business.edu"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="collegeDescription" className="form-label">
                Description
              </label>
              <textarea
                id="collegeDescription"
                value={collegeFormData.description}
                onChange={(e) => setCollegeFormData({ ...collegeFormData, description: e.target.value })}
                rows={3}
                className="form-control"
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
              >
                {editingCollege ? 'Update College' : 'Add College'}
              </button>
              {editingCollege && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingCollege(null);
                    setCollegeFormData({ name: '', code: '', description: '', location: '', domain: '' });
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

      {/* Colleges Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="h5 mb-0">All Colleges</h2>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>College Name</th>
                <th>Code</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((college) => (
                <tr key={college.id}>
                  <td className="fw-medium">{college.name}</td>
                  <td>{college.code}</td>
                  <td>{college.location}</td>
                  <td>{college.description}</td>
                  <td>
                    <button
                      onClick={() => handleEditCollege(college)}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCollege(college.id)}
                      className="btn btn-sm btn-outline-danger me-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCollege(college);
                        setActiveTab('colleges-users');
                      }}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Manage
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

export default CollegesList;
