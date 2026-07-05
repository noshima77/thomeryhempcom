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
    <div className="flex items-center justify-center min-h-[60vh] px-5">
      <div className="bg-neutral-0 border-2 border-neutral-200 rounded-2xl p-8 w-full max-w-[380px] shadow-lg text-center">
        <div className="text-5xl mb-2.5">🌿</div>
        <h2 className="font-serif text-2xl font-extrabold mb-1">GrowTrack</h2>
        <p className="text-sm text-neutral-500 mb-6">Cherry Royale · thomeryhemp.com</p>

        {error && (
          <div className="px-3.5 py-3 rounded-lg text-sm mb-4 bg-red-50 border border-red-200 text-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
          <input
            className="w-full px-3 py-2.5 border-[1.5px] border-neutral-200 rounded-lg text-sm bg-neutral-0 focus:outline-none focus:border-green-500 transition-colors"
            type="email"
            placeholder="Email admin PocketBase"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="w-full px-3 py-2.5 border-[1.5px] border-neutral-200 rounded-lg text-sm bg-neutral-0 focus:outline-none focus:border-green-500 transition-colors"
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            className="w-full flex items-center justify-center gap-2 min-h-touch px-4 rounded-lg font-medium text-[15px] bg-green-500 text-white hover:bg-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}