export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-neutral-900">
          Welcome to Next.js
        </h1>
        <p className="text-lg text-neutral-600 max-w-[600px]">
          Get started by editing <code className="bg-neutral-100 px-2 py-1 rounded text-sm text-neutral-900">app/page.tsx</code>
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-4">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-neutral-900 text-white gap-2 hover:bg-neutral-800 text-sm sm:text-base h-10 sm:h-12 px-8"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-neutral-200 transition-colors flex items-center justify-center hover:bg-neutral-100 hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-8 text-neutral-900"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
    </div>
  );
}
