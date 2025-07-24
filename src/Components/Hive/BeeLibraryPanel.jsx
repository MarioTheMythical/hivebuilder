import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BeeLibraryPanel({ bees, activeBee, onBeeSelect }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");

  const filteredBees = bees.filter((bee) => {
    const matchesSearch = bee.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = rarityFilter === "all" || bee.rarity === rarityFilter;
    return matchesSearch && matchesRarity;
  });

  const getRarityColor = (rarity) => {
    const colors = {
      'Basic': 'bg-gray-100 text-gray-800 border-gray-300',
      'Rare': 'bg-blue-100 text-blue-800 border-blue-300',
      'Epic': 'bg-purple-100 text-purple-800 border-purple-300', 
      'Legendary': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Mythic': 'bg-red-100 text-red-800 border-red-300',
      'Event': 'bg-emerald-100 text-emerald-800 border-emerald-300'
    };
    return colors[rarity] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Card className="border-amber-200 shadow-lg h-full flex flex-col">
      <CardHeader className="p-4 border-b border-amber-200">
        <h3 className="text-lg font-bold text-amber-800">Bee Library</h3>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-7 h-9"
            />
          </div>
          <Select value={rarityFilter} onValueChange={setRarityFilter}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Rarity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rarities</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Rare">Rare</SelectItem>
              <SelectItem value="Epic">Epic</SelectItem>
              <SelectItem value="Legendary">Legendary</SelectItem>
              <SelectItem value="Mythic">Mythic</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-2 overflow-y-auto flex-1">
        <div className="grid grid-cols-2 gap-2">
          {filteredBees.map((bee) => (
            <motion.div
              key={bee.id}
              layout
              className={`p-2 rounded-lg cursor-pointer border-2 transition-all duration-200 relative ${
                activeBee?.id === bee.id 
                  ? 'border-amber-500 bg-amber-50 bee-glow' 
                  : 'border-transparent hover:bg-amber-50'
              }`}
              onClick={() => onBeeSelect(bee)}
            >
              {activeBee?.id === bee.id && (
                <CheckCircle className="w-5 h-5 text-white bg-amber-500 rounded-full absolute -top-1 -right-1 z-10"/>
              )}
              <img src={bee.image_url} alt={bee.name} className="w-12 h-12 mx-auto object-contain drop-shadow-md"/>
              <p className="text-xs font-semibold text-center mt-1 truncate">{bee.name}</p>
              <Badge className={`w-full justify-center text-[10px] h-auto py-0.5 mt-1 ${getRarityColor(bee.rarity)}`}>
                {bee.rarity}
              </Badge>
            </motion.div>
 