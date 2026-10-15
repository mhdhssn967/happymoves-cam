import { Link } from 'react-router-dom';
import {
  Layers,
  Activity,
  PlaySquare,
  ChevronRight,
  Hand,
  RotateCcw,
} from 'lucide-react';
import { ROUTES } from '@/core/config/app';
import { getCatalogStats } from '@/modules/registry';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { StretchingPatientIllustration, UpperBodyIllustration, LowerBodyIllustration } from '@/components/catalog/RehabIllustrations';
import './pages.css';

export function DashboardPage() {
  useDocumentTitle('Dashboard');
  const stats = getCatalogStats();

  return (
    <div className="page dashboard-page">
      {/* 1. Hero Card: Better Movement Brighter Days (Screen 1) */}
      <section className="hero-banner" aria-labelledby="hero-title">
        <div className="hero-banner__text">
          <h1 id="hero-title" className="hero-banner__title">
            Better Movement<br />
            Brighter Days
          </h1>
          <p className="hero-banner__desc">
            Personalized rehabilitation exercises for better recovery and independence.
          </p>
        </div>
        <div className="hero-banner__graphic">
          <StretchingPatientIllustration width={130} height={130} />
        </div>
      </section>

      {/* 2. Quick Stat Counters (Categories 12, Activities 88, Working Modules 2) */}
      <section className="dashboard-stats-grid" aria-label="Rehabilitation Statistics">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green">
            <Layers size={20} />
          </div>
          <span className="stat-card__value">{stats.categories || 12}</span>
          <span className="stat-card__label">Categories</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">
            <Activity size={20} />
          </div>
          <span className="stat-card__value">{stats.activities || 88}</span>
          <span className="stat-card__label">Activities</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--purple">
            <PlaySquare size={20} />
          </div>
          <span className="stat-card__value">{stats.modules || 2}</span>
          <span className="stat-card__label">Working Modules</span>
        </div>
      </section>

      {/* 3. Choose a Body Region (Upper Body & Lower Body) */}
      <section className="dashboard-section" aria-labelledby="region-heading">
        <h2 id="region-heading" className="dashboard-section__heading">
          Choose a Body Region
        </h2>

        <div className="region-cards-list">
          {/* Upper Body Card */}
          <Link to={ROUTES.section('upper-body')} className="region-item-card">
            <div className="region-item-card__icon region-item-card__icon--teal">
              <UpperBodyIllustration width={32} height={32} />
            </div>
            <div className="region-item-card__content">
              <span className="region-item-card__title">Upper Body Rehabilitation</span>
            </div>
            <ChevronRight size={20} className="region-item-card__arrow" />
          </Link>

          {/* Lower Body Card */}
          <Link to={ROUTES.section('lower-body')} className="region-item-card">
            <div className="region-item-card__icon region-item-card__icon--green">
              <LowerBodyIllustration width={32} height={32} />
            </div>
            <div className="region-item-card__content">
              <span className="region-item-card__title">Lower Body Rehabilitation</span>
            </div>
            <ChevronRight size={20} className="region-item-card__arrow" />
          </Link>
        </div>
      </section>

      {/* 4. Working Modules (Launch Now) */}
      <section className="dashboard-section" aria-labelledby="working-heading">
        <h2 id="working-heading" className="dashboard-section__heading">
          Working Modules (Launch Now)
        </h2>

        <div className="working-modules-list">
          {/* Shoulder Mobility */}
          <Link
            to={ROUTES.module('upper-body', 'shoulder-mobility', 'general-template')}
            className="module-item-card"
          >
            <div className="module-item-card__icon module-item-card__icon--purple">
              <RotateCcw size={22} />
            </div>
            <div className="module-item-card__content">
              <span className="module-item-card__title">Shoulder Mobility</span>
              <span className="module-item-card__subtitle">(General Module Template)</span>
            </div>
            <ChevronRight size={20} className="module-item-card__arrow" />
          </Link>

          {/* Hand Opening and Closing */}
          <Link
            to={ROUTES.module('upper-body', 'hand-gross-motor', 'hand-opening-and-closing')}
            className="module-item-card"
          >
            <div className="module-item-card__icon module-item-card__icon--cyan">
              <Hand size={22} />
            </div>
            <div className="module-item-card__content">
              <span className="module-item-card__title">Hand Opening and Closing</span>
              <span className="module-item-card__subtitle">(Camera Tracking Demo)</span>
            </div>
            <ChevronRight size={20} className="module-item-card__arrow" />
          </Link>
        </div>
      </section>
    </div>
  );
}
