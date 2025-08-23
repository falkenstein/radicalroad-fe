import React, { useState } from 'react';
import { PokemonBattleInstanceDto } from '../types/api';
import { apiService } from '../services/api';
import './PokemonSelector.css';

interface PokemonSelectorProps {
  pokemon: PokemonBattleInstanceDto[];
  onPokemonSelect: (pokemonKey: string) => void;
}

const PokemonSelector: React.FC<PokemonSelectorProps> = ({ pokemon, onPokemonSelect }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const alivePokemon = pokemon.filter(p => p.alive);

  const handleImageError = (pokemonKey: string) => {
    setImageErrors(prev => ({ ...prev, [pokemonKey]: true }));
  };

  return (
    <div className="pokemon-selector">
      <h3>Choose a Pokemon to switch in:</h3>
      <div className="pokemon-grid">
        {alivePokemon.map((poke) => (
          <div 
            key={poke.key} 
            className="pokemon-card"
            onClick={() => onPokemonSelect(poke.key)}
          >
            <div className="pokemon-sprite-small">
              {!imageErrors[poke.key] ? (
                <img 
                  src={apiService.getSpriteUrl(poke.pokemon.species.key)}
                  alt={poke.pokemon.species.name}
                  className="sprite-image-small"
                  onError={() => handleImageError(poke.key)}
                />
              ) : (
                <div className="sprite-placeholder-small">
                  {poke.pokemon.species.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="pokemon-name">{poke.pokemon.species.name}</div>
            <div className="pokemon-level">Level {poke.pokemon.level}</div>
            <div className="pokemon-hp">
              HP: {poke.currentHp}/{poke.maxHp}
            </div>
            <div className="pokemon-types">
              {poke.types.map(type => (
                <span key={type} className={`type-badge ${type.toLowerCase()}`}>
                  {type}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PokemonSelector;