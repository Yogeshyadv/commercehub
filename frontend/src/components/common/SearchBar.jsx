import { HiOutlineSearch, HiX } from 'react-icons/hi';

export default function SearchBar({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input type="text" placeholder={placeholder}
        className="w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        value={value} onChange={(e) => onChange(e.target.value)} />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          <HiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}