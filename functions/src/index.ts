/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import {onRequest} from "firebase-functions/v2/https";
const { default: next } = require("next");

const app = next({ dev: false, conf: require("../next.config.js") });
const handle = app.getRequestHandler();

exports.nextApp = onRequest(async (req, res) => {
  await app.prepare();
  return handle(req, res);
});