import Phaser from 'phaser';

/**
 * Procedural HD texture generator for Warm Cozy Office Game aesthetic.
 * Produces rich, warm-toned textures, animated character sprite sheets, and props.
 */
export class CozyTextureGenerator {
  private textures: Phaser.Textures.TextureManager;

  constructor(textures: Phaser.Textures.TextureManager) {
    this.textures = textures;
  }

  public generateAll() {
    this.createFloorTextures();
    this.createDepartmentFloorTextures();
    this.createWallTextures();
    this.createFurnitureTextures();
    this.createMeetingRoomTextures();
    this.createPantryTextures();
    this.createDepartmentTextures();
    this.createPromptAndEffectTextures();
    this.createLightingTextures();
    this.createPetSprites();
    this.createAllCharacterSpriteSheets();
  }

  private makeCanvas(width: number, height: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  private register(key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
    if (this.textures.exists(key)) return;
    const { canvas, ctx } = this.makeCanvas(width, height);
    draw(ctx);
    this.textures.addCanvas(key, canvas);
  }

  private registerSpriteSheet(key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
    if (this.textures.exists(key)) return;
    const { canvas, ctx } = this.makeCanvas(width, height);
    draw(ctx);
    this.textures.addSpriteSheet(key, canvas as unknown as HTMLImageElement, { frameWidth: 32, frameHeight: 32 });
  }

  // ==========================================
  // 1. FLOOR TILES (Warm honey wood, plush rugs, cafe clay)
  // ==========================================
  private createFloorTextures() {
    // Warm Honey Oak Parquet
    this.register('tile-floor-wood', 32, 32, ctx => {
      // Base honey oak
      ctx.fillStyle = '#D97706'; // Warm amber base
      ctx.fillRect(0, 0, 32, 32);

      // Plank 1 (Top half, left 16px)
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(0, 0, 16, 15);
      // Wood grain lines
      ctx.fillStyle = '#B45309';
      ctx.fillRect(2, 4, 12, 1);
      ctx.fillRect(4, 9, 8, 1);

      // Plank 2 (Top half, right 16px)
      ctx.fillStyle = '#D97706';
      ctx.fillRect(17, 0, 15, 15);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(19, 6, 11, 1);
      ctx.fillRect(21, 11, 9, 1);

      // Plank 3 (Bottom half, shifted)
      ctx.fillStyle = '#B45309';
      ctx.fillRect(0, 17, 24, 15);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(3, 22, 18, 1);
      ctx.fillRect(6, 27, 14, 1);

      // Plank 4 (Bottom right)
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(25, 17, 7, 15);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(26, 24, 5, 1);

      // Subtle bevel highlights & board seam shadows
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, 15, 32, 2); // Horizontal seam
      ctx.fillRect(16, 0, 1, 16);  // Top vertical seam
      ctx.fillRect(24, 16, 1, 16); // Bottom vertical seam

      ctx.fillStyle = '#FDE68A55'; // Warm glossy highlight
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(0, 17, 32, 1);
    });

    // Plush Geometric Rug (Terracotta, Cream & Navy)
    this.register('tile-floor-rug', 32, 32, ctx => {
      // Deep warm base
      ctx.fillStyle = '#1E1B4B';
      ctx.fillRect(0, 0, 32, 32);

      // Woven rug body
      ctx.fillStyle = '#2E1065';
      ctx.fillRect(1, 1, 30, 30);

      // Terracotta & Cream geometric pattern
      ctx.fillStyle = '#C2410C';
      ctx.fillRect(3, 3, 26, 26);

      // Central diamond motif
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.moveTo(16, 6);
      ctx.lineTo(26, 16);
      ctx.lineTo(16, 26);
      ctx.lineTo(6, 16);
      ctx.closePath();
      ctx.fill();

      // Inner navy diamond
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.moveTo(16, 10);
      ctx.lineTo(22, 16);
      ctx.lineTo(16, 22);
      ctx.lineTo(10, 16);
      ctx.closePath();
      ctx.fill();

      // Teal center dot
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(15, 15, 2, 2);

      // Fringe borders
      ctx.fillStyle = '#FDE68A99';
      ctx.fillRect(1, 1, 30, 1);
      ctx.fillRect(1, 30, 30, 1);
    });

    // Cafe Mediterranean Terracotta Tiles
    this.register('tile-floor-cafe', 32, 32, ctx => {
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(0, 0, 32, 32);

      // 4 Warm clay tiles with slight variance
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillStyle = '#C2410C';
      ctx.fillRect(17, 1, 14, 14);
      ctx.fillStyle = '#C2410C';
      ctx.fillRect(1, 17, 14, 14);
      ctx.fillStyle = '#F97316';
      ctx.fillRect(17, 17, 14, 14);

      // Grout
      ctx.fillStyle = '#431407';
      ctx.fillRect(0, 15, 32, 2);
      ctx.fillRect(15, 0, 2, 32);

      // Clay texture dots
      ctx.fillStyle = '#FED7AA44';
      ctx.fillRect(4, 4, 2, 2);
      ctx.fillRect(20, 20, 2, 2);
    });

    // Modern Birch Focus Pod Floor
    this.register('tile-floor-office', 32, 32, ctx => {
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(0, 0, 32, 32);

      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(1, 1, 14, 30);
      ctx.fillRect(17, 1, 14, 30);

      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(0, 0, 32, 1);
      ctx.fillRect(15, 0, 2, 32);
      ctx.fillRect(0, 0, 1, 32);

      // Wood grain
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(4, 8, 8, 1);
      ctx.fillRect(20, 16, 8, 1);
    });
  }

