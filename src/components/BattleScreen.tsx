import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ObjectmonSprite } from './ObjectmonSprite';
import { ObjectmonInstance, OBJECTMON_SPECIES, MOVE_DATABASE } from '@/engine/ObjectmonEngine';

interface BattleScreenProps {
  playerObjectmon: ObjectmonInstance;
  opponentObjectmon: ObjectmonInstance;
  onAttack: (moveId: number) => void;
  onRun: () => void;
  onSwitchObjectmon: () => void;
  onUseItem: () => void;
  messages: string[];
  isPlayerTurn: boolean;
}

export const BattleScreen: React.FC<BattleScreenProps> = ({
  playerObjectmon,
  opponentObjectmon,
  onAttack,
  onRun,
  onSwitchObjectmon,
  onUseItem,
  messages,
  isPlayerTurn
}) => {
  const [selectedAction, setSelectedAction] = useState<'fight' | 'bag' | 'objectmon' | 'run' | null>(null);
  
  const playerSpecies = OBJECTMON_SPECIES.find(s => s.id === playerObjectmon.id);
  const opponentSpecies = OBJECTMON_SPECIES.find(s => s.id === opponentObjectmon.id);

  const getHPPercentage = (current: number, max: number) => (current / max) * 100;

  const renderBattleField = () => (
    <div className="relative h-40 bg-gradient-to-b from-blue-200 to-green-300 rounded-lg border-2 border-green-800">
      {/* Opponent Objectmon */}
      <div className="absolute top-4 right-8">
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {opponentSpecies && (
            <ObjectmonSprite 
              species={opponentSpecies}
              isShiny={opponentObjectmon.isShiny}
              size="large"
              animation="idle"
            />
          )}
        </motion.div>
      </div>

      {/* Player Objectmon */}
      <div className="absolute bottom-4 left-8">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {playerSpecies && (
            <ObjectmonSprite 
              species={playerSpecies}
              isShiny={playerObjectmon.isShiny}
              size="large"
              animation="idle"
            />
          )}
        </motion.div>
      </div>

      {/* Battle effects overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Add particle effects, weather, etc. */}
      </div>
    </div>
  );

  const renderObjectmonStats = (objectmon: ObjectmonInstance, isOpponent = false) => {
    const species = OBJECTMON_SPECIES.find(s => s.id === objectmon.id);
    const hpPercentage = getHPPercentage(objectmon.currentHP, objectmon.stats.HP);
    
    return (
      <Card className={`p-3 bg-green-50 border-green-700 ${isOpponent ? 'ml-auto' : ''}`}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="font-mono text-sm font-bold text-green-900">
              {objectmon.nickname}
            </div>
            <div className="text-xs text-green-700 font-mono">
              Lv.{objectmon.level}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono text-green-800">
              <span>HP</span>
              <span>{objectmon.currentHP}/{objectmon.stats.HP}</span>
            </div>
            <Progress 
              value={hpPercentage} 
              className="h-2 bg-green-200"
              style={{
                '--progress-background': hpPercentage > 50 ? '#22c55e' : 
                                       hpPercentage > 25 ? '#eab308' : '#ef4444'
              } as React.CSSProperties}
            />
          </div>

          {species && (
            <div className="flex gap-1">
              {species.types.map(type => (
                <span 
                  key={type}
                  className="px-2 py-1 text-xs bg-green-200 text-green-800 rounded font-mono"
                >
                  {type.toUpperCase()}
                </span>
              ))}
            </div>
          )}

          {objectmon.status && (
            <div className="text-xs text-red-600 font-mono">
              Status: {objectmon.status.toUpperCase()}
            </div>
          )}
        </div>
      </Card>
    );
  };

  const renderBattleActions = () => {
    if (!isPlayerTurn) return null;

    if (selectedAction === 'fight') {
      return (
        <div className="grid grid-cols-2 gap-2">
          {playerObjectmon.moves.map((move, index) => {
            const moveData = MOVE_DATABASE.find(m => m.id === move.id);
            return (
              <Button
                key={index}
                onClick={() => onAttack(move.id)}
                className="bg-red-600 hover:bg-red-500 text-white font-mono text-sm p-2 h-auto"
                disabled={move.currentPP === 0}
              >
                <div className="text-left">
                  <div>{move.name}</div>
                  <div className="text-xs opacity-75">
                    {move.currentPP}/{move.maxPP} PP
                  </div>
                  {moveData && (
                    <div className="text-xs opacity-75">
                      {moveData.type} • {moveData.category}
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={() => setSelectedAction('fight')}
          className="bg-red-600 hover:bg-red-500 text-white font-mono"
        >
          FIGHT
        </Button>
        <Button
          onClick={() => setSelectedAction('bag')}
          className="bg-blue-600 hover:bg-blue-500 text-white font-mono"
        >
          BAG
        </Button>
        <Button
          onClick={() => setSelectedAction('objectmon')}
          className="bg-green-600 hover:bg-green-500 text-white font-mono"
        >
          OBJECTMON
        </Button>
        <Button
          onClick={onRun}
          className="bg-yellow-600 hover:bg-yellow-500 text-white font-mono"
        >
          RUN
        </Button>
      </div>
    );
  };

  const renderMessages = () => (
    <Card className="p-3 bg-green-50 border-green-700 min-h-[80px]">
      <div className="font-mono text-sm text-green-900 space-y-1">
        <AnimatePresence>
          {messages.slice(-3).map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.div>
          ))}
        </AnimatePresence>
        {!isPlayerTurn && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-center text-green-700 mt-2"
          >
            Enemy turn...
          </motion.div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="h-full w-full bg-gradient-to-b from-green-300 to-green-100 p-2 space-y-2">
      {/* Battle field */}
      {renderBattleField()}

      {/* Objectmon stats */}
      <div className="space-y-2">
        <div className="flex justify-end">
          {renderObjectmonStats(opponentObjectmon, true)}
        </div>
        <div className="flex justify-start">
          {renderObjectmonStats(playerObjectmon, false)}
        </div>
      </div>

      {/* Messages */}
      {renderMessages()}

      {/* Battle actions */}
      <div className="mt-2">
        {renderBattleActions()}
        {selectedAction && selectedAction !== 'fight' && (
          <Button
            onClick={() => setSelectedAction(null)}
            variant="outline"
            className="w-full mt-2 font-mono"
          >
            BACK
          </Button>
        )}
      </div>
    </div>
  );
};