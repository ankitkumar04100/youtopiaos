import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Zap, Play, ArrowRight, Brain, BarChart3, Eye, Flame, Bot, Sparkles,
  ChevronRight, Shield, Clock, TrendingUp, Target, Calendar, Crown,
  AlertTriangle, Lightbulb, Settings2, ListChecks
} from "lucide-react";
import ParticleField from "./ParticleField";
import heroBg from "@/assets/hero-bg.jpg";

interface LandingPageProps {
  onStart: () => void;
  onAuth: () => void;
}

const fadeUp = {
  initial: { opacity: 0, y: 24, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const features = [
  { icon: Clock, title: "24-Hour Engine", desc: "Distribute your 24 hours across 6 life categories. Every hour shapes your future trajectory." },
  { icon: Target, title: "Priority Weights", desc: "Define what matters: Career, Health, Happiness, Social. These weights drive all simulation outcomes." },
  { icon: Brain, title: "Behavioral AI", desc: "Auto-inferred traits: Focus, Consistency, Discipline, Risk-Taking, and Stress Tolerance." },
  { icon: Eye, title: "Dual Futures", desc: "See your Ideal Future and Shadow Future side-by-side with 10-year projections." },
  { icon: Bot, title: "7 AI Advisors", desc: "Future Self, Mentor, Habit Analyzer, Risk Detector, Opportunity Finder, Daily Planner, Optimizer." },
  { icon: Sparkles, title: "Butterfly Effect", desc: "See how tiny daily changes create massive 10-year differences. Visual proof of compounding." },
  { icon: BarChart3, title: "Advanced Analytics", desc: "10-year projections, radar profiles, historical tracking with smooth animated charts." },
  { icon: AlertTriangle, title: "Constraint Engine", desc: "Real-world effects: burnout risk, health decline, isolation, stagnation. All simulated." },
  { icon: Flame, title: "Gamification", desc: "12 achievements, daily streaks, progress tracking. Make self-improvement addictive." },
  { icon: Crown, title: "Global Leaderboard", desc: "Compare your life scores anonymously. Climb the ranks as you optimize your life." },
  { icon: Calendar, title: "Habit Tracker", desc: "Daily habit logging with calendar view. Track consistency and build momentum." },
  { icon: Shield, title: "Cloud Sync", desc: "Sign up to save simulations, track history, and access from any device." },
];

const howItWorks = [
  { step: "01", title: "Allocate Your 24 Hours", desc: "Distribute time across Work, Sleep, Exercise, Social, Entertainment, and Learning.", icon: Clock },
  { step: "02", title: "Set Your Priorities", desc: "Weight Career, Health, Happiness, and Social Life to reflect what matters most to you.", icon: Target },
  { step: "03", title: "Watch Your Future Unfold", desc: "See dual futures, 10-year projections, behavioral traits, and risk assessments update in real-time.", icon: Eye },
  { step: "04", title: "Consult AI Advisors", desc: "Get personalized guidance from 7 AI modes — your Future Self, a Mentor, and specialized analyzers.", icon: Bot },
  { step: "05", title: "Track & Improve", desc: "Log daily habits, earn achievements, climb the leaderboard, and iterate toward your ideal life.", icon: TrendingUp },
];

const aiFeatures = [
  { icon: Bot, title: "Future Self", desc: "Advice from you in 2035" },
  { icon: Brain, title: "Life Mentor", desc: "Expert-level guidance" },
  { icon: Zap, title: "Habit Analyzer", desc: "Find weak patterns" },
  { icon: AlertTriangle, title: "Risk Detector", desc: "Burnout & failure warnings" },
  { icon: Lightbulb, title: "Opportunity Finder", desc: "Growth paths" },
  { icon: ListChecks, title: "Daily Planner", desc: "3-5 actionable tasks" },
  { icon: Settings2, title: "Life Optimizer", desc: "Best configuration" },
];

const LandingPage = ({ onStart, onAuth }: LandingPageProps) => {
  return (
    <div className="bg-background">
      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <ParticleField />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 glow-primary">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-body text-primary tracking-wider uppercase">Life Simulation Engine v3.0</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight mb-6 leading-[0.9]">
              <span className="text-foreground">YOU</span>
              <span className="text-primary text-glow">topia</span>
              <span className="text-muted-foreground text-4xl md:text-5xl lg:text-6xl ml-2">OS</span>
            </h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto text-balance">
              Design Your Life Like a Simulation
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-base text-muted-foreground/70 font-body mb-12 max-w-xl mx-auto italic">
              "Your future is not written. It is designed—decision by decision."
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onStart} size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display text-base tracking-wider px-8 py-6 rounded-xl transition-all duration-300 active:scale-[0.97]">
                <Play className="w-5 h-5 mr-2" /> BEGIN SIMULATION
              </Button>
              <Button onClick={onAuth} size="lg" variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 font-display text-base tracking-wider px-8 py-6 rounded-xl active:scale-[0.97]">
                <Shield className="w-5 h-5 mr-2" /> SIGN IN TO SAVE
              </Button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {[
              { label: "AI Advisors", value: "7" },
              { label: "Life Categories", value: "6" },
              { label: "Achievements", value: "12" },
              { label: "Year Projections", value: "10" },
            ].map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.1 }}
                className="glass rounded-lg p-3 text-center">
                <div className="text-primary font-display text-lg font-bold">{stat.value}</div>
                <div className="text-muted-foreground text-xs font-body uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

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
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground mt-3 mb-4 text-balance">
              A Complete Life Simulation Platform
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              12 powerful systems working together to help you understand, optimize, and design your future.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-xl bg-primary/10 w-fit mb-3 group-hover:glow-primary transition-all">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">{f.desc}</p>
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
              How It Works
            </h2>
          </motion.div>

          <div className="space-y-6">
            {howItWorks.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.step}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-5 items-start"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-display text-lg font-black text-primary">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" /> {step.title}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====== AI SUITE ====== */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="text-primary font-display text-sm tracking-[0.3em] uppercase">AI Intelligence</span>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground mt-3 mb-4">
              7 AI Advisors at Your Service
            </h2>
            <p className="text-muted-foreground font-body max-w-2xl mx-auto">
              Real AI, not templates. Each advisor analyzes your exact data to deliver personalized, actionable guidance.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {aiFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-xl p-4 text-center hover:border-primary/30 transition-all"
                >
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="font-display text-xs font-bold text-foreground">{f.title}</div>
                  <div className="text-[10px] text-muted-foreground font-body mt-1">{f.desc}</div>
                </motion.div>
              );
            })}
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
                {[
                  { icon: Clock, value: "1%", label: "Daily Change" },
                  { icon: ArrowRight, value: "365", label: "Days" },
                  { icon: TrendingUp, value: "37x", label: "Growth" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="glass rounded-xl px-6 py-4 text-center"
                    >
                      <Icon className={`w-5 h-5 mx-auto mb-1 ${i === 2 ? "text-success" : i === 1 ? "text-primary" : "text-accent"}`} />
                      <div className={`font-display text-2xl font-bold ${i === 2 ? "text-primary" : "text-foreground"}`}>{item.value}</div>
                      <div className="text-xs text-muted-foreground font-body">{item.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-display text-3xl md:text-5xl font-black text-foreground mb-6 text-balance">
              Ready to Design Your Future?
            </h2>
            <p className="text-muted-foreground font-body mb-8 max-w-xl mx-auto">
              Start your simulation now. It's free, instant, and might just change the trajectory of your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={onStart} size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display text-base tracking-wider px-8 py-6 rounded-xl active:scale-[0.97] transition-all">
                <Play className="w-5 h-5 mr-2" /> START NOW — IT'S FREE
              </Button>
              <Button onClick={onAuth} size="lg" variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 font-display text-base tracking-wider px-8 py-6 rounded-xl active:scale-[0.97]">
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
