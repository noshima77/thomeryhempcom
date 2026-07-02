import { useState } from "react";
import { useLotsContext } from "../context/LotsContext";

export default function LoginForm() {
  const { login } = useLotsContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError("Identifiants invalides. Vérifie ton email et mot de passe PocketBase.");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">🌿</div>
        <h2 className="login-title">GrowTrack</h2>
        <p className="login-sub">Cherry Royale · thomeryhemp.com</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="form-input"
            type="email"
            placeholder="Email admin PocketBase"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="form-input"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
