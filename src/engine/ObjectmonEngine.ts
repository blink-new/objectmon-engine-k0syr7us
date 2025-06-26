// Core Objectmon Game Engine
// Implements the complete game logic as specified in the design document

export interface GameState {
  screen: 'TITLE' | 'OVERWORLD' | 'BATTLE' | 'MENU' | 'FUSION_LAB';
  player: Player | null;
  currentMap: string;
  flags: Record<string, boolean>;
  time: {
    hour: number;
    minute: number;
    day: number;
    weather: 'sunny' | 'rain' | 'night';
  };
  rngSeed: number;
}

export interface Player {
  name: string;
  id: number;
  money: number;
  badges: boolean[];
  position: {
    map: string;
    x: number;
    y: number;
    facing: 'up' | 'down' | 'left' | 'right';
  };
  party: ObjectmonInstance[];
  pc: ObjectmonInstance[][];
  bag: {
    items: Record<number, number>;
    keyItems: Record<number, boolean>;
    capsules: Record<number, number>;
    fusionParts: Record<number, number>;
  };
  objectdex: {
    seen: Set<number>;
    caught: Set<number>;
  };
  settings: {
    textSpeed: 'slow' | 'medium' | 'fast';
    battleStyle: 'set' | 'shift';
    sound: 'mono' | 'stereo';
  };
}

export interface ObjectmonSpecies {
  id: number;
  name: string;
  kind: string;
  types: ObjectmonType[];
  baseStats: {
    HP: number;
    ATK: number;
    DEF: number;
    SPATK: number;
    SPDEF: number;
    SPD: number;
  };
  abilities: string[];
  learnset: Record<number, string>;
  eggGroup: string[];
  evolution: {
    method: 'Level' | 'Item' | 'Trade' | 'Fusion';
    level?: number;
    item?: number;
    evolvesTo: number;
  } | null;
  catchRate: number;
  baseExp: number;
  genderRatio: 'male_only' | 'female_only' | 'male_50' | 'male_75' | 'genderless';
  spriteData?: SpriteData;
}

export interface ObjectmonInstance {
  id: number;
  nickname: string;
  level: number;
  gender: 'male' | 'female' | 'none';
  ability: string;
  exp: number;
  ivs: StatBlock;
  evs: StatBlock;
  moves: MoveInstance[];
  status: StatusEffect | null;
  currentHP: number;
  stats: StatBlock;
  isShiny: boolean;
  fusionParents: number[];
  originalTrainer: {
    name: string;
    id: number;
  };
}

export interface StatBlock {
  HP: number;
  ATK: number;
  DEF: number;
  SPATK: number;
  SPDEF: number;
  SPD: number;
}

export interface MoveInstance {
  id: number;
  name: string;
  currentPP: number;
  maxPP: number;
  ppUpsUsed: number;
}

export interface Move {
  id: number;
  name: string;
  type: ObjectmonType;
  category: 'Physical' | 'Special' | 'Status';
  power: number;
  accuracy: number;
  pp: number;
  effect: MoveEffect | null;
  priority: number;
  target: 'Single' | 'All' | 'Self' | 'Ally';
}

export interface MoveEffect {
  type: 'damage' | 'status' | 'stat_change' | 'heal';
  chance: number;
  target: 'self' | 'opponent' | 'all';
  value?: number;
  stat?: keyof StatBlock;
  status?: StatusEffect;
}

export type ObjectmonType = 
  | 'Metal' | 'Electric' | 'Ceramic' | 'Liquid' 
  | 'Plastic' | 'Glass' | 'Fabric' | 'Wood' 
  | 'Fire' | 'Water' | 'Ground' | 'Air';

export type StatusEffect = 
  | 'burn' | 'freeze' | 'paralyze' | 'poison' | 'sleep' | 'rust' | 'short_circuit';

export interface SpriteData {
  name: string;
  tiles: number[];
  palette: number;
  animations: {
    idle: number[];
    walk: number[];
    attack: number[];
    faint: number[];
  };
  size: { width: number; height: number };
}

