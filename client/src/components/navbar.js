import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("username");
    navigate("/auth");
  };

  return (
    <nav className="menu2">
      <menu>
        <li>
          <NavLink exact="true" to="/" className={window.location.pathname === "/" ? "nav-linkac" : "nav-link"}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/reading-books" className={window.location.pathname === "/reading-books" ? "nav-linkac" : "nav-link"}>
            Reading
          </NavLink>
        </li>
        {!cookies.access_token ? (
          <>
            <li>
              <NavLink to="/auth" className={window.location.pathname === "/auth" ? "nav-linkac" : "nav-link"}>
                Register
              </NavLink>
            </li>
            <li>
              <NavLink to="/signin" className={window.location.pathname === "/signin" ? "nav-linkac" : "nav-link"}>
                Login
              </NavLink>
            </li>
          </>
        ) : (
          <li onClick={logout} className="nav-link logOff">
            LogOut
          </li>
        )}
      </menu>
    </nav>
  );
};
