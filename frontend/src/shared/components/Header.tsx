
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Menu, X } from "lucide-react";
import { auth } from "@/firebase";
import { signOut, onAuthStateChanged} from "firebase/auth";
import type { User } from "firebase/auth";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setGoogleUser] = useState<User | null>(null);

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setGoogleUser(user);
        setIsLoggedIn(true);
      } else {
        setGoogleUser(null);
      }
    });

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); 
    } catch (err) {
      console.error("Google logout failed", err);
    }
    localStorage.clear();
    setIsLoggedIn(false);
    setRole(null);
    setGoogleUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-purple-800/80 to-indigo-900/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center group">
            <Rocket className="h-8 w-8 text-pink-300 mr-2 group-hover:rotate-45 transition-transform" />
            <h1 className="text-2xl font-bold text-white hidden md:block">
              MATCHWISE AI
            </h1>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <h1 className="font-bold text-white">HOME</h1>
            </Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login">
                  <Button className="font-bold bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-white">
                    LOGIN
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="font-bold bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-white">
                    SIGNUP
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {role === "user" && (
                  <Link to="/add-content">
                    <h1 className="font-bold text-white">MY ANALYSIS</h1>
                  </Link>
                )}

                <Button
                  onClick={handleLogout}
                  className="font-bold bg-red-500 hover:bg-red-600 text-white"
                >
                  LOGOUT
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden flex flex-col items-center text-center space-y-4 pb-4">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              <h1 className="font-bold text-white">HOME</h1>
            </Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <Button className="w-40 font-bold bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-white">
                    LOGIN
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)}>
                  <Button className="w-40 font-bold bg-gradient-to-r from-pink-300 to-purple-400 hover:from-pink-400 hover:to-purple-500 text-white">
                    SIGNUP
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {role === "user" && (
                  <Link to="/add-content" onClick={() => setMenuOpen(false)}>
                    <h1 className="font-bold text-white">MY ANALYSIS</h1>
                  </Link>
                )}

                <Button
                  onClick={handleLogout}
                  className="w-40 font-bold bg-red-500 hover:bg-red-600 text-white"
                >
                  LOGOUT
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
