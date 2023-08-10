import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../src/App";
import { Stream } from "stream";

let assets = {
  "main.js": "/main.js",
};

const ABORT_DELAY = 100000;

function readResult(stream) {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const writable = new Stream.PassThrough();
    writable.setEncoding("utf8");
    writable.on("data", (chunk) => {
      console.log("chunk", chunk);
      buffer += chunk;
    });
    writable.on("error", (error) => {
      reject(error);
    });
    writable.on("end", () => {
      resolve(buffer);
    });
    stream.pipe(writable);
  });
}

module.exports = function render(url, res) {
  res.socket.on("error", (error) => {
    console.error("Fatal", error);
  });
  let didError = false;
  const ssrStream = renderToPipeableStream(<App />);
  readResult(ssrStream).then((result) => {
    console.log(result);
  });
  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: [assets["main.js"]],
    onShellReady() {
      res.statusCode = didError ? 500 : 200;
      res.setHeader("Content-type", "text/html");
      pipe(res);
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
  setTimeout(abort, ABORT_DELAY);
};
