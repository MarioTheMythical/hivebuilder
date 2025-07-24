
import React, { useState, useEffect } from "react";
import { Bee, HiveBuild, Beequip } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Download, Trash2, Sparkles, Copy, X } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import HiveGrid from "../components/hive/HiveGrid";
import BeeLibraryPanel from "../components/hive/BeeLibraryPanel";
import BuildStats from "../components/hive/BuildStats";
import SlotEditor from "../components/hive/SlotEditor";

export default function HiveBuilder() {
  const [bees, setBees] = useState([]);
  const [beequips, setBeequips] = useState([]);
  const [hiveSlots, setHiveSlots] = useState({});
  const [activeSlotIndex, setActiveSlotIndex] = useState(null);
  const [activeBee, setActiveBee] = useState(null);
  const [showSlotEditor, setShowSlotEditor] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [copiedBeeConfig, setCopiedBeeConfig] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [beeData, beequipData] = await Promise.all([
      Bee.list(),
      Beequip.list()
    ]);
    setBees(beeData);
    setBeequips(beequipData);
  };

  const handleSlotClick = (slotIndex) => {
    setActiveSlotIndex(slotIndex);
    if (hiveSlots[slotIndex]) {
      // If the slot is already filled, open the editor to customize it.
      setShowSlotEditor(true);
    } else if (activeBee) {
      // If the slot is empty and a bee is actively selected, place it.
      setHiveSlots(prev => ({
        ...prev,
        [slotIndex]: {
          bee: activeBee,
          level: 9,
          gifted: false,
          mutation: null,
          beequip: null,
        },
      }));
      // The activeBee remains selected for further placement.
    }
    // If the slot is empty and no bee is selected, nothing happens.
  };

  const handleBeeLibrarySelect = (bee) => {
    if (activeBee && activeBee.id === bee.id) {
      // If the currently selected bee is clicked again, deselect it.
      setActiveBee(null);
    } else {
      // Otherwise, select the new bee.
      setActiveBee(bee);
    }
  };
  
  const handlePasteBee = (slotIndex) => {
    if (copiedBeeConfig) {
      setHiveSlots(prev => ({
        ...prev,
        [slotIndex]: { ...copiedBeeConfig }
      }));
      toast.success(`Pasted ${copiedBeeConfig.bee.name} config to slot ${slotIndex + 1}`);
    }
  };

  const handleUpdateSlot = (updatedSlotData) => {
    if (activeSlotIndex !== null) {
      setHiveSlots(prev => ({
        ...prev,
        [activeSlotIndex]: updatedSlotData
      }));
    }
  };

  const handleRemoveBee = (slotIndex) => {
    setHiveSlots(prev => {
      const newSlots = { ...prev };
      delete newSlots[slotIndex];
      return newSlots;
    });
  };

  const calculateBuildStats = () => {
    const beesInHive = Object.values(hiveSlots).filter(Boolean);
    // This is a simplified calculation. A real one would be much more complex.
    const total_attack = beesInHive.reduce((sum, slot) => {
        let bee_attack = slot.bee.base_attack * (1 + (slot.level - 1) * 0.1); // Level bonus
        if(slot.gifted) bee_attack *= 1.2; // Gifted bonus
        if(slot.mutation?.stat === 'Attack') bee_attack *= 1.05; // Simplified mutation
        if(slot.beequip?.base.stats.attack) bee_attack += slot.beequip.overrides.attack || slot.beequip.base.stats.attack;
        return sum + bee_attack;
    }, 0);

    return {
      total_attack: Math.round(total_attack),
      total_gather_rate: beesInHive.reduce((sum, slot) => sum + (slot.bee.base_gather_amount || 0), 0),
      total_convert_rate: beesInHive.reduce((sum, slot) => sum + (slot.bee.base_convert_amount || 0), 0),
      bee_count: beesInHive.length
    };
  };

  const saveBuild = async () => {
    if (!buildName.trim()) {
      toast.error("Please enter a build name");
      return;
    }

    if (Object.keys(hiveSlots).length === 0) {
      toast.error("Please add at least one bee to your hive");
      return;
    }

    setIsSaving(true);
    try {
      const stats = calculateBuildStats();
      const colorTags = [...new Set(Object.values(hiveSlots).map(slot => slot.bee.color).filter(Boolean))];
      
      await HiveBuild.create({
        name: buildName,
        description: `A ${stats.bee_count}-bee build focusing on ${colorTags.join(', ') || 'mixed'} strategies`,
        build_data: hiveSlots,
        ...stats,
        tags: colorTags,
        is_public: false
      });

      toast.success("Build saved successfully!");
      setBuildName("");
    } catch (error) {
      toast.error("Failed to save build");
    }
    setIsSaving(false);
  };

  const clearHive = () => {
    setHiveSlots({});
    toast.success("Hive cleared");
  };

  const exportBuild = () => {
    const buildData = {
      name: buildName || "Untitled Build",
      slots: hiveSlots,
      stats: calculateBuildStats(),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(buildData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${buildName || 'hive-build'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Build exported successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
      <div className="max-w-screen-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-amber-800 mb-2 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-yellow-500" />
                Hive Builder
              </h1>
              <p className="text-amber-600 text-lg">Design and optimize your perfect bee swarm</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {copiedBeeConfig && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-100 text-blue-800 animate-pulse">
                  <Copy className="w-4 h-4"/>
                  <span className="text-sm font-medium">Copied: {copiedBeeConfig.bee.name}</span>
                  <Button variant="ghost" size="icon" className="w-6 h-6" onClick={() => setCopiedBeeConfig(null)}>
                    <X className="w-4 h-4"/>
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter build name..."
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                  className="min-w-48"
                />
                <Button
                  onClick={saveBuild}
                  disabled={isSaving}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportBuild}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={clearHive} className="bg-white/50">
                   <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200 p-2">
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-4 mb-4">
                <h2 className="text-xl font-bold text-amber-800 mb-2">Your Hive Layout</h2>
                <p className="text-amber-600 text-sm">
                  {activeBee 
                    ? <span className="text-blue-600 font-semibold animate-pulse">Placing: {activeBee.name}. Click empty slots.</span> 
                    : "Select a bee from the library to place."
                  }
                </p>
              </div>
              <HiveGrid
                hiveSlots={hiveSlots}
                onSlotClick={handleSlotClick}
                onRemoveBee={handleRemoveBee}
                onPasteBee={handlePasteBee}
                copiedBeeConfig={copiedBeeConfig}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <BeeLibraryPanel bees={bees} activeBee={activeBee} onBeeSelect={handleBeeLibrarySelect} />
            <BuildStats hiveSlots={hiveSlots} bees={bees} />
          </motion.div>
        </div>

        {showSlotEditor && activeSlotIndex !== null && hiveSlots[activeSlotIndex] && (
          <SlotEditor
            slotData={{ ...hiveSlots[activeSlotIndex], slotIndex: activeSlotIndex }}
            beequips={beequips}
            onSave={handleUpdateSlot}
            onRemove={() => handleRemoveBee(activeSlotIndex)}
            onCopy={(config) => {
              setCopiedBeeConfig(config);
              toast.success(`Copied ${config.bee.name} configuration`);
            }}
            onClose={() => {
              setShowSlotEditor(false);
              setActiveSlotIndex(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
