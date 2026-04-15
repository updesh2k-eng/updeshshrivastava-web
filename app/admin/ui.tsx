export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-6 h-6 border-2 rounded-full animate-spin border-sky-500 border-t-transparent" />
    </div>
  );
}

export function AdminHeader({
  title,
  left,
  right,
}: {
  title: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header
      className="sticky top-0 z-10 border-b px-5 h-14 flex items-center justify-between"
      style={{ borderColor: "var(--border)", background: "var(--background)" }}
    >
      <div className="flex items-center gap-3">
        {left}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <div className="flex items-center gap-2">{right}</div>
    </header>
  );
}
