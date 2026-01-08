import React from 'react';

const AddSubjectTab = ({
  subjectForm,
  setSubjectForm,
  subjectErrors,
  setSubjectErrors,
  subjectEntries,
  setSubjectEntries,
  handleAddSubjectRow,
  handleSubjectSubmit
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectForm({ ...subjectForm, [name]: value });
    if (subjectErrors[name]) {
      setSubjectErrors({ ...subjectErrors, [name]: '' });
    }
  };

  const handleRemoveEntry = (id) => {
    setSubjectEntries(subjectEntries.filter(entry => entry.id !== id));
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Add Subjects</h5>
      </div>
      <div className="card-body">
        {/* Subject Form */}
        <form onSubmit={handleAddSubjectRow} className="mb-4">
          <div className="row g-3">
            <div className="col-md-3">
              <label htmlFor="subjectName" className="form-label">Subject Name</label>
              <input
                type="text"
                className={`form-control ${subjectErrors.name ? 'is-invalid' : ''}`}
                id="subjectName"
                name="name"
                value={subjectForm.name}
                onChange={handleInputChange}
                placeholder="Enter subject name"
              />
              {subjectErrors.name && <div className="invalid-feedback">{subjectErrors.name}</div>}
            </div>
            <div className="col-md-2">
              <label htmlFor="subjectCode" className="form-label">Code</label>
              <input
                type="text"
                className={`form-control ${subjectErrors.code ? 'is-invalid' : ''}`}
                id="subjectCode"
                name="code"
                value={subjectForm.code}
                onChange={handleInputChange}
                placeholder="Code"
              />
              {subjectErrors.code && <div className="invalid-feedback">{subjectErrors.code}</div>}
            </div>
            <div className="col-md-2">
              <label htmlFor="subjectYear" className="form-label">Year</label>
              <select
                className={`form-select ${subjectErrors.year ? 'is-invalid' : ''}`}
                id="subjectYear"
                name="year"
                value={subjectForm.year}
                onChange={handleInputChange}
              >
                <option value="">Select Year</option>
                <option value="Year I">Year I</option>
                <option value="Year II">Year II</option>
                <option value="Year III">Year III</option>
                <option value="Year IV">Year IV</option>
              </select>
              {subjectErrors.year && <div className="invalid-feedback">{subjectErrors.year}</div>}
            </div>
            <div className="col-md-2">
              <label htmlFor="subjectSemester" className="form-label">Semester</label>
              <select
                className={`form-select ${subjectErrors.semester ? 'is-invalid' : ''}`}
                id="subjectSemester"
                name="semester"
                value={subjectForm.semester}
                onChange={handleInputChange}
              >
                <option value="">Select Semester</option>
                <option value="Sem 1">Sem 1</option>
                <option value="Sem 2">Sem 2</option>
                <option value="Sem 3">Sem 3</option>
                <option value="Sem 4">Sem 4</option>
                <option value="Sem 5">Sem 5</option>
                <option value="Sem 6">Sem 6</option>
                <option value="Sem 7">Sem 7</option>
                <option value="Sem 8">Sem 8</option>
              </select>
              {subjectErrors.semester && <div className="invalid-feedback">{subjectErrors.semester}</div>}
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button type="submit" className="btn btn-primary me-2">
                Add to List
              </button>
            </div>
          </div>
        </form>

        {/* Subjects Table */}
        {subjectEntries.length > 0 && (
          <div className="mb-4">
            <h6>Subjects to be Added:</h6>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Subject Name</th>
                    <th>Code</th>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectEntries.map((entry) => (
                    <tr key={entry.id}>
                      <td>{entry.name}</td>
                      <td>{entry.code}</td>
                      <td>{entry.year}</td>
                      <td>{entry.semester}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveEntry(entry.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubjectSubmit}
              >
                Save All Subjects to Database
              </button>
            </div>
          </div>
        )}

        {subjectEntries.length === 0 && (
          <div className="text-center text-muted">
            <p>No subjects added yet. Use the form above to add subjects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSubjectTab;
