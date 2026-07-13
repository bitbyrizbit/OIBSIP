import Header from "./components/Header";
import HeroPanel from "./components/HeroPanel";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl">
      <Header />
      <HeroPanel />
    </main>
  );
}