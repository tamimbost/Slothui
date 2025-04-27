((window, document) => {
  "use strict";

  /**
   * slothuiApp - Main Application Object
   */
  const slothuiApp = {

    /**
     * Initialize all application methods
     */
    init() {
      try {
        this.setBackgroundImages();
        this.setHeaderSticky();
        this.setupMobileMenu();
        this.setupScrollAnimations();
        this.setupCounter();
        this.setTab();
        this.setupTestimonials();
        this.setupFaq();
        this.setupTopToScroll();
        this.setupPreLoader();
      } catch (error) {
        console.error('Initialization Error:', error);
      }
    },


    /**
     * Setup Site Preloader
     */
    setupPreLoader(){
      window.addEventListener("load", function () {
        var preloader = document.getElementById("slothui__preloader");
        setTimeout(function () {
          preloader.style.transition = "opacity 300ms";
          preloader.style.opacity = "0";
          setTimeout(function () {
            preloader.style.display = "none";
          }, 300); // Match fade out duration
        }, 500); // Delay before starting fade out
      });
    },

    /**
     * Set background images for elements with [data-background] attribute
     */
    setBackgroundImages() {
      const elements = document.querySelectorAll('[data-background]');
      if (!elements.length) {
        console.warn('No elements found with [data-background] attribute.');
        return;
      }

      elements.forEach(el => {
        const bg = el.getAttribute('data-background');
        if (bg) {
          el.style.backgroundImage = `url("${bg}")`;
        }
      });
    },

    /**
     * Set Header Sticky Class on Scroll
     */
    setHeaderSticky() {
      const header = document.querySelector('.slothui__header-area');
      if (!header) return;

      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        if (scrollTop > 100) {
          header.classList.add('slothui__header-sticky');
        } else {
          header.classList.remove('slothui__header-sticky');
        }
      });
    },

    /**
     * Setup Counter Up Animation
     */
    setupCounter() {
      const counters = document.querySelectorAll('.slothui__counter');
      if (!counters.length) return;

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = target % 1 !== 0;
            let start = 0;
            const duration = 1000;
            let startTime = null;

            const animate = (timestamp) => {
              if (!startTime) startTime = timestamp;
              const progress = timestamp - startTime;
              const rate = Math.min(progress / duration, 1);

              const currentValue = start + (target - start) * rate;
              counter.innerText = isDecimal ? currentValue.toFixed(2) : Math.ceil(currentValue);

              if (progress < duration) {
                requestAnimationFrame(animate);
              } else {
                counter.innerText = isDecimal ? target.toFixed(2) : target;
              }
            };

            counter.classList.add('active');
            counter.innerText = isDecimal ? "0.00" : "0";
            requestAnimationFrame(animate);
            observer.unobserve(entry.target);
          }
        });
      }, { root: null, threshold: 0.5 });

      counters.forEach(counter => observer.observe(counter));
    },

    /**
     * Setup Tab Switching
     */
    setTab() {
      const tabs = document.querySelectorAll('.slothui__tab');
      const images = document.querySelectorAll('.slothui__tab-img');
      if (!tabs.length || !images.length) return;

      tabs.forEach(tab => {
        tab.addEventListener('click', function () {
          tabs.forEach(t => t.classList.remove('slothui__active'));
          this.classList.add('slothui__active');

          const tabNumber = this.getAttribute('data-tab');
          images.forEach(img => img.classList.remove('slothui__active'));

          const activeImage = document.querySelector(`.slothui__tab-img[data-tab="${tabNumber}"]`);
          if (activeImage) {
            activeImage.classList.add('slothui__active');
          }
        });
      });
    },

    /**
     * Setup Faq Open/Close functionality
     */
    setupFaq(){
      const faqItems = document.querySelectorAll('.slothui__faq-item');
            
      faqItems.forEach(item => {
          const question = item.querySelector('.slothui__faq-question');
          
          question.addEventListener('click', () => {
              // Check if the clicked item is already active
              const isActive = item.classList.contains('slothui__active');
              
              // Close all items
              faqItems.forEach(faqItem => {
                  faqItem.classList.remove('slothui__active');
              });
              
              // If the clicked item wasn't active, open it
              if (!isActive) {
                  item.classList.add('slothui__active');
              }
          });
      });
    },

    /**
     * Setup Testimonial Load More functionality
     */
    setupTestimonials() {
      const testimonialGroups = document.querySelectorAll('.slothui__testimonial-area__items');
      const loadMoreButton = document.querySelector('.slothui__show-hide-btn');

      if (!testimonialGroups.length) {
        console.warn('No testimonial groups found.');
        return;
      }
      if (!loadMoreButton) {
        console.warn('Load More button not found.');
        return;
      }

      const loadMoreIcon = loadMoreButton.querySelector('i') || null;
      let visibleIndex = 0;
      const totalGroups = testimonialGroups.length;

      function updateVisibility() {
        testimonialGroups.forEach((group, index) => {
          group.style.display = index <= visibleIndex ? 'block' : 'none';
        });

        if (loadMoreIcon) {
          if (visibleIndex >= totalGroups - 1) {
            loadMoreIcon.classList.remove('fa-plus');
            loadMoreIcon.classList.add('fa-minus');
          } else {
            loadMoreIcon.classList.remove('fa-minus');
            loadMoreIcon.classList.add('fa-plus');
          }
        }
      }

      function toggleVisibility() {
        if (visibleIndex < totalGroups - 1) {
          visibleIndex++;
        } else {
          visibleIndex = 0;
        }
        updateVisibility();
      }

      function handleResize() {
        if (window.innerWidth <= 991) {
          visibleIndex = 0;
          updateVisibility();
          loadMoreButton.style.display = 'block';
        } else {
          testimonialGroups.forEach(group => {
            group.style.display = 'block';
          });
          loadMoreButton.style.display = 'none';
        }
      }

      handleResize();

      loadMoreButton.addEventListener('click', (e) => {
        e.preventDefault();
        toggleVisibility();
      });

      window.addEventListener('resize', handleResize);
    },

    /**
     * Setup Top To Scroll functionality
     */
    setupTopToScroll(){
      var scrollPath = document.querySelector(".scroll-up path");
      var pathLength = scrollPath.getTotalLength();
  
      scrollPath.style.transition = "none";
      scrollPath.style.strokeDasharray = pathLength + " " + pathLength;
      scrollPath.style.strokeDashoffset = pathLength;
  
      scrollPath.getBoundingClientRect(); // Trigger layout
  
      scrollPath.style.transition = "stroke-dashoffset 10ms linear";
  
      function updateScroll() {
        var scroll = window.scrollY;
        var height = document.documentElement.scrollHeight - window.innerHeight;
        var scrollOffset = pathLength - (scroll * pathLength) / height;
        scrollPath.style.strokeDashoffset = scrollOffset;
      }
  
      updateScroll();
      window.addEventListener("scroll", updateScroll);
  
      var offset = 50;
      var duration = 550;
  
      window.addEventListener("scroll", function () {
        var scrollUp = document.querySelector(".scroll-up");
        if (window.scrollY > offset) {
          scrollUp.classList.add("active-scroll");
        } else {
          scrollUp.classList.remove("active-scroll");
        }
      });
  
      document.querySelector(".scroll-up").addEventListener("click", function (event) {
        event.preventDefault();
        scrollToTop(duration);
      });
  
      function scrollToTop(duration) {
        var start = window.scrollY;
        var startTime = performance.now();
  
        function animateScroll(currentTime) {
          var elapsed = currentTime - startTime;
          var progress = Math.min(elapsed / duration, 1);
          var ease = 1 - Math.pow(1 - progress, 3); // Ease out
          window.scrollTo(0, start * (1 - ease));
  
          if (progress < 1) {
            requestAnimationFrame(animateScroll);
          }
        }
  
        requestAnimationFrame(animateScroll);
      }
    },
    

    /**
     * Setup Mobile Menu Open/Close functionality
     */
    setupMobileMenu() {
      const mobileMenu = document.querySelector('.slothui__mobile-menu');
      const openBtn = document.querySelector('.slothui__mobile-menu-bar');
      const closeBtn = document.querySelector('.slothui__close-btn');
      const overlay = document.querySelector('.slothui__overlay');
      const body = document.body;

      if (!mobileMenu || !openBtn || !closeBtn || !overlay) {
        console.warn('Mobile menu elements are missing.');
        return;
      }

      const openMenu = () => {
        if (window.innerWidth <= 768) {
          mobileMenu.classList.add('active');
          overlay.classList.add('active');
          body.style.overflow = 'hidden';
        }
      };

      const closeMenu = () => {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
      };

      openBtn.addEventListener('click', openMenu);
      closeBtn.addEventListener('click', closeMenu);
      overlay.addEventListener('click', closeMenu);

      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          closeMenu();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeMenu();
        }
      });
    },

    /**
     * Setup Scroll Animations
     */
    setupScrollAnimations() {
      const animatedElements = document.querySelectorAll('.slothui__animate');
      if (!animatedElements.length) return;

      const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= (window.innerHeight - 100) && rect.bottom >= 0;
      };

      const animateOnScroll = () => {
        animatedElements.forEach(element => {
          if (isInViewport(element)) {
            element.classList.add('active');
          }
        });
      };

      window.addEventListener('scroll', animateOnScroll);
      animateOnScroll();
    },

  };

  /**
   * DOM Ready Initialization
   */
  document.addEventListener('DOMContentLoaded', () => {
    slothuiApp.init();
  });

})(window, document);
