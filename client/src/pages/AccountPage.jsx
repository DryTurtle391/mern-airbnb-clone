import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(false);

  const { user, ready, setUser } = useContext(UserContext);
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  if (!ready) {
    return "Loading...";
  }
  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  async function logout(event) {
    event.preventDefault();
    try {
      const response = await axios.post("/logout");
      if (response) {
        setRedirect(true);
        setUser(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function LinkClasses(type = null) {
    let classes = "py-2 px-5" + " ";
    if (type === subpage) {
      classes += "bg-primary text-white rounded-full";
    }
    return classes;
  }

  return (
    <div>
      <nav className="flex w-full mt-8 justify-center gap-2 mb-8">
        <Link className={LinkClasses("profile")} to={"/account"}>
          My Profile
        </Link>
        <Link className={LinkClasses("bookings")} to={"/account/bookings"}>
          My Bookings
        </Link>
        <Link className={LinkClasses("places")} to={"/account/places"}>
          My Accommodations
        </Link>
      </nav>
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button
            onClick={logout}
            className="bg-gray-500 text-white border border-gray-300 rounded-full py-2 px-5 mt-5"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
