import { useCallback, useContext } from "react";
import Logo from "./../../assets/images/route.png";
import { Link, Navigate, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faComment,
  faGear,
  faHouse,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../AuthContext/authContext";

const Navbar = () => {
  const { unreadCount, logout, profileData } = useContext(AuthContext);
  const navigate = useNavigate();
  const setUserLogout = useCallback(() => {
    logout();
    navigate("/auth/login");
  }, [logout, navigate]);

  return (
    <header className="flex justify-between items-center bg-base-100 shadow-sm px-3.5 py-2 md:px-10  lg:px-20  fixed top-0 left-0 right-0 z-50">
      {/* Navbar Start */}
        <div className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Logo"
            className="h-9 w-9 rounded-xl object-cover"
          />
          <p className="hidden text-xl font-bold text-slate-900 md:block">
            Route Posts
          </p>
        </div>

      {/* Navbar Center */}
      <div className="flex items-center">
        <nav className="flex min-w-0 items-center gap-1  rounded-2xl border border-slate-200 bg-slate-50/90 px-1 py-1 sm:px-1.5">
          <NavLink
            to="/feed"
            className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
          >
            <FontAwesomeIcon icon={faHouse} />
            <span className="hidden sm:inline">Feed</span>
          </NavLink>

          <NavLink
            to="/profile"
            className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
          >
            <FontAwesomeIcon icon={faUser} />
            <span className="hidden sm:inline">Profile</span>
          </NavLink>

          <NavLink
            to="/notifications"
            className="relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-extrabold transition sm:gap-2 sm:px-3.5 text-slate-600 hover:bg-white/90 hover:text-slate-900"
          >
            <FontAwesomeIcon icon={faComment} />
            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex min-w-4 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-black leading-4 text-white">
                {unreadCount}
              </span>
            )}
            <span className="hidden sm:inline">Notifications</span>
          </NavLink>
        </nav>
      </div>

      {/* Navbar End / Dropdown */}
      <div className=" flex gap-2">
        <div className="dropdown dropdown-end relative">
          {/* Trigger */}
          <button
            tabIndex={0}
            className="flex items-center gap-2 cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-2 py-1.5 hover:bg-slate-100"
          >
            <img
              src={profileData?.photo}
              className="h-8 w-8 rounded-full object-cover "
              alt={profileData?.name}
            />
            <span className="hidden md:block max-w-35 truncate text-sm font-semibold text-slate-800">
              {profileData?.name}
            </span>
            <FontAwesomeIcon icon={faBars} className="text-slate-500 " />
          </button>

          {/* Dropdown Menu */}
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link
                to={"/profile"}
                className="p-2 block rounded font-semibold text-gray-700 tracking-wide"
              >
                <FontAwesomeIcon icon={faUser} /> Profile
              </Link>
            </li>
            <li>
              <Link
                to={"/settings"}
                className="p-2 block rounded font-semibold text-gray-700 tracking-wide border-b border-gray-300"
              >
                <FontAwesomeIcon icon={faGear} /> Settings
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={setUserLogout}
                className="text-red-500 py-2 font-medium hover:bg-red-100 my-1"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
