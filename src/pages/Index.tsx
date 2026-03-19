import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "@/components/LandingPage";
import SimulationDashboard from "@/components/SimulationDashboard";
import AuthPage from "@/components/AuthPage";

type View = "landing" | "auth" | "simulation";

const Index = () => {
  const { user, isGuest, loading } = useAuth();
  const [view, setView] = useState<View>("landing");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-display text-primary text-glow animate-pulse-glow text-2xl">Loading...</div>
      </div>
    );
  }

  // If user is authenticated and tries to go to simulation
  if (view === "simulation" || ((user || isGuest) && view !== "landing" && view !== "auth")) {
    return <SimulationDashboard onBack={() => setView("landing")} />;
  }

  if (view === "auth") {
    if (user) {
      // Already logged in, go to simulation
      return <SimulationDashboard onBack={() => setView("landing")} />;
    }
    return <AuthPage onBack={() => setView("landing")} />;
  }

  return (
    <LandingPage
      onStart={() => {
        if (user || isGuest) {
          setView("simulation");
        } else {
          // Allow guest access directly
          setView("simulation");
        }
      }}
      onAuth={() => setView("auth")}
    />
  );
};

export default Index;
