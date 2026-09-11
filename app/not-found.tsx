import Image from "next/image";
import Link from "next/link";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_12px_32px_rgba(15,23,42,0.06)] sm:p-12">
        <Image
          src="/company_logo.png"
          alt="Fortune Link"
          width={180}
          height={180}
          className="mx-auto h-28 w-28 object-contain opacity-80"
          priority
        />
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
          Error 404
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/admin/dashboard"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <ArrowBackRoundedIcon sx={{ fontSize: 18 }} />
          Back to dashboard
        </Link>
      </section>
    </main>
  );
}
