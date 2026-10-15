import type { SVGProps } from 'react';

/** HappyMoves Cam Brand Logo Icon */
export function HappyMovesLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" width={28} height={28} {...props}>
      <circle cx="18" cy="18" r="17" fill="#0d9488" fillOpacity="0.1" stroke="#0d9488" strokeWidth="1.5" />
      {/* Dynamic movement figure */}
      <circle cx="18" cy="11" r="3.2" fill="#0d9488" />
      <path
        d="M11 25.5C12 21 15 17.5 18 17.5C21 17.5 24 21 25 25.5"
        stroke="#0d9488"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M12 15C14 13.5 17 13.5 19 15L24 13"
        stroke="#0d9488"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Vitality spark */}
      <circle cx="25.5" cy="10" r="1.8" fill="#10b981" />
    </svg>
  );
}

/** Patient Stretching Illustration for Hero Banner (Screens 1 & 9) */
export function StretchingPatientIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="stretching-illustration"
      {...props}
    >
      <defs>
        <linearGradient id="plantGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="100%" stopColor="#fba779" />
        </linearGradient>
      </defs>

      {/* Decorative background plants */}
      <ellipse cx="45" cy="145" rx="20" ry="26" fill="url(#plantGrad)" opacity="0.6" />
      <ellipse cx="145" cy="135" rx="16" ry="24" fill="url(#plantGrad)" opacity="0.75" />
      <ellipse cx="158" cy="148" rx="12" ry="18" fill="#14b8a6" opacity="0.5" />

      {/* Soft circular background glow */}
      <circle cx="95" cy="95" r="62" fill="#eff6ff" />

      {/* Patient Torso & Shirt */}
      <path
        d="M68 180 C68 135 72 118 84 116 L108 116 C120 118 124 135 124 180 Z"
        fill="url(#shirtGrad)"
      />

      {/* Neck */}
      <rect x="91" y="98" width="10" height="18" rx="4" fill="url(#skinGrad)" />

      {/* Head */}
      <ellipse cx="96" cy="85" rx="14" ry="16" fill="url(#skinGrad)" />

      {/* Hair (friendly dark hair with side sweep) */}
      <path
        d="M82 84 C82 68 92 68 98 68 C106 68 112 72 112 84 C112 86 108 81 103 80 C97 79 92 84 86 86 C83 87 82 86 82 84 Z"
        fill="#1e293b"
      />
      <circle cx="83" cy="88" r="7" fill="#1e293b" />

      {/* Happy Facial Features */}
      {/* Smiling eyes */}
      <path d="M89 84 Q92 81 95 84" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <path d="M99 84 Q102 81 105 84" stroke="#1e293b" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Cheerful smile */}
      <path d="M93 91 Q96 95 101 91" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* Rosy cheek dots */}
      <circle cx="88" cy="89" r="2.2" fill="#f87171" opacity="0.5" />
      <circle cx="106" cy="89" r="2.2" fill="#f87171" opacity="0.5" />

      {/* Left arm bent resting casually */}
      <path
        d="M74 122 Q60 138 64 165"
        stroke="url(#skinGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M72 120 Q60 132 64 150"
        stroke="url(#shirtGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Right arm stretching overhead in arch */}
      <path
        d="M118 120 C136 100 134 65 116 54 C104 46 92 56 94 65"
        stroke="url(#skinGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M118 122 C132 108 132 86 122 75"
        stroke="url(#shirtGrad)"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Hand resting on head/stretching */}
      <ellipse cx="94" cy="65" rx="5" ry="4" fill="url(#skinGrad)" />

      {/* Sparkles of progress */}
      <path d="M142 56 L144 50 L146 56 L152 58 L146 60 L144 66 L142 60 L136 58 Z" fill="#fbbf24" opacity="0.9" />
      <circle cx="50" cy="85" r="2.5" fill="#38bdf8" opacity="0.7" />
      <circle cx="152" cy="95" r="2" fill="#34d399" opacity="0.8" />
    </svg>
  );
}

/** Knee / Joint Placeholder Illustration (Screen 7) */
export function PlannedJointIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="80" cy="80" r="70" fill="#f1f5f9" />
      <circle cx="80" cy="80" r="54" fill="#e2e8f0" fillOpacity="0.4" />
      {/* Lower limb knee joint diagram */}
      <path
        d="M65 42 L74 74 L68 114"
        stroke="#2563eb"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M95 42 L86 74 L92 114"
        stroke="#60a5fa"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Knee joint pivot */}
      <circle cx="74" cy="74" r="8" fill="#3b82f6" />
      <circle cx="74" cy="74" r="4" fill="#ffffff" />
      <circle cx="86" cy="74" r="8" fill="#93c5fd" />
      <circle cx="86" cy="74" r="4" fill="#ffffff" />
      {/* Soft range arc */}
      <path
        d="M60 88 A 24 24 0 0 0 88 104"
        stroke="#93c5fd"
        strokeWidth="2.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** 404 Friendly Signpost Illustration (Screen 8) */
