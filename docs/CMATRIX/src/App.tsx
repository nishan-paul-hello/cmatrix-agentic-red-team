import { useState, useEffect } from "react";
import Login from "./components/Login";
import Shell, { type NavItem } from "./components/Shell";
import Dashboard from "./components/Dashboard";
import NewMissionWizard from "./components/NewMissionWizard";
import MissionWorkspace from "./components/MissionWorkspace";
import ReportsPage from "./components/ReportsPage";
import BenchmarksHub from "./components/BenchmarksHub";
import ResearchLab from "./components/ResearchLab";
import AuditLogPage from "./components/AuditLogPage";
import SettingsPage from "./components/SettingsPage";
import CommandPalette from "./components/CommandPalette";
import MemoryPage from "./components/MemoryPage";

type View = "login" | "dashboard" | "new-mission" | "mission-workspace";

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-full" style={{ color: "#333333", fontSize: 11, letterSpacing: "0.18em" }}>
      {label} — NOT YET IMPLEMENTED
    </div>
  );
}

export default function App() {
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
    "skill-library":    <Placeholder label="SKILL LIBRARY" />,
    "failure-memory":   <MemoryPage key="failure-memory" />,
    reports:            <ReportsPage />,
    benchmarks:         <BenchmarksHub />,
    ablations:          <ResearchLab key="ablations"        initialTab="ABLATION" />,
    statistics:         <ResearchLab key="statistics"       initialTab="STATISTICAL EVALUATION" />,
    "failure-analysis": <ResearchLab key="failure-analysis" initialTab="FAILURE ANALYSIS" />,
    "cost-usage":       <Placeholder label="GLOBAL COST & USAGE" />,
    "audit-log":        <AuditLogPage />,
    settings:           <SettingsPage />,
  };

  return (
    <>
      <Shell activeNav={activeNav} onNavChange={handleNavChange} missionId={activeMission}>
        {view === "new-mission" && <NewMissionWizard onCancel={() => setView("dashboard")} />}
        {view === "mission-workspace" && <MissionWorkspace missionId={activeMission} />}
        {view === "dashboard" && (activeNav === "dashboard" || activeNav === "missions") && (
          <Dashboard
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
