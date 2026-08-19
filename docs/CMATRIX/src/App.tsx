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

type View = "login" | "dashboard" | "new-mission" | "mission-workspace";

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
    if (view === "new-mission" || view === "mission-workspace") setView("dashboard");
  }

  function handlePaletteNav(id: string) {
    const navMap: Record<string, ()=>void> = {
      "go-dashboard":  () => { setActiveNav("dashboard"); setView("dashboard"); },
      "go-missions":   () => { setActiveNav("missions");  setView("dashboard"); },
      "go-benchmarks": () => { setActiveNav("benchmarks");setView("dashboard"); },
      "go-reports":    () => { setActiveNav("reports");   setView("dashboard"); },
      "go-audit":      () => { setActiveNav("audit-log"); setView("dashboard"); },
      "go-settings":   () => { setActiveNav("settings");  setView("dashboard"); },
      "act-new":       () => setView("new-mission"),
      "m-cve001":      () => { setActiveMission("CVE-001"); setView("mission-workspace"); },
    };
    navMap[id]?.();
  }

  const NAV_COMPONENTS: Partial<Record<NavItem, React.ReactNode>> = {
    reports:            <ReportsPage />,
    benchmarks:         <BenchmarksHub />,
    ablations:          <ResearchLab initialTab="ABLATION" />,
    statistics:         <ResearchLab initialTab="STATISTICAL EVALUATION" />,
    "failure-analysis": <ResearchLab initialTab="FAILURE ANALYSIS" />,
    "audit-log":        <AuditLogPage />,
    settings:           <SettingsPage />,
  };

  return (
    <>
      <Shell activeNav={activeNav} onNavChange={handleNavChange} missionId={view === "mission-workspace" ? activeMission : undefined}>
        {view === "new-mission" && <NewMissionWizard onCancel={() => setView("dashboard")} />}
        {view === "mission-workspace" && <MissionWorkspace missionId={activeMission} />}
        {view === "dashboard" && activeNav === "dashboard" && (
          <Dashboard
            onNewMission={() => setView("new-mission")}
            onOpenMission={(id) => { setActiveMission(id); setView("mission-workspace"); }}
          />
        )}
        {view === "dashboard" && activeNav !== "dashboard" && (
          NAV_COMPONENTS[activeNav] ?? (
            <div className="flex items-center justify-center h-full" style={{ color: "#333333", fontSize: 11, letterSpacing: "0.18em" }}>
              {activeNav.toUpperCase().replace(/-/g, " ")} — NOT YET IMPLEMENTED
            </div>
          )
        )}
      </Shell>
      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onNavigate={handlePaletteNav} />}
    </>
  );
}
