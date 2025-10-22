import { Hotel, User, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onAuthClick: () => void;
  onMyBookingsClick: () => void;
}

export function Header({ onAuthClick, onMyBookingsClick }: HeaderProps) {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg">
              <Hotel className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                LuxStay Hotels
              </h1>
              <p className="text-xs text-gray-600">Your comfort, our priority</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <button
                  onClick={onMyBookingsClick}
                  className="flex items-center space-x-2 px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Calendar size={18} />
                  <span className="hidden sm:inline font-medium">My Bookings</span>
                </button>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.full_name || 'Guest'}
                    </p>
                    <p className="text-xs text-gray-600">{profile?.role}</p>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all transform hover:scale-105"
              >
                <User size={18} />
                <span className="font-medium">Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
