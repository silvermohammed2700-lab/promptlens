import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold font-syne text-[var(--accent)] mb-4">404</h1>
      <p className="text-[var(--muted)] mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        Go Home
      </Link>
    </div>
  );
}
