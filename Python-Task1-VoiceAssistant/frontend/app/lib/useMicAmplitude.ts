import { useEffect, useRef, useState } from "react";

export function useMicAmplitude(active: boolean): number {
  const [amplitude, setAmplitude] = useState(0);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      setAmplitude(0);
      return;
    }

    let audioContext: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let dataArray: Uint8Array;

    async function setup() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        dataArray = new Uint8Array(analyser.frequencyBinCount);

        function tick() {
          if (!analyser) return;
          analyser.getByteFrequencyData(dataArray as Uint8Array<ArrayBuffer>);
          const avg = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
          setAmplitude(avg / 255);
          rafRef.current = requestAnimationFrame(tick);
        }
        tick();
      } catch {
        setAmplitude(0);
      }
    }

    setup();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioContext?.close();
    };
  }, [active]);

  return amplitude;
}