(() => {
    "use strict";

    const selectors = {
        header: "#site-header",
        navToggle: ".nav__toggle",
        navMenu: "#nav-menu",
        navLink: ".nav__link",
        loader: "#loader",
        backToTop: "#back-to-top",
        themeToggle: "#theme-toggle",
        musicToggle: "#music-toggle",
        audio: "#bg-music",
        shareLocation: "[data-share-location]"
    };

    const storedMusicState = "weddingMusicPlaying";
    const storedTheme = "weddingTheme";

    const getElement = (selector) => document.querySelector(selector);
    const getElements = (selector) => Array.from(document.querySelectorAll(selector));

    const closeMenu = () => {
        const navToggle = getElement(selectors.navToggle);
        const navMenu = getElement(selectors.navMenu);

        navToggle?.classList.remove("is-open");
        navToggle?.setAttribute("aria-expanded", "false");
        navMenu?.classList.remove("is-open");
        document.body.classList.remove("menu-open");
    };

    const initLoader = () => {
        const loader = getElement(selectors.loader);
        document.body.classList.add("loading");

        window.addEventListener("load", () => {
            window.setTimeout(() => {
                loader?.classList.add("is-hidden");
                document.body.classList.remove("loading");
            }, 1700);
        });
    };

    const initNavigation = () => {
        const header = getElement(selectors.header);
        const navToggle = getElement(selectors.navToggle);
        const navMenu = getElement(selectors.navMenu);
        const navLinks = getElements(selectors.navLink);
        const sections = navLinks
            .map((link) => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        const updateHeader = () => {
            header?.classList.toggle("is-scrolled", window.scrollY > 24);
        };

        navToggle?.addEventListener("click", () => {
            const isOpen = navMenu?.classList.toggle("is-open");
            navToggle.classList.toggle("is-open", Boolean(isOpen));
            navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
            document.body.classList.toggle("menu-open", Boolean(isOpen));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: "-42% 0px -52% 0px", threshold: 0.01 });

        sections.forEach((section) => observer.observe(section));
        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();
    };

    const initParallax = () => {
        const hero = document.querySelector(".hero__parallax");

        if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        let ticking = false;
        const update = () => {
            const offset = Math.min(window.scrollY * 0.18, 80);
            hero.style.setProperty("--parallax-offset", `${offset}px`);
            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
    };

    const initAos = () => {
        if (window.AOS) {
            window.AOS.init({
                disable: window.innerWidth <= 768,
                duration: 850,
                easing: "ease-out-cubic",
                once: true,
                offset: 80
            });
        }
    };

    const initTheme = () => {
        const button = getElement(selectors.themeToggle);
        const icon = button?.querySelector("i");
        const stored = localStorage.getItem(storedTheme);
        let activeTheme = stored || "light";

        const applyTheme = (theme) => {
            const isLight = theme === "light";
            activeTheme = isLight ? "light" : "dark";
            document.body.dataset.theme = activeTheme;
            document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isLight ? "#FFFDF8" : "#070201");

            if (!button || !icon) {
                return;
            }

            button.setAttribute("aria-pressed", String(isLight));
            button.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
            icon.className = isLight ? "fa-solid fa-sun" : "fa-solid fa-moon";
        };

        applyTheme(activeTheme);

        button?.addEventListener("click", () => {
            const nextTheme = activeTheme === "light" ? "dark" : "light";
            localStorage.setItem(storedTheme, nextTheme);
            applyTheme(nextTheme);
        });
    };

    const initMusic = () => {
        const button = getElement(selectors.musicToggle);
        const audio = getElement(selectors.audio);
        let preferredPlaying = localStorage.getItem(storedMusicState) === "true";

        if (!button || !audio) {
            return;
        }

        const icon = button.querySelector("i");

        const setPlayingUi = (isPlaying) => {
            button.classList.toggle("is-playing", isPlaying);
            button.setAttribute("aria-pressed", String(isPlaying));
            button.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
            button.title = isPlaying ? "Pause music" : "Play music";

            if (icon) {
                icon.className = isPlaying ? "fa-solid fa-pause" : "fa-solid fa-music";
            }
        };

        const setLoadingUi = (isLoading) => {
            button.disabled = isLoading;
            button.classList.toggle("is-loading", isLoading);
        };

        const playMusic = async () => {
            setLoadingUi(true);

            try {
                audio.load();
                await audio.play();
                preferredPlaying = true;
                localStorage.setItem(storedMusicState, "true");
                setPlayingUi(true);
            } catch (error) {
                preferredPlaying = false;
                localStorage.setItem(storedMusicState, "false");
                setPlayingUi(false);
                button.title = "Tap again after the music file finishes loading. If it still fails, check music/bg.mp3.";
                console.info("Background music could not start.", error);
            } finally {
                setLoadingUi(false);
            }
        };

        const pauseMusic = () => {
            audio.pause();
            preferredPlaying = false;
            localStorage.setItem(storedMusicState, "false");
            setPlayingUi(false);
        };

        button.addEventListener("click", () => {
            if (audio.paused) {
                playMusic();
            } else {
                pauseMusic();
            }
        });

        audio.addEventListener("play", () => setPlayingUi(true));
        audio.addEventListener("pause", () => setPlayingUi(false));

        audio.addEventListener("error", () => {
            pauseMusic();
            button.title = "Music could not be loaded. Check music/bg.mp3.";
        });

        setPlayingUi(false);

        if (preferredPlaying) {
            button.title = "Tap to resume music";
        }
    };

    const initBackToTop = () => {
        const button = getElement(selectors.backToTop);

        if (!button) {
            return;
        }

        const update = () => {
            button.classList.toggle("is-visible", window.scrollY > 600);
        };

        button.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        window.addEventListener("scroll", update, { passive: true });
        update();
    };

    const initShareLocation = () => {
        const buttons = getElements(selectors.shareLocation);

        if (!buttons.length) {
            return;
        }

        buttons.forEach((button) => {
            button.addEventListener("click", async () => {
                const shareUrl = button.dataset.shareUrl || window.location.href;
                const shareData = {
                    title: button.dataset.shareTitle || "Wedding Location",
                    text: button.dataset.shareText || "Join us for the wedding of Lalith S and Priyadharsini S.",
                    url: shareUrl
                };

                if (navigator.share) {
                    await navigator.share(shareData);
                    return;
                }

                await navigator.clipboard.writeText(shareUrl);
                button.textContent = "Location Copied";
                window.setTimeout(() => {
                    button.textContent = "Share Location";
                }, 1800);
            });
        });
    };

    const initImageFallbacks = () => {
        document.querySelectorAll("img").forEach((image) => {
            image.addEventListener("error", () => {
                image.classList.add("image-fallback");
                image.alt = image.alt || "Wedding image placeholder";
                image.src = "images/logo.png";
            }, { once: true });
        });
    };

    document.addEventListener("DOMContentLoaded", () => {
        initLoader();
        initNavigation();
        initParallax();
        initAos();
        initTheme();
        initMusic();
        initBackToTop();
        initShareLocation();
        initImageFallbacks();
    });
})();
