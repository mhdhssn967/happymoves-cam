import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Callout } from './Callout';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  /** Changing this value resets the boundary (e.g. pass the route path). */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

/** Keeps a crashing module from taking down the whole application. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Callout
        tone="danger"
        title="This module could not be displayed"
        actions={<Button size="sm" variant="secondary" onClick={() => this.setState({ error: null })}>Try again</Button>}
      >
        <p>{this.state.error.message}</p>
      </Callout>
    );
  }
}
