"use client";

import { useState } from "react";

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0 sec";
  let seconds = Math.floor(totalSeconds);
  const jours = Math.floor(seconds / 86400); // 60*60*24
  seconds %= 86400;
  const heures = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;

  const parts: string[] = [];

  if (jours > 0) parts.push(`${jours} jour${jours > 1 ? "s" : ""}`);
  if (heures > 0) parts.push(`${heures} h`);
  if (minutes > 0)
    parts.push(`${jours > 0 || heures > 0 ? minutes.toString().padStart(2, "0") : minutes} min`);
  if (sec > 0 || parts.length === 0)
    parts.push(`${jours > 0 || heures > 0 || minutes > 0 ? sec.toString().padStart(2, "0") : sec} sec`);

  return parts.join(" ");
}

export default function Calculator() {
  const [volumeValue, setVolumeValue] = useState<number>(0); // litres
  const [volumeSpeed, setVolumeSpeed] = useState<{
    volume: number; // millilitres
    perTimeInSeconds: number; // seconds
  }>({
    volume: 0,
    perTimeInSeconds: 1,
  });

  const isValid = volumeValue >= 0 && volumeSpeed.volume > 0 && volumeSpeed.perTimeInSeconds > 0;
  const timeInSeconds = isValid
    ? (volumeValue * 1000 / volumeSpeed.volume) * volumeSpeed.perTimeInSeconds
    : 0;

  return (
    <section className="w-full py-10 sm:py-14 bg-gradient-to-br from-cyan-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="rounded-2xl border border-slate-200/60 bg-white/70 shadow-lg backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/60">
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <header className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Calculateur de durée de remplissage
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Calculez le temps nécessaire pour remplir un volume en fonction du débit.
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
                    value={volumeValue}
                    onChange={(e) => setVolumeValue(Number(e.target.value))}
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
                    value={volumeSpeed.volume}
                    onChange={(e) =>
                      setVolumeSpeed({ volume: Number(e.target.value), perTimeInSeconds: volumeSpeed.perTimeInSeconds })
                    }
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                    ml
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Volume écoulé par intervalle.</p>
              </fieldset>

              <fieldset className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Par intervalle (secondes)
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-12 text-right text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="1"
                    value={volumeSpeed.perTimeInSeconds}
                    onChange={(e) =>
                      setVolumeSpeed({ volume: volumeSpeed.volume, perTimeInSeconds: Number(e.target.value) })
                    }
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                    s
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Durée de l&apos;intervalle correspondant.</p>
              </fieldset>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Durée estimée</p>
                  {!isValid && (
                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                      Entrez un débit et un intervalle valides pour obtenir le calcul.
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-mono text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {formatDuration(timeInSeconds)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}