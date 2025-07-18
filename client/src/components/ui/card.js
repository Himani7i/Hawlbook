// card.js

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white dark:bg-[#111827] p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  );
}
