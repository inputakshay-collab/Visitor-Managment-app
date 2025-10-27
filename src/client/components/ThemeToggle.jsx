import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('vm_theme') || 'orange'; } catch (e) { return 'orange'; }
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const clazz = theme === 'dark' ? 'theme-dark' : theme === 'light' ? 'theme-light' : 'theme-orange';
    // remove previous classes and add to both html and body as a fallback
    ['theme-dark', 'theme-light', 'theme-orange'].forEach(c => {
      root.classList.remove(c);
      body.classList.remove(c);
    });
    root.classList.add(clazz);
    body.classList.add(clazz);
    try { localStorage.setItem('vm_theme', theme); } catch (e) {}
    // debug: log applied theme (visible in browser console)
    try { console.debug('[ThemeToggle] applied theme:', clazz); } catch (e) {}
  }, [theme]);

  const toggle = () => {
    setTheme(prev => {
      const next = (prev === 'orange' ? 'dark' : prev === 'dark' ? 'light' : 'orange');
      try { console.debug('[ThemeToggle] switching', prev, '->', next); } catch (e) {}
      return next;
    });
  };

  return (
    <button className="btn btn-sm theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {theme === 'orange' ? '🌇 Orange' : theme === 'dark' ? '🌙 Dark' : '🌤 Light'}
    </button>
  );
}
