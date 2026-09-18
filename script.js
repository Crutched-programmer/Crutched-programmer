(() => {
  const links = [...document.querySelectorAll('.site-header a[href^="#"]')];
  const sections = [...document.querySelectorAll('.section')];
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeLabel = themeToggle.querySelector('.theme-label');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const themeKey = 'portfolio-theme';

  const updateThemeColor = () => {
    const accent = getComputedStyle(root).getPropertyValue('--active-accent').trim();
    themeColor.setAttribute('content', root.dataset.theme === 'light' ? accent : '#000000');
  };

  const setTheme = theme => {
    const isLight = theme === 'light';
    root.dataset.theme = isLight ? 'light' : 'dark';
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    themeLabel.textContent = isLight ? 'dark' : 'light';
    themeIcon.textContent = isLight ? '◐' : '☼';
    updateThemeColor();
  };

  const savedTheme = localStorage.getItem(themeKey);
  setTheme(savedTheme === 'light' ? 'light' : 'dark');

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem(themeKey, nextTheme);
    setTheme(nextTheme);
  });

  links.forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.08 });

  sections.forEach(section => observer.observe(section));

  // Tiny active-section cue without introducing any extra colours.
  const setActive = () => {
    const y = window.scrollY + 140;
    let current = sections[0];

    for (const section of sections) {
      if (section.offsetTop <= y) current = section;
    }

    root.style.setProperty('--active-accent', getComputedStyle(current).getPropertyValue('--accent').trim());
    updateThemeColor();

    links.forEach(link => {
      link.style.borderColor =
        link.getAttribute('href') === `#${current.id}` ? 'currentColor' : 'transparent';
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();
