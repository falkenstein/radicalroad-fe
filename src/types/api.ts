export interface IPlayer {
  name: string;
  key: string;
}

export interface IPrimaryStatus {
  description: string;
  type: 'BURNED' | 'FROSTBITTEN' | 'PARALYZED' | 'POISONED' | 'ASLEEP';
}

export interface MoveDataDto {
  implemented: boolean;
  key: string;
  name: string;
  types: string[];
  category: 'PHYSICAL' | 'SPECIAL' | 'STATUS';
  power: number;
  accuracy: number;
  pp: number;
  description: string;
  target: string;
  effect: any[];
}

export interface MoveBattleDto {
  move: MoveDataDto;
  currentPp: number;
  maxPp: number;
}

export interface SpeciesDataDto {
  key: string;
  name: string;
  types: string[];
  implemented: boolean;
}

export interface PokemonInstanceDto {
  species: SpeciesDataDto;
  level: number;
  learnedMoves: MoveDataDto[];
  ability: string;
}

export interface PokemonBattleInstanceDto {
  key: string;
  currentHp: number;
  maxHp: number;
  moves: MoveBattleDto[];
  alive: boolean;
  types: string[];
  pokemon: PokemonInstanceDto;
  owner: IPlayer;
  primaryStatus?: IPrimaryStatus;
}

export interface BattleLogEntryDto {
  time: string;
  message: string;
  player?: IPlayer;
  pokemon?: PokemonBattleInstanceDto;
}

export interface BattleTeamDto {
  player: IPlayer;
  pokemon: PokemonBattleInstanceDto[];
}

export interface BattleFEDto {
  id: number;
  state: 'STARTED' | 'PROCESSING' | 'WAITING_FOR_INPUT_MOVES' | 'WAITING_FOR_INPUT_REPLACE_POKEMON' | 'WON' | 'LOST';
  playerA: IPlayer;
  playerB: IPlayer;
  playerTeam: BattleTeamDto;
  turn: number;
  activePokemonPlayer: PokemonBattleInstanceDto;
  activePokemonOpponent: PokemonBattleInstanceDto;
  logs: BattleLogEntryDto[];
  completed: boolean;
}

export interface PlayerCommandDto {
  battleId: number;
  playerKey: string;
  commandType: string;
  moveKey?: string;
  pokemonKey?: string;
  targetSlot?: number;
  originSlot?: number;
}