let warned = false;

export default function warnMigratePathConfig() {
  if (warned) {
    return;
  }

  warned = true;

  console.warn(
    [
      "The shape of the configuration object for linking has changed. Please update the configuration to move the screens to a property 'screens' and make sure that the shape of the object matches the nesting of your navigators.",
      'Instead of:',
      '  {',
      "    Home: '',",
      "    Profile: 'profile',",
      "    Settings: 'settings',",
      '  }',
      'Do:',
      '  {',
      '    legacy: true,',
      '    screens: {',
      "      Home: '',",
      "      Profile: 'profile',",
      "      Settings: 'settings',",
      '    }',
      '  }',
    ].join('\n')
  );
}
