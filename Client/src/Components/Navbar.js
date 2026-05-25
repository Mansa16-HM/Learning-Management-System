import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>LMS</h2>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/courses" style={styles.link}>Courses</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/contact" style={styles.link}>Contact</Link>
      </div>

      <div style={styles.auth}>
        <Link to="/signup" style={styles.button}>Create Account</Link>
        <Link to="/login" style={styles.button}>Login</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#111",
    color: "white"
  },
  logo: {
    margin: 0
  },
  links: {
    display: "flex",
    gap: "15px"
  },
  auth: {
    display: "flex",
    gap: "10px"
  },
  link: {
    color: "white",
    textDecoration: "none"
  },
  button: {
    color: "white",
    textDecoration: "none",
    padding: "5px 10px",
    border: "1px solid white",
    borderRadius: "5px"
  }
};

export default Navbar;