import { useState } from 'react';
import { Lock, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
import { Button } from '../components/Button.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('12345678910');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="brand large">
          <div className="brand-mark">T</div>
          <div>
            <strong>Central Tubaron</strong>
            <span>Atendimento digital seguro</span>
          </div>
        </div>

        <h1>Resolva sua conta em poucos cliques.</h1>
        <p>Consulte faturas, contratos, suporte premium e orientações inteligentes em uma experiência simples e protegida.</p>

        <div className="login-highlights">
          <span><ShieldCheck size={17} /> Dados protegidos</span>
          <span><Sparkles size={17} /> IA assistiva</span>
          <span><Lock size={17} /> Integração IXC</span>
        </div>
      </section>

      <form className="login-card" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Acesso do assinante</span>
          <h2>Entrar na central</h2>
        </div>

        <label>
          CPF, CNPJ ou login PPPoE
          <div className="input-icon">
            <UserRound size={18} />
            <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
          </div>
        </label>

        <label>
          Senha ou confirmação IXC
          <div className="input-icon">
            <Lock size={18} />
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
        </label>

        {error && <div className="form-error">{error}</div>}
        <Button disabled={loading}>{loading ? 'Validando...' : 'Acessar central'}</Button>
      </form>
    </main>
  );
}
