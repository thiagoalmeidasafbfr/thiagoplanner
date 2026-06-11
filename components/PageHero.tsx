interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <div className="bg-ink-primary px-8 pt-8 pb-7 flex-shrink-0">
      <h1 className="font-fraunces text-on-dark text-[28px] font-semibold leading-tight tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="font-ibm-plex-mono text-[rgba(243,238,226,0.45)] text-xs uppercase tracking-label mt-2 leading-none">
          {subtitle}
        </p>
      )}
    </div>
  );
}
