import { Search, SlidersHorizontal } from 'lucide-react';

interface RoomFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
}

export function RoomFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  priceRange,
  onPriceRangeChange,
}: RoomFiltersProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <SlidersHorizontal className="text-emerald-600" size={20} />
        <h2 className="text-lg font-semibold text-gray-900">Filter Rooms</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
        >
          <option value="">All Room Types</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="suite">Suite</option>
          <option value="deluxe">Deluxe</option>
        </select>

        <select
          value={priceRange}
          onChange={(e) => onPriceRangeChange(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white"
        >
          <option value="">All Prices</option>
          <option value="0-100">Under $100</option>
          <option value="100-200">$100 - $200</option>
          <option value="200-300">$200 - $300</option>
          <option value="300+">$300+</option>
        </select>
      </div>
    </div>
  );
}
