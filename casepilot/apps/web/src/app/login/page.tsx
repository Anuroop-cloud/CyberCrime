'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/lib/toast-context';
import { api } from '@/lib/api';

type Step = 'mobile' | 'otp';

const FEATURES = [
  { icon: '⚡', title: 'AI-Powered Intake', desc: 'Describe your case naturally — AI extracts all required details automatically' },
  { icon: '🔒', title: 'Secure Evidence Vault', desc: 'End-to-end encrypted evidence storage with tamper-proof audit trail' },
  { icon: '📍', title: 'Real-Time Tracking', desc: 'Live case status updates with escalation guidance' },
];

export default function LoginPage() {
  const [step, setStep]       = useState<Step>('mobile');
  const [mobile, setMobile]   = useState('');
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isDemo, setIsDemo]   = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { login }   = useAuth();
  const { toast }   = useToast();
  const router      = useRouter();

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      toast({ type: 'error', title: 'Invalid number', body: 'Enter a valid 10-digit Indian mobile number' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.auth.sendOtp(mobile);
      setIsDemo(!!res.demo);
      setStep('otp');
      setCountdown(30);
      toast({ type: 'success', title: 'OTP sent', body: res.message });
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (e: any) {
      toast({ type: 'error', title: 'Failed to send OTP', body: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpKey = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      otpRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  const verifyOtp = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      toast({ type: 'error', title: 'Enter all 6 digits' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.auth.verifyOtp(mobile, code);
      login(res.token, res.user as any);
      toast({ type: 'success', title: 'Welcome back!', body: `Signed in as ${(res.user as any).name}` });
      router.push('/dashboard');
    } catch (e: any) {
      toast({ type: 'error', title: 'Invalid OTP', body: e.message });
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Left Panel ────────────────────────────────── */}
      <div className="login-left" role="presentation" aria-hidden>
        <div className="login-left-content">
          {/* Brand */}
          <div className="login-brand-icon" aria-hidden>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 7V12C3 16.55 7.84 20.74 12 22C16.16 20.74 21 16.55 21 12V7L12 2Z" fill="white" fillOpacity="0.9"/>
              <path d="M9 12L11 14L15 10" stroke="#135D66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="login-brand-name">CasePilot</h1>
          <p className="login-brand-tagline">
            India's first AI-powered cybercrime complaint portal. File, track and escalate your case with confidence.
          </p>

          {/* Feature List */}
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 20, textAlign: 'left' }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{
                  width: 38, height: 38,
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17,
                  flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.15)',
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.95)', marginBottom: 3 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo notice */}
          <div style={{
            marginTop: 40,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '12px 16px',
            fontSize: 12,
            color: 'rgba(255,255,255,0.55)',
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 14 }}>🔔</span>
            <span>
              Demo mode — use mobile{' '}
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}>9989284448</strong>{' '}
              with OTP{' '}
              <strong style={{ color: 'rgba(255,255,255,0.85)' }}>123456</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Panel ───────────────────────────────── */}
      <div className="login-right">
        <main className="login-form-container">

          {/* Heading */}
          <div style={{ marginBottom: 28 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 16,
            }}>
              <div style={{
                width: 28, height: 28,
                background: 'var(--primary)',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L3 7V12C3 16.55 7.84 20.74 12 22C16.16 20.74 21 16.55 21 12V7L12 2Z" fill="white"/>
                </svg>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', letterSpacing: '-0.2px' }}>CasePilot</span>
            </div>
            <h2 className="login-title">
              {step === 'mobile' ? 'Welcome back' : 'Verify your number'}
            </h2>
            <p className="login-subtitle">
              {step === 'mobile'
                ? 'Sign in with your mobile number to file or track a cybercrime complaint.'
                : `Enter the 6-digit OTP sent to +91 ${mobile.replace(/^(\d{2})\d{6}(\d{2})$/, '$1XXXXXX$2')}.`}
            </p>
          </div>

          {/* ── Mobile Step ────────────── */}
          {step === 'mobile' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label htmlFor="mobile-input" className="form-label">
                  Mobile Number <span className="required">*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', fontSize: 13, fontWeight: 500, pointerEvents: 'none',
                    borderRight: '1px solid var(--border)', paddingRight: 10, marginRight: 4,
                    lineHeight: '1',
                  }}>+91</span>
                  <input
                    id="mobile-input"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    className="form-input"
                    style={{ paddingLeft: 52 }}
                    placeholder="9XXXXXXXXX"
                    value={mobile}
                    onChange={e => setMobile(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && sendOtp()}
                    aria-label="Mobile number"
                    autoFocus
                  />
                </div>
                {mobile.length > 0 && !/^[6-9]/.test(mobile) && (
                  <span style={{ fontSize: 11, color: 'var(--error)' }}>Number must start with 6, 7, 8 or 9</span>
                )}
              </div>

              <button
                id="send-otp-btn"
                className="btn btn-primary btn-lg w-full"
                onClick={sendOtp}
                disabled={loading || mobile.length < 10}
                aria-busy={loading}
              >
                {loading ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {loading ? 'Sending OTP…' : 'Get OTP'}
              </button>

              {/* Quick fill demo */}
              <button
                className="btn btn-outline btn-lg w-full"
                style={{ fontSize: 12 }}
                onClick={() => setMobile('9989284448')}
                type="button"
              >
                <span style={{ fontSize: 14 }}>⚡</span> Use demo account (9989284448)
              </button>
            </div>

          ) : (
            /* ── OTP Step ───────────────── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {isDemo && (
                <div className="alert alert-teal" style={{ fontSize: 12 }}>
                  <span style={{ fontSize: 14 }}>✨</span>
                  <span>Demo mode — OTP is <strong>123456</strong>. Click verify to continue.</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">One-Time Passcode</label>
                <div
                  className="otp-inputs"
                  onPaste={handleOtpPaste}
                  role="group"
                  aria-label="6-digit OTP"
                >
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      id={`otp-digit-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-input"
                      value={d}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleOtpKey(e, i)}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              <button
                id="verify-otp-btn"
                className="btn btn-primary btn-lg w-full"
                onClick={verifyOtp}
                disabled={loading || otp.join('').length < 6}
                aria-busy={loading}
              >
                {loading ? (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3"/>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
                {loading ? 'Verifying…' : 'Verify & Sign In'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--primary)', fontWeight: 500 }}
                  onClick={() => { setStep('mobile'); setOtp(['', '', '', '', '', '']); }}
                >
                  ← Change number
                </button>
                {countdown > 0 ? (
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Resend in {countdown}s</span>
                ) : (
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: 'var(--primary)', fontWeight: 500 }}
                    onClick={sendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Install banner */}
          <div className="install-banner" style={{ marginTop: 24 }}>
            <div style={{ fontSize: 20 }}>📱</div>
            <div className="install-banner-text">
              <strong>Save to home screen</strong> for quick access to your cases
            </div>
            <button className="install-btn" onClick={() => toast({ type: 'info', title: 'Add to Home Screen', body: 'Use your browser menu → "Add to Home Screen"' })}>
              Install
            </button>
          </div>

          <p className="login-footer">
            By continuing, you agree to our{' '}
            <a href="#" onClick={e => e.preventDefault()}>Terms of Service</a> and{' '}
            <a href="#" onClick={e => e.preventDefault()}>Privacy Policy</a>.
            <br />
            This portal is for cybercrime complaint filing only. For emergencies call{' '}
            <a href="tel:112"><strong>112</strong></a> or <a href="tel:1930"><strong>1930</strong></a>.
          </p>
        </main>
      </div>
    </div>
  );
}
