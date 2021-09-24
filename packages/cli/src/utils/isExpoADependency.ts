/**
 * Check for expo in package.json
 */
function isExpoADependency(packageJsonText: string): boolean {
  const parsedContent = JSON.parse(packageJsonText);

  if (
    parsedContent.dependencies?.hasOwnProperty('expo') ||
    parsedContent.devDependencies?.hasOwnProperty('expo')
  ) {
    return true;
  }

  return false;
}

export default isExpoADependency;
