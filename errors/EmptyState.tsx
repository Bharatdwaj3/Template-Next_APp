import Link from "next/link";
import { Sprout } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onSecondary?: () => void;
  secondaryLabel?: string;
}

export const EmptyState = ({
  title = "No Produce Found",
  message = "This field is bare. Try a different category or check back after the next harvest.",
  ctaLabel = "Browse All",
  ctaHref = "/explore",
  onSecondary,
  secondaryLabel = "Clear Filters",
}: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-28 px-6 text-center relative overflow-hidden">
    <p className="absolute text-[10rem] font-black text-[#1a3d2b]/4 uppercase leading-none select-none tracking-tighter pointer-events-none">
      Empty
    </p>
    <div className="relative z-10 flex flex-col items-center">
      <div className="w-20 h-20 rounded-2xl bg-[#1a3d2b]/6 border border-[#1a3d2b] flex items-center justify-center mb-8">
        <Sprout className="w-8 h-8 text-[#1a3d2b]/30" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-3">
        Nothing Here
      </p>
      <h2 className="text-3xl font-black text-[#1a3d2b] uppercase tracking-tight mb-2">
        {title}
      </h2>
      <div
        className="w-12 h-0.5 mx-auto mb-6"
        style={{
          background:
            "linear-gradient(90deg, transparent, #e8c84a, transparent)",
        }}
      />
      <p className="text-sm text-[#8a9a8e] loading-relaxed max-w-sm mb-10">
        {message}
      </p>
      <div>
        <Link
          href={ctaHref}
          className="flex items-center justify-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors"
        >
          {ctaLabel} →
        </Link>
        {onSecondary && (
          <button
            onClick={onSecondary}
            className="flex items-center justify-center gap-2 bg-white border border-[#d4c9b0] text-[#1a3d2b] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:border-[#1a3d2b]/40 transition-colors"
          >
            {secondaryLabel}
          </button>
        )}
      </div>
    </div>
  </div>
);
