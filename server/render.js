import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../src/App";

let assets = {
  "main.js": "/main.js",
};

const ABORT_DELAY = 100000;

module.exports = function render(url, res) {
  res.socket.on("error", (error) => {
    console.error("Fatal", error);
  });
  let didError = false;

  const ssrStream = renderToPipeableStream(<App />, {
    bootstrapScripts: [assets["main.js"]],
    onShellReady() {
      res.statusCode = didError ? 500 : 200;
      res.setHeader("Content-type", "text/html");
      ssrStream.pipe(res);
    },
    onShellError(x) {
      res.statusCode = 500;
      res.send("<!doctype><p>Error</p>");
    },
    onError(x) {
      didError = true;
      console.error(x);
    },
  });

  setTimeout(ssrStream.abort, ABORT_DELAY);
};
