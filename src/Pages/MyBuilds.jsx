import React, { useState, useEffect } from "react";
import { HiveBuild } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; 
import { 
  Trash2, 
  Download, 
  Eye, 
  Copy,
  Calendar,
  Users,
  Swords,
  Droplets
} from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function MyBuilds() {
  const [builds, setBuilds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBuilds();
  }, []);

  const loadBuilds = async () => {
    setIsLoading(true);
    try {
      const buildData = await HiveBuild.list('-created_date');
      setBuilds(buildData);
    } catch (error) {
      toast.error("Failed to load builds");
    }
    setIsLoading(false);
  };

  const deleteBuild = async (buildId) => {
    try {
      await HiveBuild.delete(buildId);
      setBuilds(builds.filter(build => build.id !== buildId));
      toast.success("Build deleted successfully");
    } catch (error) {
      toast.error("Failed to delete build");
    }
  };

  const exportBuild = (build) => {
    const exportData = {
      name: build.name,
      description: build.description,
      build_data: build.build_data,
      stats: {
        total_attack: build.total_attack,
        total_gather_rate: build.total_gather_rate,
        total_convert_rate: build.total_convert_rate,
        bee_count: build.bee_count
      },
      tags: build.tags,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${build.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Build exported successfully!");
  };

  const duplicateBuild = async (build) => {
    try {
      await HiveBuild.create({
        name: `${build.name} (Copy)`,
        description: build.description,
        build_data: build.build_data,
        total_attack: build.total_attack,
        total_gather_rate: build.total_gather_rate,
        total_convert_rate: build.total_convert_rate,
        bee_count: build.bee_count,
        tags: build.tags,
        is_public: false
      });
      loadBuilds();
      toast.success("Build duplicated successfully!");
    } catch (error) {
      toast.error("Failed to duplicate build");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/50 rounded-2xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-amber-800 mb-2 flex items-center gap-3">
            💾 My Builds
          </h1>
          <p className="text-amber-600 text-lg">Manage and organize your saved hive configurations</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-amber-700">
            <span>Total Builds: <strong>{builds.length}</strong></span>
            <span>•</span>
            <span>Total Bees Used: <strong>{builds.reduce((sum, build) => sum + (build.bee_count || 0), 0)}</strong></span>
          </div>
        </motion.div>

        {builds.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No builds saved yet</h3>
            <p className="text-gray-500 mb-6">Create your first hive build to get started</p>
            <Button 
              onClick={() => window.location.href = '/hive-builder'}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Start Building
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {builds.map((build, index) => (
                <motion.div
                  key={build.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-2 border-amber-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-gray-900 truncate">
                            {build.name}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {build.description || "No description provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {build.tags?.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-600">Bees:</span>
                          <span className="font-semibold">{build.bee_count || 0}/50</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Swords className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600">Attack:</span>
                          <span className="font-semibold">{(build.total_attack || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">Gather:</span>
                          <span className="font-semibold">{(build.total_gather_rate || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span className="text-gray-600">Created:</span>
                          <span className="font-semibold text-xs">
                            {format(new Date(build.created_date), 'MMM d')}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-3 border-t border-amber-100">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => exportBuild(build)}
                          className="flex-1"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Export
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => duplicateBuild(build)}
                          className="flex-1"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteBuild(build.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}