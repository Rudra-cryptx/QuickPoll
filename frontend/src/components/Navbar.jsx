
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">Q</span>
          QuickPoll
        </Link>

        <div className="nav-links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Home
          </NavLink>

          <Link
            to="/create"
            className="nav-cta"
          >
            Create Poll
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
