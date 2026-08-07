import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return <main className="login-page"><section className="login-card"><Link className="brand" href="/"><Image className="brand-logo" src="/branding/dcnhsaai-logo.svg" alt="DCNHS Alumni Association seal" width={58} height={58} priority /><span><strong>DCNHS Alumni</strong><small>Association, Inc.</small></span></Link><div><p className="eyebrow gold">Welcome back</p><h2>Sign in to your account</h2><p>Access and update your alumni profile.</p></div><form><label>Email address<input type="email" placeholder="you@example.com" /></label><label>Password<input type="password" placeholder="Enter your password" /></label><div className="login-options"><label><input type="checkbox" /> Remember me</label><a href="#">Forgot password?</a></div><button type="button" className="button submit-button">Sign in</button></form><p className="login-foot">Not registered yet? <Link href="/register">Join the alumni registry</Link></p><Link className="back-home" href="/">← Return to website</Link></section></main>;
}
