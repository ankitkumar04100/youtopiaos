import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, Play, ArrowRight, Brain, BarChart3, Eye, Flame, Bot, Sparkles, ChevronRight, Shield, Clock, TrendingUp } from "lucide-react";
import ParticleField from "./ParticleField";
import heroBg from "@/assets/hero-bg.jpg";

interface LandingPageProps {
  onStart: () => void;
  onAuth: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const features = [
  { icon: Brain, title: "Decision Engine", desc: "Adjust 6 life variables and watch your future transform in real-time. Every slider changes everything." },
  { icon: Eye, title: "Dual Futures", desc: "See your Ideal Future and Shadow Future side by side. The contrast creates powerful emotional awareness." },
  { icon: BarChart3, title: "Life Metrics", desc: "Track Wealth, Happiness, Health, and Social Impact with beautiful animated dashboards." },
  { icon: Bot, title: "AI Future Self", desc: "Get personalized advice from your AI-powered future self. Real AI, not templates." },
  { icon: Flame, title: "Gamification", desc: "Earn streaks, unlock achievements, and hit milestones. Make self-improvement addictive." },
  { icon: TrendingUp, title: "10-Year Projections", desc: "See animated charts showing how your decisions compound over the next decade." },
];

const howItWorks = [
  { step: "01", title: "Input Your Habits", desc: "Set your daily study time, sleep, exercise, screen time, and discipline level." },
  { step: "02", title: "Watch Futures Diverge", desc: "See two contrasting futures emerge based on your exact decisions." },
  { step: "03", title: "Consult AI", desc: "Ask your Future Self or Life Mentor for personalized, AI-powered guidance." },
  { step: "04", title: "Iterate & Improve", desc: "Adjust decisions, track progress, earn achievements, and design your ideal life." },
];

const LandingPage = ({ onStart, onAuth }: LandingPageProps) => {
  return (
    <div className="bg-background">
      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <ParticleField />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-line" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 glow-primary">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-body text-primary tracking-wider uppercase">Life Simulation Engine v2.0</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight mb-6">
              <span className="text-foreground">YOU</span>
              <span className="text-primary text-glow">topia</span>
              <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl ml-2">OS</span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
              Design Your Life Like a Simulation
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-base text-muted-foreground/70 font-body mb-12 max-w-xl mx-auto italic">
              "Your future is not written. It is designed—decision by decision."
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onStart} size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display text-base tracking-wider px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105">
                <Play className="w-5 h-5 mr-2" /> BEGIN SIMULATION
              </Button>
              <Button onClick={onAuth} size="lg" variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 font-display text-base tracking-wider px-8 py-6 rounded-xl">
                <Shield className="w-5 h-5 mr-2" /> SIGN IN TO SAVE
              </Button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: "Life Metrics", value: "4+" },
              { label: "Future Paths", value: "2" },
              { label: "AI Models", value: "2" },
              { label: "Achievements", value: "8+" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.1 }}
                className="glass rounded-lg p-3 text-center">
                <div className="text-primary font-display text-lg font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-xs font-body uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronRight className="w-6 h-6 text-primary/50 rotate-90" />
        </motion.div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-24 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-primary font-display text-sm tracking-[0.3em] uppercase">Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground mt-3 mb-4">
              Everything You Need to <span className="text-primary text-glow">Design Your Future</span>
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              YOUtopia OS combines real-time simulation, AI intelligence, and gamification to transform how you make life decisions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:glow-primary transition-all">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="container mx-auto max-w-4xl relative">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="text-accent font-display text-sm tracking-[0.3em] uppercase">Process</span>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground mt-3 mb-4">
              How It <span className="text-accent text-glow-accent">Works</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {howItWorks.map((step, i) => (
              <motion.div key={step.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-display text-xl font-black text-primary glow-primary">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground font-body">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== BUTTERFLY EFFECT ====== */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div {...fadeUp} className="glass rounded-3xl p-8 md:p-12 text-center glow-primary border-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="font-display text-3xl md:text-4xl font-black text-foreground mb-4">
                The Butterfly Effect
              </h2>
              <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto mb-2">
                A 1% improvement every day makes you <span className="text-primary font-bold">37x better in one year</span>.
              </p>
              <p className="text-muted-foreground/70 font-body max-w-xl mx-auto mb-8">
                Your smallest decisions are your most powerful ones. YOUtopia OS makes the invisible visible.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <div className="glass rounded-xl px-6 py-4 text-center">
                  <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
                  <div className="font-display text-2xl font-bold text-foreground">1%</div>
                  <div className="text-xs text-muted-foreground font-body">Daily Improvement</div>
                </div>
                <div className="glass rounded-xl px-6 py-4 text-center">
                  <ArrowRight className="w-5 h-5 text-primary mx-auto mb-1" />
                  <div className="font-display text-2xl font-bold text-foreground">365</div>
                  <div className="text-xs text-muted-foreground font-body">Days Compounding</div>
                </div>
                <div className="glass rounded-xl px-6 py-4 text-center">
                  <TrendingUp className="w-5 h-5 text-success mx-auto mb-1" />
                  <div className="font-display text-2xl font-bold text-primary">37x</div>
                  <div className="text-xs text-muted-foreground font-body">Better in 1 Year</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground mb-6">
              Ready to <span className="text-primary text-glow">Design Your Future</span>?
            </h2>
            <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
              Start your simulation now. It's free, instant, and might just change the trajectory of your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onStart} size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display text-base tracking-wider px-8 py-6 rounded-xl hover:scale-105 transition-all">
                <Play className="w-5 h-5 mr-2" /> START NOW — IT'S FREE
              </Button>
              <Button onClick={onAuth} size="lg" variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 font-display text-base tracking-wider px-8 py-6 rounded-xl">
                CREATE ACCOUNT
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="container mx-auto text-center">
          <div className="font-display text-sm">
            <span className="text-foreground">YOU</span>
            <span className="text-primary">topia</span>
            <span className="text-muted-foreground ml-1">OS</span>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-2">
            Design your life, one decision at a time. © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
