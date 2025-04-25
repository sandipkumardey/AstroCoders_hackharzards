// EventX.jsx
import { useState, useEffect } from 'react';
import { 
  User, 
  Ticket, 
  ShoppingBag, 
  ArrowRight, 
  PlusCircle, 
  Search,
  ChevronDown,
  Calendar,
  MapPin,
  Tag
} from 'lucide-react';

// Mock data for tickets - replace with API call
const mockTickets = [
  {
    id: 1,
    eventName: "Taylor Swift Eras Tour",
    location: "Madison Square Garden, NYC",
    date: "May 15, 2025",
    time: "7:00 PM",
    price: 399,
    category: "Concerts",
    section: "Floor",
    row: "A",
    seat: "15",
    image: "/api/placeholder/800/400"
  },
  {
    id: 2,
    eventName: "NBA Finals Game 3",
    location: "Crypto.com Arena, LA",
    date: "June 8, 2025",
    time: "6:30 PM",
    price: 599,
    category: "Sports",
    section: "Lower Bowl",
    row: "12",
    seat: "7",
    image: "/api/placeholder/800/400"
  },
  {
    id: 3,
    eventName: "Hamilton",
    location: "Richard Rodgers Theatre, NYC",
    date: "May 22, 2025",
    time: "8:00 PM",
    price: 249,
    category: "Theater",
    section: "Orchestra",
    row: "F",
    seat: "103",
    image: "/api/placeholder/800/400"
  },
  {
    id: 4,
    eventName: "Coldplay Music of the Spheres Tour",
    location: "SoFi Stadium, LA",
    date: "June 20, 2025",
    time: "8:00 PM",
    price: 289,
    category: "Concerts",
    section: "100",
    row: "22",
    seat: "11",
    image: "/api/placeholder/800/400"
  }
];

// API endpoints
const API_BASE_URL = "http://localhost:8000"; // Change this to your API URL
const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  // Add more endpoints as needed for tickets
};

