export default function Loader({ size = 'md', text = 'Loading...', fullScreen = false }) {
  const sizeMap = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16' };

  const content = (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className={`animate-spin ${sizeMap[size]} text-primary-600`} fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">{content}</div>;
  }
  return content;
}