export interface BattleState {
  playerObjectmon: ObjectmonInstance | null;
  opponentObjectmon: ObjectmonInstance | null;
  playerParty: ObjectmonInstance[];
  opponentParty: ObjectmonInstance[];
  turnOrder: BattleAction[];
  weather: string | null;
  turnsElapsed: number;
  messageQueue: string[];
  battleEnded: boolean;
  outcome: 'win' | 'lose' | 'caught' | 'fled' | null;
}

export interface BattleAction {
  actor: 'player' | 'opponent';
  type: 'move' | 'switch' | 'item' | 'run';
  move?: Move;
  target?: ObjectmonInstance;
  item?: number;
}

// Game Boy style 4-color palette
export const GB_PALETTE = ['#e0f8d0', '#88c070', '#346856', '#081820'];

// Type effectiveness chart
export const TYPE_CHART: Record<ObjectmonType, Record<ObjectmonType, number>> = {
  'Metal': {
    'Liquid': 2.0,
    'Ceramic': 0.5,
    'Electric': 0.5,
    'Fire': 2.0,
    'Metal': 0.5,
    'Plastic': 1.0,
    'Glass': 2.0,
    'Fabric': 1.0,
    'Wood': 1.0,
    'Water': 1.0,
    'Ground': 1.0,
    'Air': 1.0
  },
  'Electric': {
    'Liquid': 2.0,
    'Metal': 2.0,
    'Water': 2.0,
    'Ceramic': 0.5,
    'Plastic': 0.5,
    'Glass': 1.0,
    'Fabric': 1.0,
    'Wood': 1.0,
    'Fire': 1.0,
    'Ground': 0.0,
    'Air': 2.0,
    'Electric': 0.5
  },
  'Fire': {
    'Fabric': 2.0,
    'Wood': 2.0,
    'Plastic': 2.0,
    'Metal': 0.5,
    'Ceramic': 0.5,
    'Water': 0.5,
    'Liquid': 0.5,
    'Glass': 1.0,
    'Electric': 1.0,
    'Ground': 1.0,
    'Air': 1.0,
    'Fire': 0.5
  },
  'Water': {
    'Fire': 2.0,
    'Ground': 2.0,
    'Metal': 1.0,
    'Electric': 0.5,
    'Ceramic': 1.0,
    'Plastic': 1.0,
    'Glass': 1.0,
    'Fabric': 1.0,
    'Wood': 1.0,
    'Liquid': 0.5,
    'Air': 1.0,
    'Water': 0.5
  },
  // Add more type interactions...
  'Ceramic': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Plastic': 1.0, 'Glass': 1.0, 'Fabric': 1.0, 'Wood': 1.0, 'Liquid': 1.0, 'Ground': 1.0, 'Air': 1.0, 'Ceramic': 1.0 },
  'Liquid': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Plastic': 1.0, 'Glass': 1.0, 'Fabric': 1.0, 'Wood': 1.0, 'Ceramic': 1.0, 'Ground': 1.0, 'Air': 1.0, 'Liquid': 1.0 },
  'Plastic': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Ceramic': 1.0, 'Glass': 1.0, 'Fabric': 1.0, 'Wood': 1.0, 'Liquid': 1.0, 'Ground': 1.0, 'Air': 1.0, 'Plastic': 1.0 },
  'Glass': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Plastic': 1.0, 'Ceramic': 1.0, 'Fabric': 1.0, 'Wood': 1.0, 'Liquid': 1.0, 'Ground': 1.0, 'Air': 1.0, 'Glass': 1.0 },
  'Fabric': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Plastic': 1.0, 'Glass': 1.0, 'Ceramic': 1.0, 'Wood': 1.0, 'Liquid': 1.0, 'Ground': 1.0, 'Air': 1.0, 'Fabric': 1.0 },
  'Wood': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Plastic': 1.0, 'Glass': 1.0, 'Fabric': 1.0, 'Ceramic': 1.0, 'Liquid': 1.0, 'Ground': 1.0, 'Air': 1.0, 'Wood': 1.0 },
  'Ground': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Plastic': 1.0, 'Glass': 1.0, 'Fabric': 1.0, 'Wood': 1.0, 'Liquid': 1.0, 'Ceramic': 1.0, 'Air': 1.0, 'Ground': 1.0 },
  'Air': { 'Metal': 1.0, 'Electric': 1.0, 'Fire': 1.0, 'Water': 1.0, 'Plastic': 1.0, 'Glass': 1.0, 'Fabric': 1.0, 'Wood': 1.0, 'Liquid': 1.0, 'Ground': 1.0, 'Ceramic': 1.0, 'Air': 1.0 }
};

