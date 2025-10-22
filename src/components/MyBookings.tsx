import { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase, Booking } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface MyBookingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyBookings({ isOpen, onClose }: MyBookingsProps) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      fetchBookings();
    }
  }, [isOpen, user]);

  const fetchBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          room:rooms(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (error) throw error;
      fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
            <p className="text-gray-600 text-sm">Manage your hotel reservations</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">No bookings yet</p>
              <p className="text-gray-500 text-sm mt-2">Start exploring our amazing rooms!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={booking.room?.image_url || 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'}
                        alt={booking.room?.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {booking.room?.name}
                          </h3>
                          <p className="text-sm text-gray-600 capitalize">
                            {booking.room?.type} Room
                          </p>
                        </div>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="capitalize">{booking.status}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar size={16} className="text-emerald-600" />
                          <div className="text-sm">
                            <p className="font-medium">Check-in</p>
                            <p>{new Date(booking.check_in_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Calendar size={16} className="text-emerald-600" />
                          <div className="text-sm">
                            <p className="font-medium">Check-out</p>
                            <p>{new Date(booking.check_out_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users size={16} />
                            <span>{booking.num_guests} guests</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign size={16} />
                            <span className="font-semibold text-emerald-600">
                              ${booking.total_price}
                            </span>
                          </div>
                        </div>

                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>

                      {booking.special_requests && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 font-medium mb-1">Special Requests:</p>
                          <p className="text-sm text-gray-700">{booking.special_requests}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
