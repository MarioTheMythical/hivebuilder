import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Grid3X3, 
  BookOpen, 
  BarChart3, 
  Save,
  Hexagon,
  Sparkles 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Hive Builder",
    url: createPageUrl("HiveBuilder"),
    icon: Grid3X3,
  },
  {
    title: "Bee Library",
    url: createPageUrl("BeeLibrary"), 
    icon: BookOpen,
  },
  {
    title: "My Builds",
    url: createPageUrl("MyBuilds"),
    icon: Save,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --honey-gold: #F59E0B;
            --honey-dark: #D97706;
            --honey-deeper: #92400E;
            --bee-yellow: #FEF3C7;
            --hive-gray: #374151;
            --background: #FAFAFA;
          }
          
          .honey-gradient {
            background: linear-gradient(135deg, var(--honey-gold) 0%, var(--honey-dark) 100%);
          }
          
          .bee-glow {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
          }
          
          .hexagon-clip {
            clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%);
          }
        `}
      </style>
      <div className="min-h-screen flex w-full" style={{backgroundColor: 'var(--background)'}}>
        <Sidebar className="border-r border-amber-200">
          <SidebarHeader className="border-b border-amber-200 p-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 honey-gradient rounded-lg flex items-center justify-center transform rotate-45">
                  <Hexagon className="w-6 h-6 text-white transform -rotate-45" />
                </div>
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h2 className="font-bold text-xl" style={{color: 'var(--hive-gray)'}}>BeeHive Pro</h2>
                <p className="text-xs text-amber-600 font-medium">Swarm Simulator Planner</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-amber-700 uppercase tracking-wider px-3 py-3">
                Planning Tools
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 rounded-xl mb-2 group ${
                          location.pathname === item.url ? 'bg-amber-100 text-amber-800 honey-glow' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-semibold">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-amber-700 uppercase tracking-wider px-3 py-3">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Active Builds</span>
                    <span className="font-bold text-amber-700">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Bees Available</span>
                    <span className="font-bold text-amber-700">54+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 font-medium">Max Slots</span>
                    <span className="font-bold text-amber-700">50</span>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-amber-100 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-amber-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-amber-800">BeeHive Pro</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}