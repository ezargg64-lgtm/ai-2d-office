import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { OfficeScene } from './scenes/OfficeScene';

export function createGameConfig(container: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: container,
    width: container.clientWidth || 1024,
    height: container.clientHeight || 768,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: '#0F172A',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false
      }
    },
    scene: [BootScene, OfficeScene]
  };
}