  // ==========================================
  // 2. WALLS & WINDOWS (Exposed brick, loft glass)
  // ==========================================
  private createWallTextures() {
    // Warm Interior Exposed Brick Wall with Wood Baseboard
    this.register('tile-wall-solid', 32, 32, ctx => {
      // Base mortar
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, 0, 32, 32);

      // Brick rows
      const brickColors = ['#9A3412', '#7C2D12', '#C2410C', '#B45309'];
      for (let y = 0; y < 24; y += 6) {
        const offset = (y % 12 === 0) ? 0 : 8;
        for (let x = -8; x < 32; x += 16) {
          const color = brickColors[Math.abs((x + y) / 6) % brickColors.length];
          ctx.fillStyle = color;
          ctx.fillRect(x + offset + 1, y + 1, 14, 4);

          // Brick bevel highlight
          ctx.fillStyle = '#FDBA7444';
          ctx.fillRect(x + offset + 1, y + 1, 14, 1);
        }
      }

      // Warm Chestnut Wood Baseboard at bottom
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, 24, 32, 8);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(0, 24, 32, 2);
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, 31, 32, 1);
    });

    // Sunlit Loft Window Wall (Warm sunlight, distant trees / blue sky)
    this.register('tile-wall-window', 32, 32, ctx => {
      // Wood frame
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, 0, 32, 32);

      // Window panes (Warm daylight vista)
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(3, 3, 12, 12);
      ctx.fillRect(17, 3, 12, 12);
      ctx.fillRect(3, 17, 12, 12);
      ctx.fillRect(17, 17, 12, 12);

      // Distant tree foliage in bottom panes
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.arc(9, 26, 6, 0, Math.PI * 2);
      ctx.arc(23, 27, 7, 0, Math.PI * 2);
      ctx.fill();

      // Soft sunbeam glare lines
      ctx.fillStyle = '#FEF08A88';
      ctx.fillRect(5, 5, 2, 8);
      ctx.fillRect(8, 8, 2, 5);
      ctx.fillRect(19, 5, 2, 8);

      // Window sills
      ctx.fillStyle = '#92400E';
      ctx.fillRect(0, 15, 32, 2);
      ctx.fillRect(15, 0, 2, 32);
      ctx.fillStyle = '#FDE68A66';
      ctx.fillRect(0, 30, 32, 2);
    });

    // Acoustic Glass Divider (Warm brass headers & soft frosting)
    this.register('tile-wall-glass', 32, 32, ctx => {
      // Semi-transparent frosted glass
      ctx.fillStyle = '#38BDF822';
      ctx.fillRect(0, 0, 32, 32);

      // Brass header and footer
      ctx.fillStyle = '#D97706';
      ctx.fillRect(0, 0, 32, 3);
      ctx.fillRect(0, 29, 32, 3);

      // Brass vertical posts
      ctx.fillStyle = '#B45309';
      ctx.fillRect(0, 0, 2, 32);
      ctx.fillRect(30, 0, 2, 32);

      // Glass frosted etched stripes
      ctx.fillStyle = '#FFFFFF44';
      ctx.fillRect(4, 12, 24, 1);
      ctx.fillRect(4, 16, 24, 2);
      ctx.fillRect(4, 20, 24, 1);

      // Glare reflection
      ctx.fillStyle = '#FFFFFF77';
      ctx.fillRect(6, 4, 3, 10);
      ctx.fillRect(12, 8, 2, 6);
    });
  }

  // ==========================================
  // 3. FURNITURE & PROPS (Warm walnut, brass, lush plants, cafe)
  // ==========================================
  private createFurnitureTextures() {
    // 1. Executive Walnut Desk with Curved Ultrawide & Brass Lamp
    this.register('furniture-desk', 32, 32, ctx => {
      // Drop shadow
      ctx.fillStyle = '#00000033';
      ctx.fillRect(2, 28, 28, 4);

      // Solid walnut desktop
      ctx.fillStyle = '#78350F';
      ctx.fillRect(1, 6, 30, 22);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(2, 7, 28, 20);

      // Ultrawide Curved Monitor
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(4, 8, 24, 10);
      // Glowing code screen with emerald & cyan lines
      ctx.fillStyle = '#0284C7';
      ctx.fillRect(6, 9, 20, 8);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(8, 11, 8, 1);
      ctx.fillRect(8, 13, 12, 1);
      ctx.fillRect(8, 15, 6, 1);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(17, 11, 7, 1);
      ctx.fillRect(15, 15, 9, 1);

      // Keyboard with warm RGB backlight
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(9, 20, 14, 5);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(10, 21, 12, 1);

      // Brass Desk Lamp (casts warm light cone)
      ctx.fillStyle = '#D97706';
      ctx.fillRect(26, 17, 3, 5);
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(27, 16, 3, 0, Math.PI * 2);
      ctx.fill();

      // Ceramic coffee mug with latte foam
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(3, 19, 4, 4);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(4, 20, 2, 2);

      // Tiny desk succulent pot
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(4, 10, 3, 3);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(4, 9, 3, 2);
    });

    // 2. Comfortable Ergonomic Upholstered Chair
    this.register('furniture-chair', 32, 32, ctx => {
      // Drop shadow
      ctx.fillStyle = '#00000033';
      ctx.beginPath();
      ctx.ellipse(16, 27, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Chrome 5-star base & casters
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(11, 25, 10, 2);
      ctx.fillRect(15, 23, 2, 4);
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 26, 2, 2);
      ctx.fillRect(20, 26, 2, 2);

      // Upholstered seat (Deep warm navy/charcoal)
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(8, 14, 16, 9);
      ctx.fillStyle = '#334155';
      ctx.fillRect(10, 15, 12, 7);

      // Mesh backrest
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(9, 6, 14, 8);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(11, 7, 10, 6);

      // Armrests
      ctx.fillStyle = '#64748B';
      ctx.fillRect(6, 12, 2, 8);
      ctx.fillRect(24, 12, 2, 8);
    });

    // 3. Warm Oak Boardroom Meeting Table (multi-tile seamless)
    this.register('furniture-meeting-table', 32, 32, ctx => {
      // Wood tabletop
      ctx.fillStyle = '#78350F';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(2, 2, 28, 28);

      // Center wood inlay strip
      ctx.fillStyle = '#B45309';
      ctx.fillRect(0, 15, 32, 2);

      // Brass table lamp / speakerphone hub
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.arc(16, 16, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(16, 16, 3, 0, Math.PI * 2);
      ctx.fill();

      // Open laptops on meeting table
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(5, 5, 8, 6);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(6, 6, 6, 4);

      ctx.fillStyle = '#1E293B';
      ctx.fillRect(19, 21, 8, 6);
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(20, 22, 6, 4);
    });

    // 4. Artisanal Espresso Bar (Wood, Copper, Steaming Machine)
    this.register('furniture-cafe-bar', 32, 32, ctx => {
      // Dark timber counter
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(2, 2, 28, 28);

      // Copper espresso machine
      ctx.fillStyle = '#B45309';
      ctx.fillRect(5, 5, 14, 15);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(6, 6, 12, 13);

      // Pressure gauges & switches
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(9, 9, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(13, 8, 2, 2);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(13, 11, 2, 2);

      // Dual portafilters
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(8, 18, 3, 4);
      ctx.fillRect(13, 18, 3, 4);

      // Glass pastry cloche with croissant
      ctx.fillStyle = '#E0F2FE88';
      ctx.beginPath();
      ctx.arc(24, 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(22, 10, 4, 3);

      // Ceramic cups stack
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(22, 19, 3, 3);
      ctx.fillRect(26, 19, 3, 3);
      ctx.fillRect(24, 16, 3, 3);
    });

    // 5. Retro Lounge Arcade Cabinet (Warm Sunset Wood & CRT Glow)
    this.register('furniture-arcade', 32, 32, ctx => {
      // Cabinet body
      ctx.fillStyle = '#581C87';
      ctx.fillRect(4, 2, 24, 28);
      ctx.fillStyle = '#7E22CE';
      ctx.fillRect(6, 4, 20, 24);

      // Woodgrain side molding
      ctx.fillStyle = '#B45309';
      ctx.fillRect(4, 2, 2, 28);
      ctx.fillRect(26, 2, 2, 28);

      // Glowing Marquee
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(7, 4, 18, 4);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(9, 5, 14, 2);

      // CRT Screen with animated retro game look
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 9, 16, 10);
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(10, 11, 5, 5); // Player sprite
      ctx.fillStyle = '#F43F5E';
      ctx.fillRect(18, 12, 3, 3); // Bug sprite
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(14, 13, 2, 2); // Coin

      // Control panel with joystick and buttons
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 20, 20, 7);
      // Red joystick
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(11, 23, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(10, 24, 2, 3);
      // Yellow & Blue buttons
      ctx.fillStyle = '#EAB308';
      ctx.beginPath();
      ctx.arc(17, 23, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(21, 23, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Lush Monstera Deliciosa Botanical Plant
    this.register('furniture-plant', 32, 32, ctx => {
      // Soft ground drop shadow
      ctx.fillStyle = '#00000033';
      ctx.beginPath();
      ctx.ellipse(16, 27, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Terracotta ceramic pot
      ctx.fillStyle = '#C2410C';
      ctx.fillRect(10, 18, 12, 10);
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(9, 17, 14, 2);
      ctx.fillStyle = '#9A3412';
      ctx.fillRect(11, 19, 10, 8);

      // Soil
      ctx.fillStyle = '#451A03';
      ctx.fillRect(11, 17, 10, 2);

      // Lush layered Monstera leaves with fenestration cuts
      ctx.fillStyle = '#166534';
      ctx.beginPath();
      ctx.arc(12, 12, 7, 0, Math.PI * 2);
      ctx.arc(20, 11, 8, 0, Math.PI * 2);
      ctx.arc(16, 7, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(10, 10, 4, 0, Math.PI * 2);
      ctx.arc(18, 9, 5, 0, Math.PI * 2);
      ctx.arc(15, 6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Leaf veins
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(13, 8, 1, 6);
      ctx.fillRect(18, 8, 1, 5);
    });

    // 7. DevOps Server Rack (Warm Tempered Glass & Pulse LEDs)
    this.register('furniture-rack', 32, 32, ctx => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(3, 2, 26, 28);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(5, 4, 22, 24);

      // Rack servers & flashing LEDs
      for (let y = 6; y < 26; y += 4) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(7, y, 18, 2);

        // Blinking multi-color LEDs
        ctx.fillStyle = (y % 8 === 0) ? '#22C55E' : '#38BDF8';
        ctx.fillRect(8, y, 2, 2);
        ctx.fillStyle = (y % 12 === 0) ? '#F59E0B' : '#10B981';
        ctx.fillRect(12, y, 2, 2);
        ctx.fillStyle = (y % 6 === 0) ? '#06B6D4' : '#A855F7';
        ctx.fillRect(16, y, 2, 2);
      }

      // Glass door sheen
      ctx.fillStyle = '#38BDF822';
      ctx.fillRect(5, 4, 22, 24);
      ctx.fillStyle = '#FFFFFF44';
      ctx.fillRect(8, 6, 2, 18);
    });

    // 8. Water Cooler with Clear Bubbling Dome
    this.register('furniture-watercooler', 32, 32, ctx => {
      // Body
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(9, 13, 14, 16);
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(10, 14, 12, 14);

      // Spouts (Cold & Hot)
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(12, 19, 2, 3);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(18, 19, 2, 3);

      // Glass water bottle with water ripple
      ctx.fillStyle = '#0284C7AA';
      ctx.fillRect(10, 3, 12, 10);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(11, 4, 10, 8);
      ctx.fillStyle = '#BAE6FD';
      ctx.fillRect(12, 5, 3, 6);
      // Water bubble
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(17, 8, 2, 2);
    });

    // 9. Retro Cream Snack Fridge with Sticky Notes
    this.register('furniture-fridge', 32, 32, ctx => {
      // Rounded retro fridge body
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(4, 2, 24, 28);
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(6, 4, 20, 24);

      // Split door seam
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(5, 14, 22, 2);

      // Chrome vintage handles
      ctx.fillStyle = '#475569';
      ctx.fillRect(23, 7, 2, 5);
      ctx.fillRect(23, 18, 2, 5);

      // Colorful sticky notes & magnets
      ctx.fillStyle = '#FDE047'; // Yellow post-it
      ctx.fillRect(8, 6, 4, 4);
      ctx.fillStyle = '#F472B6'; // Pink post-it
      ctx.fillRect(14, 7, 4, 4);
      ctx.fillStyle = '#38BDF8'; // Blue magnet
      ctx.fillRect(9, 19, 3, 3);
    });

    // 10. Deep Cozy Emerald Linen Lounge Sofa
    this.register('furniture-sofa', 32, 32, ctx => {
      // Drop shadow
      ctx.fillStyle = '#00000033';
      ctx.beginPath();
      ctx.ellipse(16, 27, 14, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sofa frame (warm dark walnut)
      ctx.fillStyle = '#451A03';
      ctx.fillRect(2, 6, 28, 22);

      // Cozy Emerald fabric cushions
      ctx.fillStyle = '#065F46';
      ctx.fillRect(4, 8, 24, 18);
      ctx.fillStyle = '#047857';
      ctx.fillRect(5, 9, 10, 8);
      ctx.fillRect(17, 9, 10, 8);

      // Seat cushions
      ctx.fillStyle = '#059669';
      ctx.fillRect(5, 17, 10, 8);
      ctx.fillRect(17, 17, 10, 8);

      // Mustard Yellow throw pillow
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(5, 12, 5, 5);
    });

    // 11. Circular Sherpa Pet Bed
    this.register('furniture-pet-bed', 32, 32, ctx => {
      ctx.fillStyle = '#00000022';
      ctx.beginPath();
      ctx.ellipse(16, 18, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Outer rim
      ctx.fillStyle = '#B45309';
      ctx.beginPath();
      ctx.ellipse(16, 16, 13, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Fluffy sherpa interior
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.ellipse(16, 16, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Red tartan plaid mini blanket
      ctx.fillStyle = '#DC2626';
      ctx.fillRect(12, 13, 8, 6);
      ctx.fillStyle = '#FEF08A';
      ctx.fillRect(14, 13, 1, 6);
      ctx.fillRect(12, 15, 8, 1);
    });
  }

  // ==========================================
  // 4. PROMPTS, CLICK MARKER & EMOTES
  // ==========================================
  private createPromptAndEffectTextures() {
    // Warm In-Game Dialogue Prompt [E]
    this.register('prompt-e-talk', 54, 22, ctx => {
      // Warm dark translucent pill
      ctx.fillStyle = '#1E1B4BF0';
      ctx.beginPath();
      ctx.roundRect(1, 1, 52, 20, 6);
      ctx.fill();

      // Warm Amber Border
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(1, 1, 52, 20, 6);
      ctx.stroke();

      ctx.fillStyle = '#FEF08A';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('💬 [E] Talk', 5, 14);
    });

    // All-Hands Pod Prompt
    this.register('prompt-e-meeting', 68, 22, ctx => {
      ctx.fillStyle = '#2E1065F0';
      ctx.beginPath();
      ctx.roundRect(1, 1, 66, 20, 6);
      ctx.fill();

      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(1, 1, 66, 20, 6);
      ctx.stroke();

      ctx.fillStyle = '#F3E8FF';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('☕ [E] All-Hands', 5, 14);
    });

    // Click-to-Move Animated Concentric Ripple Marker
    this.register('effect-click-marker', 32, 32, ctx => {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(16, 16, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#FEF08A88';
      ctx.beginPath();
      ctx.arc(16, 16, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Petting Heart Emote Bubble
    this.register('icon-heart-bubble', 24, 24, ctx => {
      ctx.fillStyle = '#FFFFFFEE';
      ctx.beginPath();
      ctx.roundRect(2, 2, 20, 18, 5);
      ctx.fill();

      // Red Heart
      ctx.fillStyle = '#EF4444';
      ctx.font = '12px sans-serif';
      ctx.fillText('❤️', 5, 15);
    });
  }

  // ==========================================
  // 5. OFFICE PET: "PIXEL THE CORGI" SPRITE SHEET
  // ==========================================
  private createPetSprites() {
    // 4-frame sprite sheet: 128x32 (32px per frame)
    // Frame 0: Walk Left, Frame 1: Walk Right, Frame 2: Stand/Pant, Frame 3: Sleeping
    this.registerSpriteSheet('pet-corgi', 128, 32, ctx => {
      for (let f = 0; f < 4; f++) {
        const ox = f * 32;

        // Shadow
        ctx.fillStyle = '#00000022';
        ctx.beginPath();
        ctx.ellipse(ox + 16, 26, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        if (f === 3) {
          // Sleeping curled up
          ctx.fillStyle = '#D97706'; // Golden fur
          ctx.beginPath();
          ctx.arc(ox + 16, 20, 8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(ox + 16, 22, 5, 0, Math.PI * 2);
          ctx.fill();
          // Ears
          ctx.fillStyle = '#B45309';
          ctx.beginPath();
          ctx.arc(ox + 12, 14, 3, 0, Math.PI * 2);
          ctx.fill();
          // Zzz text
          ctx.fillStyle = '#38BDF8';
          ctx.font = 'bold 8px monospace';
          ctx.fillText('Zzz', ox + 18, 12);
        } else {
          // Standing / Walking
          const bounce = (f === 0 || f === 1) ? 1 : 0;

          // Body
          ctx.fillStyle = '#D97706';
          ctx.fillRect(ox + 8, 13 + bounce, 14, 9);
          // White chest & belly
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(ox + 16, 15 + bounce, 6, 7);

          // Head
          ctx.fillStyle = '#D97706';
          ctx.fillRect(ox + 18, 9 + bounce, 9, 8);
          // White blaze on snout
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(ox + 23, 13 + bounce, 4, 4);
          // Black nose
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(ox + 26, 14 + bounce, 2, 2);
          // Eye
          ctx.fillStyle = '#0F172A';
          ctx.fillRect(ox + 22, 11 + bounce, 2, 2);

          // Corgi Ears
          ctx.fillStyle = '#B45309';
          ctx.fillRect(ox + 19, 4 + bounce, 3, 6);
          ctx.fillRect(ox + 23, 4 + bounce, 3, 6);
          ctx.fillStyle = '#FED7AA';
          ctx.fillRect(ox + 20, 5 + bounce, 1, 4);
          ctx.fillRect(ox + 24, 5 + bounce, 1, 4);

          // Little paws
          ctx.fillStyle = '#FFFFFF';
          const legShift = f === 0 ? 2 : f === 1 ? -2 : 0;
          ctx.fillRect(ox + 10 + legShift, 22, 3, 5);
          ctx.fillRect(ox + 18 - legShift, 22, 3, 5);

          // Nub tail wagging
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(ox + 6, 14 + bounce - (f % 2), 3, 3);
        }
      }
    });
  }

  // ==========================================
  // 6. DETAILED CHARACTER SPRITE SHEETS (4 Directions x 4 Frames)
  // ==========================================
  private createAllCharacterSpriteSheets() {
    const characters = [
      {
        id: 'char-owner',
        name: 'The Owner (CEO)',
        hairColor: '#334155',
        hairStyle: 'slick',
        outfitColor: '#1E3A8A', // Navy tailored blazer
        accentColor: '#F59E0B', // Gold pocket square & crisp shirt
        pantsColor: '#1E293B',
        shoesColor: '#0F172A',
        detail: 'watch'
      },
      {
        id: 'char-sarah',
        name: 'Sarah (PM)',
        hairColor: '#78350F',
        hairStyle: 'bob',
        outfitColor: '#B45309', // Warm amber blazer
        accentColor: '#FEF3C7', // Silk blouse
        pantsColor: '#451A03',
        shoesColor: '#78350F',
        detail: 'tablet'
      },
      {
        id: 'char-maya',
        name: 'Maya (Head of Product)',
        hairColor: '#3B0764',
        hairStyle: 'bun',
        outfitColor: '#831843', // Burgundy turtleneck
        accentColor: '#FCE7F3',
        pantsColor: '#1F2937',
        shoesColor: '#111827',
        detail: 'glasses'
      },
      {
        id: 'char-uma',
        name: 'Uma (Lead Design)',
        hairColor: '#581C87',
        hairStyle: 'curly',
        outfitColor: '#7C3AED', // Cozy violet oversized knit sweater
        accentColor: '#DDD6FE',
        pantsColor: '#312E81',
        shoesColor: '#06B6D4',
        detail: 'headphones'
      },
      {
        id: 'char-dana',
        name: 'Dana (Frontend)',
        hairColor: '#0E7490',
        hairStyle: 'short',
        outfitColor: '#0891B2', // Warm cyan tech hoodie
        accentColor: '#CFFAFE',
        pantsColor: '#0F172A',
        shoesColor: '#38BDF8',
        detail: 'hoodie'
      },
      {
        id: 'char-dev',
        name: 'Dev (Backend)',
        hairColor: '#064E3B',
        hairStyle: 'parted',
        outfitColor: '#047857', // Forest green flannel
        accentColor: '#D1FAE5',
        pantsColor: '#1E293B',
        shoesColor: '#D97706',
        detail: 'mug'
      },
      {
        id: 'char-owen',
        name: 'Owen (DevOps)',
        hairColor: '#7F1D1D',
        hairStyle: 'short',
        outfitColor: '#C2410C', // Rust utility vest
        accentColor: '#FFEDD5',
        pantsColor: '#374151',
        shoesColor: '#1F2937',
        detail: 'lanyard'
      },
      {
        id: 'char-quinn',
        name: 'Quinn (QA)',
        hairColor: '#1E3A8A',
        hairStyle: 'ponytail',
        outfitColor: '#2563EB', // Blue work jacket
        accentColor: '#DBEAFE',
        pantsColor: '#1E293B',
        shoesColor: '#10B981',
        detail: 'badge'
      }
    ];

    for (const c of characters) {
      this.drawFullCharacterSpriteSheet(c);
    }
  }

  /**
   * Generates a 128x128 sprite sheet for a character.
   * 4 rows: Row 0 = Down, Row 1 = Left, Row 2 = Right, Row 3 = Up
   * 4 columns (each 32x32):
   *   Col 0: Step Left
   *   Col 1: Idle
   *   Col 2: Step Right
   *   Col 3: Desk Work / Action (typing with glowing screen reflection)
   */
  private drawFullCharacterSpriteSheet(c: {
    id: string;
    hairColor: string;
    hairStyle: string;
    outfitColor: string;
    accentColor: string;
    pantsColor: string;
    shoesColor: string;
    detail: string;
  }) {
    this.registerSpriteSheet(c.id, 128, 128, ctx => {
      const directions = ['down', 'left', 'right', 'up'];

      directions.forEach((dir, row) => {
        for (let col = 0; col < 4; col++) {
          const ox = col * 32;
          const oy = row * 32;

          // 1. Soft Ground Drop Shadow
          ctx.fillStyle = '#00000033';
          ctx.beginPath();
          ctx.ellipse(ox + 16, oy + 30, 8, 3, 0, 0, Math.PI * 2);
          ctx.fill();

          const isWalking = col === 0 || col === 2;
          const isTyping = col === 3;
          const bob = isWalking ? 1 : 0;

          // Leg positions for walk cycle
          let legLOffset = 0;
          let legROffset = 0;
          if (col === 0) {
            legLOffset = -2;
            legROffset = 2;
          } else if (col === 2) {
            legLOffset = 2;
            legROffset = -2;
          }

          if (isTyping) {
            // Typing at desk state (leaning forward, hands up, screen reflection)
            this.drawCharBody(ctx, ox, oy - 1, dir, c);
            this.drawCharHead(ctx, ox, oy - 1, dir, c);

            // Typing Hands
            ctx.fillStyle = '#FED7AA';
            ctx.fillRect(ox + 11, oy + 21, 3, 3);
            ctx.fillRect(ox + 18, oy + 21, 3, 3);

            // Subtle cyan monitor glow on face
            ctx.fillStyle = '#38BDF833';
            ctx.fillRect(ox + 10, oy + 8, 12, 10);
          } else {
            // Walking / Standing State
            // Draw Legs
            ctx.fillStyle = c.pantsColor;
            if (dir === 'left' || dir === 'right') {
              ctx.fillRect(ox + 14 + legLOffset, oy + 23 - bob, 4, 7);
              ctx.fillRect(ox + 14 + legROffset, oy + 23 - bob, 4, 7);
            } else {
              ctx.fillRect(ox + 11, oy + 23 + legLOffset - bob, 4, 7);
              ctx.fillRect(ox + 17, oy + 23 + legROffset - bob, 4, 7);
            }

            // Shoes
            ctx.fillStyle = c.shoesColor;
            ctx.fillRect(ox + 10, oy + 29 + Math.max(0, legLOffset) - bob, 5, 2);
            ctx.fillRect(ox + 17, oy + 29 + Math.max(0, legROffset) - bob, 5, 2);

            // Draw Torso & Arms
            this.drawCharBody(ctx, ox, oy - bob, dir, c);

            // Draw Head & Hair
            this.drawCharHead(ctx, ox, oy - bob, dir, c);

            // Special detail accessory
            this.drawCharDetail(ctx, ox, oy - bob, dir, c);
          }
        }
      });
    });
  }

  private drawCharBody(
    ctx: CanvasRenderingContext2D,
    ox: number,
    oy: number,
    dir: string,
    c: { outfitColor: string; accentColor: string; hairColor: string }
  ) {
    // Torso / Sweater / Blazer
    ctx.fillStyle = c.outfitColor;
    ctx.fillRect(ox + 9, oy + 13, 14, 11);

    // Collar / Inner Shirt
    ctx.fillStyle = c.accentColor;
    if (dir === 'down') {
      ctx.fillRect(ox + 14, oy + 13, 4, 5);
    } else if (dir === 'left') {
      ctx.fillRect(ox + 11, oy + 13, 3, 5);
    } else if (dir === 'right') {
      ctx.fillRect(ox + 18, oy + 13, 3, 5);
    } // Up shows solid back of blazer

    // Arms
    ctx.fillStyle = c.outfitColor;
    if (dir === 'left') {
      ctx.fillRect(ox + 12, oy + 14, 4, 8);
    } else if (dir === 'right') {
      ctx.fillRect(ox + 16, oy + 14, 4, 8);
    } else {
      ctx.fillRect(ox + 7, oy + 14, 3, 8);
      ctx.fillRect(ox + 22, oy + 14, 3, 8);
    }

    // Hands
    ctx.fillStyle = '#FED7AA';
    if (dir === 'left') {
      ctx.fillRect(ox + 13, oy + 21, 3, 2);
    } else if (dir === 'right') {
      ctx.fillRect(ox + 16, oy + 21, 3, 2);
    } else {
      ctx.fillRect(ox + 7, oy + 21, 3, 2);
      ctx.fillRect(ox + 22, oy + 21, 3, 2);
    }
  }

  private drawCharHead(
    ctx: CanvasRenderingContext2D,
    ox: number,
    oy: number,
    dir: string,
    c: { hairColor: string; hairStyle: string }
  ) {
    // Warm Skin Tone
    ctx.fillStyle = '#FED7AA';
    ctx.fillRect(ox + 11, oy + 6, 10, 8);

    if (dir === 'down') {
      // Eyes with highlight
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(ox + 13, oy + 9, 2, 2);
      ctx.fillRect(ox + 17, oy + 9, 2, 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ox + 13, oy + 9, 1, 1);
      ctx.fillRect(ox + 17, oy + 9, 1, 1);
      // Gentle smile
      ctx.fillStyle = '#EA580C';
      ctx.fillRect(ox + 15, oy + 12, 2, 1);
    } else if (dir === 'left') {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(ox + 12, oy + 9, 2, 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ox + 12, oy + 9, 1, 1);
    } else if (dir === 'right') {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(ox + 18, oy + 9, 2, 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ox + 19, oy + 9, 1, 1);
    }

    // Hair
    ctx.fillStyle = c.hairColor;
    if (dir === 'up') {
      // Full back of hair
      ctx.fillRect(ox + 10, oy + 3, 12, 11);
    } else {
      // Front & sides of hair
      ctx.fillRect(ox + 10, oy + 3, 12, 4);
      ctx.fillRect(ox + 9, oy + 4, 3, 7);
      ctx.fillRect(ox + 20, oy + 4, 3, 7);

      if (c.hairStyle === 'curly') {
        ctx.beginPath();
        ctx.arc(ox + 9, oy + 6, 3, 0, Math.PI * 2);
        ctx.arc(ox + 23, oy + 6, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.hairStyle === 'bun') {
        ctx.beginPath();
        ctx.arc(ox + 16, oy + 2, 3, 0, Math.PI * 2);
        ctx.fill();
      } else if (c.hairStyle === 'bob') {
        ctx.fillRect(ox + 9, oy + 8, 3, 4);
        ctx.fillRect(ox + 20, oy + 8, 3, 4);
      }
    }
  }

  private drawCharDetail(
    ctx: CanvasRenderingContext2D,
    ox: number,
    oy: number,
    dir: string,
    c: { detail: string }
  ) {
    if (c.detail === 'headphones') {
      // Cyan wireless headphones
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(ox + 8, oy + 7, 2, 5);
      ctx.fillRect(ox + 22, oy + 7, 2, 5);
      ctx.fillRect(ox + 10, oy + 2, 12, 2);
    } else if (c.detail === 'tablet') {
      // PM Agile tablet
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(ox + 6, oy + 16, 4, 6);
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(ox + 7, oy + 17, 2, 4);
    } else if (c.detail === 'glasses' && dir === 'down') {
      // Stylish dark frames
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(ox + 12, oy + 8, 3, 1);
      ctx.fillRect(ox + 17, oy + 8, 3, 1);
      ctx.fillRect(ox + 15, oy + 8, 2, 1);
    } else if (c.detail === 'mug') {
      // Steaming coffee mug
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(ox + 22, oy + 18, 4, 4);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(ox + 23, oy + 19, 2, 2);
    } else if (c.detail === 'lanyard' && dir === 'down') {
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(ox + 15, oy + 14, 2, 6);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(ox + 14, oy + 19, 4, 3);
    }
  }

  // ==========================================
  // 7. MEETING ROOM DETAILED PROPS
  // ==========================================
  private createMeetingRoomTextures() {
    // Projector Screen (wall-mounted, active glow)
    this.register('furniture-projector-screen', 32, 32, ctx => {
      // Mount bracket
      ctx.fillStyle = '#64748B';
      ctx.fillRect(13, 0, 6, 3);
      // Screen frame
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(3, 3, 26, 20);
      // Screen surface
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(5, 5, 22, 16);
      // Projected bar chart
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(7, 13, 3, 7);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(11, 10, 3, 10);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(15, 8, 3, 12);
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(19, 11, 3, 9);
      // Glow halo
      ctx.fillStyle = '#38BDF811';
      ctx.fillRect(0, 2, 32, 24);
    });

    // Whiteboard with Colored Sticky Notes
    this.register('furniture-whiteboard', 32, 32, ctx => {
      // Chrome frame
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(1, 1, 30, 26);
      // White surface
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(2, 2, 28, 24);
      // Marker tray
      ctx.fillStyle = '#64748B';
      ctx.fillRect(4, 26, 24, 3);
      // Markers
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(6, 26, 4, 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(12, 26, 4, 2);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(18, 26, 4, 2);
      // Sticky notes
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(4, 4, 6, 5);
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(12, 3, 6, 5);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(20, 5, 6, 5);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(5, 12, 6, 5);
      ctx.fillStyle = '#FB923C';
      ctx.fillRect(13, 13, 6, 5);
      // Handwritten scribble lines
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(21, 14, 7, 1);
      ctx.fillRect(22, 16, 5, 1);
      ctx.fillRect(6, 19, 8, 1);
      ctx.fillRect(7, 21, 10, 1);
    });

    // Individual Meeting Chair (compact top-down)
    this.register('furniture-meeting-chair', 32, 32, ctx => {
      // Shadow
      ctx.fillStyle = '#00000022';
      ctx.beginPath();
      ctx.ellipse(16, 24, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      // Seat cushion
      ctx.fillStyle = '#334155';
      ctx.fillRect(9, 14, 14, 10);
      ctx.fillStyle = '#475569';
      ctx.fillRect(10, 15, 12, 8);
      // Backrest
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(10, 8, 12, 7);
      ctx.fillStyle = '#334155';
      ctx.fillRect(11, 9, 10, 5);
      // Chrome legs
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(10, 24, 2, 3);
      ctx.fillRect(20, 24, 2, 3);
    });
  }

  // ==========================================
  // 8. PANTRY / KITCHEN PROPS
  // ==========================================
  private createPantryTextures() {
    // Kitchen Counter Segment
    this.register('furniture-kitchen-counter', 32, 32, ctx => {
      // Counter body
      ctx.fillStyle = '#451A03';
      ctx.fillRect(0, 8, 32, 20);
      // Granite countertop
      ctx.fillStyle = '#374151';
      ctx.fillRect(0, 6, 32, 6);
      ctx.fillStyle = '#4B5563';
      ctx.fillRect(1, 7, 30, 4);
      // Granite speckle
      ctx.fillStyle = '#6B7280';
      ctx.fillRect(5, 8, 1, 1);
      ctx.fillRect(12, 9, 1, 1);
      ctx.fillRect(20, 8, 1, 1);
      ctx.fillRect(27, 9, 1, 1);
      // Cabinet doors
      ctx.fillStyle = '#78350F';
      ctx.fillRect(2, 14, 12, 12);
      ctx.fillRect(18, 14, 12, 12);
      // Handles
      ctx.fillStyle = '#D97706';
      ctx.fillRect(12, 19, 2, 3);
      ctx.fillRect(18, 19, 2, 3);
      ctx.fillStyle = '#1C1917';
      ctx.fillRect(0, 28, 32, 2);
    });

    // Professional Coffee Machine
    this.register('furniture-coffee-machine', 32, 32, ctx => {
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 2, 20, 22);
      ctx.fillStyle = '#334155';
      ctx.fillRect(8, 4, 16, 18);
      // Chrome top
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(6, 0, 20, 3);
      // Steam nozzle
      ctx.fillStyle = '#64748B';
      ctx.fillRect(14, 3, 4, 3);
      // Pressure gauge
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(12, 9, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(12, 7, 1, 3);
      // Buttons
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(18, 8, 3, 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(18, 11, 3, 2);
      // Drip tray & portafilter
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(10, 16, 12, 3);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(12, 14, 3, 4);
      ctx.fillRect(17, 14, 3, 4);
      // Cup
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(13, 19, 4, 3);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(14, 20, 2, 1);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(6, 24, 20, 3);
    });

    // Microwave
    this.register('furniture-microwave', 32, 32, ctx => {
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(4, 8, 24, 16);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(5, 9, 22, 14);
      // Window
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(6, 10, 14, 11);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(7, 11, 12, 9);
      ctx.fillStyle = '#FDE68A33';
      ctx.fillRect(8, 12, 4, 3);
      // Control panel
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(22, 10, 4, 11);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(23, 12, 2, 2);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(23, 15, 2, 2);
      // Handle
      ctx.fillStyle = '#64748B';
      ctx.fillRect(20, 13, 1, 5);
    });

    // Mug Rack (wall-mounted)
    this.register('furniture-mug-rack', 32, 32, ctx => {
      // Shelf
      ctx.fillStyle = '#78350F';
      ctx.fillRect(2, 10, 28, 3);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(2, 10, 28, 1);
      // Brackets
      ctx.fillStyle = '#451A03';
      ctx.fillRect(4, 13, 2, 6);
      ctx.fillRect(26, 13, 2, 6);
      // Hooks
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(7, 13, 1, 3);
      ctx.fillRect(13, 13, 1, 3);
      ctx.fillRect(19, 13, 1, 3);
      ctx.fillRect(25, 13, 1, 3);
      // Mugs (4 colors)
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(5, 15, 5, 5);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(11, 15, 5, 5);
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(17, 15, 5, 5);
      ctx.fillStyle = '#F472B6';
      ctx.fillRect(23, 15, 5, 5);
    });

    // Dining Table (round birch)
    this.register('furniture-dining-table', 32, 32, ctx => {
      ctx.fillStyle = '#00000022';
      ctx.beginPath();
      ctx.ellipse(16, 26, 12, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#D97706';
      ctx.beginPath();
      ctx.ellipse(16, 16, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.ellipse(16, 15, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Leg
      ctx.fillStyle = '#78350F';
      ctx.fillRect(14, 22, 4, 5);
      // Plate & cup
      ctx.fillStyle = '#F8FAFC';
      ctx.beginPath();
      ctx.arc(12, 14, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(18, 13, 3, 4);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(19, 14, 1, 2);
    });

    // Snack Rack (colorful)
    this.register('furniture-snack-rack', 32, 32, ctx => {
      // Frame
      ctx.fillStyle = '#64748B';
      ctx.fillRect(3, 2, 26, 28);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(4, 3, 24, 26);
      // Shelves
      ctx.fillStyle = '#64748B';
      ctx.fillRect(4, 10, 24, 1);
      ctx.fillRect(4, 18, 24, 1);
      // Top shelf - chips
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(5, 4, 5, 6);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(11, 4, 5, 6);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(17, 4, 5, 6);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(23, 4, 4, 6);
      // Middle shelf - cookies
      ctx.fillStyle = '#92400E';
      ctx.fillRect(5, 11, 6, 7);
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(12, 11, 5, 7);
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(18, 11, 5, 7);
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(24, 11, 4, 7);
      // Bottom shelf - drinks
      ctx.fillStyle = '#06B6D4';
      ctx.fillRect(6, 19, 4, 8);
      ctx.fillStyle = '#F97316';
      ctx.fillRect(11, 19, 4, 8);
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(16, 19, 4, 8);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(21, 19, 4, 8);
    });
  }

  // ==========================================
  // 9. DEPARTMENT-SPECIFIC PROPS
  // ==========================================
  private createDepartmentTextures() {
    // PM Kanban Board (To Do / Doing / Done)
    this.register('furniture-kanban-board', 32, 32, ctx => {
      ctx.fillStyle = '#78350F';
      ctx.fillRect(1, 1, 30, 28);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(2, 2, 28, 26);
      // Column dividers
      ctx.fillStyle = '#451A03';
      ctx.fillRect(11, 2, 1, 26);
      ctx.fillRect(21, 2, 1, 26);
      // Headers
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(3, 3, 7, 3);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(13, 3, 7, 3);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(23, 3, 7, 3);
      // Todo stickies
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(3, 8, 7, 4);
      ctx.fillStyle = '#FB923C';
      ctx.fillRect(3, 14, 7, 4);
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(3, 20, 7, 4);
      // Doing stickies
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(13, 8, 7, 4);
      ctx.fillStyle = '#A78BFA';
      ctx.fillRect(13, 14, 7, 4);
      // Done stickies with checkmarks
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(23, 8, 7, 4);
      ctx.fillStyle = '#86EFAC';
      ctx.fillRect(23, 14, 7, 4);
      ctx.fillStyle = '#166534';
      ctx.fillRect(26, 9, 1, 2);
      ctx.fillRect(27, 10, 1, 1);
      ctx.fillRect(26, 15, 1, 2);
      ctx.fillRect(27, 16, 1, 1);
    });

    // Timeline Chart
    this.register('furniture-timeline-chart', 32, 32, ctx => {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(2, 2, 28, 26);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.strokeRect(2, 2, 28, 26);
      // Timeline line
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(5, 15, 22, 2);
      // Milestone dots
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(8, 16, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(16, 16, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#22C55E';
      ctx.beginPath();
      ctx.arc(24, 16, 3, 0, Math.PI * 2);
      ctx.fill();
      // Labels
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(6, 7, 6, 1);
      ctx.fillRect(6, 9, 4, 1);
      ctx.fillRect(14, 21, 6, 1);
      ctx.fillRect(14, 23, 4, 1);
    });

    // Mood Board (cork board)
    this.register('furniture-mood-board', 32, 32, ctx => {
      ctx.fillStyle = '#B45309';
      ctx.fillRect(1, 1, 30, 28);
      ctx.fillStyle = '#D97706';
      ctx.fillRect(2, 2, 28, 26);
      // Pinned photo
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(3, 3, 8, 7);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(4, 4, 6, 5);
      // Color swatches
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(13, 4, 4, 4);
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(18, 4, 4, 4);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(23, 4, 4, 4);
      // Fabric swatch
      ctx.fillStyle = '#059669';
      ctx.fillRect(4, 14, 7, 6);
      ctx.fillStyle = '#10B981';
      ctx.fillRect(5, 15, 5, 4);
      // Typography sample
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(14, 12, 10, 7);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(15, 14, 8, 1);
      ctx.fillRect(15, 16, 6, 1);
      // Push pins
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(6, 3, 2, 2);
      ctx.fillRect(16, 3, 2, 2);
      ctx.fillRect(7, 13, 2, 2);
    });

    // Drawing Tablet Desk
    this.register('furniture-drawing-tablet', 32, 32, ctx => {
      // Desk
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(2, 8, 28, 18);
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(3, 9, 26, 16);
      // Tablet
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(5, 10, 18, 12);
      ctx.fillStyle = '#334155';
      ctx.fillRect(6, 11, 16, 10);
      // Design on screen
      ctx.fillStyle = '#8B5CF6';
      ctx.beginPath();
      ctx.arc(14, 16, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(10, 13, 3, 3);
      // Stylus
      ctx.fillStyle = '#64748B';
      ctx.fillRect(24, 12, 2, 10);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(24, 11, 2, 2);
      // Palette dots
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(26, 14, 2, 2);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(26, 17, 2, 2);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(26, 20, 2, 2);
    });

    // Bookshelf
    this.register('furniture-bookshelf', 32, 32, ctx => {
      ctx.fillStyle = '#451A03';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#78350F';
      ctx.fillRect(3, 3, 26, 26);
      // Shelf divider
      ctx.fillStyle = '#451A03';
      ctx.fillRect(3, 15, 26, 2);
      // Top books
      ctx.fillStyle = '#1E40AF';
      ctx.fillRect(4, 4, 4, 11);
      ctx.fillStyle = '#BE123C';
      ctx.fillRect(9, 5, 3, 10);
      ctx.fillStyle = '#065F46';
      ctx.fillRect(13, 3, 5, 12);
      ctx.fillStyle = '#7C2D12';
      ctx.fillRect(19, 5, 3, 10);
      ctx.fillStyle = '#581C87';
      ctx.fillRect(23, 4, 5, 11);
      // Bottom books
      ctx.fillStyle = '#0E7490';
      ctx.fillRect(4, 17, 5, 11);
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(10, 18, 4, 10);
      ctx.fillStyle = '#1E3A8A';
      ctx.fillRect(15, 17, 3, 11);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(19, 19, 4, 9);
      // Small plant
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(24, 18, 4, 4);
      ctx.fillStyle = '#C2410C';
      ctx.fillRect(25, 22, 3, 4);
    });

    // Color Swatches (wall grid)
    this.register('furniture-color-swatches', 32, 32, ctx => {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(2, 2, 28, 26);
      const colors = [
        '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
        '#14B8A6', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
        '#D946EF', '#EC4899', '#F43F5E', '#FB7185', '#FCA5A1', '#FDBA74',
        '#FDE047', '#BEF264', '#6EE7B7', '#67E8F9', '#93C5FD', '#C4B5FD'
      ];
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
          ctx.fillStyle = colors[row * 6 + col];
          ctx.fillRect(4 + col * 4, 4 + row * 6, 3, 5);
        }
      }
    });

    // Dual Monitor Setup
    this.register('furniture-dual-monitor', 32, 32, ctx => {
      ctx.fillStyle = '#00000033';
      ctx.fillRect(2, 28, 28, 4);
      // Desk
      ctx.fillStyle = '#78350F';
      ctx.fillRect(1, 16, 30, 14);
      ctx.fillStyle = '#92400E';
      ctx.fillRect(2, 17, 28, 12);
      // Monitor 1
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(2, 4, 13, 10);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(3, 5, 11, 8);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(4, 6, 6, 1);
      ctx.fillRect(4, 8, 8, 1);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(4, 10, 5, 1);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(7, 14, 3, 3);
      // Monitor 2
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(17, 4, 13, 10);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(18, 5, 11, 8);
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(19, 6, 7, 1);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(19, 8, 5, 1);
      ctx.fillRect(19, 10, 9, 1);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(22, 14, 3, 3);
      // Keyboard
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(8, 20, 16, 5);
      ctx.fillStyle = '#334155';
      ctx.fillRect(9, 21, 14, 3);
      ctx.fillStyle = '#F59E0B44';
      ctx.fillRect(9, 24, 14, 1);
      // Mouse
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(26, 21, 3, 4);
    });

    // Mini Server Tower
    this.register('furniture-server-mini', 32, 32, ctx => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(6, 4, 20, 24);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(8, 6, 16, 20);
      // Dividers
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 11, 16, 1);
      ctx.fillRect(8, 17, 16, 1);
      ctx.fillRect(8, 23, 16, 1);
      // LEDs
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(10, 7, 2, 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(10, 13, 2, 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(10, 19, 2, 2);
      // Drive bays
      ctx.fillStyle = '#334155';
      ctx.fillRect(14, 7, 8, 3);
      ctx.fillRect(14, 13, 8, 3);
      ctx.fillRect(14, 19, 8, 3);
    });

    // Device Shelf (QA phones & tablets)
    this.register('furniture-device-shelf', 32, 32, ctx => {
      ctx.fillStyle = '#64748B';
      ctx.fillRect(2, 2, 28, 28);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(3, 3, 26, 26);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(3, 15, 26, 1);
      // Phones
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(5, 5, 4, 8);
      ctx.fillStyle = '#38BDF8';
      ctx.fillRect(6, 6, 2, 6);
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(11, 5, 4, 8);
      ctx.fillStyle = '#4ADE80';
      ctx.fillRect(12, 6, 2, 6);
      // Tablet
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(17, 4, 8, 10);
      ctx.fillStyle = '#A855F7';
      ctx.fillRect(18, 5, 6, 8);
      // Bottom shelf
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(5, 17, 4, 8);
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(6, 18, 2, 6);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(12, 17, 7, 9);
      ctx.fillStyle = '#EC4899';
      ctx.fillRect(13, 18, 5, 7);
      // Cables
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(22, 20, 5, 1);
      ctx.fillRect(22, 23, 5, 1);
    });

    // Test Matrix Board
    this.register('furniture-test-board', 32, 32, ctx => {
      ctx.fillStyle = '#F1F5F9';
      ctx.fillRect(1, 1, 30, 28);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 1;
      ctx.strokeRect(1, 1, 30, 28);
      // Title bar
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(2, 2, 28, 4);
      // Grid
      ctx.fillStyle = '#CBD5E1';
      for (let gx = 0; gx < 5; gx++) {
        ctx.fillRect(7 + gx * 5, 6, 1, 22);
      }
      for (let gy = 0; gy < 5; gy++) {
        ctx.fillRect(2, 10 + gy * 4, 28, 1);
      }
      // Green checks
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(9, 7, 2, 2);
      ctx.fillRect(14, 7, 2, 2);
      ctx.fillRect(9, 11, 2, 2);
      ctx.fillRect(19, 11, 2, 2);
      ctx.fillRect(24, 11, 2, 2);
      ctx.fillRect(14, 15, 2, 2);
      ctx.fillRect(24, 15, 2, 2);
      ctx.fillRect(9, 19, 2, 2);
      ctx.fillRect(14, 19, 2, 2);
      ctx.fillRect(19, 19, 2, 2);
      ctx.fillRect(9, 23, 2, 2);
      ctx.fillRect(14, 23, 2, 2);
      ctx.fillRect(19, 23, 2, 2);
      ctx.fillRect(24, 23, 2, 2);
      // Red fails
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(19, 7, 2, 2);
      ctx.fillRect(24, 7, 2, 2);
      ctx.fillRect(14, 11, 2, 2);
      ctx.fillRect(9, 15, 2, 2);
      // Yellow pending
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(19, 15, 2, 2);
      ctx.fillRect(24, 19, 2, 2);
    });

    // Portrait Monitor
    this.register('furniture-portrait-monitor', 32, 32, ctx => {
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(8, 2, 16, 22);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(9, 3, 14, 20);
      // Mobile preview content
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(10, 4, 12, 18);
      ctx.fillStyle = '#3B82F6';
      ctx.fillRect(10, 4, 12, 3);
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(12, 9, 8, 1);
      ctx.fillRect(12, 11, 6, 1);
      ctx.fillRect(12, 13, 9, 1);
      ctx.fillRect(12, 15, 5, 1);
      // Nav bar
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(10, 19, 12, 3);
      ctx.fillStyle = '#64748B';
      ctx.fillRect(12, 20, 2, 1);
      ctx.fillRect(16, 20, 2, 1);
      ctx.fillRect(20, 20, 2, 1);
      // Stand
      ctx.fillStyle = '#64748B';
      ctx.fillRect(14, 24, 4, 2);
      ctx.fillRect(10, 26, 12, 2);
    });

    // Desk Divider Panel
    this.register('furniture-desk-divider', 32, 32, ctx => {
      ctx.fillStyle = '#CBD5E144';
      ctx.fillRect(14, 4, 4, 22);
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(14, 4, 4, 2);
      ctx.fillRect(14, 24, 4, 2);
      ctx.fillRect(15, 4, 2, 22);
      ctx.fillStyle = '#FFFFFF33';
      ctx.fillRect(15, 8, 2, 4);
      ctx.fillRect(15, 16, 2, 4);
    });

    // Floor Lamp
    this.register('furniture-floor-lamp', 32, 32, ctx => {
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.ellipse(16, 28, 6, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#D97706';
      ctx.fillRect(15, 6, 2, 22);
      ctx.fillStyle = '#FEF3C7';
      ctx.fillRect(8, 2, 16, 8);
      ctx.fillStyle = '#FDE68A';
      ctx.fillRect(9, 3, 14, 6);
      ctx.fillStyle = '#FDE68A44';
      ctx.beginPath();
      ctx.arc(16, 6, 12, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ==========================================
  // 10. DEPARTMENT-SPECIFIC FLOOR TEXTURES
  // ==========================================
  private createDepartmentFloorTextures() {
    // PM Area - Soft Blue-Gray Carpet
    this.register('tile-floor-pm', 32, 32, ctx => {
      ctx.fillStyle = '#1E3A5F';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#1E40AF';
      ctx.fillRect(0, 0, 16, 16);
      ctx.fillRect(16, 16, 16, 16);
      ctx.fillStyle = '#2563EB22';
      for (let y = 0; y < 32; y += 2) {
        ctx.fillRect(0, y, 32, 1);
      }
      ctx.fillStyle = '#3B82F622';
      ctx.fillRect(14, 6, 4, 4);
      ctx.fillRect(14, 22, 4, 4);
    });

    // Design Studio - Warm Creative Floor
    this.register('tile-floor-design', 32, 32, ctx => {
      ctx.fillStyle = '#FDF2F8';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#FBCFE8';
      ctx.fillRect(0, 0, 8, 16);
      ctx.fillRect(8, 8, 8, 16);
      ctx.fillRect(16, 0, 8, 16);
      ctx.fillRect(24, 8, 8, 16);
      ctx.fillStyle = '#F9A8D4';
      ctx.fillRect(2, 4, 4, 1);
      ctx.fillRect(10, 12, 4, 1);
      ctx.fillRect(18, 4, 4, 1);
      ctx.fillRect(26, 12, 4, 1);
      ctx.fillStyle = '#EC489944';
      ctx.fillRect(8, 0, 1, 32);
      ctx.fillRect(16, 0, 1, 32);
      ctx.fillRect(24, 0, 1, 32);
    });

    // QA Lab - Clean Tech Vinyl
    this.register('tile-floor-qa', 32, 32, ctx => {
      ctx.fillStyle = '#D1D5DB';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#E5E7EB';
      ctx.fillRect(1, 1, 14, 14);
      ctx.fillRect(17, 17, 14, 14);
      ctx.fillStyle = '#F3F4F6';
      ctx.fillRect(17, 1, 14, 14);
      ctx.fillRect(1, 17, 14, 14);
      ctx.fillStyle = '#9CA3AF';
      ctx.fillRect(0, 15, 32, 2);
      ctx.fillRect(15, 0, 2, 32);
      ctx.fillStyle = '#6B728022';
      ctx.fillRect(4, 4, 2, 2);
      ctx.fillRect(20, 20, 2, 2);
    });
  }

  // ==========================================
  // 11. PARTICLE & LIGHTING TEXTURES
  // ==========================================
  private createLightingTextures() {
    // Sunbeam Particle
    this.register('particle-sunbeam', 8, 8, ctx => {
      ctx.fillStyle = '#FDE68A';
      ctx.beginPath();
      ctx.arc(4, 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FEF08A88';
      ctx.beginPath();
      ctx.arc(4, 4, 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Typing Spark
    this.register('particle-typing-spark', 4, 4, ctx => {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(1, 1, 2, 2);
    });
  }
}
