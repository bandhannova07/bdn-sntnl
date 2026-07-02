/** @jsxImportSource react */
import React, { useEffect, useState } from 'react';
import { API_BASE } from '../../../config';

interface GoogleAuthResponse {
  success?: boolean;
  error?: string;
  session_token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    plan?: string;
    debug?: boolean;
  };
}

export default function LoginFlow() {
  const [loading, setLoading] = useState(true);
  const [checkingAutoLogin, setCheckingAutoLogin] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const isDebugEnabled = import.meta.env.DEV || import.meta.env.PUBLIC_ENABLE_DEBUG_MODE === 'true';

  useEffect(() => {
    const checkSession = async () => {
      const expires = localStorage.getItem('sentinel_token_expires');
      const savedUser = localStorage.getItem('sentinel_user');
      
      // If valid unexpired 7-day session exists locally, auto-enter dashboard
      if (savedUser && expires && Number(expires) > Date.now()) {
        window.location.href = '/dashboard';
        return;
      }

      // Also check active server cookie session
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const userData = await res.json();
          localStorage.setItem('sentinel_user', JSON.stringify(userData));
          localStorage.setItem('sentinel_token_expires', (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
          window.location.href = '/dashboard';
          return;
        }
      } catch (err) {
        // Backend session verification failed or offline
      }

      // No active session found, show sign in UI
      localStorage.removeItem('sentinel_session_token');
      localStorage.removeItem('sentinel_token_expires');
      setCheckingAutoLogin(false);
    };

    checkSession();
  }, []);

  const handleGoogleLogin = async (response: { credential?: string }) => {
    const idToken = response.credential;
    if (!idToken) {
      setAuthError('Google sign-in did not return a valid credential.');
      return;
    }
    
    let orgName = '';
    let orgDomain = '';
    
    const pendingSignup = localStorage.getItem('pending_signup_org');
    if (pendingSignup) {
      try {
        const parsed = JSON.parse(pendingSignup);
        orgName = parsed.orgName || '';
        orgDomain = parsed.orgDomain || '';
      } catch (e) {
        console.error("Failed to parse pending signup data");
      }
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_token: idToken,
          org_name: orgName,
          org_domain: orgDomain,
        }),
      });
      const data = await res.json() as GoogleAuthResponse;
      if (data.success) {
        localStorage.removeItem('pending_signup_org');
        localStorage.setItem("sentinel_user", JSON.stringify(data.user));
        if (data.session_token) {
          localStorage.setItem("sentinel_session_token", data.session_token);
        }
        // Save 7-day token expiration timestamp
        localStorage.setItem("sentinel_token_expires", (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
        window.location.href = "/dashboard";
      } else {
        setAuthError(data.error || 'Google authentication failed.');
      }
    } catch (err) {
      console.error("Auth call failed", err);
      setAuthError('Could not connect to the auth verification endpoint.');
    }
  };

  useEffect(() => {
    if (checkingAutoLogin) return;

    const checkGoogle = setInterval(() => {
      if (window && (window as any).google) {
        clearInterval(checkGoogle);
        setLoading(false);
        
        (window as any).google.accounts.id.initialize({
          client_id: import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || "703126793842-gqpdh5pgntuov72dngk35iogeltelf1r.apps.googleusercontent.com",
          callback: handleGoogleLogin,
        });

        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { theme: "filled_dark", size: "large", width: 320 }
        );
      }
    }, 100);

    return () => clearInterval(checkGoogle);
  }, [checkingAutoLogin]);

  const handleDebugMode = () => {
    const debugUser = {
      id: "debug-user-1",
      name: "Bandhan (UI Inspector)",
      email: "bandhan@sentinel-debug.local",
      picture: "https://api.dicebear.com/7.x/bottts/svg?seed=Bandhan",
      plan: "Enterprise",
      debug: true
    };
    localStorage.setItem("sentinel_user", JSON.stringify(debugUser));
    localStorage.setItem("sentinel_debug_mode", "true");
    localStorage.setItem("sentinel_token_expires", (Date.now() + 7 * 24 * 60 * 60 * 1000).toString());
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030303] py-12">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-xl px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <a href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/favicon.ico" alt="Sentinel Logo" className="w-14 h-14 object-contain drop-shadow-[0_0_15px_rgba(167,139,250,0.5)] hover:scale-110 transition-transform duration-500" />
            <span className="text-4xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 drop-shadow-[0_0_2px_rgba(167,139,250,0.25)] mt-1" style={{ fontFamily: "'Virgo 01', sans-serif", letterSpacing: "2px" }}>
              Sentinel
            </span>
          </a>
        </div>

        <div className="bg-[#0a0a0a]/80 border border-white/[0.08] rounded-3xl p-8 md:p-10 backdrop-blur-3xl shadow-2xl text-center">
          {checkingAutoLogin ? (
            <div className="py-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Verifying active session...</h3>
              <p className="text-xs text-zinc-400" style={{ fontFamily: "'Inter', sans-serif" }}>Checking your 7-day secure token</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Welcome back</h2>
              <p className="text-[14px] text-gray-400 mb-8" style={{ fontFamily: "'Inter', sans-serif" }}>Sign in to continue to your dashboard.</p>

              <div className="flex justify-center mb-6 min-h-[44px]">
                {loading && <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>}
                <div id="google-signin-btn" className={loading ? 'hidden' : 'block'}></div>
              </div>

              {authError && (
                <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {authError}
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-white/[0.06]">
                <a 
                  href="/signup"
                  className="text-[14px] text-gray-400 hover:text-white transition-colors block mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Don't have an account? <span className="text-violet-400 font-semibold">Sign up for free</span>
                </a>

                {/* UI Debug / Preview Mode Button */}
                {isDebugEnabled && (
                  <button
                    onClick={handleDebugMode}
                    type="button"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 hover:text-amber-200 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/15 group"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    Enter UI Preview / Debug Mode
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
