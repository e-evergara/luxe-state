interface StatsCardProps {
  icon: string;
  label: string;
  value: number | string;
  description?: string;
  accent?: 'green' | 'teal' | 'sage' | 'amber';
}

const accentClasses = {
  green: {
    icon: 'bg-[#D9ECC8] text-[#19322F]',
    border: 'border-[#D9ECC8]/60',
    glow: 'shadow-[0_0_20px_rgba(217,236,200,0.15)]',
  },
  teal: {
    icon: 'bg-[#006655]/15 text-[#006655]',
    border: 'border-[#006655]/20',
    glow: 'shadow-[0_0_20px_rgba(0,102,85,0.1)]',
  },
  sage: {
    icon: 'bg-[#19322F]/10 text-[#19322F] dark:bg-white/10 dark:text-white',
    border: 'border-[#19322F]/10 dark:border-white/10',
    glow: '',
  },
  amber: {
    icon: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-800/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]',
  },
};

export function StatsCard({
  icon,
  label,
  value,
  description,
  accent = 'teal',
}: StatsCardProps) {
  const styles = accentClasses[accent];

  return (
    <div
      className={`
        bg-white dark:bg-[#152e2a] rounded-2xl p-6
        border ${styles.border}
        ${styles.glow}
        transition-all duration-300 hover:-translate-y-0.5
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${styles.icon}`}>
          <span className="material-icons text-xl">{icon}</span>
        </div>
      </div>
      <p className="text-3xl font-bold text-[#19322F] dark:text-white mb-1 tabular-nums">
        {value}
      </p>
      <p className="text-sm font-semibold text-[#19322F]/70 dark:text-white/60">{label}</p>
      {description && (
        <p className="text-xs text-[#19322F]/40 dark:text-white/30 mt-1">{description}</p>
      )}
    </div>
  );
}
