import Link from "next/link";

const faq = [
  ["What is JustSayYes?", "A playful way to ask someone out: you send a link, they meet a NO button that runs away."],
  ["Is it free?", "Yes. The basics are free."],
  ["Does the recipient need an account?", "No. They just open the link."],
];

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Ask them out. Let them try to say no. 😂❤️</h1>
        <p className="mt-4 text-lg text-neutral-600">Create a funny dating invitation, send the link, and see what happens.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/create" className="rounded-full bg-rose-500 px-8 py-4 font-semibold text-white">Create Your Invitation ❤️</Link>
          <a href="#how" className="rounded-full border px-8 py-4 font-semibold">See How It Works</a>
        </div>
        <div className="mx-auto mt-12 max-w-sm rounded-3xl bg-white p-8 shadow-xl">
          <p className="text-2xl font-bold">Hey Sarah ❤️</p>
          <p className="mt-2">Will you go on a date with me?</p>
          <div className="mt-6 flex justify-center gap-4">
            <span className="rounded-full bg-rose-500 px-6 py-3 font-semibold text-white">YES ❤️</span>
            <span className="rounded-full bg-neutral-900 px-6 py-3 font-semibold text-white">NO 😈</span>
          </div>
          <p className="mt-4 text-sm text-neutral-500">Good luck clicking NO 😂</p>
        </div>
      </section>
      <section id="how" className="mt-20">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-6">
          <li>Create your invitation</li><li>Send the link</li><li>Wait for the YES ❤️</li>
        </ol>
      </section>
      <section className="mt-16">
        <h2 className="text-2xl font-bold">FAQ</h2>
        {faq.map(([q, a]) => <details key={q} className="mt-3 rounded-2xl bg-white p-4"><summary className="font-semibold">{q}</summary><p className="mt-2 text-neutral-600">{a}</p></details>)}
      </section>
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold">Ready to ask them out?</h2>
        <Link href="/create" className="mt-4 inline-block rounded-full bg-rose-500 px-8 py-4 font-semibold text-white">Create My Invitation ❤️</Link>
      </section>
    </main>
  );
}
