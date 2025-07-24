import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dna, Shield, Sliders, Trash2, X, Save, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MUTATION_STATS = ["Attack", "Pollen", "Convert Rate", "Energy Regen", "Move Speed", "Critical Chance"];

export default function SlotEditor({ slotData, beequips, onSave, onRemove, onCopy, onClose }) {
  const [level, setLevel] = useState(slotData.level || 9);
  const [isGifted, setIsGifted] = useState(slotData.gifted || false);
  const [mutationStat, setMutationStat] = useState(slotData.mutation?.stat || "none");
  const [mutationValue, setMutationValue] = useState(slotData.mutation?.value || "");
  const [beequipId, setBeequipId] = useState(slotData.beequip?.base.id || "none");
  const [beequipOverrides, setBeequipOverrides] = useState(slotData.beequip?.overrides || {});

  if (!slotData?.bee) return null;

  const handleSave = () => {
    const baseBeequip = beequips.find(bq => bq.id === beequipId);
    onSave({
      ...slotData,
      level,
      gifted: isGifted,
      mutation: mutationStat !== "none" ? { stat: mutationStat, value: mutationValue } : null,
      beequip: baseBeequip ? { base: baseBeequip, overrides: beequipOverrides } : null,
    });
    onClose();
  };

  const handleCopy = () => {
    onCopy({ ...slotData, level, gifted: isGifted, mutation: { stat: mutationStat, value: mutationValue }, beequip: { base: beequips.find(bq => bq.id === beequipId), overrides: beequipOverrides } });
    onClose();
  }

  const handleBeequipChange = (id) => {
    setBeequipId(id);
    setBeequipOverrides({}); // Reset overrides when changing beequip
  }
  
  const handleOverrideChange = (stat, value) => {
    setBeequipOverrides(prev => ({...prev, [stat]: value}));
  }

  const selectedBeequipBase = beequips.find(bq => bq.id === beequipId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-amber-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={slotData.bee.image_url} alt={slotData.bee.name} className="w-16 h-16 object-contain" />
              {isGifted && <img src="https://static.wikia.nocookie.net/bee-swarm-simulator/images/b/b5/Gifted_Effect.png" className="w-20 h-20 absolute -top-2 -left-2 opacity-80" />}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-800">{slotData.bee.name}</h2>
              <p className="text-sm text-amber-600">Customizing Slot #{slotData.slotIndex + 1}</p>
            </div>
          </div>
           <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
 