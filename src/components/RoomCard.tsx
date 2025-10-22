import { Users, Wifi, Tv, Coffee, Eye } from 'lucide-react';
import { Room } from '../lib/supabase';

interface RoomCardProps {
  room: Room;
  onBookClick: (room: Room) => void;
}

const amenityIcons: Record<string, any> = {
  WiFi: Wifi,
  'Smart TV': Tv,
  TV: Tv,
  'Coffee Maker': Coffee,
};

export function RoomCard({ room, onBookClick }: RoomCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img
          src={room.image_url || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-sm font-semibold text-emerald-600">${room.price_per_night}/night</span>
        </div>
        <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase">
          {room.type}
        </div>
        {!room.is_available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>

        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Users size={16} />
            <span>Up to {room.max_guests} guests</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity, index) => {
            const Icon = amenityIcons[amenity] || Eye;
            return (
              <div
                key={index}
                className="flex items-center space-x-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs"
              >
                <Icon size={12} />
                <span>{amenity}</span>
              </div>
            );
          })}
          {room.amenities.length > 4 && (
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
              +{room.amenities.length - 4} more
            </div>
          )}
        </div>

        <button
          onClick={() => onBookClick(room)}
          disabled={!room.is_available}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {room.is_available ? 'Book Now' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}
