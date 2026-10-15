import { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  Home,
  Layers,
  BookOpen,
  User,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { ROUTES } from '@/core/config/app';
import { ErrorBoundary } from '@/components/ui';
import { HappyMovesLogo, StretchingPatientIllustration } from '@/components/catalog/RehabIllustrations';
import './layout.css';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}

const BOTTOM_NAV: NavItem[] = [
  { to: ROUTES.home, label: 'Home', icon: Home, end: true },
  { to: ROUTES.section('upper-body'), label: 'Section', icon: Layers, end: false },
  { to: ROUTES.section('lower-body'), label: 'Library', icon: BookOpen, end: false },
  { to: '#profile', label: 'Profile', icon: User, end: false },
];

const DRAWER_NAV = [
  { to: ROUTES.home, label: 'Home', icon: Home, end: true },
  { to: ROUTES.section('upper-body'), label: 'Upper Body', icon: Layers, end: false },
  { to: ROUTES.section('lower-body'), label: 'Lower Body', icon: Layers, end: false },
  { to: ROUTES.section('upper-body'), label: 'Library', icon: BookOpen, end: false },
  { to: '#profile', label: 'Profile', icon: User, end: false },
];

export function AppLayout() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Close drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileMenuOpen || profileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, profileModalOpen]);

  const handleNavClick = (to: string) => {
    if (to === '#profile') {
      setProfileModalOpen(true);
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="app-container">
      <a href="#main" className="skip-link">Skip to main content</a>

      {/* Top Patient Header Bar */}
      <header className="patient-header">
        <div className="patient-header__inner">
          {/* Logo & App Title */}
          <Link to={ROUTES.home} className="patient-brand" aria-label="HappyMoves Cam Home">
            <HappyMovesLogo />
            <span className="patient-brand__name">HappyMoves Cam</span>
          </Link>

          {/* Desktop Direct Nav Links */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            <NavLink
              to={ROUTES.home}
              end
              className={({ isActive }) => `desktop-nav__link ${isActive ? 'desktop-nav__link--active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to={ROUTES.section('upper-body')}
              className={({ isActive }) => `desktop-nav__link ${isActive ? 'desktop-nav__link--active' : ''}`}
            >
              Upper Body
            </NavLink>
            <NavLink
              to={ROUTES.section('lower-body')}
              className={({ isActive }) => `desktop-nav__link ${isActive ? 'desktop-nav__link--active' : ''}`}
            >
              Lower Body
            </NavLink>
            <NavLink
              to={ROUTES.module('upper-body', 'hand-gross-motor', 'hand-opening-and-closing')}
              className={({ isActive }) => `desktop-nav__link ${isActive ? 'desktop-nav__link--active' : ''}`}
            >
              Camera Demo
            </NavLink>
          </nav>

          {/* Hamburger Menu Toggle (Screen 1 & 9) */}
          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Mobile Slide-in Navigation Drawer (Screen 9) */}
      {mobileMenuOpen && (
        <div className="drawer-overlay" role="dialog" aria-modal="true" aria-label="Navigation Menu">
          <div className="drawer-backdrop" onClick={() => setMobileMenuOpen(false)} />
          <div className="drawer-panel">
            <div className="drawer-header">
              <div className="patient-brand">
                <HappyMovesLogo />
                <span className="patient-brand__name">HappyMoves Cam</span>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="drawer-nav">
              {DRAWER_NAV.map(({ to, label, icon: IconComp, end }) => {
                if (to.startsWith('#')) {
                  return (
                    <button
                      key={label}
                      type="button"
                      className="drawer-nav__item"
                      onClick={() => handleNavClick(to)}
                    >
                      <span className="drawer-nav__icon">
                        <IconComp size={20} />
                      </span>
                      <span className="drawer-nav__label">{label}</span>
                      <ChevronRight size={16} className="drawer-nav__arrow" />
                    </button>
                  );
                }

                return (
                  <NavLink
                    key={to + label}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `drawer-nav__item ${isActive ? 'drawer-nav__item--active' : ''}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="drawer-nav__icon">
                      <IconComp size={20} />
                    </span>
                    <span className="drawer-nav__label">{label}</span>
                    <ChevronRight size={16} className="drawer-nav__arrow" />
                  </NavLink>
                );
              })}
            </nav>

            {/* Bottom mini hero banner matching Screen 9 */}
            <div className="drawer-footer-card">
              <div className="drawer-footer-card__content">
                <span className="drawer-footer-card__title">Better Movement</span>
                <span className="drawer-footer-card__subtitle">Brighter Days</span>
              </div>
              <div className="drawer-footer-card__art">
                <StretchingPatientIllustration width={64} height={64} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Profile Modal */}
      {profileModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setProfileModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Patient Profile</h2>
              <button
                type="button"
                className="modal-close"
                onClick={() => setProfileModalOpen(false)}
                aria-label="Close profile"
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                HM
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Active Patient</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Daily Rehabilitation Program</p>
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Assigned Exercises</span>
                <span style={{ fontWeight: 600 }}>12 activities</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Completed Today</span>
                <span style={{ fontWeight: 600, color: '#16a34a' }}>2 sessions</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Motion Sensor</span>
                <span style={{ fontWeight: 600, color: '#2563eb' }}>Ready (Webcam)</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn--primary btn--full"
              onClick={() => setProfileModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main App Content Viewport */}
      <main id="main" className="patient-main" tabIndex={-1}>
        <ErrorBoundary resetKey={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Sticky Mobile Bottom Navigation Bar (Screens 1, 2, 3, 9, 10) */}
      <nav className="patient-bottom-nav" aria-label="Mobile Navigation Bar">
        <div className="patient-bottom-nav__inner">
          {BOTTOM_NAV.map(({ to, label, icon: IconComp, end }) => {
            if (to.startsWith('#')) {
              return (
                <button
                  key={label}
                  type="button"
                  className="patient-bottom-nav__item"
                  onClick={() => handleNavClick(to)}
                >
                  <IconComp size={22} className="patient-bottom-nav__icon" />
                  <span className="patient-bottom-nav__label">{label}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `patient-bottom-nav__item ${isActive ? 'patient-bottom-nav__item--active' : ''}`
                }
              >
                <IconComp size={22} className="patient-bottom-nav__icon" />
                <span className="patient-bottom-nav__label">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
