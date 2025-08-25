import { describe, it, expect } from 'vitest';
import Home from '../routes/Home.jsx';
import Features from '../routes/Features.jsx';
import Packages from '../routes/Packages.jsx';
import Gallery from '../routes/Gallery.jsx';
import About from '../routes/About.jsx';
import Contact from '../routes/Contact.jsx';
import RootLayout from '../routes/RootLayout.jsx';

describe('Ghosthome components compile', () => {
  const components = { Home, Features, Packages, Gallery, About, Contact, RootLayout };
  for (const [name, Comp] of Object.entries(components)) {
    it(`${name} is a function component`, () => {
      expect(typeof Comp).toBe('function');
    });
  }
});