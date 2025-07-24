
import React, { useState, useEffect } from "react";
import { Bee } from "@/entities/all";
import { Search, Filter, Star, Zap, Sword, Droplets } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

export default function BeeLibrary() {
  const [bees, setBees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [rarityFilter, setRarityFilter] = useState("all");
  const [colorFilter, setColorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadBees();
  }, []);

  const loadBees = async () => {
    const beeData = await Bee.list();
    setBees(beeData);
  };

  const filteredAndSortedBees = bees
    .filter((bee) => {
      const matchesSearch = bee.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = rarityFilter === "all" || bee.rarity === rarityFilter;
      const matchesColor = colorFilter === "all" || bee.color === colorFilter;
      return matchesSearch && matchesRarity && matchesColor;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rarity":
          const rarityOrder = ["Basic", "Rare", "Epic", "Legendary", "Mythic", "Event"];
          return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
        case "attack":
          return (b.base_attack || 0) - (a.base_attack || 0);
        case "gather":
          return (b.base_gather_amount || 0) - (a.base_gather_amount || 0);
        default:
          return 0;
      }
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

  const getRarityGlow = (rarity) => {
    const glows = {
      'Legendary': 'shadow-yellow-200',
      'Mythic': 'shadow-red-200',
      'Event': 'shadow-emerald-200'
    };
    return glows[rarity] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-800 mb-2 flex items-center gap-3">
            📚 Bee Library
          </h1>
          <p className="text-amber-600 text-lg">Explore all available bees and their stats</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by rarity" />
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
            <Select value={colorFilter} onValueChange={setColorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
                <SelectItem value="White">White</SelectItem>
                <SelectItem value="Colorless">Colorless</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rarity">Rarity</SelectItem>
                <SelectItem value="attack">Attack</SelectItem>
                <SelectItem value="gather">Gather Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredAndSortedBees.map((bee, index) => (
              <motion.div
                key={bee.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 ${getRarityGlow(bee.rarity)} bg-white/80 backdrop-blur-sm`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={bee.image_url} alt={bee.name} className="w-12 h-12 object-contain" />
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900">
                            {bee.name}
                          </CardTitle>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            <Badge className={getRarityColor(bee.rarity)}>
                              {bee.rarity}
                            </Badge>
                            {bee.color && (
                              <Badge variant="outline" className="text-xs">
                                {bee.color}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Sword className="w-4 h-4 text-red-500" />
                        <span className="text-gray-600">Attack:</span>
                        <span className="font-semibold">{bee.base_attack || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600">Gather:</span>
                        <span className="font-semibold">{bee.base_gather_amount || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-600">Energy:</span>
                        <span className="font-semibold">{bee.energy || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-600">Convert:</span>
                        <span className="font-semibold">{bee.base_convert_amount || 'N/A'}</span>
                      </div>
                    </div>

                    {bee.favorite_field && (
                      <div className="text-sm">
                        <span className="text-gray-600">Favorite Field:</span>
                        <span className="font-semibold ml-2 text-green-600">{bee.favorite_field}</span>
                      </div>
                    )}

                    {bee.abilities && bee.abilities.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Abilities</h4>
                        <div className="flex flex-wrap gap-1">
                          {bee.abilities.slice(0, 3).map((ability, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ability}
                            </Badge>
                          ))}
                          {bee.abilities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{bee.abilities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {bee.beequips && bee.beequips.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Beequips</h4>
                        <div className="flex flex-wrap gap-1">
                          {bee.beequips.slice(0, 3).map((beequip, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {beequip}
                            </Badge>
                          ))}
                          {bee.beequips.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{bee.beequips.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {bee.mutations && bee.mutations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Mutations</h4>
                        <div className="flex flex-wrap gap-1">
                          {bee.mutations.slice(0, 3).map((mutation, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {mutation}
                            </Badge>
                          ))}
                          {bee.mutations.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{bee.mutations.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {bee.description && (
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {bee.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredAndSortedBees.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No bees found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
