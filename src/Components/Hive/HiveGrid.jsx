import React from "react";
import { motion } from "framer-motion";
import { Plus, X, Star, Shield, Dna, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HiveGrid({ hiveSlots, onSlotClick, onRemoveBee, onPasteBee, copiedBeeConfig }) {
  const getRarityColor = (rarity) => {
    const colors = {
      'Basic': 'bg-gray-100 border-gray-300',
      'Rare': 'bg-blue-100 border-blue-400', 
      'Epic': 'bg-purple-100 border-purple-400',
      'Legendary': 'bg-yellow-100 border-yellow-400',
      'Mythic': 'bg-red-100 border-red-400',
      'Event': 'bg-emerald-100 border-emerald-400'
    };
    return colors[rarity] || 'bg-gray-50 border-gray-200';
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-5 gap-3 p-6 bg-white rounded-2xl shadow-lg border border-amber-100">
        {Array.from({ length: 50 }, (_, index) => {
          const slot = hiveSlots[index];
          const bee = slot?.bee;
          return (
            <motion.div
              key={index}
              className={`aspect-square rounded-xl border-2 border-dashed cursor-pointer relative group transition-all duration-300 hover:scale-105 ${
                bee 
                  ? `${getRarityColor(bee.rarity)} border-solid bee-glow` 
                  : 'bg-amber-50 border-amber-200 hover:border-amber-300 hover:bg-amber-100'
              }`}
              onClick={() => onSlotClick(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {bee ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-full h-full flex flex-col items-center justify-center p-1">
                      <div className="relative">
                        <img src={bee.image_url} alt={bee.name} className="w-10 h-10 object-contain drop-shadow-lg" />
                         {slot.gifted && <img src="https://static.wikia.nocookie.net/bee-swarm-simulator/images/b/b5/Gifted_Effect.png" className="w-12 h-12 absolute -top-1 -left-1 opacity-70" />}
                      </div>
                      <div className="text-xs font-semibold text-center leading-tight mt-1 truncate w-full">
                        {bee.name}
                      </div>
                      <div className="absolute top-1 left-1 flex flex-col gap-1">
                        {slot.mutation && <Dna className="w-3 h-3 text-green-500" />}
                        {slot.beequip && <Shield className="w-3 h-3 text-gray-500" />}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-center">
                      <p className="font-semibold">{slot.gifted ? 'Gifted ' : ''}{bee.name} (Lvl {slot.level || 9})</p>
                      <p className="text-xs text-gray-500">{bee.rarity}</p>
                      {slot.mutation && <p className="text-xs text-green-600">Mutation: {slot.mutation.stat} {slot.mutation.value}</p>}
                      {slot.beequip && <p className="text-xs text-gray-600">Equip: {slot.beequip.base.name}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  {copiedBeeConfig ? (
                     <Button size="icon" variant="ghost" className="w-full h-full" onClick={(e) => {e.stopPropagation(); onPasteBee(index)}}>
                      <Copy className="w-6 h-6 text-blue-500"/>
                     </Button>
                  ) : (
                    <Plus className="w-6 h-6 text-amber-400 group-hover:text-amber-600 transition-colors duration-200" />
                  )}
                </div>
              )}
              <div className="absolute bottom-1 right-1 text-xs font-bold text-amber-600 opacity-60">
                {index + 1}
              </div>
            </motion.div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
