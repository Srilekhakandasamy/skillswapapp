function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500/40";

  const styles =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "secondary"
      ? "bg-slate-900 text-white hover:bg-slate-800"
      : "bg-indigo-600 text-white hover:bg-indigo-700";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}

export default Button;

