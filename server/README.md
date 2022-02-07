# Coversy - Server

### Tools

-   [Express](https://www.npmjs.com/package/express)
-   [MongoDB](https://www.mongodb.com)
-   [AWS S3](https://aws.amazon.com/s3/)

### Requirements

This project requires NodeJS (version 8 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/).
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
```

### Installation

```sh
npm i
```

### Configuration

Include the server .env file in the root of this directory.

### Development

```sh
npm run dev
```

### Troubleshooting

Make sure you have the latest version of NodeJS and NPM.

Run the following for missing modules:

```sh
npm i
```

If the dev script is still throwing errors, run the following before trying again:

```sh
npm i -D nodemon
```

For missing environment variables, reach out for a copy of the .env file.