import {
  BattleFEDto,
  PlayerCommandDto,
} from '../types/api';

const BASE_URL = 'http://localhost:8080';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createPlayer(name: string): Promise<string> {
    const url = `${BASE_URL}/player/new?name=${encodeURIComponent(name)}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.text();
  }

  async createBattle(playerKey: string): Promise<BattleFEDto> {
    return this.request<BattleFEDto>('/battle/new-vs-ai', {
      method: 'POST',
      body: JSON.stringify(playerKey),
    });
  }

  async sendBattleCommand(command: PlayerCommandDto): Promise<BattleFEDto> {
    return this.request<BattleFEDto>('/battle/command', {
      method: 'POST',
      body: JSON.stringify(command),
    });
  }

  async sendPokemonSwitch(battleId: number, playerKey: string, pokemonKey: string): Promise<BattleFEDto> {
    const command: PlayerCommandDto = {
      battleId,
      playerKey,
      commandType: 'switch',
      pokemonKey,
      originSlot: 1
    };
    
    return this.request<BattleFEDto>('/battle/command', {
      method: 'POST',
      body: JSON.stringify(command),
    });
  }

  async getBattleInfo(battleId: number, playerKey: string): Promise<BattleFEDto> {
    const url = `${BASE_URL}/battle/info?battleId=${battleId}&playerKey=${encodeURIComponent(playerKey)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async forceAIAction(battleId: number): Promise<BattleFEDto> {
    const url = `${BASE_URL}/battle/force-action?battleId=${battleId}`;
    const response = await fetch(url, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();