export function NotFoundIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {/* Soft ground / hill */}
      <ellipse cx="100" cy="148" rx="85" ry="12" fill="#e2e8f0" />
      <ellipse cx="100" cy="146" rx="70" ry="8" fill="#cbd5e1" opacity="0.6" />

      {/* Signpost */}
      <rect x="94" y="65" width="8" height="82" rx="3" fill="#64748b" />
      {/* Left Sign */}
      <path d="M50 78 L95 78 L95 96 L50 96 L42 87 Z" fill="#94a3b8" />
      <circle cx="56" cy="87" r="2" fill="#f8fafc" />
      {/* Right Sign */}
      <path d="M97 90 L145 90 L153 99 L145 108 L97 108 Z" fill="#3b82f6" opacity="0.9" />
      <circle cx="140" cy="99" r="2" fill="#ffffff" />

      {/* Cute lost explorer / buddy */}
      <circle cx="58" cy="116" r="16" fill="#1e293b" />
      <ellipse cx="58" cy="136" rx="14" ry="12" fill="#2563eb" />
      {/* Big curious eyes */}
      <ellipse cx="54" cy="114" rx="4" ry="5" fill="#ffffff" />
      <ellipse cx="64" cy="114" rx="4" ry="5" fill="#ffffff" />
      <circle cx="55" cy="114" r="2" fill="#0f172a" />
      <circle cx="65" cy="114" r="2" fill="#0f172a" />
      {/* Question mark spark */}
      <path
        d="M58 86 Q62 82 66 84 Q68 87 64 90 L63 94 M63 97 L63 99"
        stroke="#f59e0b"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Soft cloud in background */}
      <path
        d="M130 52 C128 46 132 40 140 40 C144 36 152 36 156 40 C162 40 166 44 165 50 C169 52 170 58 166 62 C162 65 132 65 130 52 Z"
        fill="#f1f5f9"
      />
    </svg>
  );
}

/** Exercise Complete Celebratory Checkmark (Screen 6) */
export function CelebrationCheckmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width={80} height={80} {...props}>
      <circle cx="48" cy="48" r="42" fill="#ecfdf5" stroke="#10b981" strokeWidth="3" />
      <circle cx="48" cy="48" r="34" fill="#10b981" />
      {/* Checkmark */}
      <path
        d="M34 48 L44 58 L62 38"
        stroke="#ffffff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Sparkles */}
      <circle cx="16" cy="30" r="3" fill="#34d399" />
      <circle cx="80" cy="28" r="3.5" fill="#fbbf24" />
      <circle cx="82" cy="64" r="2.5" fill="#60a5fa" />
      <circle cx="14" cy="62" r="2" fill="#a78bfa" />
    </svg>
  );
}

/** Serene Meadow Stage Backdrop (Screen 4) */
export function SereneMeadowBackdrop() {
  return (
    <svg
      viewBox="0 0 600 360"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="60%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="hillGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="hillGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bbf7d0" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
      </defs>

      {/* Soft sky */}
      <rect width="600" height="360" fill="url(#skyGrad)" />

      {/* Gentle floating clouds */}
      <ellipse cx="120" cy="60" rx="42" ry="14" fill="#ffffff" opacity="0.6" />
      <ellipse cx="145" cy="54" rx="28" ry="12" fill="#ffffff" opacity="0.75" />
      <ellipse cx="460" cy="80" rx="55" ry="16" fill="#ffffff" opacity="0.5" />
      <ellipse cx="490" cy="72" rx="35" ry="14" fill="#ffffff" opacity="0.65" />

      {/* Back Hill */}
      <path
        d="M-40 280 Q160 210 380 250 T640 240 L640 360 L-40 360 Z"
        fill="url(#hillGrad2)"
        opacity="0.8"
      />

      {/* Friendly tree on the right hill */}
      <rect x="495" y="210" width="8" height="40" rx="3" fill="#78350f" opacity="0.8" />
      <ellipse cx="499" cy="195" rx="22" ry="26" fill="#15803d" />
      <ellipse cx="494" cy="188" rx="16" ry="18" fill="#16a34a" />

      {/* Foreground Meadow */}
      <path
        d="M-40 300 Q180 270 420 305 Q520 320 640 295 L640 360 L-40 360 Z"
        fill="url(#hillGrad1)"
      />
    </svg>
  );
}

/** Figure Posture Icon (Screen 3 Activities List) */
export function PostureFigureIcon({ variant = 'flexion' }: { variant?: 'flexion' | 'abduction' | 'rotation' | 'scapular' | 'angels' | 'hand' | 'knee' }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width={26} height={26}>
      <circle cx="20" cy="9" r="4.5" fill="#2563eb" />
      {/* Torso */}
      <path d="M20 14 V26" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <path d="M20 26 L15 36 M20 26 L25 36" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms variation */}
      {variant === 'flexion' && (
        <path d="M12 21 L20 17 L28 12" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {variant === 'abduction' && (
        <path d="M8 17 L20 17 L32 17" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {variant === 'rotation' && (
        <path d="M11 20 L20 17 L25 21 L30 16" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {variant === 'scapular' && (
        <path d="M12 16 L20 17 L28 16" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {variant === 'angels' && (
        <path d="M10 11 L20 17 L30 11" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {variant === 'hand' && (
        <path d="M14 20 L20 17 L26 20" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      )}
      {variant === 'knee' && (
        <path d="M15 20 L20 17 L25 20" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

/** Legacy Anatomical Illustrations kept for compatibility */
export function UpperBodyIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={38} height={38} {...props}>
      <circle cx="24" cy="10" r="5" fill="#0d9488" />
      <path d="M14 20 C18 17 30 17 34 20" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
      <path d="M14 20 L11 31 L18 31" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 20 L37 31 L30 31" stroke="#0d9488" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 16 V34" stroke="#0d9488" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function LowerBodyIllustration(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={38} height={38} {...props}>
      <path d="M16 12 H32 L29 20 H19 Z" fill="#4f46e5" />
      <path d="M19 20 L16 32 L13 42" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M29 20 L32 32 L35 42" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="32" r="3" fill="#818cf8" />
      <circle cx="32" cy="32" r="3" fill="#818cf8" />
    </svg>
  );
}
