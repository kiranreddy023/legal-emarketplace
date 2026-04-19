import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RegisterCitizenPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const validateForm = () => {
    // Name validation
    if (form.name.trim().length < 3) {
      return "Name must be at least 3 characters";
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.name)) {
      return "Name can only contain letters and spaces";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Invalid email format";
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      return "Phone number must be 10 digits";
    }

    // Password validation
    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
    if (!passwordRegex.test(form.password)) {
      return "Password must contain at least one letter and one number";
    }

    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    const validationError = validateForm();
    if (validationError) {
      setErr(validationError);
      return;
    }

    try {
      console.log('Attempting to register citizen with:', form);
      const { data } = await api.post("/auth/register/citizen", form);
      console.log('Registration successful:', data);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/citizen");
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      setErr(error.response?.data?.error || error.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        margin: "0",
        backgroundImage:
          "url('https://images.pexels.com/photos/5669601/pexels-photo-5669601.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "80px", // adjust based on navbar height
          left: "50%",
          transform: "translateX(-50%)",
          width: "420px",
          background: "rgba(0,0,0,0.55)",
          padding: "30px",
          borderRadius: "18px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
          color: "white",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "25px",
            fontWeight: "700",
          }}
        >
          Register as Citizen
        </h2>

        {err && (
          <div
            style={{
              background: "#ff4d4d",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "10px",
              textAlign: "center",
              fontWeight: "600",
            }}
          >
            {err}
          </div>
        )}

        <form onSubmit={submit}>
          {["name", "email", "phone", "password"].map((key) => (
            <div style={{ marginBottom: "16px" }} key={key}>
              <label style={{ fontWeight: "600", fontSize: "14px" }}>
                {key.toUpperCase()}
              </label>
              <input
                type={key === "password" ? "password" : "text"}
                placeholder={`Enter your ${key}`}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "none",
                  marginTop: "6px",
                  outline: "none",
                  fontSize: "15px",
                }}
              />
            </div>
          ))}

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#1a73e8",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              color: "white",
              fontWeight: "700",
              fontSize: "16px",
              marginTop: "10px",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
