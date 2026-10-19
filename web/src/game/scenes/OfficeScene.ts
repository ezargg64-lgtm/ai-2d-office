import Phaser from 'phaser';
import { eventBus } from '../eventBus';
import { soundEffects } from '../audio/SoundEffects';

interface AgentData {
  id: string;
  name: string;
  role: string;
  spriteKey: string;
  deskX: number;
  deskY: number;
  chairX: number;
  chairY: number;
  meetingChairX: number;
  meetingChairY: number;
  statusText: string;
}

export class OfficeScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    interact: Phaser.Input.Keyboard.Key;
    shift: Phaser.Input.Keyboard.Key;
  };
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private agentsGroup!: Phaser.Physics.Arcade.Group;
  private agentSprites: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
  private agentLabels: Map<string, Phaser.GameObjects.Text> = new Map();
  private speechBubbles: Map<string, Phaser.GameObjects.Container> = new Map();

  // Pet Corgi
  private corgi!: Phaser.Physics.Arcade.Sprite;
  private corgiState: 'wander' | 'idle' | 'sleep' = 'wander';

  // Interaction prompts
  private talkPrompt!: Phaser.GameObjects.Image;
  private meetingPrompt!: Phaser.GameObjects.Image;
  private activeTarget: { type: 'agent' | 'meeting' | 'cafe' | 'arcade' | 'terminal' | 'corgi' | 'water'; id?: string } | null = null;
  private hoveredAgentId: string | null = null;

  // Day/Night and Warm Lighting
  private dayNightOverlay!: Phaser.GameObjects.Rectangle;
  private warmLightSprites: Phaser.GameObjects.Arc[] = [];
  private dayCycleTimer: number = 0;
  private readonly DAY_CYCLE_DURATION = 12 * 60 * 1000; // 12 minutes
  private mobileVelocity = { x: 0, y: 0 };
  private isGatheredInMeeting = false;

  // Click-to-move waypoint
  private targetWaypoint: { x: number; y: number } | null = null;
  private clickMarker!: Phaser.GameObjects.Image;

  // Movement state & audio throttle
  private lastFootstepTime: number = 0;
  private facingDirection: 'down' | 'left' | 'right' | 'up' = 'down';
  private isSprinting: boolean = false;
  private speedBuffMultiplier: number = 1.0;

  // Ambient banter timer
  private banterTimer: number = 0;

  private agentsList: AgentData[] = [
    {
      id: 'sarah',
      name: 'Sarah',
      role: 'PM',
      spriteKey: 'char-sarah',
      deskX: 6 * 32,
      deskY: 15 * 32,
      chairX: 6 * 32,
      chairY: 16 * 32,
      meetingChairX: 14 * 32,
      meetingChairY: 5 * 32,
      statusText: 'Tracking sprint metrics & unblocking QA'
    },
    {
      id: 'maya',
      name: 'Maya',
      role: 'Product',
      spriteKey: 'char-maya',
      deskX: 5 * 32,
      deskY: 5 * 32,
      chairX: 5 * 32,
      chairY: 6 * 32,
      meetingChairX: 15 * 32,
      meetingChairY: 3 * 32,
      statusText: 'Reviewing PRD v2.1 with executive team'
    },
    {
      id: 'uma',
      name: 'Uma',
      role: 'Design',
      spriteKey: 'char-uma',
      deskX: 34 * 32,
      deskY: 5 * 32,
      chairX: 34 * 32,
      chairY: 6 * 32,
      meetingChairX: 17 * 32,
      meetingChairY: 3 * 32,
      statusText: 'Polishing 16-bit cozy visual themes'
    },
    {
      id: 'dana',
      name: 'Dana',
      role: 'Frontend',
      spriteKey: 'char-dana',
      deskX: 25 * 32,
      deskY: 5 * 32,
      chairX: 25 * 32,
      chairY: 6 * 32,
      meetingChairX: 19 * 32,
      meetingChairY: 3 * 32,
      statusText: 'Optimizing Phaser 3 canvas 60FPS render loop'
    },
    {
      id: 'dev',
      name: 'Dev',
      role: 'Backend',
      spriteKey: 'char-dev',
      deskX: 28 * 32,
      deskY: 5 * 32,
      chairX: 28 * 32,
      chairY: 6 * 32,
      meetingChairX: 20 * 32,
      meetingChairY: 5 * 32,
      statusText: 'Hardening REST endpoints & data persistence'
    },
    {
      id: 'owen',
      name: 'Owen',
      role: 'DevOps',
      spriteKey: 'char-owen',
      deskX: 34 * 32,
      deskY: 22 * 32,
      chairX: 34 * 32,
      chairY: 23 * 32,
      meetingChairX: 19 * 32,
      meetingChairY: 7 * 32,
      statusText: 'Container CPU at 1.2%, CI/CD green'
    },
    {
      id: 'quinn',
      name: 'Quinn',
      role: 'QA',
      spriteKey: 'char-quinn',
      deskX: 34 * 32,
      deskY: 15 * 32,
      chairX: 34 * 32,
      chairY: 16 * 32,
      meetingChairX: 16 * 32,
      meetingChairY: 7 * 32,
      statusText: 'Running touch gesture regression test suite'
    }
  ];

  constructor() {
    super('OfficeScene');
  }

  create() {
    const mapW = 40;
    const mapH = 30;
    const tileSize = 32;
    const worldW = mapW * tileSize;
    const worldH = mapH * tileSize;

    this.physics.world.setBounds(0, 0, worldW, worldH);

    // 1. Build Office Tilemap Layout with Warm Cozy Textures
    this.obstacles = this.physics.add.staticGroup();
    this.buildOfficeFloorAndWalls(mapW, mapH, tileSize);

    // 2. Spawn Agents at desks with Typing/Work Animation
    this.agentsGroup = this.physics.add.group();
    this.spawnAgents();

    // 3. Spawn Office Pet (Pixel the Corgi)
    this.spawnOfficePet(tileSize);

    // 4. Spawn Player (Owner/CEO) at entrance
    this.player = this.physics.add.sprite(20 * tileSize, 27 * tileSize, 'char-owner');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(18, 18);
    this.player.setOffset(7, 14);
    this.player.setDepth(20);
    this.player.play('char-owner-idle-down');

    // Setup Collisions
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.agentsGroup, this.obstacles);
    this.physics.add.collider(this.corgi, this.obstacles);
    this.physics.add.collider(this.player, this.agentsGroup);

    // 5. Setup Camera Follow with Smooth Zoom
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(1.0);

    // Camera Zoom with Mouse Wheel
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gameObjects: unknown[], _deltaX: number, deltaY: number) => {
      const currentZoom = this.cameras.main.zoom;
      const newZoom = Phaser.Math.Clamp(currentZoom - deltaY * 0.001, 0.8, 1.4);
      this.cameras.main.setZoom(newZoom);
    });

    // 6. Click-to-Move / Tap-to-Move Waypoint Navigation
    this.clickMarker = this.add.image(0, 0, 'effect-click-marker').setDepth(45).setVisible(false);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // If clicking directly on world canvas
      if (pointer.y > 60 && pointer.y < this.scale.height - 70) {
        const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.setClickWaypoint(worldPoint.x, worldPoint.y);
      }
    });

    // 7. Input Controls (Keyboard)
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      shift: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    };

    // 8. Interaction Prompts
    this.talkPrompt = this.add.image(0, 0, 'prompt-e-talk').setDepth(50).setVisible(false);
    this.meetingPrompt = this.add.image(0, 0, 'prompt-e-meeting').setDepth(50).setVisible(false);

    // 9. Day/Night Warm Lighting Overlay & Cozy Light Halos
    this.dayNightOverlay = this.add.rectangle(worldW / 2, worldH / 2, worldW, worldH, 0x1e1b4b, 0.0);
    this.dayNightOverlay.setDepth(1040);
    this.createWarmLightZones();

    // 10. Ambient Particles: Coffee Steam, Window Sunbeams & Typing Sparks
    this.createAmbientAtmosphere(tileSize);

    // 11. Event Bus Listeners
    eventBus.on('meeting:gather', () => this.gatherAgentsForMeeting());
    eventBus.on('meeting:dismiss', () => this.dismissAgentsToDesks());
    eventBus.on('mobile:move', (vel: { x: number; y: number }) => {
      this.mobileVelocity = vel;
      if (vel.x !== 0 || vel.y !== 0) {
        this.targetWaypoint = null;
        this.clickMarker.setVisible(false);
      }
    });
    eventBus.on('mobile:action', () => this.triggerInteraction());
    eventBus.on('buff:speed', (multiplier: number) => {
      this.speedBuffMultiplier = multiplier;
      this.time.delayedCall(90000, () => {
        this.speedBuffMultiplier = 1.0;
      });
    });
    eventBus.on('camera:zoomIn', () => {
      const z = Math.min(1.4, this.cameras.main.zoom + 0.15);
      this.cameras.main.setZoom(z);
    });
    eventBus.on('camera:zoomOut', () => {
      const z = Math.max(0.8, this.cameras.main.zoom - 0.15);
      this.cameras.main.setZoom(z);
    });

    // 12. Periodic Ambient Banter & Pet Wander
    this.time.addEvent({
      delay: 18000,
      callback: this.triggerRandomAgentBanter,
      callbackScope: this,
      loop: true
    });

    this.time.addEvent({
      delay: 12000,
      callback: this.updateCorgiBehavior,
      callbackScope: this,
      loop: true
    });
  }

  update(_time: number, delta: number) {
    this.handlePlayerMovement(delta);
    this.checkProximityTriggers();
    this.updateDayNightCycle(delta);
    this.updateDepthSorting();

    // Publish player position for radar minimap
    eventBus.emit('player:pos', {
      x: this.player.x / (40 * 32),
      y: this.player.y / (30 * 32)
    });
  }

  private setClickWaypoint(x: number, y: number) {
    this.targetWaypoint = { x, y };
    this.clickMarker.setPosition(x, y).setVisible(true).setScale(0.5).setAlpha(1);

    soundEffects.playInteractionPing();

    this.tweens.killTweensOf(this.clickMarker);
    this.tweens.add({
      targets: this.clickMarker,
      scale: 1.2,
      alpha: 0.2,
      duration: 600,
      ease: 'Sine.easeOut',
      yoyo: true,
      repeat: -1
    });
  }

  private handlePlayerMovement(delta: number) {
    const baseSpeed = 140;
    this.isSprinting = this.wasd.shift.isDown;
    const speed = baseSpeed * (this.isSprinting ? 1.65 : 1.0) * this.speedBuffMultiplier;

    let vx = 0;
    let vy = 0;

    // Check Keyboard inputs
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      vx = -speed;
      this.targetWaypoint = null;
      this.clickMarker.setVisible(false);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      vx = speed;
      this.targetWaypoint = null;
      this.clickMarker.setVisible(false);
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      vy = -speed;
      this.targetWaypoint = null;
      this.clickMarker.setVisible(false);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      vy = speed;
      this.targetWaypoint = null;
      this.clickMarker.setVisible(false);
    }

    // Mobile Virtual Joystick override
    if (this.mobileVelocity.x !== 0 || this.mobileVelocity.y !== 0) {
      vx = this.mobileVelocity.x * speed;
      vy = this.mobileVelocity.y * speed;
    }

    // Click-to-Move waypoint navigation
    if (this.targetWaypoint && vx === 0 && vy === 0) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.targetWaypoint.x, this.targetWaypoint.y);
      if (dist < 10) {
        this.targetWaypoint = null;
        this.clickMarker.setVisible(false);
        this.player.setVelocity(0, 0);
      } else {
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.targetWaypoint.x, this.targetWaypoint.y);
        vx = Math.cos(angle) * speed;
        vy = Math.sin(angle) * speed;
      }
    }

    // Diagonal normalization
    if (vx !== 0 && vy !== 0 && !this.targetWaypoint) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.player.setVelocity(vx, vy);

    // Directional facing & Walk animation
    const isMoving = Math.abs(vx) > 5 || Math.abs(vy) > 5;

    if (isMoving) {
      if (Math.abs(vx) > Math.abs(vy)) {
        this.facingDirection = vx > 0 ? 'right' : 'left';
        this.player.play(`char-owner-walk-${this.facingDirection}`, true);
      } else {
        this.facingDirection = vy > 0 ? 'down' : 'up';
        this.player.play(`char-owner-walk-${this.facingDirection}`, true);
      }

      // Footstep sound synthesis
      this.lastFootstepTime += delta;
      const stepInterval = this.isSprinting ? 220 : 330;
      if (this.lastFootstepTime >= stepInterval) {
        this.lastFootstepTime = 0;
        soundEffects.playFootstep('wood');
      }
    } else {
      this.player.play(`char-owner-idle-${this.facingDirection}`, true);
    }

    // Key E interaction
    if (Phaser.Input.Keyboard.JustDown(this.wasd.interact)) {
      this.triggerInteraction();
    }
  }

  private checkProximityTriggers() {
    const px = this.player.x;
    const py = this.player.y;
    let foundTarget = false;

    // 1. Proximity to Meeting Table (x: 17*32, y: 5*32)
    const distToMeeting = Phaser.Math.Distance.Between(px, py, 17 * 32, 5 * 32);
    if (distToMeeting < 64) {
      this.clearAgentHighlight();
      this.activeTarget = { type: 'meeting' };
      this.meetingPrompt.setPosition(17 * 32, 3.5 * 32).setVisible(true).setDepth(1015);
      this.talkPrompt.setVisible(false);
      foundTarget = true;
      return;
    }

    // 2. Proximity to Artisanal Cafe Bar (x: 17*32, y: 14*32)
    const distToCafe = Phaser.Math.Distance.Between(px, py, 17 * 32, 14 * 32);
    if (distToCafe < 52) {
      this.clearAgentHighlight();
      this.activeTarget = { type: 'cafe' };
      this.talkPrompt.setPosition(17 * 32, 13 * 32).setVisible(true).setDepth(1015);
      this.meetingPrompt.setVisible(false);
      foundTarget = true;
      return;
    }

    // 3. Proximity to Lounge Arcade Cabinet (x: 16*32, y: 22*32)
    const distToArcade = Phaser.Math.Distance.Between(px, py, 16 * 32, 22 * 32);
    if (distToArcade < 48) {
      this.clearAgentHighlight();
      this.activeTarget = { type: 'arcade' };
      this.talkPrompt.setPosition(16 * 32, 21 * 32).setVisible(true).setDepth(1015);
      this.meetingPrompt.setVisible(false);
      foundTarget = true;
      return;
    }

    // 4. Proximity to DevOps Server Rack (x: 36*32, y: 22*32)
    const distToTerminal = Phaser.Math.Distance.Between(px, py, 36 * 32, 22 * 32);
    if (distToTerminal < 48) {
      this.clearAgentHighlight();
      this.activeTarget = { type: 'terminal' };
      this.talkPrompt.setPosition(36 * 32, 20.5 * 32).setVisible(true).setDepth(1015);
      this.meetingPrompt.setVisible(false);
      foundTarget = true;
      return;
    }

    // 5. Proximity to Office Pet Corgi
    if (this.corgi) {
      const distToCorgi = Phaser.Math.Distance.Between(px, py, this.corgi.x, this.corgi.y);
      if (distToCorgi < 42) {
        this.clearAgentHighlight();
        this.activeTarget = { type: 'corgi' };
        this.talkPrompt.setPosition(this.corgi.x, this.corgi.y - 20).setVisible(true).setDepth(1015);
        this.meetingPrompt.setVisible(false);
        foundTarget = true;
        return;
      }
    }

    // 6. Proximity to each Agent
    for (const [id, sprite] of this.agentSprites.entries()) {
      const dist = Phaser.Math.Distance.Between(px, py, sprite.x, sprite.y);
      if (dist < 48) {
        if (this.hoveredAgentId !== id) {
          this.clearAgentHighlight();
          this.hoveredAgentId = id;
          sprite.setTint(0xFFE4B5); // Warm highlight glow
          this.showEmoteBubble(sprite.x, sprite.y, '💬');
        }
        this.activeTarget = { type: 'agent', id };
        this.talkPrompt.setPosition(sprite.x, sprite.y - 28).setVisible(true).setDepth(1015);
        this.meetingPrompt.setVisible(false);

        // Turn agent toward player
        this.orientAgentToward(id, sprite, px, py);
        foundTarget = true;
        break;
      }
    }

    if (!foundTarget) {
      this.clearAgentHighlight();
      this.activeTarget = null;
      this.talkPrompt.setVisible(false);
      this.meetingPrompt.setVisible(false);

      // Return sitting agents to work idle
      for (const [, sprite] of this.agentSprites.entries()) {
        if (!this.isGatheredInMeeting) {
          sprite.play(`${sprite.texture.key}-idle-work`, true);
        }
      }
    }
  }

  private clearAgentHighlight() {
    if (this.hoveredAgentId) {
      const sp = this.agentSprites.get(this.hoveredAgentId);
      sp?.clearTint();
      this.hoveredAgentId = null;
    }
  }

  private orientAgentToward(_id: string, sprite: Phaser.Physics.Arcade.Sprite, px: number, py: number) {
    const dx = px - sprite.x;
    const dy = py - sprite.y;
    const textureKey = sprite.texture.key;

    if (Math.abs(dx) > Math.abs(dy)) {
      sprite.play(`${textureKey}-idle-${dx > 0 ? 'right' : 'left'}`, true);
    } else {
      sprite.play(`${textureKey}-idle-${dy > 0 ? 'down' : 'up'}`, true);
    }
  }

  private triggerInteraction() {
    if (!this.activeTarget) return;

    soundEffects.playInteractionPing();

    if (this.activeTarget.type === 'agent' && this.activeTarget.id) {
      this.screenShake(0.002, 80);
      eventBus.emit('open:agent', this.activeTarget.id);
    } else if (this.activeTarget.type === 'meeting') {
      soundEffects.playMeetingGong();
      this.screenShake(0.004, 160);
      eventBus.emit('open:meeting');
    } else if (this.activeTarget.type === 'cafe') {
      soundEffects.playCoffeeBrew();
      this.screenShake(0.002, 100);
      eventBus.emit('open:cafe');
    } else if (this.activeTarget.type === 'arcade') {
      soundEffects.playArcade8Bit('coin');
      this.screenShake(0.005, 120);
      eventBus.emit('open:arcade');
    } else if (this.activeTarget.type === 'terminal') {
      this.screenShake(0.002, 80);
      eventBus.emit('open:terminal');
    } else if (this.activeTarget.type === 'corgi') {
      this.petCorgi();
    }
  }

  private petCorgi() {
    soundEffects.playPetReaction();
    this.screenShake(0.002, 60);
    this.showEmoteBubble(this.corgi.x, this.corgi.y, '❤️');
    eventBus.emit('pet:corgi');
  }

  public showEmoteBubble(x: number, y: number, emoji: string) {
    const bubble = this.add.container(x, y - 32).setDepth(1020);
    const bg = this.add.graphics();
    bg.fillStyle(0xFFFFFF, 0.95);
    bg.fillRoundedRect(-14, -12, 28, 22, 6);
    bg.lineStyle(1.5, 0xF59E0B, 1);
    bg.strokeRoundedRect(-14, -12, 28, 22, 6);

    const text = this.add.text(0, -1, emoji, {
      fontSize: '12px'
    }).setOrigin(0.5);

    bubble.add([bg, text]);

    this.tweens.add({
      targets: bubble,
      y: bubble.y - 18,
      alpha: 0,
      duration: 2000,
      ease: 'Sine.easeOut',
      onComplete: () => bubble.destroy()
    });
  }

  public screenShake(intensity: number = 0.004, duration: number = 120) {
    this.cameras.main.shake(duration, intensity);
  }

  private showAgentSpeechBubble(agentId: string, text: string) {
    const sprite = this.agentSprites.get(agentId);
    if (!sprite) return;

    // Remove existing bubble if any
    const existing = this.speechBubbles.get(agentId);
    if (existing) {
      existing.destroy();
    }

    const container = this.add.container(sprite.x, sprite.y - 38).setDepth(55);

    const label = this.add.text(0, 0, text, {
      fontFamily: 'Space Grotesk, sans-serif',
      fontSize: '11px',
      color: '#F8FAFC',
      backgroundColor: '#1E1B4BF5',
      padding: { x: 8, y: 5 }
    }).setOrigin(0.5);

    label.setStroke('#F59E0B', 1);

    container.add(label);
    this.speechBubbles.set(agentId, container);

    // Auto dismiss after 6 seconds
    this.time.delayedCall(6000, () => {
      if (this.speechBubbles.get(agentId) === container) {
        this.tweens.add({
          targets: container,
          alpha: 0,
          y: container.y - 10,
          duration: 400,
          onComplete: () => {
            container.destroy();
            this.speechBubbles.delete(agentId);
          }
        });
      }
    });
  }

  private triggerRandomAgentBanter() {
    if (this.isGatheredInMeeting) return;

    const randomAgent = this.agentsList[Math.floor(Math.random() * this.agentsList.length)];
    const banters: Record<string, string[]> = {
      sarah: [
        'Sprint 14 velocity is looking great today!',
        'Coffee break time, who wants pour-over?',
        'All roadmap deliverables are tracking green.'
      ],
      maya: [
        'Love the new warm timber decor in here.',
        'Finalizing the user story mappings.',
        'The mobile experience feels silky smooth.'
      ],
      uma: [
        'These honey oak tones match our design tokens perfectly.',
        'Listening to lo-fi beats while sketching wireframes.',
        'Look at Pixel snoozing over there, so cute!'
      ],
      dana: [
        'Phaser 3 canvas is locked at 60 FPS!',
        'Refactoring the virtual touch controls.',
        'Anyone up for a round of Bug Buster on the arcade machine?'
      ],
      dev: [
        'Fresh pot of single-origin coffee is brewing.',
        'Database write latencies are sub-5ms.',
        'Clean schemas make for happy mornings.'
      ],
      owen: [
        'Container memory usage is steady at 38MB.',
        'Automated CI/CD build finished in 18 seconds.',
        'Deploying the latest hotfix to staging.'
      ],
      quinn: [
        'Touch input regression suite passed 100%!',
        'No collision clipping found in the office bounds.',
        'Checking boundary edge cases on tablet screens.'
      ]
    };

    const agentBanterList = banters[randomAgent.id] || ['Having a great day at the office!'];
    const line = agentBanterList[Math.floor(Math.random() * agentBanterList.length)];
    this.showAgentSpeechBubble(randomAgent.id, line);
  }

  private updateCorgiBehavior() {
    if (!this.corgi) return;

    const roll = Math.random();
    if (roll < 0.4) {
      // Wander to a cozy spot (rug, near desk, pet bed)
      const targets = [
        { x: 16 * 32, y: 24 * 32 }, // Lounge rug
        { x: 18 * 32, y: 16 * 32 }, // Cafe floor
        { x: 14 * 32, y: 23 * 32 }, // Pet bed
        { x: 8 * 32, y: 16 * 32 }   // Sarah's desk
      ];
      const target = targets[Math.floor(Math.random() * targets.length)];

      this.corgi.play('corgi-walk', true);
      this.corgi.flipX = target.x < this.corgi.x;

      this.tweens.add({
        targets: this.corgi,
        x: target.x,
        y: target.y,
        duration: 3500,
        ease: 'Sine.easeInOut',
        onComplete: () => {
          this.corgi.play('corgi-idle', true);
        }
      });
    } else if (roll < 0.7) {
      // Sleep on bed
      this.corgi.play('corgi-sleep', true);
    } else {
      // Idle sniffing
      this.corgi.play('corgi-idle', true);
    }
  }

  private gatherAgentsForMeeting() {
    this.isGatheredInMeeting = true;
    for (const agent of this.agentsList) {
      const sprite = this.agentSprites.get(agent.id);
      if (sprite) {
        sprite.play(`${sprite.texture.key}-walk-right`, true);
        this.tweens.add({
          targets: sprite,
          x: agent.meetingChairX,
          y: agent.meetingChairY,
          duration: 2200,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            sprite.play(`${sprite.texture.key}-idle-down`, true);
          }
        });
      }
    }
  }

  private dismissAgentsToDesks() {
    this.isGatheredInMeeting = false;
    for (const agent of this.agentsList) {
      const sprite = this.agentSprites.get(agent.id);
      if (sprite) {
        sprite.play(`${sprite.texture.key}-walk-left`, true);
        this.tweens.add({
          targets: sprite,
          x: agent.chairX,
          y: agent.chairY,
          duration: 2200,
          ease: 'Sine.easeInOut',
          onComplete: () => {
            sprite.play(`${sprite.texture.key}-idle-work`, true);
          }
        });
      }
    }
  }

  private updateDayNightCycle(delta: number) {
    this.dayCycleTimer = (this.dayCycleTimer + delta) % this.DAY_CYCLE_DURATION;
    const progress = this.dayCycleTimer / this.DAY_CYCLE_DURATION;

    // Sine curve: 0 at noon, max darkness (0.4 alpha) at night
    const darkness = Math.sin(progress * Math.PI * 2);
    const alpha = Phaser.Math.Clamp(darkness * 0.4, 0.0, 0.4);
    this.dayNightOverlay.setAlpha(alpha);

    // Warm indoor lamps glow softly during night hours
    this.warmLightSprites.forEach(glow => {
      glow.setAlpha(alpha > 0.08 ? (alpha - 0.08) * 0.9 : 0);
    });

    eventBus.emit('time:cycle', {
      progress,
      isNight: alpha > 0.18
    });
  }

  private updateDepthSorting() {
    // 2.5D RPG Y-sorting: objects lower on screen render in front
    this.player.setDepth(this.player.y + 12);

    for (const [, sprite] of this.agentSprites) {
      sprite.setDepth(sprite.y + 12);
    }

    if (this.corgi) {
      this.corgi.setDepth(this.corgi.y + 10);
    }
  }

  private createWarmLightZones() {
    const lampPositions = [
      { x: 17 * 32, y: 14 * 32, radius: 75, color: 0xFDE68A }, // Cafe bar warm glow
      { x: 14 * 32, y: 25 * 32, radius: 70, color: 0xFDE68A }, // Lounge floor lamp glow
      { x: 27 * 32, y: 7 * 32, radius: 65, color: 0xFDE68A },  // Dev pod floor lamp glow
      { x: 17 * 32, y: 4.5 * 32, radius: 85, color: 0xBAE6FD },// Meeting room screen cyan glow
      { x: 36 * 32, y: 22 * 32, radius: 60, color: 0x38BDF8 }, // DevOps server rack blue glow
      { x: 6 * 32, y: 15 * 32, radius: 60, color: 0xFDE68A },  // PM desk lamp glow
    ];

    this.warmLightSprites = lampPositions.map(pos => {
      const glow = this.add.circle(pos.x, pos.y, pos.radius, pos.color, 0.0);
      glow.setDepth(1030);
      glow.setBlendMode(Phaser.BlendModes.ADD);
      return glow;
    });
  }

  private spawnAgents() {
    for (const agent of this.agentsList) {
      const sprite = this.physics.add.sprite(agent.chairX, agent.chairY, agent.spriteKey);
      sprite.setImmovable(true);
      sprite.setSize(18, 18);
      sprite.setOffset(7, 14);
      sprite.setDepth(agent.chairY + 12);
      sprite.play(`${agent.spriteKey}-idle-work`);

      // Subtle 1-pixel breathing bob animation
      this.tweens.add({
        targets: sprite,
        y: agent.chairY - 1,
        duration: 1200 + Math.random() * 400,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
      });

      this.agentsGroup.add(sprite);
      this.agentSprites.set(agent.id, sprite);

      // Name label tag with warm badge styling
      const text = this.add.text(agent.chairX, agent.chairY - 22, agent.name, {
        fontSize: '10px',
        fontFamily: 'Space Grotesk, sans-serif',
        color: '#FEF3C7',
        backgroundColor: '#1E1B4BF0',
        padding: { x: 4, y: 1 }
      }).setOrigin(0.5).setDepth(1000);

      this.agentLabels.set(agent.id, text);

      // Keep label synced with sprite
      this.events.on('update', () => {
        text.setPosition(sprite.x, sprite.y - 22);
        const bubble = this.speechBubbles.get(agent.id);
        if (bubble) {
          bubble.setPosition(sprite.x, sprite.y - 38);
        }
      });
    }
  }

  private spawnOfficePet(ts: number) {
    this.corgi = this.physics.add.sprite(15 * ts, 23 * ts, 'pet-corgi');
    this.corgi.setCollideWorldBounds(true);
    this.corgi.setSize(20, 14);
    this.corgi.setOffset(6, 14);
    this.corgi.setDepth(23 * ts + 10);
    this.corgi.play('corgi-idle');
  }

  private createAmbientAtmosphere(ts: number) {
    // 1. Warm Coffee Steam rising from Cafe Espresso Bar
    const steamEmitter = this.add.particles(17 * ts + 10, 13 * ts + 8, 'tile-floor-office', {
      scale: { start: 0.06, end: 0.18 },
      alpha: { start: 0.6, end: 0 },
      speedY: { min: -18, max: -32 },
      speedX: { min: -4, max: 4 },
      lifespan: 1400,
      frequency: 280,
      tint: 0xFFFBEB
    });
    steamEmitter.setDepth(920);

    // 2. Soft golden dust particles in sunlit loft windows
    const dustEmitter = this.add.particles(20 * ts, 3 * ts, 'tile-floor-office', {
      scale: { start: 0.04, end: 0.02 },
      alpha: { start: 0.4, end: 0 },
      speedY: { min: 8, max: 20 },
      speedX: { min: -6, max: 6 },
      lifespan: 3000,
      frequency: 600,
      tint: 0xFDE68A,
      emitZone: {
        source: new Phaser.Geom.Rectangle(-300, 0, 600, 20),
        type: 'random'
      }
    });
    dustEmitter.setDepth(920);

    // 3. Sunbeam shafts from top loft windows
    const sunbeamEmitter = this.add.particles(20 * ts, 2 * ts, 'particle-sunbeam', {
      scale: { start: 0.55, end: 0.15 },
      alpha: { start: 0.35, end: 0 },
      speedY: { min: 10, max: 24 },
      speedX: { min: -4, max: 4 },
      lifespan: 3500,
      frequency: 700,
      tint: 0xFDE68A,
      emitZone: {
        source: new Phaser.Geom.Rectangle(-280, 0, 560, 20),
        type: 'random'
      }
    });
    sunbeamEmitter.setDepth(920);

    // 4. Subtle typing sparks at Dev pod
    const typingEmitter = this.add.particles(27.5 * ts, 5.2 * ts, 'particle-typing-spark', {
      scale: { start: 0.8, end: 0.2 },
      alpha: { start: 0.75, end: 0 },
      speedY: { min: -8, max: -18 },
      speedX: { min: -6, max: 6 },
      lifespan: 550,
      frequency: 1200,
      emitZone: {
        source: new Phaser.Geom.Rectangle(-35, -8, 70, 16),
        type: 'random'
      }
    });
    typingEmitter.setDepth(920);

    // 5. Blinking DevOps server rack LEDs
    this.createServerRackLEDs(ts);
  }

  private createServerRackLEDs(ts: number) {
    const ledPositions = [
      { x: 36 * ts + 10, y: 21 * ts + 8, color: 0x22C55E },
      { x: 36 * ts + 16, y: 21 * ts + 8, color: 0x38BDF8 },
      { x: 36 * ts + 22, y: 21 * ts + 8, color: 0xF59E0B },
      { x: 36 * ts + 10, y: 23 * ts + 8, color: 0x22C55E },
      { x: 36 * ts + 16, y: 23 * ts + 8, color: 0x38BDF8 },
      { x: 36 * ts + 22, y: 23 * ts + 8, color: 0xEF4444 }
    ];

    const leds = ledPositions.map(pos => {
      const rect = this.add.rectangle(pos.x, pos.y, 3, 2, pos.color).setDepth(23 * ts + 15);
      return { rect, origColor: pos.color };
    });

    this.time.addEvent({
      delay: 750,
      loop: true,
      callback: () => {
        leds.forEach(led => {
          const on = Math.random() > 0.35;
          led.rect.setAlpha(on ? 1.0 : 0.2);
        });
      }
    });
  }

  private buildOfficeFloorAndWalls(mapW: number, mapH: number, ts: number) {
    // 1. Base floor tiles (Warm honey oak, department zones, Mediterranean cafe)
    for (let x = 0; x < mapW; x++) {
      for (let y = 0; y < mapH; y++) {
        let tileKey = 'tile-floor-wood';

        // Cafe terracotta area (x: 14..20, y: 12..17)
        if (x >= 14 && x <= 20 && y >= 12 && y <= 17) {
          tileKey = 'tile-floor-cafe';
        }
        // Rug zones (Boardroom Pod, Lounge, Center hallway)
        else if (
          (x >= 13 && x <= 21 && y >= 2 && y <= 9) || // Boardroom
          (x >= 13 && x <= 20 && y >= 19 && y <= 25) || // Cozy Lounge
          (x >= 10 && x <= 29 && y >= 10 && y <= 11)   // Hallway runner
        ) {
          tileKey = 'tile-floor-rug';
        }
        // PM Corner - Soft blue carpet
        else if (x >= 2 && x <= 10 && y >= 12 && y <= 18) {
          tileKey = 'tile-floor-pm';
        }
        // Design Studio - Warm creative floor
        else if (x >= 32 && x <= 38 && y >= 2 && y <= 8) {
          tileKey = 'tile-floor-design';
        }
        // QA Lab - Clean tech vinyl
        else if (x >= 32 && x <= 38 && y >= 12 && y <= 18) {
          tileKey = 'tile-floor-qa';
        }
        // Birch Focus Tech pods
        else if (x > 22 && y > 10) {
          tileKey = 'tile-floor-office';
        }

        this.add.image(x * ts + ts / 2, y * ts + ts / 2, tileKey).setDepth(0);
      }
    }

    // 2. Outer boundary walls (Warm exposed brick + sunlit windows)
    for (let x = 0; x < mapW; x++) {
      this.addWall(x * ts + ts / 2, ts / 2, 'tile-wall-window'); // Top loft window wall
      this.addWall(x * ts + ts / 2, (mapH - 1) * ts + ts / 2, 'tile-wall-solid'); // Bottom brick wall
    }
    for (let y = 1; y < mapH - 1; y++) {
      this.addWall(ts / 2, y * ts + ts / 2, 'tile-wall-solid'); // Left wall
      this.addWall((mapW - 1) * ts + ts / 2, y * ts + ts / 2, 'tile-wall-solid'); // Right wall
    }

    // 3. Interior Acoustic Glass Dividers
    for (let x = 1; x < mapW - 1; x++) {
      if (x !== 6 && x !== 17 && x !== 26 && x !== 34) { // Doorways
        this.addWall(x * ts + ts / 2, 9 * ts + ts / 2, 'tile-wall-glass');
      }
    }

    // 4. Place Key Furniture & Stations
    // Meeting Room Conference Table (3x2 table)
    for (let tx = 15; tx <= 19; tx++) {
      for (let ty = 4; ty <= 6; ty++) {
        this.addObstacle(tx * ts + ts / 2, ty * ts + ts / 2, 'furniture-meeting-table');
      }
    }

    // Meeting Room: Wall-mounted Projector Screen & Whiteboard
    this.addObstacle(17 * ts + ts / 2, 2 * ts + ts / 2, 'furniture-projector-screen');
    this.addObstacle(13 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-whiteboard');

    // Meeting Room: 8 Chairs around the conference table
    for (let i = 0; i < 4; i++) {
      this.addDecoration((15 + i) * ts + ts / 2, 3 * ts + ts / 2, 'furniture-meeting-chair', 0);
      this.addDecoration((15 + i) * ts + ts / 2, 7 * ts + ts / 2, 'furniture-meeting-chair', 8);
    }

    // Pantry: L-shape kitchen counter segment
    for (let x = 14; x <= 16; x++) {
      this.addObstacle(x * ts + ts / 2, 12 * ts + ts / 2, 'furniture-kitchen-counter');
    }
    this.addObstacle(14 * ts + ts / 2, 13 * ts + ts / 2, 'furniture-kitchen-counter');

    // Pantry: Espresso Coffee Machine, Microwave, Mug rack, Snack rack
    this.addObstacle(15 * ts + ts / 2, 12 * ts + ts / 2, 'furniture-coffee-machine');
    this.addObstacle(16 * ts + ts / 2, 12 * ts + ts / 2, 'furniture-microwave');
    this.addObstacle(15 * ts + ts / 2, 11 * ts + ts / 2, 'furniture-mug-rack');
    this.addObstacle(20 * ts + ts / 2, 12 * ts + ts / 2, 'furniture-snack-rack');

    // Pantry: Round Birch Dining Tables
    this.addObstacle(17 * ts + ts / 2, 16 * ts + ts / 2, 'furniture-dining-table');
    this.addObstacle(19 * ts + ts / 2, 16 * ts + ts / 2, 'furniture-dining-table');

    // Desks for 7 agents
    this.addObstacle(6 * ts + ts / 2, 15 * ts + ts / 2, 'furniture-desk'); // Sarah
    this.addObstacle(5 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk');  // Maya
    this.addObstacle(34 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk'); // Uma
    this.addObstacle(25 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk'); // Dana
    this.addObstacle(28 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk'); // Dev
    this.addObstacle(34 * ts + ts / 2, 22 * ts + ts / 2, 'furniture-desk'); // Owen
    this.addObstacle(34 * ts + ts / 2, 15 * ts + ts / 2, 'furniture-desk'); // Quinn

    // PM Corner Props
    this.addObstacle(3 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-kanban-board');
    this.addObstacle(3 * ts + ts / 2, 16 * ts + ts / 2, 'furniture-timeline-chart');
    this.addObstacle(8 * ts + ts / 2, 15 * ts + ts / 2, 'furniture-desk-divider');

    // Design Studio Props (Uma)
    this.addObstacle(37 * ts + ts / 2, 4 * ts + ts / 2, 'furniture-mood-board');
    this.addObstacle(36 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-drawing-tablet');
    this.addObstacle(38 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-bookshelf');
    this.addObstacle(37 * ts + ts / 2, 2 * ts + ts / 2, 'furniture-color-swatches');

    // Dev Pod Props (Dana & Dev)
    this.addObstacle(26 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-dual-monitor');
    this.addObstacle(29 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-dual-monitor');
    this.addObstacle(30 * ts + ts / 2, 7 * ts + ts / 2, 'furniture-server-mini');

    // QA Lab Props (Quinn)
    this.addObstacle(36 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-device-shelf');
    this.addObstacle(37 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-test-board');
    this.addObstacle(36 * ts + ts / 2, 16 * ts + ts / 2, 'furniture-portrait-monitor');

    // Artisanal Cafe Espresso Bar
    this.addObstacle(17 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-cafe-bar');
    this.addObstacle(18 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-cafe-bar');

    // Water Cooler in central lobby
    this.addObstacle(22 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-watercooler');

    // Retro Snack Fridge
    this.addObstacle(5 * ts + ts / 2, 22 * ts + ts / 2, 'furniture-fridge');

    // DevOps Server Racks
    this.addObstacle(36 * ts + ts / 2, 21 * ts + ts / 2, 'furniture-rack');
    this.addObstacle(36 * ts + ts / 2, 23 * ts + ts / 2, 'furniture-rack');

    // Vintage Lounge Arcade Cabinet
    this.addObstacle(16 * ts + ts / 2, 22 * ts + ts / 2, 'furniture-arcade');

    // Cozy Emerald Lounge Sofas
    this.addObstacle(14 * ts + ts / 2, 24 * ts + ts / 2, 'furniture-sofa');
    this.addObstacle(8 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-sofa');

    // Warm Brass Floor Lamps
    this.addObstacle(14 * ts + ts / 2, 25 * ts + ts / 2, 'furniture-floor-lamp');
    this.addObstacle(27 * ts + ts / 2, 7 * ts + ts / 2, 'furniture-floor-lamp');

    // Lush Monstera & Fiddle Leaf Botanical Plants
    this.addObstacle(12 * ts + ts / 2, 11 * ts + ts / 2, 'furniture-plant');
    this.addObstacle(28 * ts + ts / 2, 11 * ts + ts / 2, 'furniture-plant');
    this.addObstacle(4 * ts + ts / 2, 11 * ts + ts / 2, 'furniture-plant');
    this.addObstacle(37 * ts + ts / 2, 11 * ts + ts / 2, 'furniture-plant');

    // Circular Pet Bed for Pixel the Corgi
    this.addObstacle(14 * ts + ts / 2, 22 * ts + ts / 2, 'furniture-pet-bed');
  }

  private addWall(x: number, y: number, key: string) {
    const wall = this.obstacles.create(x, y, key);
    wall.setDepth(y + 16);
    wall.refreshBody();
    return wall;
  }

  private addObstacle(x: number, y: number, key: string) {
    const item = this.obstacles.create(x, y, key);
    item.setDepth(y + 8);
    item.refreshBody();
    return item;
  }

  private addDecoration(x: number, y: number, key: string, depthOffset: number = 8) {
    const item = this.add.image(x, y, key);
    item.setDepth(y + depthOffset);
    return item;
  }
}
