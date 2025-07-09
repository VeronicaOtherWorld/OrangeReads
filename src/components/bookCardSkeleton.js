export default function BookCardSketleton() {
  return (
    <div className="w-[220px] h-[360px] bg-gray-50 rounded-2xl animate-pulse shadow-inner">
      <div className="w-full h-4/6 bg-gray-300 rounded-t-2xl"></div>
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
}
