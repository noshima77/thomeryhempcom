export default function ProgressBar({ value, small }) {
  return (
    <div className={`progress-bar ${small ? "progress-bar--small" : ""}`}>
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}
