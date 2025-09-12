"use client";

import { useState } from "react";

function formatDuration(seconds: number): string {
  const jours = Math.floor(seconds / 86400); // 60*60*24
  seconds %= 86400;
  const heures = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const sec = seconds % 60;

  const parts: string[] = [];

  if (jours > 0) parts.push(`${jours} jour${jours > 1 ? "s" : ""}`);
  if (heures > 0) parts.push(`${heures} h`);
  if (minutes > 0) parts.push(`${jours > 0 || heures > 0 ? minutes.toString().padStart(2, "0") : minutes} min`);
  if (sec > 0 || parts.length === 0) parts.push(`${(jours > 0 || heures > 0 || minutes > 0) ? sec.toString().padStart(2, "0") : sec} sec`);

  return parts.join(" ");
}

export default function Calculator() {
  const [volumeValue, setVolumeValue] = useState<number>(0);
  const [volumeSpeed, setVolumeSpeed] = useState<{
    volume: number,
    perTimeInSeconds: number
  }>({
    volume: 0,
    perTimeInSeconds: 1
  });

  const timeInSeconds = (volumeValue * 1000 / volumeSpeed.volume ) * volumeSpeed.perTimeInSeconds;

  return (<div className={"flex flex-row gap-[32px] items-center justify-center p-8 bg-cyan-600"}>
    <fieldset className={"flex flex-col gap-[10px] items-center justify-center"}>
      <label>Volume total en litre:</label>
      <input className={"text-center"} type={"number"} value={volumeValue} onChange={(e) => setVolumeValue(Number(e.target.value))} />
    </fieldset>
    <fieldset className={"flex flex-col gap-[10px] items-center justify-center"}>
      <label>Volume en ml:</label>
      <input className={"text-center"} type={"number"} value={volumeSpeed.volume} onChange={(e) => setVolumeSpeed({volume: Number(e.target.value), perTimeInSeconds: volumeSpeed.perTimeInSeconds})} />
    </fieldset>
    <fieldset className={"flex flex-col gap-[10px] items-center justify-center"}  >
      <label>par secondes:</label>
      <input className={"text-center"} type={"number"} value={volumeSpeed.perTimeInSeconds} onChange={(e) => setVolumeSpeed({volume: volumeSpeed.volume, perTimeInSeconds: Number(e.target.value)})} />
    </fieldset>
    <div>
      <p>Durée</p>
      <p>{formatDuration(timeInSeconds)}</p>
    </div>
  </div>);
}