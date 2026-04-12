/**
 * Color Mapping Utilities
 * Maps quant data to visual colors for consistent, meaningful UI
 */

export const colorMappings = {
  // Mastery level to color
  masteryLevelColor: {
    mastered: 'bg-[#7a8d7e] text-white', // Sage
    proficient: 'bg-[#a89d94] text-white', // Warm grey
    developing: 'bg-[#a88080] text-white', // Dusty rose
    not_started: 'bg-[#d4ccc3] text-[#2a2520]', // Taupe
  },

  // Accuracy percentage to color
  accuracyColor: (percent: number) => {
    if (percent >= 80) return 'text-[#7a8d7e]'; // Sage (high)
    if (percent >= 70) return 'text-[#a89d94]'; // Warm grey (medium)
    if (percent >= 60) return 'text-[#c9b5a0]'; // Warm tan (low)
    return 'text-[#a88080]'; // Dusty rose (very low)
  },

  // Progress bar fill color
  progressBarColor: (percent: number) => {
    if (percent >= 85) return 'bg-[#7a8d7e]'; // Sage
    if (percent >= 70) return 'bg-[#a89d94]'; // Warm grey
    return 'bg-[#a88080]'; // Dusty rose
  },

  // Error category to badge color
  errorCategoryColor: {
    conceptual_misunderstanding: 'bg-[#a88080] text-white', // Dusty rose
    computational_error: 'bg-[#c9b5a0] text-[#2a2520]', // Warm tan
    sign_error: 'bg-[#a88080] text-white', // Dusty rose
    reading_comprehension: 'bg-[#8a7d74] text-white', // Warm grey
    careless_mistake: 'bg-[#d4ccc3] text-[#2a2520]', // Taupe
  },

  // Daily check-in emotion to color
  emotionColor: {
    overwhelmed: 'text-[#a88080]', // Dusty rose
    frustrated: 'text-[#c9b5a0]', // Warm tan
    neutral: 'text-[#a89d94]', // Warm grey
    confident: 'text-[#7a8d7e]', // Sage
  },

  // Study status to border color
  statusBorderColor: {
    on_track: 'border-l-[#7a8d7e]', // Sage (left border for active)
    behind: 'border-l-[#a88080]', // Dusty rose
    recovering: 'border-l-[#c9b5a0]', // Warm tan
  },
};

// Button style mappings
export const buttonStyles = {
  primary: 'bg-[#3d2f3f] hover:bg-[#5a4a5c] text-[#faf8f3]', // Plum
  secondary: 'bg-[#ede8df] hover:bg-[#d4ccc3] text-[#3d2f3f]', // Sand
  outlined: 'border border-[#d4ccc3] text-[#3d2f3f] hover:bg-[#f5f1e8]', // Taupe border
  ghost: 'text-[#3d2f3f] hover:bg-[#f5f1e8]', // Plum text on hover bg
};

// Card style mappings
export const cardStyles = {
  default: 'bg-white border border-[#e8e3db]', // Off-white bg, sand border
  highlight: 'bg-[#f5f1e8] border-l-4 border-l-[#7a8d7e]', // Off-white with sage left border
  subtle: 'bg-[#ede8df]', // Sand background
};

// Text color mappings
export const textColors = {
  heading: 'text-[#3d2f3f]', // Plum
  body: 'text-[#2a2520]', // Foreground
  muted: 'text-[#a89d94]', // Warm grey
  accent: 'text-[#7a8d7e]', // Sage
  warning: 'text-[#a88080]', // Dusty rose
};
