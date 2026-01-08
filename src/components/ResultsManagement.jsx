import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ResultsManagement = ({
  selectedCollege,
  setSuccessMessage,
  user
}) => {
  const [selectedYear, setSelectedYear] = useState('year1');
  const [publishing, setPublishing] = useState(false);
  const [publishedResults, setPublishedResults] = useState([]);

  // Fetch published results on component mount
  useEffect(() => {
    const fetchResults = async () => {
      if (selectedCollege?.id) {
        try {
          // Fetch published results for this college
          const resultsQuery = query(
            collection(db, 'results'),
            where('collegeId', '==', selectedCollege.id)
          );
          const resultsSnapshot = await getDocs(resultsQuery);
          const resultsData = resultsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setPublishedResults(resultsData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchResults();
  }, [selectedCollege]);

  const handlePublishResults = async () => {
    if (!selectedDepartment) {
      alert('Please select a department first.');
      return;
    }

    // Check if user has permission to publish results for this college
    if (user.role !== 'admin' && user.role !== 'head') {
      alert('You do not have permission to publish results.');
      return;
    }

    // For college-specific admins, check if they belong to this college
    if (user.role === 'head' && user.collegeId !== selectedCollege.id) {
      alert('You can only publish results for your assigned college.');
      return;
    }

    setPublishing(true);

    try {
      // Create result data for publishing
      const resultData = {
        collegeId: selectedCollege.id,
        collegeName: selectedCollege.name,
        departmentId: selectedDepartment.id,
        departmentName: selectedDepartment.name,
        year: selectedYear,
        status: 'Published',
        publishedAt: new Date(),
        publishedBy: user.username || 'admin',
        publishedById: user.id,
        publishedByRole: user.role
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'results'), resultData);

      // Update local state
      setPublishedResults(prev => [...prev, { id: docRef.id, ...resultData }]);

      // Show success message
      setSuccessMessage(`Results published successfully for ${selectedDepartment.name} - ${selectedYear.toUpperCase()} (${selectedCollege.name})`);

      // Reset selection
      setSelectedDepartment(null);
      setSelectedYear('year1');

    } catch (error) {
      console.error('Error publishing results:', error);
      alert('Error publishing results. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div>
      <h4 className="mb-4">Publish Results</h4>

      {/* Year Selection */}
      <div className="mb-4">
        <label className="form-label">Select Year</label>
        <div className="d-flex gap-2">
          <button
            onClick={() => setSelectedYear('year1')}
            className={`btn btn-sm ${selectedYear === 'year1' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Year 1
          </button>
          <button
            onClick={() => setSelectedYear('year2')}
            className={`btn btn-sm ${selectedYear === 'year2' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Year 2
          </button>
        </div>
      </div>

      {/* Publish Button */}
      <button
        onClick={handlePublishResults}
        disabled={publishing}
        className="btn btn-success"
      >
        {publishing ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            Publishing...
          </>
        ) : (
          'Publish Results'
        )}
      </button>

      <div className="mt-3 alert alert-info">
        <strong>Ready to publish:</strong> {selectedYear.toUpperCase()} results for {selectedCollege.name}
      </div>

      {/* Published Results History */}
      <div className="mt-4">
        <h5>Published Results History</h5>
        {publishedResults.length === 0 ? (
          <p className="text-muted">No results published yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Published Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {publishedResults.map(result => (
                  <tr key={result.id}>
                    <td>{result.year.toUpperCase()}</td>
                    <td>{result.publishedAt?.toDate ? result.publishedAt.toDate().toLocaleDateString() : new Date(result.publishedAt).toLocaleDateString()}</td>
                    <td>
                      <span className="badge bg-success">{result.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsManagement;