export class ObjectmonEngine {
  private gameState: GameState;
  private battleState: BattleState | null = null;

  constructor() {
    this.gameState = this.initializeGameState();
  }

  private initializeGameState(): GameState {
    return {
      screen: 'TITLE',
      player: null,
      currentMap: 'StarterTown',
      flags: {},
      time: {
        hour: 12,
        minute: 0,
        day: 1,
        weather: 'sunny'
      },
      rngSeed: Date.now()
    };
  }

  // Game State Management
  getGameState(): GameState {
    return this.gameState;
  }

  setScreen(screen: GameState['screen']): void {
    this.gameState.screen = screen;
  }

  // Player Management
  createPlayer(name: string): Player {
    const player: Player = {
      name,
      id: Math.floor(Math.random() * 65536),
      money: 3000,
      badges: Array(8).fill(false),
      position: {
        map: 'StarterTown',
        x: 10,
        y: 12,
        facing: 'down'
      },
      party: [],
      pc: Array(12).fill([]).map(() => []),
      bag: {
        items: { 1: 5 }, // Start with 5 Oil Cans
        keyItems: {},
        capsules: { 3: 10 }, // Start with 10 Capsule Balls
        fusionParts: {}
      },
      objectdex: {
        seen: new Set(),
        caught: new Set()
      },
      settings: {
        textSpeed: 'medium',
        battleStyle: 'set',
        sound: 'stereo'
      }
    };

    this.gameState.player = player;
    return player;
  }

  // Battle System
  startBattle(opponent: ObjectmonInstance): void {
    if (!this.gameState.player || this.gameState.player.party.length === 0) {
      throw new Error('Cannot start battle without player or party');
    }

    this.battleState = {
      playerObjectmon: this.gameState.player.party[0],
      opponentObjectmon: opponent,
      playerParty: [...this.gameState.player.party],
      opponentParty: [opponent],
      turnOrder: [],
      weather: null,
      turnsElapsed: 0,
      messageQueue: [],
      battleEnded: false,
      outcome: null
    };

    this.gameState.screen = 'BATTLE';
  }

  // Damage calculation (Pokemon formula)
  calculateDamage(attacker: ObjectmonInstance, defender: ObjectmonInstance, move: Move): number {
    if (move.category === 'Status') return 0;

    const level = attacker.level;
    const attackStat = move.category === 'Physical' ? attacker.stats.ATK : attacker.stats.SPATK;
    const defenseStat = move.category === 'Physical' ? defender.stats.DEF : defender.stats.SPDEF;
    const basePower = move.power;

    // Base damage calculation
    let damage = Math.floor(
      (((2 * level / 5 + 2) * attackStat * basePower / defenseStat) / 50) + 2
    );

    // Apply modifiers
    let modifier = 1.0;

    // STAB (Same Type Attack Bonus)
    const attackerSpecies = OBJECTMON_SPECIES.find(s => s.id === attacker.id);
    if (attackerSpecies && attackerSpecies.types.includes(move.type)) {
      modifier *= 1.5;
    }

    // Type effectiveness
    const defenderSpecies = OBJECTMON_SPECIES.find(s => s.id === defender.id);
    if (defenderSpecies) {
      defenderSpecies.types.forEach(defType => {
        modifier *= TYPE_CHART[move.type]?.[defType] || 1.0;
      });
    }

    // Random factor (85-100%)
    modifier *= (85 + Math.floor(Math.random() * 16)) / 100;

    // Critical hit (simplified)
    if (Math.random() < 0.0625) { // 1/16 chance
      modifier *= 2.0;
    }

    damage = Math.floor(damage * modifier);
    return Math.max(1, damage);
  }

