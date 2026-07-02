export function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 min-h-12 px-6 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-green-500 text-white hover:bg-green-700 active:bg-green-700',
    secondary:
      'bg-earth-100 text-earth-900 hover:bg-earth-300 active:bg-earth-300',
    outline:
      'border-2 border-green-500 text-green-700 hover:bg-green-50 active:bg-green-50',
  };

  const sizes = {
    md: 'text-lg',
    lg: 'text-xl px-8 min-h-14',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}