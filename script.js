//Theme colors of tailwind
tailwind.config = {
    theme: {
        extend: {
            colors: {
                msqBlue: '#163c6d',
                msqGray: '#a1a2b4',
                msqDark: '#535456',
                msqBlack: '#1a1a1a',
            },
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            }
        }
    }
}
// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

// ----------------------------------------------------
// 1. PAGE TRANSITION (FADE IN)
// ----------------------------------------------------
window.addEventListener("load", () => {
    // Add class to body to trigger CSS opacity transition
    document.body.classList.add('loaded');
    
    // Also trigger the hero wrapper fade-in if it exists
    const heroWrapper = document.querySelector('.animate-on-load');
    if (heroWrapper) {
        heroWrapper.classList.add('loaded');
    }
});

// ----------------------------------------------------
// 2. CUSTOM CURSOR
// ----------------------------------------------------
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

const hoverTriggers = document.querySelectorAll(".hover-trigger");
hoverTriggers.forEach(trigger => {
    trigger.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
    trigger.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
});

// ----------------------------------------------------
// 3. HOME PAGE HERO SLIDER LOGIC
// ----------------------------------------------------
const domTitle = document.getElementById('hero-title');

if (domTitle) {
    // 1. Define Content Data
    const slides = [
        {
            subtitle: "Manufacturing Excellence",
            title: "Precision Pharma <br> Solutions",
            desc: "High-quality 60ml & 120ml PET bottles designed for the pharmaceutical industry.",
            img: "pharmaslider.png", 
            btnText: "View Products",
            btnLink: "products.html"
        },
        {
            subtitle: "Textile Partners",
            title: "Excellence in <br> Textile",
            desc: "Durable Crystal Plastic Shirt Clips with superior grip and elasticity for export quality.",
            img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1600&auto=format&fit=crop",
            btnText: "Our Catalog",
            btnLink: "products.html"
        }
    ];

    // 2. Select DOM Elements
    const domSubtitle = document.getElementById('hero-subtitle');
    const domDesc = document.getElementById('hero-desc');
    const domImg = document.getElementById('hero-img');
    const domBtn = document.getElementById('hero-btn');

    let currentSlide = 0;
    let isAnimating = false;
    let autoPlayTimer;

    // 3. Animation Function
    function changeSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        const nextSlide = slides[index];

        const tl = gsap.timeline({
            defaults: { ease: "power4.inOut" },
            onComplete: () => { isAnimating = false; }
        });

        // A. Curtains Close (Wipe In)
        tl.set(".slash-panel", { display: "block" })
          .to("#slash-left", { left: "0%", duration: 0.8 })
          .to("#slash-right", { right: "0%", duration: 0.8 }, "<")
          
        // B. Swap Content (Behind Curtains)
          .add(() => {
              domSubtitle.innerText = nextSlide.subtitle;
              domTitle.innerHTML = nextSlide.title;
              domDesc.innerText = nextSlide.desc;
              domImg.src = nextSlide.img;
              if(domBtn) {
                  domBtn.innerText = nextSlide.btnText;
                  domBtn.href = nextSlide.btnLink;
              }
          })

        // C. Curtains Open (Wipe Out)
          .to("#slash-left", { left: "-60%", duration: 0.8 })
          .to("#slash-right", { right: "-60%", duration: 0.8 }, "<")
          .set(".slash-panel", { display: "none" })
          
        // D. Improved Directional Entry Animations
          // Text Slides from Left
          .fromTo([domSubtitle, domTitle, domDesc, domBtn], 
              { x: -50, opacity: 0 }, 
              { x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" }, 
              "-=0.6"
          )
          // Image Slides from Right
          .fromTo(domImg, 
              { x: 50, opacity: 0, scale: 1.05 }, 
              { x: 0, opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, 
              "-=1"
          );
    }

    // 4. Auto Play Logic
    function startAutoPlay() {
        // Change slide every 5 seconds (5000ms)
        autoPlayTimer = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            changeSlide(currentSlide);
        }, 5000); 
    }

    // Start immediately
    startAutoPlay();

    // 5. Initial Load Animation
    window.addEventListener("load", () => {
        gsap.from(".hero-content", {
            x: -50,
            opacity: 0,
            duration: 1,
            delay: 0.5
        });
        gsap.from("#hero-img", {
            x: 50,
            opacity: 0,
            duration: 1,
            delay: 0.7
        });
    });
}

// ----------------------------------------------------
// 4. COUNTERS (Runs if .counter exists)
// ----------------------------------------------------
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        ScrollTrigger.create({
            trigger: counter,
            start: "top 85%",
            once: true,
            onEnter: () => {
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2,
                    snap: { innerHTML: 1 },
                    ease: "power1.inOut"
                });
            }
        });
    });
}

// ----------------------------------------------------
// 5. PRODUCTS STAGGER (Runs if .flip-card exists)
// ----------------------------------------------------
const cards = document.querySelectorAll('.flip-card');
if (cards.length > 0) {
    // Check if #products-grid exists, otherwise fallback to body
    const triggerElement = document.getElementById("products-grid") || document.body;
    
    gsap.from(".flip-card", {
        scrollTrigger: {
            trigger: triggerElement, 
            start: "top 80%"
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });
}