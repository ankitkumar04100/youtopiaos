import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, UserPlus, Ghost, ArrowLeft, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage = ({ onBack }: AuthPageProps) => {
  const { signIn, signUp, continueAsGuest } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error.message);
      else toast.success("Welcome back!");
    } else {
      const { error } = await signUp(email, password, name);
      if (error) toast.error(error.message);
      else toast.success("Check your email to confirm your account!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background grid-overlay flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <div className="glass rounded-2xl p-8 glow-primary border-primary/20">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold">
              <span className="text-foreground">YOU</span>
              <span className="text-primary text-glow">topia</span>
              <span className="text-muted-foreground ml-1 text-lg">OS</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-2 font-body">
              {mode === "login" ? "Welcome back, time traveler" : "Create your simulation account"}
            </p>
          </div>

          {/* Tab switch */}
          <div className="flex gap-2 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-body transition-all ${
                  mode === m ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Display Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-muted/50 border-border/50 text-foreground"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-muted/50 border-border/50 text-foreground"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 bg-muted/50 border-border/50 text-foreground"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-wider"
            >
              {loading ? "Processing..." : mode === "login" ? (
                <><LogIn className="w-4 h-4 mr-2" /> SIGN IN</>
              ) : (
                <><UserPlus className="w-4 h-4 mr-2" /> CREATE ACCOUNT</>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground font-body">or</span></div>
          </div>

          <Button
            variant="outline"
            onClick={continueAsGuest}
            className="w-full border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 font-body"
          >
            <Ghost className="w-4 h-4 mr-2" /> Continue as Guest
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-3 font-body">
            Guest progress won't be saved across sessions
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
