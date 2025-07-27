import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const LandingPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/v1/user/dashboard', {
          withCredentials: true,
        });

        if (res.status === 200 && res.data.user) {
          setUser(res.data.user);
          navigate('/dashboard');
        }
      } catch (err) {
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, []);

  if (checking) return <div className="text-center mt-20 text-white">Checking session...</div>;

  return (
    <>
      <Nav />
      <Hero />
      <Footer />
    </>
  );
};

export default LandingPage;
