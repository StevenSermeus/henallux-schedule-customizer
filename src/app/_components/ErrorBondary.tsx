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
      <p>Y a un truc qui a peté mon gars</p>
      <pre>{error.message}</pre>
      <button onClick={reset}>Retry</button>
    </>
  );
}

export default ErrorHandler;
