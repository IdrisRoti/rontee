import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";

/**
 * Landing page — built section by section from approved Stitch designs.
 * So far: navbar + hero. Further sections (gallery, how it works, etc.)
 * will be added one at a time.
 */
export default function Home() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
    </div>
  );
}
