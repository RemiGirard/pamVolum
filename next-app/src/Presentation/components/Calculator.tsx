"use client";

import { useEffect, useState } from "react";

function splitDurationTwoLines(totalSeconds: number): { daysLine: string; hmsLine: string } {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    return { daysLine: "0 jour", hmsLine: "00 h 00 m 00 s" };
  }
  let seconds = Math.floor(totalSeconds);
  const jours = Math.floor(seconds / 86400); // 60*60*24
  seconds %= 86400;
  const heures = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;

  const daysLabel = `${jours} jour${jours > 1 ? "s" : ""}`;
  const h = String(heures).padStart(2, "0");
  const m = String(minutes).padStart(2, "0");
  const s = String(sec).padStart(2, "0");
  return { daysLine: daysLabel, hmsLine: `${h} h ${m} m ${s} s` };
}

function formatDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}:${ss}`;
}

type CalculatorProps = {
  onStartExperiment: (startLiters: number, mlPerSec: number) => void;
};

export default function Calculator({ onStartExperiment }: CalculatorProps) {
  // Keep raw strings so inputs can be temporarily empty while editing
  const [volumeValueStr, setVolumeValueStr] = useState<string>("10");
  const [speedVolumeStr, setSpeedVolumeStr] = useState<string>("1");
  const [perTimeStr, setPerTimeStr] = useState<string>("100");

  // Parsed values for calculations (static estimation)
  const volumeValue = parseFloat(volumeValueStr);
  const speedVolume = parseFloat(speedVolumeStr);
  const perTimeInSeconds = parseFloat(perTimeStr);

  const isValid =
    Number.isFinite(volumeValue) &&
    Number.isFinite(speedVolume) &&
    Number.isFinite(perTimeInSeconds) &&
    volumeValue >= 0 &&
    speedVolume > 0 &&
    perTimeInSeconds > 0;

  const timeInSeconds = isValid
    ? (volumeValue * 1000 / speedVolume) * perTimeInSeconds
    : 0;

  // Avoid SSR/client hydration mismatch: compute end date only after mount
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // set once on mount and keep updating every second to refresh the end date display without SSR mismatch
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const endDateStr = isValid && volumeValue > 0 && now !== null
    ? formatDate(new Date(now + timeInSeconds * 1000))
    : null;


  return (
    <section className="w-full py-10 sm:py-14 bg-gradient-to-br from-cyan-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <header className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Calculateur de durée de vidage
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Calculez le temps nécessaire pour vider un volume en fonction du débit.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
              <fieldset className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Volume total
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-16 text-right text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0,00"
                    value={volumeValueStr}
                    onChange={(e) => setVolumeValueStr(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                    L
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Volume total en litres.</p>
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Débit (volume)
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-16 text-right text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    type="number"
                    min={0}
                    step={1}
                    placeholder="0"
                    value={speedVolumeStr}
                    onChange={(e) => setSpeedVolumeStr(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                    ml
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Volume écoulé par intervalle en millilitres (10<sup>-3</sup> litre).</p>
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Par intervalle
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-12 text-right text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="1"
                    value={perTimeStr}
                    onChange={(e) => setPerTimeStr(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                    s
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Durée de l&apos;intervalle correspondant en secondes.</p>
              </fieldset>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700 flex-col">
              <div className="flex items-start justify-between gap-4 flex-row">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Durée estimée</p>
                  {!isValid && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      Entrez un débit et un intervalle valides pour obtenir le calcul.
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 text-right">
                    {(() => { const d = splitDurationTwoLines(timeInSeconds); return (<>
                      <span className="block">{d.daysLine}</span>
                      <span className="block">{d.hmsLine}</span>
                    </>); })()}
                  </p>
                </div>
              </div>
              <div className={"flew-row"}>
                <div className={"text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400"}>
                  Fin:
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {endDateStr}
                  </p>
                </div>
              </div>
            </div>

            {/* Start experiment button (list is shown on the page via ExperimentList) */}
            <div className="mt-6">
              <button
                className="rounded-lg bg-cyan-600 px-4 py-2 text-white shadow hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  if (!isValid) return;
                  const startLiters = Math.max(0, volumeValue);
                  const mlPerSec = speedVolume / perTimeInSeconds;
                  onStartExperiment(startLiters, mlPerSec);
                }}
                disabled={!isValid || volumeValue <= 0}
              >
                Démarrer le vidage
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}