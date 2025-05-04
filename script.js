document.addEventListener("DOMContentLoaded", function () {
  // ===== Mobile Menu Toggle =====
  const menuBtn = document.querySelector(".menu-btn");
  const closeBtn = document.querySelector(".close-btn");
  const mobileMenu = document.querySelector(".mobile-menu");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

  // Toggle mobile menu
  const toggleMenu = () => {
    mobileMenu.classList.toggle("active");
    document.body.style.overflow = mobileMenu.classList.contains("active")
      ? "hidden"
      : "";
  };

  menuBtn.addEventListener("click", toggleMenu);
  closeBtn.addEventListener("click", toggleMenu);

  // Close menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (mobileMenu.classList.contains("active")) {
        toggleMenu();
      }
    });
  });

  // ===== Smooth Scrolling =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Update URL without page jump
        history.pushState(null, null, targetId);
      }
    });
  });

  // ===== Sticky Header on Scroll =====
  const header = document.querySelector("header");
  const headerScrollHandler = () => {
    header.style.boxShadow =
      window.scrollY > 100 ? "0 5px 15px rgba(0, 0, 0, 0.1)" : "none";
  };

  // Initial check
  headerScrollHandler();
  window.addEventListener("scroll", headerScrollHandler);

  // ===== Form Submission =====
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;

      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        // Get form data
        const formData = new FormData(this);
        const response = await fetch(
          "https://script.google.com/macros/s/AKfycbwU3P9oHN89yWTPMGgsiVfIjKSw5haPfZ1aCnMJDt7FVI8rhuBCTqZGLZtkoaknt4XI-g/exec",
          {
            method: "POST",
            body: formData,
          }
        );

        if (response.ok) {
          // Show success message
          const successMsg = document.createElement("div");
          successMsg.className = "form-success";
          successMsg.textContent = "Thank you! Your message has been sent.";
          successMsg.style.cssText = `
                        background: #4CAF50;
                        color: white;
                        padding: 15px;
                        border-radius: 5px;
                        margin-top: 20px;
                        text-align: center;
                    `;

          contactForm.appendChild(successMsg);
          contactForm.reset();

          // Remove message after 5 seconds
          setTimeout(() => {
            successMsg.remove();
          }, 5000);
        } else {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(
          "There was a problem sending your message. Please try again later."
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // ===== Active Nav Link Based on Scroll =====
  const sections = document.querySelectorAll("section");
  const updateActiveLink = () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  };

  // Initial check and scroll listener
  updateActiveLink();
  window.addEventListener("scroll", debounce(updateActiveLink));

  // ===== Project Card Hover Effect for Touch Devices =====
  const projectCards = document.querySelectorAll(".project-card");
  projectCards.forEach((card) => {
    card.addEventListener("touchstart", function () {
      this.classList.add("hover");
    });

    card.addEventListener("touchend", function () {
      this.classList.remove("hover");
    });
  });

  // ===== Debounce Function for Performance =====
  function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  // ===== Lazy Loading Images =====
  if ("loading" in HTMLImageElement.prototype) {
    // Native lazy loading supported
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach((img) => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback for browsers without native lazy loading
    const lazyLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "200px 0px",
      }
    );

    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      lazyLoadObserver.observe(img);
    });
  }

  // ===== Scroll Reveal Animation =====
  const scrollReveal = ScrollReveal({
    origin: "bottom",
    distance: "40px",
    duration: 1000,
    reset: false,
    easing: "cubic-bezier(0.5, 0, 0, 1)",
  });

  scrollReveal.reveal(".home-content, .section-title", {
    interval: 200,
    delay: 300,
  });

  scrollReveal.reveal(".project-card", {
    interval: 200,
    delay: 200,
    mobile: false,
  });

  // ===== Service Worker Registration (Progressive Web App) =====
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful");
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed: ", err);
        });
    });
  }

  // creating links dynamically in JavaScript:
  const link = document.createElement("a");
  link.href = "https://example.com";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "View Demo";
});
