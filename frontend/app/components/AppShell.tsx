"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AppShellProps {
  commandBar: ReactNode;
  sidebar: ReactNode;
  workspace: ReactNode;
  inspector?: ReactNode;
  inspectorOpen?: boolean;
}

export default function AppShell({
  commandBar,
  sidebar,
  workspace,
  inspector,
  inspectorOpen = false,
}: AppShellProps) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-app">
      {/* Command Bar - Sticky Top */}
      <div className="relative z-10 flex-shrink-0 border-b border-soft glass-strong">
        {commandBar}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed Width */}
        <div className="relative z-0 flex-shrink-0 border-r border-soft glass">
          {sidebar}
        </div>

        {/* Workspace - Flexible Center */}
        <div className="relative z-0 flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto glass">{workspace}</div>

          {/* Inspector - Collapsible Right Panel */}
          <AnimatePresence>
            {inspector && inspectorOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 border-l border-soft glass"
              >
                {inspector}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
