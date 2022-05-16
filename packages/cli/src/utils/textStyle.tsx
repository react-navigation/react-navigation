const BOLD = '\u001b[1m';
const RESET = '\u001b[0m';

export const Colors = {
  yellow: '\u001b[33m',
  green: '\u001b[32m',
  cyan: '\u001b[36m',
  red: '\u001b[31m',
  magenta: '\u001b[35m',
  reset: RESET,
};

export const TextStyle = {
  stepStart: `${RESET}${BOLD}${Colors.cyan}`,
  stepDone: `${RESET}${Colors.green}`,
  failed: `${RESET}${Colors.red}`,
  underline: `${RESET}${Colors.cyan}`,
  command: `${RESET}${Colors.magenta}`,
  highlight: `${RESET}${Colors.cyan}`,
  success: `${RESET}${Colors.green}`,
  green: `${Colors.green}`,
  yellow: `${Colors.yellow}`,
  bold: BOLD,
  reset: RESET,
};
