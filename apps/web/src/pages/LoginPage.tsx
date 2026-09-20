import LoginForm from "../components/auth/LoginForm";

export default function LoginPage() {
  function handleLoginSuccess() {
    console.log("Login successful");
  }

  return (
    <main className="login-page">
      <section className="login-image">
        <div className="login-image-overlay">
          <span className="brand-mark">NAMOU</span>

          <div className="image-copy">
            <p>THE COLLECTION</p>
            <h2>Where every scent<br />tells a story.</h2>
          </div>
        </div>
      </section>

      <section className="login-section">
        <div className="login-card">
          <div className="login-brand">NAMOU</div>

          <div className="login-header">
            <span className="eyebrow">MEMBER ACCESS</span>
            <h1>Welcome back.</h1>
            <p>
              Sign in to continue your journey with us.
            </p>
          </div>

          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </section>
    </main>
  );
}
