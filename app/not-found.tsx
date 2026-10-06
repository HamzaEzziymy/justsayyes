import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold">Looks like this date invitation got lost 😂</h1>
      <Link href="/create" className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white">Create an Invitation ❤️</Link>
    </main>
  );
}
