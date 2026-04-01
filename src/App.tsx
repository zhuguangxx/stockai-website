import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Hardware from './sections/Hardware';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';
import Login from './admin/Login';
import AdminPanel from './admin/AdminPanel';

// 首页组件
function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Hardware />
      <FAQ />
      <Footer />
    </main>
  );
}

// App组件
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
