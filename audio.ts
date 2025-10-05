// Base64 encoded sound effects for the game.
// These are short, royalty-free sounds suitable for a web game.

const paddleHitSound = 'assets/ballhit.mp3'
const tableBounceSound = 'assets/bounce.mp3';
const pointScoredSound = 'assets/point.mp3';
const gameOverSound = 'assets/over.mp3';
const menuClickSound = 'assets/click.mp3'

type SoundEffect = 'paddle_hit' | 'table_bounce' | 'point_scored' | 'game_over' | 'menu_click';

const audioSources: Record<SoundEffect, string> = {
  paddle_hit: paddleHitSound,
  table_bounce: tableBounceSound,
  point_scored: pointScoredSound,
  game_over: gameOverSound,
  menu_click: menuClickSound,
};

class AudioManager {
  private audioElements: Map<SoundEffect, HTMLAudioElement> = new Map();
  private isUnlocked = false;

  constructor() {
    // This check ensures audio is only initialized in the browser environment.
    if (typeof window !== 'undefined') {
      for (const key in audioSources) {
        const soundName = key as SoundEffect;
        const audio = new Audio(audioSources[soundName]);
        audio.preload = 'auto';
        this.audioElements.set(soundName, audio);
      }
    }
  }

   policies.
  unlockAudio() {
    if (this.isUnlocked || typeof window === 'undefined') return;
    // Play and immediately pause a sound to "unlock" audio on the browser.
    const sound = this.audioElements.get('menu_click');
    if (sound) {
      sound.play().then(() => {
        sound.pause();
        this.isUnlocked = true;
      }).catch(() => {
        // Autoplay was blocked, user needs to interact more.
      });
    }
  }

  play(soundName: SoundEffect) {
    if (!this.isUnlocked) return;
    
    const audio = this.audioElements.get(soundName);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        // This can happen if the user hasn't interacted with the page yet.
        // console.warn(`Could not play sound: ${soundName}`, error);
      });
    }
  }
}

export const audioManager = new AudioManager();