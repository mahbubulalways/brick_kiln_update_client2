export default function UnderConstruction() {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-gray-800">
        🚧 This page is under construction
      </h1>

      <p className="mt-3 text-gray-500 text-lg">
        We&apos;re working on it. Please check back soon.
      </p>

      <div className="mt-8 flex gap-2">
        <span className="h-3 w-3 animate-bounce rounded-full bg-green-600 [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-green-600 [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-bounce rounded-full bg-green-600" />
      </div>
    </div>
  );
}
