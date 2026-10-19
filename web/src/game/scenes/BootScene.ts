import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Generate all pixel textures procedurally
    this.createFloorTextures();
    this.createWallTextures();
    this.createFurnitureTextures();
    this.createCharacterTextures();
    this.createPromptTextures();
  }

  create() {
    this.scene.start('OfficeScene');
  }

  // Helper to create a 32x32 canvas texture
  private makeTexture(key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
    if (this.textures.exists(key)) return;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    this.textures.addCanvas(key, canvas);
  }

  private createFloorTextures() {
    // 1. Wood Floor
    this.makeTexture('tile-floor-wood', 32, 32, ctx => {
      ctx.fillStyle = '#C29B62';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#B08850';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 16, 32, 1);
      ctx.fillRect(16, 0, 1, 16);
      ctx.fillRect(8, 16, 1, 16);
      ctx.fillStyle = '#D4AC73';
      ctx.fillRect(1, 1, 14, 1);
      ctx.fillRect(17, 1, 14, 1);
    });

    // 2. Light Office Tile
    this.makeTexture('tile-floor-office', 32, 32, ctx => {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 0, 1, 32);
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(1, 1, 30, 1);
      ctx.fillRect(1, 1, 1, 30);
    });

    // 3. Meeting / Lounge Rug
    this.makeTexture('tile-floor-rug', 32, 32, ctx => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#334155';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(4, 4, 24, 1);
      ctx.fillRect(4, 27, 24, 1);
      ctx.fillRect(4, 4, 1, 24);
      ctx.fillRect(27, 4, 1, 24);
    });

    // 4. Cafe Checkered Floor
    this.makeTexture('tile-floor-cafe', 32, 32, ctx => {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillRect(16, 16, 16, 16);
    });
  }

  private createWallTextures() {
    // Solid Wall with baseboard
    this.makeTexture('tile-wall-solid', 32, 32, ctx => {
      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 32, 28);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 26, 32, 2);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 28, 32, 4);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(0, 0, 32, 2);
    });

    // Glass Partition
    this.makeTexture('tile-wall-glass', 32, 32, ctx => {
      ctx.fillStyle = '#38BDF822';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(0, 0, 32, 3);
      ctx.fillRect(0, 29, 32, 3);
      ctx.fillRect(0, 0, 2, 32);
      ctx.fillRect(30, 0, 2, 32);
      // Glare lines
      ctx.fillStyle = '#FFFFFF88';
      ctx.fillRect(6, 6, 2, 16);
      ctx.fillRect(10, 10, 2, 12);
    });

    // Top Window Wall
    this.makeTexture('tile-wall-window', 32, 32, ctx => {
      ctx.fillStyle = '#64748B';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(4, 4, 24, 20);
      ctx.fillStyle = '#E0F2FE';
      ctx.fillRect(6, 6, 8, 16);
      ctx.fillStyle = '#334155';
      ctx.fillRect(15, 4, 2, 20);
      ctx.fillRect(4, 14, 24, 2);
    });
  }

  private createFurnitureTextures() {
    // Desk with dual monitors
    this.makeTexture('furniture-desk', 32, 32, ctx => {
      // Wood tabletop
      ctx.fillStyle = '#854D0E';
      ctx.fillRect(1, 4, 30, 24);
      ctx.fillStyle = '#A16207';
      ctx.fillRect(2, 5, 28, 22);
      // Left monitor
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 7, 10, 7);
      ctx.fillStyle = '#22D3EE';
      ctx.fillRect(5, 8, 8, 5);
      // Right monitor
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(16, 7, 10, 7);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(17, 8, 8, 5);
      // Keyboard
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 18, 12, 4);
    });

    // Ergonomic Chair
    this.makeTexture('furniture-chair', 32, 32, ctx => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(10, 8, 12, 14);
      ctx.fillStyle = '#334155';
      ctx.fillRect(11, 9, 10, 12);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 14, 2, 6);
      ctx.fillRect(22, 14, 2, 6);
      ctx.fillRect(14, 22, 4, 6);
    });

    // Meeting Table
    this.makeTexture('furniture-meeting-table', 32, 32, ctx => {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(2, 2, 28, 28);
      // Microphone / Laptop
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(11, 11, 10, 8);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(12, 12, 8, 6);
    });

    // Watercooler
    this.makeTexture('furniture-watercooler', 32, 32, ctx => {
      // Body
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(8, 12, 16, 18);
      // Spout
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(11, 18, 3, 4);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(18, 18, 3, 4);
      // Bottle
      ctx.fillStyle = '#0284C7AA';
      ctx.fillRect(9, 2, 14, 10);
      ctx.fillStyle = '#BAE6FD';
      ctx.fillRect(11, 3, 4, 8);
    });

    // Cafe Espresso Bar
    this.makeTexture('furniture-cafe-bar', 32, 32, ctx => {
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(2, 2, 28, 28);
      // Espresso machine
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(6, 6, 12, 14);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(8, 9, 3, 3);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(13, 9, 3, 3);
      // Steam
      ctx.fillStyle = '#FFFFFF66';
      ctx.fillRect(9, 3, 2, 2);
    });

    // Lunch Fridge
    this.makeTexture('furniture-fridge', 32, 32, ctx => {
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(4, 2, 24, 28);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(6, 4, 20, 11);
      ctx.fillRect(6, 17, 20, 11);
      // Handles
      ctx.fillStyle = '#475569';
      ctx.fillRect(23, 7, 2, 5);
      ctx.fillRect(23, 19, 2, 5);
      // Post-it note
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(8, 6, 4, 4);
    });

    // Server Rack (DevOps)
    this.makeTexture('furniture-rack', 32, 32, ctx => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(4, 4, 24, 24);
      // Server slots
      for (let y = 6; y < 26; y += 4) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(6, y, 20, 2);
        // Blinking LEDs
        ctx.fillStyle = (y % 8 === 0) ? '#22C55E' : '#38BDF8';
        ctx.fillRect(8, y, 2, 2);
        ctx.fillStyle = (y % 12 === 0) ? '#F59E0B' : '#22C55E';
        ctx.fillRect(12, y, 2, 2);
      }
    });

    // Arcade Cabinet
    this.makeTexture('furniture-arcade', 32, 32, ctx => {
      ctx.fillStyle = '#581C87';
      ctx.fillRect(4, 2, 24, 28);
      ctx.fillStyle = '#7E22CE';
      ctx.fillRect(6, 4, 20, 24);
      // Screen
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 7, 16, 10);
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(10, 9, 6, 6);
      ctx.fillStyle = '#FACC15';
      ctx.fillRect(18, 11, 4, 4);
      // Joystick
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(12, 19, 2, 3);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(18, 20, 3, 2);
    });

    // Lounge Sofa
    this.makeTexture('furniture-sofa', 32, 32, ctx => {
      ctx.fillStyle = '#0F766E';
      ctx.fillRect(2, 6, 28, 20);
      ctx.fillStyle = '#14B8A6';
      ctx.fillRect(4, 8, 24, 16);
      ctx.fillStyle = '#0D9488';
      ctx.fillRect(4, 16, 24, 6);
    });

    // Potted Plant
    this.makeTexture('furniture-plant', 32, 32, ctx => {
      // Pot
      ctx.fillStyle = '#B45309';
      ctx.fillRect(10, 18, 12, 12);
      // Leaves
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.arc(16, 12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(14, 10, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private createCharacterTextures() {
    // 1. Owner (Player) - Navy blazer, crisp collar, 4 frames
    this.drawCharSprite('char-owner', '#1E3A8A', '#F1F5F9', '#1E293B', '#F59E0B');
    
    // 2. Sarah (PM) - Business casual, warm amber, clipboard
    this.drawCharSprite('char-sarah', '#B45309', '#FDE68A', '#78350F', '#EA580C');

    // 3. Maya (Head of Product) - Rose blazer, laptop bag
    this.drawCharSprite('char-maya', '#BE185D', '#FCE7F3', '#831843', '#475569');

    // 4. Uma (Lead Design) - Purple oversized sweater, cyan headphones
    this.drawCharSprite('char-uma', '#6D28D9', '#DDD6FE', '#4C1D95', '#06B6D4');

    // 5. Dana (Frontend) - Cyan hoodie, keyboard motif
    this.drawCharSprite('char-dana', '#0891B2', '#CFFAFE', '#155E75', '#3B82F6');

    // 6. Dev (Backend) - Emerald dark shirt, coffee mug
    this.drawCharSprite('char-dev', '#047857', '#D1FAE5', '#064E3B', '#D97706');

    // 7. Owen (DevOps) - Amber/Red cargo, lanyard
    this.drawCharSprite('char-owen', '#B91C1C', '#FEE2E2', '#7F1D1D', '#F59E0B');

    // 8. Quinn (QA) - Blue tech vest, testing tablet
    this.drawCharSprite('char-quinn', '#1D4ED8', '#DBEAFE', '#1E40AF', '#10B981');
  }

  private drawCharSprite(key: string, primaryColor: string, accentColor: string, hairColor: string, detailColor: string) {
    this.makeTexture(key, 32, 32, ctx => {
      // Head / Hair
      ctx.fillStyle = hairColor;
      ctx.fillRect(10, 3, 12, 6);
      ctx.fillStyle = '#FED7AA'; // Skin tone
      ctx.fillRect(11, 7, 10, 8);
      // Eyes
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(13, 9, 2, 2);
      ctx.fillRect(17, 9, 2, 2);
      // Torso / Outfit
      ctx.fillStyle = primaryColor;
      ctx.fillRect(9, 15, 14, 10);
      // Shirt / Accent
      ctx.fillStyle = accentColor;
      ctx.fillRect(13, 15, 6, 6);
      // Special detail (badge, clipboard, headphones, etc.)
      ctx.fillStyle = detailColor;
      ctx.fillRect(7, 17, 3, 5);
      // Legs
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(11, 25, 4, 6);
      ctx.fillRect(17, 25, 4, 6);
      // Shoes
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(10, 30, 5, 2);
      ctx.fillRect(17, 30, 5, 2);
    });
  }

  private createPromptTextures() {
    this.makeTexture('prompt-e-talk', 48, 20, ctx => {
      ctx.fillStyle = '#0F172ACC';
      ctx.fillRect(0, 0, 48, 20);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(0, 0, 48, 1);
      ctx.fillRect(0, 19, 48, 1);
      ctx.fillRect(0, 0, 1, 20);
      ctx.fillRect(47, 0, 1, 20);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('💬 [E]', 6, 14);
    });

    this.makeTexture('prompt-e-meeting', 64, 20, ctx => {
      ctx.fillStyle = '#1E1B4BEE';
      ctx.fillRect(0, 0, 64, 20);
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(0, 0, 64, 1);
      ctx.fillRect(0, 19, 64, 1);
      ctx.fillRect(0, 0, 1, 20);
      ctx.fillRect(63, 0, 1, 20);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('📞 [E] POD', 5, 14);
    });
  }
}
