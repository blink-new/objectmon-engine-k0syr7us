import React from 'react';
import { GameBoyScreen } from './components/GameBoyScreen';
import { TitleScreen } from './components/TitleScreen';
import { BattleScreen } from './components/BattleScreen';
import { ObjectmonEngine, GameState, OBJECTMON_SPECIES } from './engine/ObjectmonEngine';
import toast from 'react-hot-toast';

function App() {
  const [engine] = React.useState(() => new ObjectmonEngine());
  const [gameState, setGameState] = React.useState<GameState>(engine.getGameState());
  const [battleMessages, setBattleMessages] = React.useState<string[]>([]);

  // Load save slot data
  const [saveSlots] = React.useState(() => {
    return [1, 2, 3].map(slot => {
      const saveData = localStorage.getItem(`objectmon_save_${slot}`);
      if (saveData) {
        try {
          const parsed = JSON.parse(saveData);
          return {
            slot,
            hasData: true,
            timestamp: parsed.timestamp,
            playerName: parsed.gameState?.player?.name || 'Unknown'
          };
        } catch {
          return { slot, hasData: false };
        }
      }
      return { slot, hasData: false };
    });
  });

  // Update UI when game state changes
  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentState = engine.getGameState();
      setGameState({ ...currentState });
    }, 100);

    return () => clearInterval(interval);
  }, [engine]);

  const handleNewGame = () => {
    const playerName = prompt('Enter your name:') || 'Player';
    const player = engine.createPlayer(playerName);
    
    // Give starter Objectmon
    toast.success(`Welcome to the world of Objectmon, ${playerName}!`);
    
    // Create starter Toaster
    const starterToaster = engine.createObjectmonInstance(1, 5, 'Toasty');
    player.party.push(starterToaster);
    player.objectdex.seen.add(1);
    player.objectdex.caught.add(1);

    engine.setScreen('OVERWORLD');
    toast.success('You received a Toaster! Check your party.');
    
    // Start tutorial battle
    setTimeout(() => {
      startTutorialBattle();
    }, 2000);
  };

  const handleLoadGame = (slot: number) => {
    const success = engine.loadGame(slot);
    if (success) {
      toast.success(`Game loaded from slot ${slot}!`);
      const currentState = engine.getGameState();
      setGameState({ ...currentState });
    } else {
      toast.error('Failed to load game!');
    }
  };

  const startTutorialBattle = () => {
    // Create a wild Mug to battle
    const wildMug = engine.createObjectmonInstance(2, 4, 'Wild Mug');
    
    setBattleMessages(['A wild Mug appeared!', 'Go, Toasty!']);
    engine.startBattle(wildMug);
    
    setTimeout(() => {
      setBattleMessages(prev => [...prev, 'What will Toasty do?']);
    }, 1500);
  };

  const handleBattleAttack = (moveId: number) => {
    const battleState = engine.getBattleState();
    if (!battleState?.playerObjectmon || !battleState?.opponentObjectmon) return;

    const playerObjectmon = battleState.playerObjectmon;
    const opponentObjectmon = battleState.opponentObjectmon;
    
    // Find the move
    const moveInstance = playerObjectmon.moves.find(m => m.id === moveId);
    if (!moveInstance) return;

    setBattleMessages(prev => [...prev, `${playerObjectmon.nickname} used ${moveInstance.name}!`]);

    // Simple battle logic for demo
    setTimeout(() => {
      const damage = Math.floor(Math.random() * 20) + 10;
      opponentObjectmon.currentHP = Math.max(0, opponentObjectmon.currentHP - damage);
      
      if (opponentObjectmon.currentHP === 0) {
        setBattleMessages(prev => [...prev, `Wild ${opponentObjectmon.nickname} fainted!`, 'You won the battle!']);
        setTimeout(() => {
          engine.setScreen('OVERWORLD');
          toast.success('Battle won! Your Objectmon gained experience.');
          // Save game automatically
          engine.saveGame(1);
        }, 2000);
      } else {
        setBattleMessages(prev => [...prev, `Wild ${opponentObjectmon.nickname} took ${damage} damage!`]);
        
        // Opponent's turn
        setTimeout(() => {
          const enemyDamage = Math.floor(Math.random() * 15) + 5;
          playerObjectmon.currentHP = Math.max(0, playerObjectmon.currentHP - enemyDamage);
          setBattleMessages(prev => [...prev, `Wild ${opponentObjectmon.nickname} attacked!`, `${playerObjectmon.nickname} took ${enemyDamage} damage!`]);
          
          if (playerObjectmon.currentHP === 0) {
            setBattleMessages(prev => [...prev, `${playerObjectmon.nickname} fainted!`, 'You lost the battle...']);
            setTimeout(() => {
              engine.setScreen('OVERWORLD');
              toast.error('Your Objectmon fainted! Visit the Objectmon Center.');
            }, 2000);
          }
        }, 1500);
      }
    }, 1000);
  };

  const handleBattleRun = () => {
    setBattleMessages(prev => [...prev, 'You ran away safely!']);
    setTimeout(() => {
      engine.setScreen('OVERWORLD');
      toast.info('You escaped from the battle.');
    }, 1500);
  };

  const renderCurrentScreen = () => {
    switch (gameState.screen) {
      case 'TITLE':
        return (
          <TitleScreen 
            onNewGame={handleNewGame}
            onLoadGame={handleLoadGame}
            saveSlots={saveSlots}
          />
        );

      case 'BATTLE': {
        const battleState = engine.getBattleState();
        if (battleState?.playerObjectmon && battleState?.opponentObjectmon) {
          return (
            <BattleScreen
              playerObjectmon={battleState.playerObjectmon}
              opponentObjectmon={battleState.opponentObjectmon}
              onAttack={handleBattleAttack}
              onRun={handleBattleRun}
              onSwitchObjectmon={() => toast.info('Switch Objectmon - Coming soon!')}
              onUseItem={() => toast.info('Use Item - Coming soon!')}
              messages={battleMessages}
              isPlayerTurn={true}
            />
          );
        }
        return <div className="p-4 text-center">Loading battle...</div>;
      }

      case 'OVERWORLD':
        return (
          <div className="h-full w-full bg-gradient-to-b from-green-300 to-green-100 p-4">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-green-900 font-mono">OVERWORLD</h2>
              <p className="text-green-800 font-mono text-sm">
                Welcome to the world of Objectmon!
              </p>
              
              {gameState.player && (
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-700">
                  <h3 className="font-bold text-green-900 mb-2">Player Info</h3>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>Name: {gameState.player.name}</div>
                    <div>Money: ${gameState.player.money}</div>
                    <div>Party: {gameState.player.party.length}/6</div>
                    <div>Objectdex: {gameState.player.objectdex.caught.size} caught</div>
                  </div>
                  
                  {gameState.player.party.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-bold text-green-900 mb-2">Your Team</h4>
                      <div className="space-y-2">
                        {gameState.player.party.map((objectmon, index) => {
                          const species = OBJECTMON_SPECIES.find(s => s.id === objectmon.id);
                          return (
                            <div key={index} className="bg-white p-2 rounded border">
                              <div className="flex justify-between">
                                <span className="font-mono text-sm">{objectmon.nickname}</span>
                                <span className="text-xs text-gray-600">Lv.{objectmon.level}</span>
                              </div>
                              <div className="text-xs text-gray-600">
                                HP: {objectmon.currentHP}/{objectmon.stats.HP}
                              </div>
                              {species && (
                                <div className="text-xs text-gray-600">
                                  Type: {species.types.join('/')}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={startTutorialBattle}
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded font-mono text-sm"
                >
                  Start Battle
                </button>
                <div>
                  <button
                    onClick={() => engine.saveGame(1)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded font-mono text-sm mr-2"
                  >
                    Save Game
                  </button>
                  <button
                    onClick={() => engine.setScreen('TITLE')}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded font-mono text-sm"
                  >
                    Main Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-4 text-center">Loading...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-300 to-green-200 p-4 flex items-center justify-center">
      <GameBoyScreen>
        {renderCurrentScreen()}
      </GameBoyScreen>
    </div>
  );
}

export default App;