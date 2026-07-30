import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import StatusBadge from "../../components/StatusBadge";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    const res = await api.get("/admin/dashboard");
    setStats(res.data.data);
  };

  const loadProviders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/providers", {
        params: { search, status, page, limit: 8 },
      });
      setProviders(res.data.data.providers);
      setPagination(res.data.data.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadProviders(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProviders(1);
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/providers/${id}/approve`);
      toast.success("Provider approved");
      loadProviders(pagination.page);
      loadStats();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    if (!remarks.trim()) return toast.error("Enter rejection remarks");
    try {
      await api.patch(`/admin/providers/${id}/reject`, { remarks });
      toast.success("Provider rejected");
      setRemarks("");
      loadProviders(pagination.page);
      loadStats();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reject failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Admin Dashboard</h1>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Providers</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.approved}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        )}

        <form className="filters-row" onSubmit={handleSearch}>
          <input
            placeholder="Search by name, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="incomplete">Incomplete</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button type="submit">Filter</button>
        </form>

        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Categories</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.location?.city || "-"}</td>
                  <td>{p.serviceCategories?.join(", ") || "-"}</td>
                  <td>
                    <StatusBadge status={p.applicationStatus} />
                  </td>
                  <td>
                    <button className="btn-link" onClick={() => setSelected(p)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {providers.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="muted">
                    No providers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-row">
            <button
              disabled={pagination.page <= 1}
              onClick={() => loadProviders(pagination.page - 1)}
            >
              Prev
            </button>
            <span>
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => loadProviders(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selected.name}</h2>
            <StatusBadge status={selected.applicationStatus} />
            <p>
              <strong>Email:</strong> {selected.email}
            </p>
            <p>
              <strong>Phone:</strong> {selected.phone || "-"}
            </p>
            <p>
              <strong>Experience:</strong> {selected.experienceYears || 0} yrs
            </p>
            <p>
              <strong>Skills:</strong> {(selected.skills || []).join(", ") || "-"}
            </p>
            <p>
              <strong>Categories:</strong>{" "}
              {(selected.serviceCategories || []).join(", ") || "-"}
            </p>
            <p>
              <strong>Location:</strong> {selected.location?.address},{" "}
              {selected.location?.city}, {selected.location?.state} -{" "}
              {selected.location?.pincode}
            </p>

            {selected.profilePhoto?.url && (
              <img
                src={selected.profilePhoto.url}
                alt="Profile"
                className="profile-photo-preview"
              />
            )}

            <h3>Documents</h3>
            <ul className="doc-list">
              {(selected.documents || []).map((doc) => (
                <li key={doc.publicId}>
                  <a href={doc.url} target="_blank" rel="noreferrer">
                    {doc.name}
                  </a>
                </li>
              ))}
              {(!selected.documents || selected.documents.length === 0) && (
                <li className="muted">No documents</li>
              )}
            </ul>

            {selected.applicationStatus === "pending" && (
              <div className="review-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleApprove(selected._id)}
                >
                  Approve
                </button>
                <textarea
                  placeholder="Rejection remarks (required to reject)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
                <button
                  className="btn-danger"
                  onClick={() => handleReject(selected._id)}
                >
                  Reject
                </button>
              </div>
            )}

            {selected.applicationStatus === "rejected" && (
              <div className="alert alert-error">
                <strong>Remarks:</strong> {selected.rejectionRemarks}
              </div>
            )}

            <button className="btn-link" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;