import { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { RoomFilters } from './components/RoomFilters';
import { RoomCard } from './components/RoomCard';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { MyBookings } from './components/MyBookings';
import { supabase, Room } from './lib/supabase';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    filterRooms();
  }, [rooms, searchTerm, selectedType, priceRange]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('price_per_night', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRooms = () => {
    let filtered = [...rooms];

    if (searchTerm) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter((room) => room.type === selectedType);
    }

    if (priceRange) {
      filtered = filtered.filter((room) => {
        const price = room.price_per_night;
        if (priceRange === '0-100') return price < 100;
        if (priceRange === '100-200') return price >= 100 && price < 200;
        if (priceRange === '200-300') return price >= 200 && price < 300;
        if (priceRange === '300+') return price >= 300;
        return true;
      });
    }

    setFilteredRooms(filtered);
  };

  const handleBookClick = (room: Room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Header
        onAuthClick={() => setAuthModalOpen(true)}
        onMyBookingsClick={() => setMyBookingsOpen(true)}
      />

      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="text-emerald-600" size={32} />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Discover Your Perfect Stay
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience luxury and comfort in our carefully curated selection of premium hotel rooms
            </p>
          </div>

          <RoomFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-600 border-t-transparent"></div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No rooms found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('');
                  setPriceRange('');
                }}
                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} onBookClick={handleBookClick} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="font-semibold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              LuxStay Hotels
            </p>
            <p className="text-sm">Premium accommodations for unforgettable experiences</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        room={selectedRoom}
        onSuccess={handleBookingSuccess}
      />

      <MyBookings
        isOpen={myBookingsOpen}
        onClose={() => setMyBookingsOpen(false)}
      />

      {showSuccess && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl animate-bounce">
          <p className="font-semibold">Booking confirmed successfully!</p>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
