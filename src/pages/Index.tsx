import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import SimulationDashboard from "@/components/SimulationDashboard";

const Index = () => {
  const [started, setStarted] = useState(false);

  if (started) {
    return <SimulationDashboard onBack={() => setStarted(false)} />;
  }

  return <HeroSection onStart={() => setStarted(true)} />;
};

export default Index;
