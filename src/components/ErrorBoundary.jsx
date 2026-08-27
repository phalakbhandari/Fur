import { Component } from 'react';

/**
 * Last line of defence. A render crash anywhere below this shows a recovery
 * screen instead of a blank white page — which is what React 19 gives you by
 * default when an error escapes to the root.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // No error-reporting service wired up yet; the console is the log.
    console.error('Unhandled error in the React tree:', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen bg-ochre flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-paper rounded-[28px] border border-ink/10 shadow-lift p-8 text-center">
          <h1 className="text-3xl font-display text-ink">Something broke</h1>
          <p className="text-sm text-ink-muted font-medium mt-3 leading-relaxed">
            That is on us, not you. Reloading usually clears it. If it keeps happening, clearing
            this site&rsquo;s saved data will reset the app to a clean state.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex-1 py-3 rounded-xl bg-ink hover:bg-[#111] text-cream font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-card transition-all cursor-pointer"
            >
              Reload the page
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  window.localStorage.clear();
                } catch {
                  /* storage may be unavailable; reloading is still worth a try */
                }
                window.location.reload();
              }}
              className="flex-1 py-3 rounded-xl bg-paper hover:bg-ochre-wash text-ink font-semibold text-xs uppercase tracking-wider border border-ink/10 shadow-card transition-all cursor-pointer"
            >
              Reset saved data
            </button>
          </div>
        </div>
      </div>
    );
  }
}
