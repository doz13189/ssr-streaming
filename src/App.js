import React, { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  return (
    <Html title="Hello">
      <Suspense fallback={<>Loading</>}>
        <ErrorBoundary FallbackComponent={<>Error</>}>
          <Content />
        </ErrorBoundary>
      </Suspense>
    </Html>
  );
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function Content() {
  use(sleep(5000));
  return <p>Hello World</p>;
}

function Html({ children, title }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="favicon.ico" />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