  // Statistics calculation
  calculateStat(baseStat: number, level: number, iv: number, ev: number, isHP = false): number {
    if (isHP) {
      return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
    }
    return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  }

  // Create Objectmon instance
  createObjectmonInstance(speciesId: number, level: number, nickname?: string): ObjectmonInstance {
    const species = OBJECTMON_SPECIES.find(s => s.id === speciesId);
    if (!species) {
      throw new Error(`Species with ID ${speciesId} not found`);
    }

    const ivs: StatBlock = {
      HP: Math.floor(Math.random() * 32),
      ATK: Math.floor(Math.random() * 32),
      DEF: Math.floor(Math.random() * 32),
      SPATK: Math.floor(Math.random() * 32),
      SPDEF: Math.floor(Math.random() * 32),
      SPD: Math.floor(Math.random() * 32)
    };

    const evs: StatBlock = {
      HP: 0, ATK: 0, DEF: 0, SPATK: 0, SPDEF: 0, SPD: 0
    };

    const stats: StatBlock = {
      HP: this.calculateStat(species.baseStats.HP, level, ivs.HP, evs.HP, true),
      ATK: this.calculateStat(species.baseStats.ATK, level, ivs.ATK, evs.ATK),
      DEF: this.calculateStat(species.baseStats.DEF, level, ivs.DEF, evs.DEF),
      SPATK: this.calculateStat(species.baseStats.SPATK, level, ivs.SPATK, evs.SPATK),
      SPDEF: this.calculateStat(species.baseStats.SPDEF, level, ivs.SPDEF, evs.SPDEF),
      SPD: this.calculateStat(species.baseStats.SPD, level, ivs.SPD, evs.SPD)
    };

    return {
      id: speciesId,
      nickname: nickname || species.name,
      level,
      gender: species.genderRatio === 'genderless' ? 'none' : 
             (Math.random() < 0.5 ? 'male' : 'female'),
      ability: species.abilities[0],
      exp: 0,
      ivs,
      evs,
      moves: this.generateMoves(species, level),
      status: null,
      currentHP: stats.HP,
      stats,
      isShiny: Math.random() < (1 / 4096),
      fusionParents: [],
      originalTrainer: {
        name: this.gameState.player?.name || 'Unknown',
        id: this.gameState.player?.id || 0
      }
    };
  }

  private generateMoves(species: ObjectmonSpecies, level: number): MoveInstance[] {
    const moves: MoveInstance[] = [];
    
    Object.entries(species.learnset)
      .filter(([levelReq]) => parseInt(levelReq) <= level)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .slice(-4) // Take last 4 moves
      .forEach(([, moveName]) => {
        const moveData = MOVE_DATABASE.find(m => m.name === moveName);
        if (moveData) {
          moves.push({
            id: moveData.id,
            name: moveData.name,
            currentPP: moveData.pp,
            maxPP: moveData.pp,
            ppUpsUsed: 0
          });
        }
      });

    return moves;
  }

  // Save/Load system
  saveGame(slot: number): void {
    const saveData = {
      gameState: this.gameState,
      timestamp: Date.now()
    };
    localStorage.setItem(`objectmon_save_${slot}`, JSON.stringify(saveData));
  }

  loadGame(slot: number): boolean {
    const saveData = localStorage.getItem(`objectmon_save_${slot}`);
    if (saveData) {
      try {
        const parsed = JSON.parse(saveData);
        this.gameState = parsed.gameState;
        return true;
      } catch (error) {
        console.error('Failed to load save:', error);
        return false;
      }
    }
    return false;
  }

  getBattleState(): BattleState | null {
    return this.battleState;
  }
}

