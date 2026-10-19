import Phaser from 'phaser';
import { eventBus } from '../eventBus';

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
  };
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private agentsGroup!: Phaser.Physics.Arcade.Group;
  private agentSprites: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();
  private talkPrompt!: Phaser.GameObjects.Image;
  private meetingPrompt!: Phaser.GameObjects.Image;
  private activeTarget: { type: 'agent' | 'meeting' | 'cafe'; id?: string } | null = null;
  private dayNightOverlay!: Phaser.GameObjects.Rectangle;
  private dayCycleTimer: number = 0;
  private readonly DAY_CYCLE_DURATION = 12 * 60 * 1000; // 12 minutes
  private mobileVelocity = { x: 0, y: 0 };
  private isGatheredInMeeting = false;

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
      meetingChairY: 5 * 32
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
      meetingChairY: 3 * 32
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
      meetingChairY: 3 * 32
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
      meetingChairY: 3 * 32
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
      meetingChairY: 5 * 32
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
      meetingChairY: 7 * 32
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
      meetingChairY: 7 * 32
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

    // 1. Build Office Tilemap Layout
    this.obstacles = this.physics.add.staticGroup();
    this.buildOfficeFloorAndWalls(mapW, mapH, tileSize);

    // 2. Spawn Agents at desks
    this.agentsGroup = this.physics.add.group();
    this.spawnAgents();

    // 3. Spawn Owner (Player) at Entrance (x=20, y=27)
    this.player = this.physics.add.sprite(20 * tileSize, 27 * tileSize, 'char-owner');
    this.player.setCollideWorldBounds(true);
    this.player.setSize(20, 20);
    this.player.setOffset(6, 12);
    this.player.setDepth(20);

    // Collisions
    this.physics.add.collider(this.player, this.obstacles);
    this.physics.add.collider(this.agentsGroup, this.obstacles);
    this.physics.add.collider(this.player, this.agentsGroup);

    // 4. Setup Camera Follow
    this.cameras.main.setBounds(0, 0, worldW, worldH);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.0);

    // 5. Input Controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      interact: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    };

    // 6. Interaction Prompts
    this.talkPrompt = this.add.image(0, 0, 'prompt-e-talk').setDepth(50).setVisible(false);
    this.meetingPrompt = this.add.image(0, 0, 'prompt-e-meeting').setDepth(50).setVisible(false);

    // 7. Day/Night Tint Overlay
    this.dayNightOverlay = this.add.rectangle(worldW / 2, worldH / 2, worldW, worldH, 0x1e1b4b, 0.0);
    this.dayNightOverlay.setDepth(99);

    // 8. Event Bus Listeners
    eventBus.on('meeting:gather', () => this.gatherAgentsForMeeting());
    eventBus.on('meeting:dismiss', () => this.dismissAgentsToDesks());
    eventBus.on('mobile:move', (vel: { x: number; y: number }) => {
      this.mobileVelocity = vel;
    });
    eventBus.on('mobile:action', () => this.triggerInteraction());

    // 9. Ambient Office Wandering AI (every 30-45s)
    this.time.addEvent({
      delay: 35000,
      callback: this.triggerAmbientWander,
      callbackScope: this,
      loop: true
    });
  }

  update(time: number, delta: number) {
    this.handlePlayerMovement();
    this.checkProximityTriggers();
    this.updateDayNightCycle(delta);

    // Publish player position for minimap
    eventBus.emit('player:pos', {
      x: this.player.x / (40 * 32),
      y: this.player.y / (30 * 32)
    });
  }

  private handlePlayerMovement() {
    const speed = 140;
    let vx = 0;
    let vy = 0;

    // Keyboard inputs
    if (this.cursors.left.isDown || this.wasd.left.isDown) vx = -speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) vx = speed;

    if (this.cursors.up.isDown || this.wasd.up.isDown) vy = -speed;
    else if (this.cursors.down.isDown || this.wasd.down.isDown) vy = speed;

    // Mobile virtual joystick override
    if (this.mobileVelocity.x !== 0 || this.mobileVelocity.y !== 0) {
      vx = this.mobileVelocity.x * speed;
      vy = this.mobileVelocity.y * speed;
    }

    // Diagonal normalization
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.player.setVelocity(vx, vy);

    // Key E interaction
    if (Phaser.Input.Keyboard.JustDown(this.wasd.interact)) {
      this.triggerInteraction();
    }
  }

  private checkProximityTriggers() {
    const px = this.player.x;
    const py = this.player.y;
    let foundTarget = false;

    // 1. Check proximity to Meeting Table (approx x: 17*32, y: 5*32)
    const distToMeeting = Phaser.Math.Distance.Between(px, py, 17 * 32, 5 * 32);
    if (distToMeeting < 64) {
      this.activeTarget = { type: 'meeting' };
      this.meetingPrompt.setPosition(17 * 32, 3.5 * 32).setVisible(true);
      this.talkPrompt.setVisible(false);
      foundTarget = true;
      return;
    }

    // 2. Check proximity to Cafe Bar (x: 17*32, y: 14*32)
    const distToCafe = Phaser.Math.Distance.Between(px, py, 17 * 32, 14 * 32);
    if (distToCafe < 52) {
      this.activeTarget = { type: 'cafe' };
      this.talkPrompt.setPosition(17 * 32, 13 * 32).setVisible(true);
      this.meetingPrompt.setVisible(false);
      foundTarget = true;
      return;
    }

    // 3. Check proximity to each Agent
    for (const [id, sprite] of this.agentSprites.entries()) {
      const dist = Phaser.Math.Distance.Between(px, py, sprite.x, sprite.y);
      if (dist < 48) {
        this.activeTarget = { type: 'agent', id };
        this.talkPrompt.setPosition(sprite.x, sprite.y - 28).setVisible(true);
        this.meetingPrompt.setVisible(false);
        foundTarget = true;
        break;
      }
    }

    if (!foundTarget) {
      this.activeTarget = null;
      this.talkPrompt.setVisible(false);
      this.meetingPrompt.setVisible(false);
    }
  }

  private triggerInteraction() {
    if (!this.activeTarget) return;

    if (this.activeTarget.type === 'agent' && this.activeTarget.id) {
      eventBus.emit('open:agent', this.activeTarget.id);
    } else if (this.activeTarget.type === 'meeting') {
      eventBus.emit('open:meeting');
    } else if (this.activeTarget.type === 'cafe') {
      eventBus.emit('interact:cafe');
    }
  }

  private gatherAgentsForMeeting() {
    this.isGatheredInMeeting = true;
    for (const agent of this.agentsList) {
      const sprite = this.agentSprites.get(agent.id);
      if (sprite) {
        this.tweens.add({
          targets: sprite,
          x: agent.meetingChairX,
          y: agent.meetingChairY,
          duration: 2500,
          ease: 'Sine.easeInOut'
        });
      }
    }
  }

  private dismissAgentsToDesks() {
    this.isGatheredInMeeting = false;
    for (const agent of this.agentsList) {
      const sprite = this.agentSprites.get(agent.id);
      if (sprite) {
        this.tweens.add({
          targets: sprite,
          x: agent.chairX,
          y: agent.chairY,
          duration: 2500,
          ease: 'Sine.easeInOut'
        });
      }
    }
  }

  private triggerAmbientWander() {
    if (this.isGatheredInMeeting) return;

    // Pick 1 random agent to wander to cafe or arcade
    const randomAgent = this.agentsList[Math.floor(Math.random() * this.agentsList.length)];
    const sprite = this.agentSprites.get(randomAgent.id);
    if (!sprite) return;

    const waypoints = [
      { x: 17 * 32, y: 15 * 32 }, // Cafe bar
      { x: 22 * 32, y: 14 * 32 }, // Watercooler
      { x: 17 * 32, y: 22 * 32 }  // Arcade lounge
    ];
    const destination = waypoints[Math.floor(Math.random() * waypoints.length)];

    // Walk to destination, pause 8s, walk back to chair
    this.tweens.add({
      targets: sprite,
      x: destination.x,
      y: destination.y,
      duration: 3500,
      ease: 'Linear',
      onComplete: () => {
        // Show speech bubble
        this.time.delayedCall(8000, () => {
          if (!this.isGatheredInMeeting) {
            this.tweens.add({
              targets: sprite,
              x: randomAgent.chairX,
              y: randomAgent.chairY,
              duration: 3500,
              ease: 'Linear'
            });
          }
        });
      }
    });
  }

  private updateDayNightCycle(delta: number) {
    this.dayCycleTimer = (this.dayCycleTimer + delta) % this.DAY_CYCLE_DURATION;
    const progress = this.dayCycleTimer / this.DAY_CYCLE_DURATION; // 0.0 to 1.0

    // Sine curve: 0 at noon, max darkness (0.45 alpha) at night
    const darkness = Math.sin(progress * Math.PI * 2);
    const alpha = Phaser.Math.Clamp(darkness * 0.45, 0.0, 0.45);
    this.dayNightOverlay.setAlpha(alpha);

    // Notify React of cycle time
    eventBus.emit('time:cycle', {
      progress,
      isNight: alpha > 0.2
    });
  }

  private spawnAgents() {
    for (const agent of this.agentsList) {
      const sprite = this.physics.add.sprite(agent.chairX, agent.chairY, agent.spriteKey);
      sprite.setImmovable(true);
      sprite.setSize(20, 24);
      sprite.setOffset(6, 6);
      sprite.setDepth(15);
      this.agentsGroup.add(sprite);
      this.agentSprites.set(agent.id, sprite);

      // Name label tag
      const text = this.add.text(agent.chairX, agent.chairY - 22, agent.name, {
        fontSize: '9px',
        fontFamily: 'monospace',
        color: '#FFFFFF',
        backgroundColor: '#0F172ACC',
        padding: { x: 3, y: 1 }
      }).setOrigin(0.5).setDepth(16);

      // Keep label synced with sprite
      this.events.on('update', () => {
        text.setPosition(sprite.x, sprite.y - 22);
      });
    }
  }

  private buildOfficeFloorAndWalls(mapW: number, mapH: number, ts: number) {
    // 1. Base floor tiles
    for (let x = 0; x < mapW; x++) {
      for (let y = 0; y < mapH; y++) {
        let tileKey = 'tile-floor-wood';

        // Cafe floor area (x: 14..20, y: 12..17)
        if (x >= 14 && x <= 20 && y >= 12 && y <= 17) {
          tileKey = 'tile-floor-cafe';
        }
        // Rug zones (Meeting Pod, Lounge, Open center)
        else if (
          (x >= 13 && x <= 21 && y >= 2 && y <= 9) || // Meeting
          (x >= 14 && x <= 20 && y >= 19 && y <= 25) || // Arcade/Lounge
          (x >= 10 && x <= 29 && y >= 10 && y <= 11)   // Hallway rug
        ) {
          tileKey = 'tile-floor-rug';
        }
        // General Tech corridors
        else if (x > 22 && y > 10) {
          tileKey = 'tile-floor-office';
        }

        this.add.image(x * ts + ts / 2, y * ts + ts / 2, tileKey).setDepth(0);
      }
    }

    // 2. Outer boundary walls
    for (let x = 0; x < mapW; x++) {
      this.addWall(x * ts + ts / 2, ts / 2, 'tile-wall-window'); // Top window wall
      this.addWall(x * ts + ts / 2, (mapH - 1) * ts + ts / 2, 'tile-wall-solid'); // Bottom wall
    }
    for (let y = 1; y < mapH - 1; y++) {
      this.addWall(ts / 2, y * ts + ts / 2, 'tile-wall-solid'); // Left wall
      this.addWall((mapW - 1) * ts + ts / 2, y * ts + ts / 2, 'tile-wall-solid'); // Right wall
    }

    // 3. Interior partitions & Glass dividers
    // Horizontal divider for top offices
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

    // Desks for all 7 agents
    this.addObstacle(6 * ts + ts / 2, 15 * ts + ts / 2, 'furniture-desk'); // Sarah
    this.addObstacle(5 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk');  // Maya
    this.addObstacle(34 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk'); // Uma
    this.addObstacle(25 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk'); // Dana
    this.addObstacle(28 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-desk'); // Dev
    this.addObstacle(34 * ts + ts / 2, 22 * ts + ts / 2, 'furniture-desk'); // Owen
    this.addObstacle(34 * ts + ts / 2, 15 * ts + ts / 2, 'furniture-desk'); // Quinn

    // Cafe Espresso Counter & Stools
    this.addObstacle(17 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-cafe-bar');
    this.addObstacle(18 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-cafe-bar');

    // Watercooler in central lobby
    this.addObstacle(22 * ts + ts / 2, 14 * ts + ts / 2, 'furniture-watercooler');

    // Lunch Fridge
    this.addObstacle(5 * ts + ts / 2, 22 * ts + ts / 2, 'furniture-fridge');

    // DevOps Server Racks
    this.addObstacle(36 * ts + ts / 2, 21 * ts + ts / 2, 'furniture-rack');
    this.addObstacle(36 * ts + ts / 2, 23 * ts + ts / 2, 'furniture-rack');

    // Arcade Cabinet in Play Zone
    this.addObstacle(16 * ts + ts / 2, 22 * ts + ts / 2, 'furniture-arcade');

    // Lounge Couches & Plants
    this.addObstacle(14 * ts + ts / 2, 24 * ts + ts / 2, 'furniture-sofa');
    this.addObstacle(8 * ts + ts / 2, 5 * ts + ts / 2, 'furniture-sofa');
    this.addObstacle(12 * ts + ts / 2, 11 * ts + ts / 2, 'furniture-plant');
    this.addObstacle(28 * ts + ts / 2, 11 * ts + ts / 2, 'furniture-plant');
  }

  private addWall(x: number, y: number, key: string) {
    const wall = this.obstacles.create(x, y, key);
    wall.setDepth(10);
    wall.refreshBody();
  }

  private addObstacle(x: number, y: number, key: string) {
    const item = this.obstacles.create(x, y, key);
    item.setDepth(12);
    item.refreshBody();
  }
}
