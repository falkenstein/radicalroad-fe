import React, { useState, useEffect, useRef } from 'react';
import { BattleFEDto } from '../types/api';
import { apiService } from '../services/api';
import PokemonDisplay from './PokemonDisplay';
import MoveSelector from './MoveSelector';
import PokemonSelector from './PokemonSelector';
import BattleResult from './BattleResult';
import BattleConfiguration from './BattleConfiguration';
import './BattleScreen.css';

const BattleScreen: React.FC = () => {
  const [battle, setBattle] = useState<BattleFEDto | null>(null);
  const [playerKey, setPlayerKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfiguration, setShowConfiguration] = useState<boolean>(true);
  const initializationRef = useRef<boolean>(false);

  useEffect(() => {
    // Remove automatic initialization on component mount
  }, []);

  useEffect(() => {
    if (battle && battle.state === 'PROCESSING' && playerKey && !loading) {
      handleProcessingState(battle.id, playerKey);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [battle?.state]);

  const initializeBattle = async (level: number) => {
    try {
      setLoading(true);
      setError(null);
      setShowConfiguration(false);

      const playerKeyResponse = await apiService.createPlayer('Player');
      setPlayerKey(playerKeyResponse);
      
      const battleResponse = await apiService.createBattle(playerKeyResponse, level);
      setBattle(battleResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize battle');
      setShowConfiguration(true);
    } finally {
      setLoading(false);
    }
  };

  const refreshBattleInfo = async (battleId: number, playerKeyValue: string) => {
    try {
      const updatedBattle = await apiService.getBattleInfo(battleId, playerKeyValue);
      setBattle(updatedBattle);
    } catch (err) {
      console.error('Failed to refresh battle state:', err);
    }
  };

  const handleProcessingState = async (battleId: number, playerKeyValue: string) => {
    try {
      const forceActionResponse = await apiService.forceAIAction(battleId);
      setBattle(forceActionResponse);
      
      if (forceActionResponse.state === 'PROCESSING') {
        await refreshBattleInfo(battleId, playerKeyValue);
      }
    } catch (err) {
      console.error('Failed to force AI action:', err);
      await refreshBattleInfo(battleId, playerKeyValue);
    }
  };

  const handleMoveSelect = async (moveKey: string) => {
    if (!battle || !playerKey) return;

    try {
      setError(null);
      setLoading(true);
      
      const commandResponse = await apiService.sendBattleCommand({
        battleId: battle.id,
        playerKey: playerKey,
        commandType: 'move',
        moveKey: moveKey,
        pokemonKey: battle.activePokemonPlayer.key
      });

      setBattle(commandResponse);
      
      if (commandResponse.state === 'PROCESSING') {
        await handleProcessingState(commandResponse.id, playerKey);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute move');
    } finally {
      setLoading(false);
    }
  };

  const handlePokemonSwitch = async (pokemonKey: string) => {
    if (!battle || !playerKey) return;

    try {
      setError(null);
      setLoading(true);
      
      const commandResponse = await apiService.sendPokemonSwitch(battle.id, playerKey, pokemonKey);
      setBattle(commandResponse);
      
      if (commandResponse.state === 'PROCESSING') {
        await handleProcessingState(commandResponse.id, playerKey);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch Pokemon');
    } finally {
      setLoading(false);
    }
  };

  const handleNewBattle = () => {
    initializationRef.current = false;
    setShowConfiguration(true);
    setBattle(null);
    setPlayerKey(null);
    setError(null);
  };

  if (showConfiguration) {
    return <BattleConfiguration onStartBattle={initializeBattle} loading={loading} />;
  }

  if (loading) {
    return <div className="battle-screen loading">Loading battle...</div>;
  }

  if (error) {
    return (
      <div className="battle-screen error">
        <div>Error: {error}</div>
        <button onClick={handleNewBattle}>Back to Configuration</button>
      </div>
    );
  }

  if (!battle) {
    return <div className="battle-screen">No battle data available</div>;
  }

  if (battle.state === 'WON' || battle.state === 'LOST') {
    return <BattleResult result={battle.state} onNewBattle={handleNewBattle} />;
  }

  if (battle.state === 'WAITING_FOR_INPUT_REPLACE_POKEMON') {
    return (
      <div className="battle-screen">
        <div className="battle-field">
          <div className="opponent-section">
            <h3>Opponent</h3>
            <PokemonDisplay pokemon={battle.activePokemonOpponent} isOpponent />
          </div>
          
          {battle.logs && battle.logs.length > 0 && (
            <div className="battle-log">
              <h3>Battle Log</h3>
              <div className="log-messages">
                {battle.logs.slice(-3).map((log, index) => (
                  <div key={index} className="log-message">
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="battle-controls">
          {!loading ? (
            <PokemonSelector 
              pokemon={battle.playerTeam.pokemon}
              onPokemonSelect={handlePokemonSwitch}
            />
          ) : (
            <div className="waiting">Processing switch...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="battle-screen">
      <div className="battle-field">
        <div className="opponent-section">
          <h3>Opponent</h3>
          <PokemonDisplay pokemon={battle.activePokemonOpponent} isOpponent />
        </div>
        
        <div className="player-section">
          <h3>Your Pokemon</h3>
          <PokemonDisplay pokemon={battle.activePokemonPlayer} isOpponent={false} />
        </div>
        
        {battle.logs && battle.logs.length > 0 && (
          <div className="battle-log">
            <h3>Battle Log</h3>
            <div className="log-messages">
              {battle.logs.slice(-3).map((log, index) => (
                <div key={index} className="log-message">
                  {log.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="battle-controls">
        {battle.state === 'WAITING_FOR_INPUT_MOVES' && !loading ? (
          <MoveSelector 
            moves={battle.activePokemonPlayer.moves}
            onMoveSelect={handleMoveSelect}
          />
        ) : (
          <div className="waiting">
            {loading ? 'Processing command...' : 
             battle.state === 'PROCESSING' ? 'Processing turn...' : 'Waiting for opponent...'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleScreen;