function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 ${className}`}>
      {children}
    </div>
  );
}

export default Card;

