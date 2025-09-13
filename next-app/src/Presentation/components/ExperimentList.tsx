"use client";

import React from "react";

function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0 sec";
  let seconds = Math.floor(totalSeconds);
  const jours = Math.floor(seconds / 86400);
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

export type Experiment = {
  id: string;
  startLiters: number;
  mlPerSec: number;
  remainingMl: number;
  elapsedMs: number;
  isRunning: boolean;
  lastTick: number | null;
};

type Props = {
  experiments: Experiment[];
  onTogglePause: (id: string) => void;
  onReset: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function ExperimentList({ experiments, onTogglePause, onReset, onRemove }: Props) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-4 ring-1 ring-inset ring-slate-200 dark:bg-slate-800/60 dark:ring-slate-700 w-full">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Expériences</h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">{experiments.length}</span>
      </div>
      {experiments.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">Aucune expérience pour le moment.</p>
      ) : (
        <ul className="space-y-3 max-h-80 overflow-auto pr-1">
          {experiments.map((exp) => {
            const remainingL = (exp.remainingMl / 1000).toFixed(2);
            return (
              <li
                key={exp.id}
                className="rounded-lg bg-white/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 px-3 py-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{exp.mlPerSec.toFixed(2)} ml/s</div>
                  <div className="flex items-center gap-2">
                    <button
                      className="text-xs rounded-md bg-slate-700 px-2 py-1 text-white hover:bg-slate-800"
                      onClick={() => onTogglePause(exp.id)}
                    >
                      {exp.isRunning ? "Pause" : "Reprendre"}
                    </button>
                    <button
                      className="text-xs rounded-md bg-amber-600 px-2 py-1 text-white hover:bg-amber-700"
                      onClick={() => onReset(exp.id)}
                    >
                      Réinitialiser
                    </button>
                    <button
                      className="text-xs rounded-md bg-rose-600 px-2 py-1 text-white hover:bg-rose-700"
                      onClick={() => onRemove(exp.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Temps restant</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">
                      {formatDuration(exp.remainingMl / exp.mlPerSec)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-300">Restant</span>
                    <span className="font-mono text-slate-900 dark:text-slate-100">{remainingL} L</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
