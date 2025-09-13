"use client";

import React, { useEffect, useRef, useState } from "react";
import Calculator from "@/Presentation/components/Calculator";
import ExperimentList, { Experiment } from "@/Presentation/components/ExperimentList";

const STORAGE_KEY = "experiments_v1";

export default function ExperimentPage() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const experimentsRef = useRef(experiments);
  useEffect(() => {
    experimentsRef.current = experiments;
  }, [experiments]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Experiment[];
      const now = Date.now();
      const normalized = parsed.map((e) => {
        let remainingMl = e.remainingMl;
        let isRunning = e.isRunning;
        let startedAt = e.startedAt;
        let endsAt = e.endsAt;
        // Recompute remaining if running and dates exist
        if (isRunning && endsAt) {
          const remainingMs = Math.max(0, endsAt - now);
          remainingMl = (remainingMs / 1000) * e.mlPerSec;
          if (remainingMl <= 0) {
            remainingMl = 0;
            isRunning = false;
            startedAt = null;
            endsAt = null;
          }
        }
        return { ...e, remainingMl, isRunning, startedAt, endsAt } as Experiment;
      });
      setExperiments(normalized);
    } catch (e) {
      console.error("Failed to parse experiments from storage", e);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
    } catch (e) {
      console.error("Failed to save experiments to storage", e);
    }
  }, [experiments]);

  // Global timer: recompute remaining using endsAt to make it robust across refresh
  useEffect(() => {
    if (experiments.length === 0) return;
    const id = setInterval(() => {
      const now = Date.now();
      const next = experimentsRef.current.map((exp) => {
        if (!exp.isRunning || !exp.endsAt) return exp;
        const remainingMs = Math.max(0, exp.endsAt - now);
        const remainingMl = (remainingMs / 1000) * exp.mlPerSec;
        if (remainingMl <= 0) {
          return { ...exp, remainingMl: 0, isRunning: false, startedAt: null, endsAt: null };
        }
        return { ...exp, remainingMl };
      });
      setExperiments(next);
    }, 200);
    return () => clearInterval(id);
  }, [experiments.length]);

  function addExperiment(startLiters: number, mlPerSec: number) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const totalMs = ((startLiters * 1000) / mlPerSec) * 1000;
    const startedAt = Date.now();
    const endsAt = startedAt + totalMs;
    const newExp: Experiment = {
      id,
      startLiters,
      mlPerSec,
      remainingMl: startLiters * 1000,
      isRunning: true,
      startedAt,
      endsAt,
    };
    setExperiments((prev) => [newExp, ...prev]);
  }

  function togglePause(expId: string) {
    const now = Date.now();
    setExperiments((prev) =>
      prev.map((e) => {
        if (e.id !== expId) return e;
        if (e.isRunning) {
          // Pause: compute remaining by endsAt
          const remainingMs = e.endsAt ? Math.max(0, e.endsAt - now) : (e.remainingMl / e.mlPerSec) * 1000;
          const remainingMl = (remainingMs / 1000) * e.mlPerSec;
          return { ...e, isRunning: false, startedAt: null, endsAt: null, remainingMl };
        } else {
          // Resume: set new dates based on remaining
          const remainingMs = (e.remainingMl / e.mlPerSec) * 1000;
          const startedAt = now;
          const endsAt = now + remainingMs;
          return { ...e, isRunning: true, startedAt, endsAt };
        }
      })
    );
  }

  function resetExperiment(expId: string) {
    setExperiments((prev) =>
      prev.map((e) =>
        e.id === expId
          ? {
              ...e,
              remainingMl: e.startLiters * 1000,
              isRunning: false,
              startedAt: null,
              endsAt: null,
            }
          : e
      )
    );
  }

  function removeExperiment(expId: string) {
    setExperiments((prev) => prev.filter((e) => e.id !== expId));
  }

  return (
    <div className="w-full h-full min-h-0">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 w-full h-full min-h-0">
        <Calculator onStartExperiment={addExperiment} />
        <ExperimentList
          experiments={experiments}
          onTogglePause={togglePause}
          onReset={resetExperiment}
          onRemove={removeExperiment}
        />
      </div>
    </div>
  );
}
