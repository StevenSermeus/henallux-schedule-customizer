"use client";
import React from "react";
function ErrorHandler({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <p>Something went wrong :c</p>
      <pre>{error.message}</pre>
      <button onClick={reset}>Retry</button>
    </>
  );
}

export default ErrorHandler;
