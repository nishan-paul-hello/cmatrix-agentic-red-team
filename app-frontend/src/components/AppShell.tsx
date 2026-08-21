"use client";

import { useState, useEffect } from "react";
import Login from "./Login";
import Shell, { type NavItem } from "./Shell";
import Dashboard from "./Dashboard";
import MissionsPage from "./MissionsPage";
import NewMissionWizard from "./NewMissionWizard";
import MissionWorkspace from "./MissionWorkspace";
import ReportsPage from "./ReportsPage";
import BenchmarksHub from "./BenchmarksHub";
import ResearchLab from "./ResearchLab";
import AuditLogPage from "./AuditLogPage";
import SettingsPage from "./SettingsPage";
import CommandPalette from "./CommandPalette";
import MemoryPage from "./MemoryPage";
import CostDashboard from "./CostDashboard";
import TrajectoryBrowser from "./TrajectoryBrowser";

type View = "login" | "dashboard" | "new-mission" | "mission-workspace";

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full" style={{ color: "#333333", fontSize: 11, letterSpacing: "0.18em" }}>
      {label} — NOT YET IMPLEMENTED
    </div>
  );
}

export default function AppShell() {
  const [view, setView] = useState<View>("login");
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [activeMission, setActiveMission] = useState("CVE-001");
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setPaletteOpen(p => !p); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (view === "login") return <Login onLogin={() => setView("dashboard")} />;

  function handleNavChange(id: NavItem) {
    setActiveNav(id);
    setView("dashboard");
  }

  function handlePaletteNav(id: string) {
    const navMap: Record<string, () => void> = {
      "go-dashboard":  () => { setActiveNav("dashboard");  setView("dashboard"); },
      "go-missions":   () => { setActiveNav("missions");   setView("dashboard"); },
      "go-benchmarks": () => { setActiveNav("benchmarks"); setView("dashboard"); },
      "go-reports":    () => { setActiveNav("reports");    setView("dashboard"); },
      "go-audit":      () => { setActiveNav("audit-log");  setView("dashboard"); },
      "go-settings":   () => { setActiveNav("settings");   setView("dashboard"); },
      "act-new":       () => setView("new-mission"),
      "m-cve001":      () => { setActiveMission("CVE-001"); setView("mission-workspace"); },
    };
    navMap[id]?.();
  }

  const NAV_COMPONENTS: Partial<Record<NavItem, React.ReactNode>> = {
    memory:             <MemoryPage key="global-memory" />,
    "skill-library":    <MemoryPage key="skill-library" initialTab="SKILL LIBRARY" />,
    "failure-memory":   <MemoryPage key="failure-memory" />,
    trajectory:         <TrajectoryBrowser />,
    reports:            <ReportsPage />,
    benchmarks:         <BenchmarksHub />,
    ablations:          <ResearchLab key="ablations"        initialTab="ABLATION" />,
    statistics:         <ResearchLab key="statistics"       initialTab="STATISTICAL EVALUATION" />,
    "failure-analysis": <ResearchLab key="failure-analysis" initialTab="FAILURE ANALYSIS" />,
    "cost-usage":       <CostDashboard />,
    "audit-log":        <AuditLogPage />,
    settings:           <SettingsPage />,
  };

  return (
    <>
      <Shell activeNav={activeNav} onNavChange={handleNavChange} missionId={activeMission}>
        {view === "new-mission" && <NewMissionWizard onCancel={() => setView("dashboard")} onStart={() => { setActiveMission("NEW-001"); setView("mission-workspace"); }} />}
        {view === "mission-workspace" && <MissionWorkspace missionId={activeMission} />}
        {view === "dashboard" && activeNav === "dashboard" && (
          <Dashboard
            onNewMission={() => setView("new-mission")}
            onOpenMission={(id) => { setActiveMission(id); setView("mission-workspace"); }}
          />
        )}
        {view === "dashboard" && activeNav === "missions" && (
          <MissionsPage
            onNewMission={() => setView("new-mission")}
            onOpenMission={(id) => { setActiveMission(id); setView("mission-workspace"); }}
          />
        )}
        {view === "dashboard" && activeNav !== "dashboard" && activeNav !== "missions" && (
          NAV_COMPONENTS[activeNav] ?? <Placeholder label={activeNav.toUpperCase().replace(/-/g, " ")} />
        )}
      </Shell>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onNavigate={handlePaletteNav} />}
    </>
  );
}
