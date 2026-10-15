import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import type { Point } from '@/core/utils/geometry';
import { TEMPLATE_CONFIG } from '../config';
import { createGameState, stepGame, type GameState } from './targetGame';

interface Options {
  running: boolean;
  /** Latest normalised input position (mouse here; a tracked landmark in a camera module). */
  inputRef: RefObject<Point | null>;
  onRep: () => void;
}

/** Connects the pure game logic to the animation loop and exposes render state. */
export function useTargetGame({ running, inputRef, onRep }: Options) {
  const stateRef = useRef<GameState>(createGameState());
  const [view, setView] = useState<GameState>(stateRef.current);
  const onRepRef = useRef(onRep);

  useEffect(() => {
    onRepRef.current = onRep;
  }, [onRep]);

  useEffect(() => {
    if (!running) return;
    let rafId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100); // ignore long pauses (tab switches)
      last = now;
      const { state, completed } = stepGame(stateRef.current, inputRef.current, dt);
      stateRef.current = state;
      setView(state);
      if (completed) onRepRef.current();
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [running, inputRef]);

  const reset = useCallback(() => {
    stateRef.current = createGameState();
    setView(stateRef.current);
  }, []);

  return {
    target: view.target,
    holdProgress: Math.min(1, view.holdMs / TEMPLATE_CONFIG.holdMs),
    reset,
  };
}
