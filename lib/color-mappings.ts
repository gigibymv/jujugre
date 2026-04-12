/**
 * Semantic color utilities — accent (positive), destructive (critical), neutral only.
 * Chart palette stays in globals.css for Recharts, not for general UI.
 */

export const colorMappings = {
  masteryLevelColor: {
    mastered: 'bg-accent text-accent-foreground',
    proficient: 'bg-muted text-foreground',
    developing: 'bg-destructive text-destructive-foreground',
    not_started: 'bg-secondary text-secondary-foreground',
  },

  accuracyColor: (percent: number) => {
    if (percent >= 80) return 'text-accent';
    if (percent >= 70) return 'text-foreground';
    if (percent >= 60) return 'text-muted-foreground';
    return 'text-destructive';
  },

  progressBarColor: (percent: number) => {
    if (percent >= 85) return 'bg-accent';
    if (percent >= 70) return 'bg-muted-foreground';
    return 'bg-destructive';
  },

  errorCategoryColor: {
    conceptual_misunderstanding: 'bg-destructive text-destructive-foreground',
    computational_error: 'bg-muted text-foreground',
    sign_error: 'bg-destructive text-destructive-foreground',
    reading_comprehension: 'bg-secondary text-secondary-foreground',
    careless_mistake: 'bg-muted text-foreground',
  },

  emotionColor: {
    overwhelmed: 'text-destructive',
    frustrated: 'text-muted-foreground',
    neutral: 'text-muted-foreground',
    confident: 'text-accent',
  },

  statusBorderColor: {
    on_track: 'border-l-accent',
    behind: 'border-l-destructive',
    recovering: 'border-l-muted-foreground',
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
  highlight: 'bg-secondary border-l-4 border-l-accent',
  subtle: 'bg-muted',
};

export const textColors = {
  heading: 'text-foreground',
  body: 'text-foreground',
  muted: 'text-muted-foreground',
  accent: 'text-accent',
  warning: 'text-destructive',
};
