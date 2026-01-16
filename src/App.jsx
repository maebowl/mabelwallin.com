import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SiteDataProvider } from './data/siteData';
import Layout from './components/Layout';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Design from './pages/Design';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  return (
    <SiteDataProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="portfolio">
            <Route index element={<Home />} />
            <Route path="videos" element={<Videos />} />
            <Route path="designs" element={<Design />} />
          </Route>
          <Route path="videos" element={<Navigate to="/portfolio/videos" replace />} />
          <Route path="designs" element={<Navigate to="/portfolio/designs" replace />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </SiteDataProvider>
  );
}

export default App;
