
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold text-indigo-600">
          QuickPoll
        </Link>

        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'text-indigo-600 font-semibold'
                : 'text-gray-600 hover:text-indigo-600'
            }
          >
            Home
          </NavLink>

          <Link
            to="/create"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Create Poll
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
