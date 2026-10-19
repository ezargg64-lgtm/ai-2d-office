import Phaser from 'phaser';
import { CozyTextureGenerator } from '../graphics/CozyTextureGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Generate all warm cozy textures procedurally
    const generator = new CozyTextureGenerator(this.textures);
    generator.generateAll();
  }

  create() {
    // Register all character directional walk and idle animations
    const charIds = [
      'char-owner',
      'char-sarah',
      'char-maya',
      'char-uma',
      'char-dana',
      'char-dev',
      'char-owen',
      'char-quinn'
    ];

    for (const id of charIds) {
      // Down (Row 0: 0, 1, 2, 3)
      this.anims.create({
        key: `${id}-walk-down`,
        frames: this.anims.generateFrameNumbers(id, { frames: [0, 1, 2, 1] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${id}-idle-down`,
        frames: [{ key: id, frame: 1 }],
        frameRate: 1
      });
      this.anims.create({
        key: `${id}-idle-work`,
        frames: this.anims.generateFrameNumbers(id, { frames: [1, 3] }),
        frameRate: 2,
        repeat: -1
      });

      // Left (Row 1: 4, 5, 6, 7)
      this.anims.create({
        key: `${id}-walk-left`,
        frames: this.anims.generateFrameNumbers(id, { frames: [4, 5, 6, 5] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${id}-idle-left`,
        frames: [{ key: id, frame: 5 }],
        frameRate: 1
      });

      // Right (Row 2: 8, 9, 10, 11)
      this.anims.create({
        key: `${id}-walk-right`,
        frames: this.anims.generateFrameNumbers(id, { frames: [8, 9, 10, 9] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${id}-idle-right`,
        frames: [{ key: id, frame: 9 }],
        frameRate: 1
      });

      // Up (Row 3: 12, 13, 14, 15)
      this.anims.create({
        key: `${id}-walk-up`,
        frames: this.anims.generateFrameNumbers(id, { frames: [12, 13, 14, 13] }),
        frameRate: 8,
        repeat: -1
      });
      this.anims.create({
        key: `${id}-idle-up`,
        frames: [{ key: id, frame: 13 }],
        frameRate: 1
      });
    }

    // Office Pet Corgi Animations
    this.anims.create({
      key: 'corgi-walk',
      frames: this.anims.generateFrameNumbers('pet-corgi', { frames: [0, 1] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'corgi-idle',
      frames: [{ key: 'pet-corgi', frame: 2 }],
      frameRate: 1
    });
    this.anims.create({
      key: 'corgi-sleep',
      frames: [{ key: 'pet-corgi', frame: 3 }],
      frameRate: 1
    });

    this.scene.start('OfficeScene');
  }
}