export default function EventX() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mode, setMode] = useState(null); // 'buy' or 'sell'
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tickets, setTickets] = useState(mockTickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [sellTicketData, setSellTicketData] = useState({
    eventName: '',
    location: '',
    date: '',
    time: '',
    price: '',
    section: '',
    row: '',
    seat: '',
    category: 'Concerts'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // Check if user is logged in (e.g., by checking cookies)
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    // In a real app, you would check if the auth cookie exists
    // For now, we'll just check localStorage as an example
    const token = document.cookie.includes('auth_token');
    if (token) {
      setIsLoggedIn(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: 'include', // Important for cookies
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }
      
      setIsLoggedIn(true);
      setShowLogin(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      // Auto login after registration
      await handleLogin(e);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear cookies (in a real app, you'd call a logout endpoint)
    document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setIsLoggedIn(false);
    setMode(null);
  };

  const handleSellTicket = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call
    // Add commission calculation (10%)
    const ticketWithCommission = {
      ...sellTicketData,
      id: tickets.length + 1,
      image: "/api/placeholder/800/400",
      originalPrice: parseFloat(sellTicketData.price),
      price: parseFloat(sellTicketData.price) * 1.1 // Adding 10% commission
    };
    
    setTickets([ticketWithCommission, ...tickets]);
    
    // Reset the form
    setSellTicketData({
      eventName: '',
      location: '',
      date: '',
      time: '',
      price: '',
      section: '',
      row: '',
      seat: '',
      category: 'Concerts'
    });
    
    // Go back to main view
    setMode(null);
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      {/* Header */}
      <header className={`fixed w-full bg-black bg-opacity-50 backdrop-blur-md py-4 px-6 z-20 transition-all duration-500 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Ticket className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">EventX</span>
          </div>
          
          {isLoggedIn ? (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMode('buy')}
                className={`px-4 py-2 rounded-full transition-all ${mode === 'buy' ? 'bg-purple-500 text-white' : 'bg-purple-900 hover:bg-purple-700'}`}
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Buy Tickets
              </button>
              <button 
                onClick={() => setMode('sell')}
                className={`px-4 py-2 rounded-full transition-all ${mode === 'sell' ? 'bg-pink-500 text-white' : 'bg-pink-900 hover:bg-pink-700'}`}
              >
                <Tag className="w-5 h-5 inline mr-2" />
                Sell Tickets
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {setShowLogin(true); setShowRegister(false);}}
                className="px-4 py-2 bg-purple-600 rounded-full hover:bg-purple-500 transition-all"
              >
                Login
              </button>
              <button 
                onClick={() => {setShowRegister(true); setShowLogin(false);}}
                className="px-4 py-2 bg-pink-600 rounded-full hover:bg-pink-500 transition-all"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <div className={`relative h-screen flex items-center justify-center transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black opacity-60"></div>
          <img src="/api/placeholder/1920/1080" alt="Concert background" className="w-full h-full object-cover" />
        </div>
        
        <div className="relative z-10 text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-pulse">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Buy & Sell Event Tickets
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            The safest way to buy and sell tickets for concerts, sports, and theater events
          </p>
          
          {!isLoggedIn && (
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => {setShowLogin(true); setShowRegister(false);}}
                className="px-8 py-3 bg-purple-600 rounded-full text-lg hover:bg-purple-500 transition-all transform hover:scale-105"
              >
                Login to Buy
              </button>
              <button 
                onClick={() => {setShowRegister(true); setShowLogin(false);}}
                className="px-8 py-3 bg-pink-600 rounded-full text-lg hover:bg-pink-500 transition-all transform hover:scale-105"
              >
                Register to Sell
              </button>
            </div>
          )}
          
          {isLoggedIn && (
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => setMode('buy')}
                className="px-8 py-3 bg-purple-600 rounded-full text-lg hover:bg-purple-500 transition-all transform hover:scale-105"
              >
                <ShoppingBag className="w-6 h-6 inline mr-2" />
                Find Tickets
              </button>
              <button 
                onClick={() => setMode('sell')}
                className="px-8 py-3 bg-pink-600 rounded-full text-lg hover:bg-pink-500 transition-all transform hover:scale-105"
              >
                <Tag className="w-6 h-6 inline mr-2" />
                Sell Your Tickets
              </button>
            </div>
          )}
        </div>
        
        {/* Animated scrolling indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white opacity-70" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        {isLoggedIn && mode === 'buy' && (
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-6">Available Tickets</h2>
              <div className="relative mb-6">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for events, venues, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black bg-opacity-50 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            {filteredTickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTickets.map((ticket, index) => (
                  <div 
                    key={ticket.id} 
                    className="bg-black bg-opacity-50 rounded-lg overflow-hidden hover:shadow-xl transition-all hover:transform hover:scale-105 border border-purple-500 border-opacity-50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <img src={ticket.image} alt={ticket.eventName} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-purple-300">{ticket.eventName}</h3>
                        <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-sm">${ticket.price}</span>
                      </div>
                      <div className="flex items-center text-gray-300 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="text-sm">{ticket.date} • {ticket.time}</span>
                      </div>
                      <div className="flex items-center text-gray-300 mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="text-sm">{ticket.location}</span>
                      </div>
                      <div className="text-gray-300 text-sm mb-4">
                        Section {ticket.section}, Row {ticket.row}, Seat {ticket.seat}
                      </div>
                      <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded-full font-medium hover:from-purple-500 hover:to-pink-500 transition-all transform">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-black bg-opacity-50 rounded-lg p-8 text-center">
                <p className="text-xl text-gray-300">No tickets found matching your search.</p>
              </div>
            )}
          </div>
        )}
        
        {isLoggedIn && mode === 'sell' && (
          <div className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="max-w-2xl mx-auto bg-black bg-opacity-50 rounded-lg p-6 border border-pink-500 border-opacity-50">
              <h2 className="text-2xl font-bold mb-6 text-center">List Your Tickets for Sale</h2>
              
              <form onSubmit={handleSellTicket}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
                    <input 
                      type="text" 
                      required
                      value={sellTicketData.eventName}
                      onChange={(e) => setSellTicketData({...sellTicketData, eventName: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                    <select 
                      value={sellTicketData.category}
                      onChange={(e) => setSellTicketData({...sellTicketData, category: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option>Concerts</option>
                      <option>Sports</option>
                      <option>Theater</option>
                      <option>Comedy</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <input 
                      type="text" 
                      required
                      value={sellTicketData.location}
                      onChange={(e) => setSellTicketData({...sellTicketData, location: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                    <input 
                      type="date" 
                      required
                      value={sellTicketData.date}
                      onChange={(e) => setSellTicketData({...sellTicketData, date: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                    <input 
                      type="time" 
                      required
                      value={sellTicketData.time}
                      onChange={(e) => setSellTicketData({...sellTicketData, time: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Your Price ($)</label>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={sellTicketData.price}
                      onChange={(e) => setSellTicketData({...sellTicketData, price: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    {sellTicketData.price && (
                      <p className="text-xs text-gray-400 mt-1">
                        Buyer will pay: ${(parseFloat(sellTicketData.price) * 1.1).toFixed(2)} (includes 10% commission)
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Section</label>
                    <input 
                      type="text" 
                      required
                      value={sellTicketData.section}
                      onChange={(e) => setSellTicketData({...sellTicketData, section: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Row</label>
                    <input 
                      type="text" 
                      required
                      value={sellTicketData.row}
                      onChange={(e) => setSellTicketData({...sellTicketData, row: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Seat</label>
                    <input 
                      type="text" 
                      required
                      value={sellTicketData.seat}
                      onChange={(e) => setSellTicketData({...sellTicketData, seat: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-purple-600 py-3 rounded-full font-medium hover:from-pink-500 hover:to-purple-500 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  <Tag className="w-5 h-5 mr-2" />
                  List Ticket for Sale
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-purple-500 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Login to EventX</h2>
              <button onClick={() => setShowLogin(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-500 text-white px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-800 py-3 rounded-full font-medium hover:from-purple-500 hover:to-purple-700 transition-all flex items-center justify-center"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => {setShowRegister(true); setShowLogin(false);}}
                  className="text-purple-400 hover:text-purple-300"
                >
                  Register here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full border border-pink-500 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create an Account</h2>
              <button onClick={() => setShowRegister(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            
            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-500 text-white px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-800 py-3 rounded-full font-medium hover:from-pink-500 hover:to-pink-700 transition-all flex items-center justify-center"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="mt-4 text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button 
                  onClick={() => {setShowLogin(true); setShowRegister(false);}}
                  className="text-pink-400 hover:text-pink-300"
                >
                  Login here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black bg-opacity-70 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Ticket className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">EventX</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 EventX. The safest way to buy and sell event tickets.
          </p>
        </div>
      </footer>
    </div>
  );
}