# React Navigation Website


## Basic Auth

We have basic auth on the website while the repo is private.

User: `navigate` Pass: `navigate`.

## Dev Mode

To run the website in development mode:

```sh
cd react-navigation
npm run build
cd website
npm start
```

## Test Server Rendering

To run the website in server prod mode with server rendering:

```sh
cd react-navigation
npm run build
cd website
npm run prod
```

This will start the production server on [port 3000](http://localhost:3000).


## Rebuild Docs

When docs change, the following command must be run again to copy the docs into the website:

```sh
cd react-navigation
npm run build-docs
# OR, do a full build:
npm run build
```
