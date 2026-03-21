import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";
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

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) toast.error(error instanceof Error ? error.message : "Google sign-in failed");
  };

  return (
    <div className="min-h-screen bg-background grid-overlay flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
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

          {/* Google Sign-In */}
          <Button onClick={handleGoogleSignIn} variant="outline"
            className="w-full mb-4 border-border/50 text-foreground hover:bg-muted/50 font-body flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground font-body">or</span></div>
          </div>

          {/* Tab switch */}
          <div className="flex gap-2 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-body transition-all ${
                  mode === m ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground"
                }`}>
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
                    <Input placeholder="Display Name" value={name} onChange={(e) => setName(e.target.value)}
                      className="pl-10 bg-muted/50 border-border/50 text-foreground" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="pl-10 bg-muted/50 border-border/50 text-foreground" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                className="pl-10 bg-muted/50 border-border/50 text-foreground" />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-display tracking-wider">
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

          <Button variant="outline" onClick={continueAsGuest}
            className="w-full border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 font-body">
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
