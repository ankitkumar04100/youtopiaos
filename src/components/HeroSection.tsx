import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Play } from "lucide-react";
import ParticleField from "./ParticleField";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-50" />

      {/* Particles */}
      <ParticleField />

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-line" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 glow-primary"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-body text-primary tracking-wider uppercase">Life Simulation Engine v1.0</span>
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight mb-6">
            <span className="text-foreground">YOU</span>
            <span className="text-primary text-glow">topia</span>
            <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl ml-2">OS</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto"
          >
            Design Your Life Like a Simulation
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-base text-muted-foreground/70 font-body mb-12 max-w-xl mx-auto italic"
          >
            "Your future is not written. It is designed—decision by decision."
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={onStart}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display text-base tracking-wider px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Play className="w-5 h-5 mr-2" />
              BEGIN SIMULATION
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {[
            { label: "Metrics", value: "4+" },
            { label: "Life Paths", value: "2" },
            { label: "Decisions", value: "∞" },
            { label: "AI Engine", value: "ON" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
              className="glass rounded-lg p-3 text-center"
            >
              <div className="text-primary font-display text-lg font-bold">{stat.value}</div>
              <div className="text-muted-foreground text-xs font-body uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
