const handler = async () => {
  try {
    const pkg = await fetch(
      'https://raw.githubusercontent.com/react-navigation/react-navigation/main/example/package.json'
    ).then((res) => res.json());

    const expo = pkg.dependencies['expo'].replace(/[\^~]/, '').split('.')[0];

    return {
      statusCode: 302,
      headers: {
        Location: `https://expo.dev/@react-navigation/react-navigation-example?serviceType=eas&distribution=expo-go&scheme=exp+react-navigation-example&channel=main&sdkVersion=${expo}.0.0`,
      },
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };
