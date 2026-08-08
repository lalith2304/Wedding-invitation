(() => {
    "use strict";

    const weddingDate = new Date("2026-08-23T04:30:00+05:30").getTime();
    const values = {
        days: document.querySelector('[data-countdown="days"]'),
        hours: document.querySelector('[data-countdown="hours"]'),
        minutes: document.querySelector('[data-countdown="minutes"]'),
        seconds: document.querySelector('[data-countdown="seconds"]')
    };

    const pad = (value, size = 2) => String(value).padStart(size, "0");

    const setValue = (element, value) => {
        if (!element || element.textContent === value) {
            return;
        }

        element.textContent = value;
        element.classList.add("is-ticking");
        window.setTimeout(() => element.classList.remove("is-ticking"), 180);
    };

    let timer;

    const updateCountdown = () => {
        const now = Date.now();
        const distance = Math.max(weddingDate - now, 0);

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);

        setValue(values.days, pad(days));
        setValue(values.hours, pad(hours));
        setValue(values.minutes, pad(minutes));
        setValue(values.seconds, pad(seconds));

        if (distance === 0 && timer) {
            window.clearInterval(timer);
        }
    };

    updateCountdown();
    timer = window.setInterval(updateCountdown, 1000);
})();