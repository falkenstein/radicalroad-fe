import React from 'react';
import { MoveBattleDto } from '../types/api';
import './MoveSelector.css';

interface MoveSelectorProps {
  moves: MoveBattleDto[];
  onMoveSelect: (moveKey: string) => void;
}

const MoveSelector: React.FC<MoveSelectorProps> = ({ moves, onMoveSelect }) => {
  return (
    <div className="move-selector">
      <h3>Choose your move:</h3>
      <div className="moves-grid">
        {moves.slice(0, 4).map(moveDto => {
          const move = moveDto.move;
          const primaryType = move.types[0] || 'normal';
          
          return (
            <button
              key={move.key}
              className={`move-button ${primaryType.toLowerCase()}`}
              onClick={() => onMoveSelect(move.key)}
              disabled={moveDto.currentPp === 0}
            >
              <div className="move-name">{move.name}</div>
              <div className="move-details">
                <span className="move-type">{primaryType}</span>
                <span className="move-power">PWR: {move.power || '-'}</span>
              </div>
              <div className="move-pp">
                PP: {moveDto.currentPp}/{moveDto.maxPp}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoveSelector;