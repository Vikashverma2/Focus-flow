import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, ArrowLeft, Info } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, DEMO_CREDENTIALS } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import "./Login.css"; // <-- Create and import your custom CSS file

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = login(email, password);
      if (success) {
        toast({
          title: "Login successful",
          description: "Welcome back to Study Planner!",
        });
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Invalid credentials. Please try the demo credentials below.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-back-link">
          <Link to="/" className="back-link">
            <ArrowLeft className="icon" />
            Back to Study Planner
          </Link>
        </div>

        <Card className="login-card">
          <CardHeader className="login-header">
            <div className="logo-circle">
              <span className="logo-text">SP</span>
            </div>
            <CardTitle className="login-title">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </CardTitle>
            <p className="login-subtitle">
              {isSignUp ? "Start your study journey today" : "Sign in to continue your study journey"}
            </p>
          </CardHeader>

          <CardContent className="login-content">
            <Alert className="demo-alert">
              <Info className="icon-small" />
              <AlertDescription className="demo-text">
                <strong>Demo Credentials:</strong><br />
                Email: {DEMO_CREDENTIALS.email}<br />
                Password: {DEMO_CREDENTIALS.password}
                <Button
                  variant="link"
                  className="demo-button"
                  onClick={handleDemoLogin}
                >
                  Use Demo
                </Button>
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter your full name" className="form-input" />
                </div>
              )}

              <div className="form-group">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <Label htmlFor="password">Password</Label>
                <div className="password-wrapper">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="icon-small" /> : <Eye className="icon-small" />}
                  </Button>
                </div>
              </div>

              {isSignUp && (
                <div className="form-group">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="form-input"
                  />
                </div>
              )}

              <Button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "Signing In..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="separator-wrapper">
              <Separator />
              <span className="separator-text">OR</span>
            </div>

            <Button variant="outline" className="google-btn">
              Continue with Google
            </Button>

            <div className="switch-text">
              <span>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </span>
              <Button variant="link" className="switch-link" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
