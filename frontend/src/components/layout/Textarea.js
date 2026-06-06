function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`w-full min-h-[90px] rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none ring-0 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 ${className}`}
      {...props}
    />
  );
}

export default Textarea;

