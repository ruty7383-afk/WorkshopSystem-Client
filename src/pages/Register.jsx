import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // קודם הרשמה
      await apiClient.post("/api/auth/register", form);

      // מיד אחר כך התחברות
      const loginResponse = await apiClient.post(
        "/api/auth/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      // שמירת הטוקן
      localStorage.setItem(
        "token",
        loginResponse.data.token
      );

      window.dispatchEvent(
        new Event("auth-changed")
      );

      // מעבר ישירות לאתר
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.title ||
        "ההרשמה נכשלה"
      );
    }
  };

  return (
    <div className="page narrow">
      <h1>הרשמה</h1>

      <form onSubmit={handleSubmit} className="form">
        <label>
          שם
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          אימייל
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          סיסמה
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          אימות סיסמה
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit">
          הרשמה
        </button>
      </form>

      {error && (
        <p className="error">{error}</p>
      )}
    </div>
  );
}

export default Register;

