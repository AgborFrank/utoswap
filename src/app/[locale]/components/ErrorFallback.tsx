"use client"; // 👈 Add this

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <div role="alert" className="p-4">
      <h2 className="text-lg font-semibold text-red-600">Something went wrong</h2>
      <pre className="mt-2 text-sm text-gray-500">{error.message}</pre>
    </div>
  );
};

export default ErrorFallback;
