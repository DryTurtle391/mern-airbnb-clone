import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(event) {
    event.preventDefault();
    try {
      const response = await axios.post("/register", {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        alert("Registration Successful! You can login now");
      }
    } catch (e) {
      console.log(e);
      //alert(e.response.data.errors.message);
      alert("Registration Failed. Try again later");
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-center text-3xl mb-2">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
          <button className="primary">Register</button>
          <div className="text-center py-1 text-gray-500">
            Already a Member?
            <Link to={"/login"} className="underline text-black px-1">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
