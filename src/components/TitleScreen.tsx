import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface TitleScreenProps {
  onNewGame: () => void;
  onLoadGame: (slot: number) => void;
  saveSlots: Array<{ slot: number; hasData: boolean; timestamp?: number; playerName?: string }>;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onNewGame, onLoadGame, saveSlots }) => {
  return (
    <div className="h-full w-full bg-gradient-to-b from-green-300 via-green-200 to-green-100 p-4 flex flex-col">
      {/* Title */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-green-900 font-mono tracking-wide mb-2">
          OBJECTMON
        </h1>
        <p className="text-lg text-green-800 font-mono">
          ENGINE
        </p>
        <div className="mt-2 text-xs text-green-700 font-mono">
          v1.0.0
        </div>
      </motion.div>

      {/* Animated sprite placeholder */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex justify-center mb-6"
      >
        <div className="w-20 h-20 bg-green-800 rounded-lg flex items-center justify-center border-2 border-green-900">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl"
          >
            🏠
          </motion.div>
        </div>
      </motion.div>

      {/* Menu options */}
      <div className="space-y-3 flex-1">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Button
            onClick={onNewGame}
            className="w-full bg-green-700 hover:bg-green-600 text-white font-mono border-2 border-green-900 shadow-lg"
          >
            NEW GAME
          </Button>
        </motion.div>

        {/* Save slot selection */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="space-y-2"
        >
          <div className="text-sm font-mono text-green-800 text-center">CONTINUE</div>
          {saveSlots.map((save) => (
            <Card key={save.slot} className="p-2 bg-green-50 border-green-700">
              <Button
                onClick={() => onLoadGame(save.slot)}
                disabled={!save.hasData}
                variant={save.hasData ? "default" : "secondary"}
                className="w-full text-left font-mono text-sm justify-start"
              >
                <div className="flex justify-between items-center w-full">
                  <span>FILE {save.slot}</span>
                  {save.hasData ? (
                    <div className="text-xs">
                      <div>{save.playerName}</div>
                      <div className="text-muted-foreground">
                        {save.timestamp ? new Date(save.timestamp).toLocaleDateString() : ''}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">EMPTY</span>
                  )}
                </div>
              </Button>
            </Card>
          ))}
        </motion.div>
      </div>

      {/* Copyright */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="text-center text-xs text-green-700 font-mono mt-4"
      >
        © 2024 OBJECTMON PROJECT
      </motion.div>
    </div>
  );
};