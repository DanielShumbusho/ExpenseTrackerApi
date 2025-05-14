import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from sessionStorage
    const user = sessionStorage.getItem("credential");
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("credential");
    window.location.href = "/login"; // Redirect to login or homepage
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Profile</h2>
      <div style={styles.card}>
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        {user.role && (
          <p>
            <strong>Role:</strong> {user.role}
          </p>
        )}
        <button onClick={handleLogout} style={styles.button}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    display: "flex",
    justifyContent: "center",
  },
  heading: {
    textAlign: "center",
  },
  card: {
    border: "1px solid #ccc",
    padding: "1.5rem",
    borderRadius: "8px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  button: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#ff4d4d",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Profile;
