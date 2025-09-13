import Image from "next/image";
import type { Metadata } from "next";
import ExperimentPage from "@/Presentation/components/ExperimentPage";

export const metadata: Metadata = {
  title: "Volum",
  description: "Calculate volume and duration",
};
export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center h-screen p-8 pb-20 gap-16 sm:p-20 min-h-0">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start h-full min-h-0">
        <ExperimentPage />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Pipette
      </footer>
    </div>
  );
}
