/**
 * Color mapping utilities — Tailwind semantic tokens (aligned with app/globals.css).
 */

export const colorMappings = {
  masteryLevelColor: {
    mastered: 'bg-chart-1 text-white',
    proficient: 'bg-chart-4 text-white',
    developing: 'bg-chart-2 text-white',
    not_started: 'bg-chart-5 text-foreground',
  },

  accuracyColor: (percent: number) => {
    if (percent >= 80) return 'text-chart-1';
    if (percent >= 70) return 'text-muted-foreground';
    if (percent >= 60) return 'text-chart-3';
    return 'text-chart-2';
  },

  progressBarColor: (percent: number) => {
    if (percent >= 85) return 'bg-chart-1';
    if (percent >= 70) return 'bg-muted-foreground';
    return 'bg-chart-2';
  },

  errorCategoryColor: {
    conceptual_misunderstanding: 'bg-chart-2 text-white',
    computational_error: 'bg-chart-3 text-foreground',
    sign_error: 'bg-chart-2 text-white',
    reading_comprehension: 'bg-chart-4 text-white',
    careless_mistake: 'bg-chart-5 text-foreground',
  },

  emotionColor: {
    overwhelmed: 'text-chart-2',
    frustrated: 'text-chart-3',
    neutral: 'text-muted-foreground',
    confident: 'text-chart-1',
  },

  statusBorderColor: {
    on_track: 'border-l-chart-1',
    behind: 'border-l-chart-2',
    recovering: 'border-l-chart-3',
  },
};

export const buttonStyles = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  outlined: 'border border-border text-foreground hover:bg-muted',
  ghost: 'text-foreground hover:bg-muted',
};

export const cardStyles = {
  default: 'bg-card border border-border',
  highlight: 'bg-secondary border-l-4 border-l-chart-1',
  subtle: 'bg-muted',
};

export const textColors = {
  heading: 'text-foreground',
  body: 'text-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-accent',
  warning: 'text-destructive',
};
