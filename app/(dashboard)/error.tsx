"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const databaseUnavailable =
    error.message.includes("Can't reach database server") ||
    error.message.includes("localhost:5432");

  return (
    <section className="mx-auto max-w-2xl py-16" role="alert">
      <div className="card">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Servizio temporaneamente non disponibile
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          {databaseUnavailable
            ? "PostgreSQL non è in esecuzione"
            : "Non è stato possibile caricare la pagina"}
        </h1>
        <p className="mt-3 text-slate-600">
          {databaseUnavailable
            ? "Avvia PostgreSQL sulla porta 5432, applica la migrazione Prisma e riprova. La home pubblica rimane disponibile."
            : "Riprova tra poco. Se il problema continua, controlla il terminale del server."}
        </p>
        <button className="button mt-6" type="button" onClick={reset}>
          Riprova
        </button>
      </div>
    </section>
  );
}
