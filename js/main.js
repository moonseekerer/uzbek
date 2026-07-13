document.addEventListener('DOMContentLoaded', () => {
  // 1. Header Scroll Effect
  const header = document.querySelector('header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // 2. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileClose = document.querySelector('.mobile-nav-close');
  const overlay = document.querySelector('.overlay');

  const openMobileMenu = () => {
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable background scroll
  };

  const closeMobileMenu = () => {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable background scroll
  };

  if (hamburger) hamburger.addEventListener('click', openMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // 3. Scroll Animations (Intersection Observer)
  const animElements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fadeInUp', 'animated');
        observer.unobserve(entry.target); // Animates only once
      }
    });
  }, observerOptions);

  animElements.forEach(el => {
    observer.observe(el);
  });

  // 4. Hero Banner Slider (Pure JS Fade Slider)
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 seconds
  let sliderTimer;

  const showSlide = (n) => {
    if (slides.length === 0) return;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => {
    showSlide(currentSlide + 1);
  };

  const startSlider = () => {
    if (slides.length === 0) return;
    sliderTimer = setInterval(nextSlide, slideInterval);
  };

  const resetSliderTimer = () => {
    clearInterval(sliderTimer);
    startSlider();
  };

  if (slides.length > 0) {
    showSlide(0);
    startSlider();

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        showSlide(index);
        resetSliderTimer();
      });
    });
  }

  // 5. Project Showcase Carousel / Gallery Slider
  const track = document.querySelector('.carousel-track');
  const cards = document.querySelectorAll('.carousel-card');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (track && cards.length > 0) {
    let index = 0;
    
    const getVisibleCardsCount = () => {
      if (window.innerWidth > 1024) return 3;
      if (window.innerWidth > 768) return 2;
      return 1;
    };

    const updateCarousel = () => {
      const cardWidth = cards[0].getBoundingClientRect().width;
      const gap = 24; // Match CSS grid gap
      const visibleCards = getVisibleCardsCount();
      const maxIndex = cards.length - visibleCards;
      
      if (index > maxIndex) index = maxIndex;
      if (index < 0) index = 0;

      track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
      
      // Update button disabled states
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index >= maxIndex;
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        index++;
        updateCarousel();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        index--;
        updateCarousel();
      });
    }

    window.addEventListener('resize', updateCarousel);
    updateCarousel(); // Initial setting
  }

  // 6. Language Switcher Redirection
  const langSelect = document.querySelector('.lang-select');
  if (langSelect) {
    const href = window.location.href;
    
    // Set initial value of dropdown based on URL
    if (href.includes('/en/')) {
      langSelect.value = 'en';
    } else if (href.includes('/uz/')) {
      langSelect.value = 'uz';
    } else {
      langSelect.value = 'ko';
    }

    langSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      const currentUrl = window.location.href;
      
      // Determine current language from URL
      let currentLang = 'ko';
      if (currentUrl.includes('/en/')) currentLang = 'en';
      else if (currentUrl.includes('/uz/')) currentLang = 'uz';
      
      if (selectedLang === currentLang) return;
      
      // Determine page depth and filename
      const isSubPage = currentUrl.includes('/sub/');
      
      // Get the filename (e.g. index.html or greeting.html)
      const pathname = window.location.pathname;
      const filename = pathname.substring(pathname.lastIndexOf('/') + 1) || 'index.html';
      
      let relativePrefix = '';
      if (currentLang === 'ko') {
        relativePrefix = isSubPage ? '../' : '';
      } else {
        relativePrefix = isSubPage ? '../../' : '../';
      }
      
      let targetPath = '';
      if (selectedLang === 'ko') {
        targetPath = isSubPage ? `${relativePrefix}sub/${filename}` : `${relativePrefix}${filename}`;
      } else if (selectedLang === 'en') {
        targetPath = isSubPage ? `${relativePrefix}en/sub/${filename}` : `${relativePrefix}en/${filename}`;
      } else if (selectedLang === 'uz') {
        targetPath = isSubPage ? `${relativePrefix}uz/sub/${filename}` : `${relativePrefix}uz/${filename}`;
      }
      
      window.location.href = targetPath;
    });
  }
});
