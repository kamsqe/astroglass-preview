/**
 * Luxury Interactions (v17.0)
 * Premium micro-interactions for the Liquid Glass theme.
 */

// Spotlight Effect causing a localized glow to follow the cursor
export class Spotlight {
  constructor(selector = '.js-spotlight') {
    this.targets = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    this.targets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
}

// Magnetic Button Effect
export class Magnetic {
  constructor(selector = '.js-magnetic', strength = 20) {
    this.targets = document.querySelectorAll(selector);
    this.strength = strength;
    this.init();
  }

  init() {
    // Only enable on desktop
    if (window.matchMedia('(hover: none)').matches) return;

    this.targets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        el.style.transform = `translate(${x / this.strength}px, ${y / this.strength}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0)';
      });
    });
  }
}

// Staggered Scroll Reveal
export class ScrollReveal {
  constructor(selector = '.js-reveal', options = {}) {
    this.targets = document.querySelectorAll(selector);
    this.options = { 
      threshold: 0.1, 
      rootMargin: '0px 0px -50px 0px',
      ...options 
    };
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, this.options);

    this.targets.forEach(target => {
      // Add base styles if not present
      if (!target.classList.contains('reveal-base')) {
        target.style.opacity = '0';
        target.style.transform = 'translateY(20px)';
        target.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      }
      observer.observe(target);
    });

    // Add CSS class for visible state
    const style = document.createElement('style');
    style.innerHTML = `
      .is-visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
  }
}

// Parallax Effect (v17.1)
export class Parallax {
  constructor(selector = '.js-parallax', speed = 0.5) {
    this.targets = document.querySelectorAll(selector);
    this.speed = speed;
    this.init();
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      this.targets.forEach(el => {
        const offset = (el.getBoundingClientRect().top + scrolled) * this.speed;
        // Calculate relative movement
        const yPos = -(scrolled * this.speed);
        el.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    });
  }
}

// Staggered Text Reveal (v17.1)
// Splits text into words and reveals them one by one
export class TextReveal {
  constructor(selector = '.js-text-reveal', options = {}) {
    this.targets = document.querySelectorAll(selector);
    this.options = { threshold: 0.2, ...options };
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, this.options);

    this.targets.forEach(el => {
      const text = el.textContent.trim();
      el.innerHTML = '';
      el.style.opacity = '1'; // Ensure container is visible

      // Split by words
      const words = text.split(' ');
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100%)';
        span.style.transition = `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`;
        el.appendChild(span);
      });

      observer.observe(el);
    });

    // Add revelation definition
    const style = document.createElement('style');
    style.innerHTML = `
      .js-text-reveal.is-revealed span {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    if (!document.getElementById('text-reveal-style')) {
      style.id = 'text-reveal-style';
      document.head.appendChild(style);
    }
  }
}
