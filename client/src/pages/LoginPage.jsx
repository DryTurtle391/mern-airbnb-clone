import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function loginUser(event) {
    event.preventDefault();
    try {
      const response = await axios.post("/login", { email, password });
      if (response.status === 200) {
        setUser(response.data);
        alert("Login Successful!");
        setRedirect(true);
      }
    } catch (e) {
      alert("Unable to Login. Try again later");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-center text-3xl mb-2">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={loginUser}>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="login">Login</button>
          <div className="text-center py-1 text-gray-500">
            Don't have an account yet?
            <Link to={"/register"} className="underline text-black px-1">
              Register Now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
