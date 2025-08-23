import React from 'react';
import './BattleResult.css';

interface BattleResultProps {
  result: 'WON' | 'LOST';
  onNewBattle: () => void;
}

const BattleResult: React.FC<BattleResultProps> = ({ result, onNewBattle }) => {
  return (
    <div className={`battle-result ${result.toLowerCase()}`}>
      <div className="result-content">
        <div className="result-icon">
          {result === 'WON' ? '🏆' : '💀'}
        </div>
        <h2 className="result-title">
          {result === 'WON' ? 'Victory!' : 'Defeat!'}
        </h2>
        <p className="result-message">
          {result === 'WON' 
            ? 'Congratulations! You have emerged victorious in this Pokemon battle!' 
            : 'Your Pokemon have been defeated. Better luck next time!'}
        </p>
        <button className="new-battle-btn" onClick={onNewBattle}>
          Start New Battle
        </button>
      </div>
    </div>
  );
};

export default BattleResult;