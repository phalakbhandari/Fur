import { useState } from 'react';
import { Cross } from './ui/Glyph';
import { CustomIcon } from './CustomIcon';
import { ModalShell } from './ModalShell';
import { PawIcon } from './PawDecorations';

const fieldClass =
  'w-full px-3.5 py-2.5 rounded-xl bg-paper border border-ink/12 text-sm text-ink font-bold placeholder:text-ink-faint focus:outline-none focus:border-ink/10 focus:bg-paper transition-colors';

const labelClass = 'block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nameFromEmail(email) {
  const local = email
    .split('@')[0]
    .replace(/[._-]+/g, ' ')
    .trim();
  return local
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

/**
 * Account entry for the demo.
 *
 * There is no auth server, so this deliberately does not pretend to be
 * secure: accounts live in this browser and passwords are never stored, only
 * checked for presence. It exists so the app can tell "this visitor" from
 * "some visitor" when attributing applications and listings — swapping it for
 * a real identity provider means replacing `onAuthenticate`, nothing else.
 */
export const SignInModal = ({ isOpen, onClose, onAuthenticate, knownEmails = [], reason }) => {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const isSignUp = mode === 'signup';

  const reset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
    setMode('signin');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const switchMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setError(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (isSignUp && !name.trim()) {
      setError('What should we call you?');
      return;
    }
    if (!trimmedEmail) {
      setError('Enter your email address.');
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('That does not look like a valid email address.');
      return;
    }
    if (!password) {
      setError('Enter a password.');
      return;
    }
    if (isSignUp && password.length < 6) {
      setError('Use at least six characters.');
      return;
    }
    if (isSignUp && knownEmails.includes(trimmedEmail)) {
      setError('There is already an account with that email on this device. Sign in instead.');
      return;
    }

    setIsSubmitting(true);

    onAuthenticate({
      id: `user-${trimmedEmail.replace(/[^a-z0-9]/g, '')}`,
      name: isSignUp ? name.trim() : nameFromEmail(trimmedEmail),
      email: trimmedEmail,
    });

    setIsSubmitting(false);
    reset();
  };

  return (
    <ModalShell onClose={handleClose} labelledBy="signin-title">
      <div className="relative bg-cream rounded-[var(--radius-panel)] max-w-md w-full overflow-hidden shadow-lift ring-1 ring-ink/10 animate-scale-up">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-30 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink ring-1 ring-ink/10 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-ink hover:text-cream hover:rotate-90 cursor-pointer"
        >
          <Cross className="w-4 h-4" />
        </button>

        <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-ink/8">
          <div className="flex items-center gap-3 pr-10">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-ochre-wash border border-ink/10 flex items-center justify-center shadow-soft">
              <PawIcon className="w-6 h-6 fill-ink" />
            </div>
            <div>
              <h2
                id="signin-title"
                className="text-2xl sm:text-3xl font-display text-ink leading-none"
              >
                {isSignUp ? 'Create an account' : 'Welcome back'}
              </h2>
              <p className="text-[11px] text-ink-muted font-bold mt-1">
                {reason ??
                  (isSignUp ? 'It takes a moment' : 'Sign in to pick up where you left off')}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-8 space-y-4">
          {error && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-brick/8 border border-brick text-brick text-xs font-semibold flex items-start gap-2"
            >
              <CustomIcon name="exclamation" className="w-4 h-4 shrink-0 mt-px" />
              <span>{error}</span>
            </div>
          )}

          {isSignUp && (
            <div>
              <label htmlFor="signin-name" className={labelClass}>
                Your name
              </label>
              <input
                id="signin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maya Rao"
                autoComplete="name"
                className={fieldClass}
              />
            </div>
          )}

          <div>
            <label htmlFor="signin-email" className={labelClass}>
              Email address
            </label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maya@example.com"
              autoComplete="email"
              className={fieldClass}
            />
          </div>

          <div>
            <label htmlFor="signin-password" className={labelClass}>
              Password
            </label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isSignUp ? 'At least six characters' : 'Your password'}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className={fieldClass}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-sm tracking-wider border border-ink/10 shadow-card hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <PawIcon className="w-4 h-4 fill-cream" />
            <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
          </button>

          <p className="text-center text-xs font-bold text-ink-muted">
            {isSignUp ? 'Already have an account?' : 'New here?'}{' '}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-ink underline underline-offset-2 hover:text-brick cursor-pointer transition-colors"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>

          <p className="text-[11px] text-ink-muted font-bold leading-relaxed text-center border-t border-ink/10 pt-4">
            Demo accounts are stored in this browser and nowhere else. Passwords are checked for
            length, never saved.
          </p>
        </form>
      </div>
    </ModalShell>
  );
};
