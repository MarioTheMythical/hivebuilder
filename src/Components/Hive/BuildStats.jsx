import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Swords, 
  Droplets, 
  Zap, 
  Target,
  TrendingUp,
  Users
} from "lucide-react";

export default function BuildStats({ hiveSlots, bees }) {
  const calculateStats = () => {
    const beesInHive = Object.values(hiveSlots).filter(Boolean);
    
    const totalAttack = beesInHive.reduce((sum, bee) => sum + (bee.base_attack || 0), 0);
    const totalGatherAmount = beesInHive.reduce((sum, bee) => sum + (bee.base_gather_amount || 0), 0);
    const totalGatherSpeed = beesInHive.reduce((sum, bee) => sum + (bee.base_gather_speed || 1), 0);
    const totalConvertAmount = beesInHive.reduce((sum, bee) => sum + (bee.base_convert_amount || 0), 0);
    const totalEnergy = beesInHive.reduce((sum, bee) => sum + (bee.energy || 0), 0);
    
    const rarityCount = beesInHive.reduce((acc, bee) => {
      acc[bee.rarity] = (acc[bee.rarity] || 0) + 1;
      return acc;
    }, {});

    const colorCount = beesInHive.reduce((acc, bee) => {
      if (bee.color) {
        acc[bee.color] = (acc[bee.color] || 0) + 1;
      }
      return acc;
    }, {});

    return {
      beeCount: beesInHive.length,
      totalAttack,
      totalGatherAmount,
      totalGatherSpeed,
      totalConvertAmount,
      totalEnergy,
      rarityCount,
      colorCount,
      efficiency: beesInHive.length > 0 ? Math.round((totalAttack + totalGatherAmount) / beesInHive.length) : 0
    };
  };

  const stats = calculateStats();

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-xs text-green-600">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 font-medium">{title}</p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <Target className="w-5 h-5" />
            Hive Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="Total Bees"
              value={`${stats.beeCount}/50`}
              icon={Users}
              color="bg-blue-500"
            />
 