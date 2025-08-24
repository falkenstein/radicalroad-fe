import React, { useState } from 'react';
import { PokemonBattleInstanceDto } from '../types/api';
import { apiService } from '../services/api';
import './PokemonDisplay.css';

interface PokemonDisplayProps {
  pokemon: PokemonBattleInstanceDto;
  isOpponent: boolean;
}

const PokemonDisplay: React.FC<PokemonDisplayProps> = ({ pokemon, isOpponent }) => {
  const [imageError, setImageError] = useState(false);
  const hpPercentage = (pokemon.currentHp / pokemon.maxHp) * 100;
  const spriteUrl = apiService.getSpriteUrl(pokemon.pokemon.species.key);

  return (
    <div className={`pokemon-display ${isOpponent ? 'opponent' : 'player'}`}>
      <div className="pokemon-info">
        <div className="pokemon-name-level">
          <span className="pokemon-name">{pokemon.pokemon.species.name}</span>
          <span className="pokemon-level">Lv.{pokemon.pokemon.level}</span>
        </div>
        
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span key={type} className={`type-badge ${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>
        
        <div className="hp-bar-container">
          <div className="hp-text">
            HP: {pokemon.currentHp}/{pokemon.maxHp}
          </div>
          <div className="hp-bar">
            <div 
              className="hp-fill" 
              style={{ 
                width: `${hpPercentage}%`,
                backgroundColor: hpPercentage > 50 ? '#4CAF50' : hpPercentage > 20 ? '#FF9800' : '#F44336'
              }}
            />
          </div>
        </div>
        
        {pokemon.primaryStatus && (
          <div className="status-indicator">
            <span className={`status-badge ${pokemon.primaryStatus.type.toLowerCase()}`}>
              {pokemon.primaryStatus.type}
            </span>
          </div>
        )}
      </div>
      
      <div className="pokemon-sprite">
        {!imageError ? (
          <img 
            src={spriteUrl}
            alt={pokemon.pokemon.species.name}
            className={`sprite-image ${isOpponent ? 'opponent-sprite' : 'player-sprite'}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`sprite-placeholder ${isOpponent ? 'opponent-sprite' : 'player-sprite'}`}>
            {pokemon.pokemon.species.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokemonDisplay;