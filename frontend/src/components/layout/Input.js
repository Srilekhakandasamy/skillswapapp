function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${className}`}
      {...props}
    />
  );
}

export default Input;

