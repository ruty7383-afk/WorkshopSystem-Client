import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      window.dispatchEvent(new Event("auth-changed"));

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "ההתחברות נכשלה"
      );
    }
  };

  return (
    <div className="page narrow">
      <h1>התחברות</h1>

      <form onSubmit={handleSubmit} className="form">
        <label>
          אימייל
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">התחברות</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Login;

