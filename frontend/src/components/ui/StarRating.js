import { useMemo } from "react";

function StarRating({ value, onChange, size = 22, className = "" }) {
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  return (
    <div className={className} style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {stars.map((s) => {
        const active = value >= s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange?.(s)}
            aria-label={`Rate ${s} stars`}
            style={{
              width: size,
              height: size,
              lineHeight: `${size}px`,
              borderRadius: 6,
              border: "1px solid rgba(0,0,0,0.1)",
              background: active ? "#f59e0b" : "white",
              color: active ? "white" : "#111827",
              cursor: "pointer",
              fontSize: 14,
              padding: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;