// Static game data
export const OBJECTMON_SPECIES: ObjectmonSpecies[] = [
  {
    id: 1,
    name: 'Toaster',
    kind: 'Appliance',
    types: ['Metal', 'Electric'],
    baseStats: { HP: 40, ATK: 50, DEF: 35, SPATK: 30, SPDEF: 30, SPD: 25 },
    abilities: ['Heatproof', 'Static'],
    learnset: { 5: 'Toast', 10: 'Heat Up', 15: 'Crumb Shot' },
    eggGroup: ['Appliance'],
    evolution: { method: 'Level', level: 16, evolvesTo: 2 },
    catchRate: 190,
    baseExp: 60,
    genderRatio: 'genderless'
  },
  {
    id: 2,
    name: 'Mug',
    kind: 'Utensil',
    types: ['Ceramic', 'Liquid'],
    baseStats: { HP: 55, ATK: 30, DEF: 40, SPATK: 45, SPDEF: 50, SPD: 20 },
    abilities: ['Hydrate'],
    learnset: { 5: 'Splash', 12: 'Steep', 18: 'Steam Burst' },
    eggGroup: ['Utensil'],
    evolution: null,
    catchRate: 255,
    baseExp: 65,
    genderRatio: 'female_only'
  },
  {
    id: 3,
    name: 'Lamp',
    kind: 'Appliance',
    types: ['Electric', 'Fire'],
    baseStats: { HP: 45, ATK: 35, DEF: 30, SPATK: 55, SPDEF: 35, SPD: 40 },
    abilities: ['Illuminate', 'Flash Fire'],
    learnset: { 5: 'Flash', 8: 'Ember', 14: 'Light Beam' },
    eggGroup: ['Appliance'],
    evolution: null,
    catchRate: 200,
    baseExp: 70,
    genderRatio: 'genderless'
  }
];

export const MOVE_DATABASE: Move[] = [
  {
    id: 1,
    name: 'Toast',
    type: 'Electric',
    category: 'Physical',
    power: 40,
    accuracy: 100,
    pp: 30,
    effect: { type: 'status', chance: 10, target: 'opponent', status: 'burn' },
    priority: 0,
    target: 'Single'
  },
  {
    id: 2,
    name: 'Heat Up',
    type: 'Fire',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    effect: { type: 'stat_change', chance: 100, target: 'self', stat: 'ATK', value: 1 },
    priority: 0,
    target: 'Self'
  },
  {
    id: 3,
    name: 'Crumb Shot',
    type: 'Ground',
    category: 'Physical',
    power: 50,
    accuracy: 95,
    pp: 20,
    effect: { type: 'stat_change', chance: 30, target: 'opponent', stat: 'DEF', value: -1 },
    priority: 0,
    target: 'Single'
  },
  {
    id: 4,
    name: 'Splash',
    type: 'Water',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 40,
    effect: null,
    priority: 0,
    target: 'Self'
  },
  {
    id: 5,
    name: 'Steep',
    type: 'Water',
    category: 'Special',
    power: 30,
    accuracy: 100,
    pp: 25,
    effect: { type: 'stat_change', chance: 50, target: 'opponent', stat: 'SPDEF', value: -1 },
    priority: 0,
    target: 'Single'
  },
  {
    id: 6,
    name: 'Steam Burst',
    type: 'Water',
    category: 'Special',
    power: 65,
    accuracy: 90,
    pp: 15,
    effect: { type: 'status', chance: 20, target: 'opponent', status: 'burn' },
    priority: 0,
    target: 'Single'
  },
  {
    id: 7,
    name: 'Flash',
    type: 'Electric',
    category: 'Status',
    power: 0,
    accuracy: 100,
    pp: 20,
    effect: { type: 'stat_change', chance: 100, target: 'opponent', stat: 'ATK', value: -1 },
    priority: 0,
    target: 'Single'
  },
  {
    id: 8,
    name: 'Ember',
    type: 'Fire',
    category: 'Special',
    power: 40,
    accuracy: 100,
    pp: 25,
    effect: { type: 'status', chance: 10, target: 'opponent', status: 'burn' },
    priority: 0,
    target: 'Single'
  },
  {
    id: 9,
    name: 'Light Beam',
    type: 'Electric',
    category: 'Special',
    power: 60,
    accuracy: 95,
    pp: 20,
    effect: null,
    priority: 0,
    target: 'Single'
  }
];