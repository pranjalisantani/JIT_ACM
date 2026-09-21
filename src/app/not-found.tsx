import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-neutral-100 px-6 py-24 text-center">
      <div className="max-w-md space-y-6">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 block">
          404 · Not Found
        </span>
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
          Page Not Located
        </h1>
        <p className="text-sm font-light text-neutral-400 leading-relaxed">
          The requested path does not exist in the ACM FACE digital architecture.
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-800 hover:border-neutral-500 bg-neutral-950 text-neutral-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            <span>Return Home</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
