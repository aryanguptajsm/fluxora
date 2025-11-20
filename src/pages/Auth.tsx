import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Mail, Lock, User, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

const Auth = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username: username || email.split("@")[0],
          }
        }
      });

      if (error) throw error;
      
      toast.success("Account created! Please check your email to confirm.");
      setEmail("");
      setPassword("");
      setUsername("");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success("Signed in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      
      <Card className="w-full max-w-md relative z-10 border-primary/30 shadow-card bg-card/95 backdrop-blur-sm">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-4">
              <Wand2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Welcome to Fluxora
            </h1>
            <p className="text-muted-foreground">
              Create stunning AI images in seconds
            </p>
          </div>

          <Tabs defaultValue="signin" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-background">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-background">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Username (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background border-border focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background border-border focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-background border-border focus:border-primary"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-glow"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create Account"}
                  <Sparkles className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Skip Option */}
          <div className="mt-6 pt-6 border-t border-border">
            <Button
              variant="ghost"
              className="w-full hover:bg-muted"
              onClick={handleSkip}
            >
              Continue without account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
