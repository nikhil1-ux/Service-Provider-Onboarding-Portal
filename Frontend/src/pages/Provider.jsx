import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const CATEGORY_OPTIONS = [
  "Plumbing",
  "Electrician",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Appliance Repair",
  "Salon at Home",
  "Pest Control",
];

const ProviderDashboard = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docName, setDocName] = useState("");
  const [docFile, setDocFile] = useState(null);

  const isLocked = profile?.applicationStatus === "approved";

  const loadProfile = async () => {
    const res = await api.get("/provider/profile");
    setProfile(res.data.data);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (!profile) return <div className="page-loading">Loading...</div>;

  const handleField = (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }));
  };

  const handleLocation = (field, value) => {
    setProfile((p) => ({ ...p, location: { ...p.location, [field]: value } }));
  };

  const toggleCategory = (cat) => {
    setProfile((p) => {
      const has = p.serviceCategories.includes(cat);
      return {
        ...p,
        serviceCategories: has
          ? p.serviceCategories.filter((c) => c !== cat)
          : [...p.serviceCategories, cat],
      };
    });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { name, phone, serviceCategories, skills, experienceYears, location } =
        profile;
      const res = await api.put("/provider/profile", {
        name,
        phone,
        serviceCategories,
        skills,
        experienceYears,
        location,
      });
      setProfile(res.data.data);
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);
      const res = await api.post("/provider/profile-photo", formData);
      setProfile((p) => ({ ...p, profilePhoto: res.data.data }));
      toast.success("Photo uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Photo upload failed");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocUpload = async () => {
    if (!docFile) return toast.error("Choose a file first");
    if (!docName.trim()) return toast.error("Enter a document name");
    setUploadingDocs(true);
    try {
      const formData = new FormData();
      formData.append("documents", docFile);
      formData.append("documentNames", docName);
      const res = await api.post("/provider/documents", formData);
      setProfile((p) => ({ ...p, documents: res.data.data }));
      setDocFile(null);
      setDocName("");
      toast.success("Document uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Document upload failed");
    } finally {
      setUploadingDocs(false);
    }
  };

  const handleDeleteDoc = async (publicId) => {
    try {
      const res = await api.delete(
        `/provider/documents/${encodeURIComponent(publicId)}`
      );
      setProfile((p) => ({ ...p, documents: res.data.data }));
      toast.success("Document removed");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove document");
    }
  };

  const handleSubmitApplication = async () => {
    try {
      const res = await api.post("/provider/submit");
      setProfile(res.data.data);
      toast.success("Application submitted for review!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>My Profile</h1>
          <StatusBadge status={profile.applicationStatus} />
        </div>

        {profile.applicationStatus === "rejected" && (
          <div className="alert alert-error">
            <strong>Application Rejected:</strong> {profile.rejectionRemarks}
            <br />
            Please update your profile and resubmit.
          </div>
        )}
        {profile.applicationStatus === "pending" && (
          <div className="alert alert-info">
            Your application is under review by our admin team.
          </div>
        )}
        {isLocked && (
          <div className="alert alert-success">
            Your profile has been approved. Editing is locked.
          </div>
        )}

        <div className="card">
          <h2>Basic Details</h2>
          <div className="grid-2">
            <div>
              <label>Full Name</label>
              <input
                disabled={isLocked}
                value={profile.name || ""}
                onChange={(e) => handleField("name", e.target.value)}
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                disabled={isLocked}
                value={profile.phone || ""}
                onChange={(e) => handleField("phone", e.target.value)}
              />
            </div>
            <div>
              <label>Experience (years)</label>
              <input
                type="number"
                min={0}
                disabled={isLocked}
                value={profile.experienceYears || 0}
                onChange={(e) =>
                  handleField("experienceYears", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label>Skills (comma separated)</label>
              <input
                disabled={isLocked}
                value={(profile.skills || []).join(", ")}
                onChange={(e) =>
                  handleField(
                    "skills",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>
          </div>

          <label>Service Categories</label>
          <div className="chip-group">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                type="button"
                key={cat}
                disabled={isLocked}
                className={`chip ${
                  profile.serviceCategories?.includes(cat) ? "chip-active" : ""
                }`}
                onClick={() => toggleCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <h3>Service Location</h3>
          <div className="grid-2">
            <div>
              <label>Address</label>
              <input
                disabled={isLocked}
                value={profile.location?.address || ""}
                onChange={(e) => handleLocation("address", e.target.value)}
              />
            </div>
            <div>
              <label>City</label>
              <input
                disabled={isLocked}
                value={profile.location?.city || ""}
                onChange={(e) => handleLocation("city", e.target.value)}
              />
            </div>
            <div>
              <label>State</label>
              <input
                disabled={isLocked}
                value={profile.location?.state || ""}
                onChange={(e) => handleLocation("state", e.target.value)}
              />
            </div>
            <div>
              <label>Pincode</label>
              <input
                disabled={isLocked}
                value={profile.location?.pincode || ""}
                onChange={(e) => handleLocation("pincode", e.target.value)}
              />
            </div>
          </div>

          {!isLocked && (
            <button onClick={saveProfile} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          )}
        </div>

        <div className="card">
          <h2>Profile Photo</h2>
          {profile.profilePhoto?.url && (
            <img
              src={profile.profilePhoto.url}
              alt="Profile"
              className="profile-photo-preview"
            />
          )}
          {!isLocked && (
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploadingPhoto}
            />
          )}
        </div>

        <div className="card">
          <h2>Verification Documents</h2>
          <ul className="doc-list">
            {profile.documents?.map((doc) => (
              <li key={doc.publicId}>
                <a href={doc.url} target="_blank" rel="noreferrer">
                  {doc.name}
                </a>
                {!isLocked && (
                  <button
                    className="btn-link danger"
                    onClick={() => handleDeleteDoc(doc.publicId)}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
            {(!profile.documents || profile.documents.length === 0) && (
              <li className="muted">No documents uploaded yet</li>
            )}
          </ul>

          {!isLocked && (
            <div className="doc-upload-row">
              <input
                type="text"
                placeholder="Document name (e.g. Aadhar Card)"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setDocFile(e.target.files[0])}
              />
              <button onClick={handleDocUpload} disabled={uploadingDocs}>
                {uploadingDocs ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>

        {!isLocked && profile.applicationStatus !== "pending" && (
          <div className="card">
            <h2>Submit Application</h2>
            <p className="muted">
              Once your profile, photo and documents are complete, submit your
              application for admin review.
            </p>
            <button className="btn-primary" onClick={handleSubmitApplication}>
              Submit Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;