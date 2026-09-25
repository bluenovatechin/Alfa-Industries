import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Alfa Hardware UI Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif',
          background: '#15181c',
          color: '#f8fafc',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#cf1f2c', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ maxWidth: '600px', color: '#cbd5e1', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <pre style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '1rem',
            borderRadius: '8px',
            maxWidth: '800px',
            overflowX: 'auto',
            textAlign: 'left',
            fontSize: '0.8rem',
            color: '#ef4444',
            marginBottom: '1.5rem'
          }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#cf1f2c',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
