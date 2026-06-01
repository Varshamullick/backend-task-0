import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => (
  <div className="home-page">
    <h1>Simple Task App</h1>
    <p>Login or register to manage tasks with a backend API.</p>
    <div className="home-actions">
      <Link to="/login" className="home-btn">
        Login
      </Link>
      <Link to="/register" className="home-btn home-btn-outline">
        Register
      </Link>
    </div>
  </div>
);

export default Home;
