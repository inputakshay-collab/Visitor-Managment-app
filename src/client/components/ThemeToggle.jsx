import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('vm_theme') || 'orange'; } catch (e) { return 'orange'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-light', 'theme-orange');
    root.classList.add(theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : 'theme-orange');
    try { localStorage.setItem('vm_theme', theme); } catch (e) {}
  }, [theme]);

  const toggle = () => {
    setTheme(prev => (prev === 'orange' ? 'dark' : prev === 'dark' ? 'light' : 'orange'));
  };

  return (
    <button className="btn btn-sm theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {theme === 'orange' ? '🌇 Orange' : theme === 'dark' ? '🌙 Dark' : '🌤 Light'}
    </button>
  );
}
