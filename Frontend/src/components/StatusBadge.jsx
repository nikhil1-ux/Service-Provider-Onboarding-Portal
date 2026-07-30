const LABELS = {
  incomplete: "Incomplete",
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
};

const StatusBadge = ({ status }) => (
  <span className={`badge badge-${status}`}>{LABELS[status] || status}</span>
);

export default StatusBadge;