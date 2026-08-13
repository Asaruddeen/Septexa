import { useState } from 'react';

function AuthModal({ isOpen, onClose, onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, name: email.split('@')[0] });
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setEmail('');
    setPassword('');
  };

  const close = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="auth-backdrop" onClick={close}>
      <div className="auth-modal">
        <h2 className="auth-modal__title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <form className="auth-modal__form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            className="auth-modal__input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-modal__input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <button type="submit" className="auth-modal__submit">
            {mode === 'login' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
        <button
          type="button"
          className="auth-modal__toggle"
          onClick={toggleMode}
        >
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
