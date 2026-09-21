"use client";

import { OPENING_AUDIO, OPENING_STRINGS } from "@/config/opening";

/**
 * ACM FACE — Voice Audio Engine
 * Manages audio playback, browser autoplay fallback, mute preferences,
 * and double-mount single-play guards.
 */

let audioInstance: HTMLAudioElement | null = null;
let hasFiredPlayback = false;
let activeSubtitleTimeout: NodeJS.Timeout | null = null;

export function getStoredMutePreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(OPENING_AUDIO.STORAGE_MUTE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setStoredMutePreference(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(OPENING_AUDIO.STORAGE_MUTE_KEY, muted ? "true" : "false");
  } catch {
    // Ignore storage exceptions in restricted environments
  }
}

/**
 * Reset play guard (for manual replay scenarios like ?opening=1)
 */
export function resetVoiceGuard(): void {
  hasFiredPlayback = false;
}

let currentSourceIndex = 0;

/**
 * Returns or instantiates the singleton Audio instance with preload="none"
 */
export function getOrCreateAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;

  if (!audioInstance) {
    audioInstance = new Audio();
    const sources = OPENING_AUDIO.VOICE_SOURCES as readonly string[];
    audioInstance.src = sources[currentSourceIndex] || OPENING_AUDIO.SRC;
    audioInstance.preload = "none";
    audioInstance.volume = 0.9;

    audioInstance.addEventListener("error", () => {
      if (currentSourceIndex < sources.length - 1 && audioInstance) {
        currentSourceIndex++;
        audioInstance.src = sources[currentSourceIndex];
        audioInstance.load();
      }
    });
  }

  return audioInstance;
}

/**
 * Loads voice audio in an idle callback after first paint
 */
export function preloadVoiceInIdleCallback(): void {
  if (typeof window === "undefined") return;
  const schedule = window.requestIdleCallback || ((cb: () => void) => setTimeout(cb, 300));
  schedule(() => {
    const audio = getOrCreateAudio();
    if (audio) {
      try {
        audio.load();
      } catch {
        // Ignore load errors in restricted sandbox
      }
    }
  });
}

export interface PlayVoiceOptions {
  muted?: boolean;
  onSubtitle?: (text: string) => void;
  onEnded?: () => void;
  forcePlay?: boolean;
}

/**
 * Plays the welcome voice line "Welcome to ACM."
 * Strictly guards against double-invocation under React Strict Mode.
 */
export async function playWelcomeVoice(
  options: PlayVoiceOptions = {}
): Promise<{ started: boolean; autoplayBlocked: boolean }> {
  const { muted = false, onSubtitle, onEnded, forcePlay = false } = options;

  // Strict Single-Play Guard: prevents dual peaks under React Strict Mode double mount
  if (hasFiredPlayback && !forcePlay) {
    return { started: false, autoplayBlocked: false };
  }
  hasFiredPlayback = true;

  // Show plain subtitle caption regardless of audio state
  if (onSubtitle) {
    onSubtitle(OPENING_STRINGS.SUBTITLE);

    if (activeSubtitleTimeout) clearTimeout(activeSubtitleTimeout);
    activeSubtitleTimeout = setTimeout(() => {
      onSubtitle("");
      onEnded?.();
    }, 1200); // Display for ~1.2s
  }

  if (muted) {
    return { started: false, autoplayBlocked: false };
  }

  const audio = getOrCreateAudio();
  if (!audio) {
    return { started: false, autoplayBlocked: false };
  }

  try {
    audio.currentTime = 0;
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      await playPromise;
    }
    return { started: true, autoplayBlocked: false };
  } catch {
    // Autoplay blocked by browser policy:
    // Visual sequence and subtitles proceed uninterrupted.
    return { started: false, autoplayBlocked: true };
  }
}

/**
 * Halts any active playback, fades out quickly, and clears timers
 */
export function clearVoicePlayback(): void {
  if (activeSubtitleTimeout) {
    clearTimeout(activeSubtitleTimeout);
    activeSubtitleTimeout = null;
  }

  if (audioInstance) {
    try {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    } catch {
      // Ignore pause errors
    }
  }
}
