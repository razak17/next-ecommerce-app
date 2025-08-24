import { ModeToggle } from "@/components/layouts/mode-toggle";
import { Shell } from "@/components/shell";

export default function Home() {
  return (
    <Shell className="flex h-dvh flex-col items-center justify-center">
      <section className="prose prose-zinc dark:prose-invert flex flex-col items-center text-center font-mono">
        <h1 className="font-bold text-4xl">Ecommerce App</h1>
        <ModeToggle />
      </section>
    </Shell>
  );
}
