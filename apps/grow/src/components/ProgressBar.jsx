export default function ProgressBar({ value, small }) {
  return (
    <div className={`bg-green-100 rounded-full overflow-hidden ${small ? "h-1.5" : "h-2"}`}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: "linear-gradient(90deg, var(--color-green-500), var(--color-green-300))",
        }}
      />
    </div>
  );
}