import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ontraLogo from "@/assets/ontra-logo.png";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [organization, setOrganization] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!username.trim()) e.username = "Username is required";
    if (!password.trim()) e.password = "Password is required";
    if (!organization) e.organization = "Please select an organization";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    login(username, organization);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-muted via-background to-accent/30 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card rounded-xl border border-border p-8" style={{ boxShadow: "var(--shadow-lg)" }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src={ontraLogo} alt="Ontra" className="h-10 mb-4" />
            <p className="text-xs text-muted-foreground mb-3">Powered by Ontra</p>
            <h1 className="text-xl font-heading font-bold text-foreground">Welcome to Ontra Back Office</h1>
            <p className="text-sm text-muted-foreground mt-1">Secure Administrative Access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border bg-background text-foreground text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary ${errors.username ? "border-destructive" : "border-input"}`}
                placeholder="Enter your username"
              />
              {errors.username && <p className="text-xs text-destructive mt-1">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3 py-2.5 pr-10 rounded-lg border bg-background text-foreground text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary ${errors.password ? "border-destructive" : "border-input"}`}
                  placeholder="Enter your password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Organization</label>
              <select
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-lg border bg-background text-foreground text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary ${errors.organization ? "border-destructive" : "border-input"}`}
              >
                <option value="">Select Organization</option>
                <option value="Ontra Global">Ontra Global</option>
                <option value="Ontra US">Ontra US</option>
                <option value="Ontra EMEA">Ontra EMEA</option>
                <option value="Ontra APAC">Ontra APAC</option>
              </select>
              {errors.organization && <p className="text-xs text-destructive mt-1">{errors.organization}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-input accent-primary" />
                Remember Me
              </label>
              <button type="button" className="text-sm text-primary hover:underline">Forgot Password?</button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">© 2026 Ontra. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;
