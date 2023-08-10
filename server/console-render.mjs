import * as React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../src/App";
import { Stream } from "stream";

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

const ssrStream = renderToPipeableStream(<App />);
readResult(ssrStream).then((result) => {
  console.log(result);
});
