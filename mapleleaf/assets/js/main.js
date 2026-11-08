
"use strict";

/* =========================================
   EXPLORE TORONTO - MAIN JAVASCRIPT

   Libraries:
   1. Glide.js - Carousel
   2. Leaflet - Interactive map
   3. Chart.js - Weather chart
   4. AOS - Scroll animations
   5. Granim.js - Animated gradient
   6. Cleave.js - Date formatting
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* MOBILE NAVIGATION */

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close menu" : "Open menu"
        );
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });


    /* IMAGE ERROR CHECKING */

    document.querySelectorAll("img").forEach((img) => {
        img.addEventListener("error", () => {
            console.warn("Image failed to load:", img.src);
            img.style.backgroundColor = "#e9f2f3";
        });
    });


    /* LIBRARY 1: GLIDE.JS */

    if (typeof Glide !== "undefined") {
        const slider = new Glide(".attractions-glide", {
            type: "carousel",
            startAt: 0,
            perView: 3,
            gap: 25,
            autoplay: 4500,
            hoverpause: true,
            animationDuration: 650,

            breakpoints: {
                1023: {
                    perView: 2
                },
                767: {
                    perView: 1
                }
            }
        });

        slider.mount();

        document.querySelector(".slider-prev").addEventListener("click", () => {
            slider.go("<");
        });

        document.querySelector(".slider-next").addEventListener("click", () => {
            slider.go(">");
        });
    } else {
        console.warn("Glide.js was not loaded.");
    }


    /* LIBRARY 2: LEAFLET */

    if (typeof L !== "undefined") {
        const map = L.map("toronto-map", {
            scrollWheelZoom: false
        }).setView([43.6532, -79.3832], 12);

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }
        ).addTo(map);

        const locations = [
            {
                name: "CN Tower",
                lat: 43.6426,
                lng: -79.3871,
                description: "Toronto's famous observation tower."
            },
            {
                name: "Toronto Islands",
                lat: 43.6205,
                lng: -79.3785,
                description: "Waterfront parks, beaches and skyline views."
            },
            {
                name: "Casa Loma",
                lat: 43.6780,
                lng: -79.4094,
                description: "Historic Gothic Revival castle."
            },
            {
                name: "Art Gallery of Ontario",
                lat: 43.6536,
                lng: -79.3925,
                description: "One of Toronto's major art museums."
            },
            {
                name: "St. Lawrence Market",
                lat: 43.6487,
                lng: -79.3715,
                description: "Historic food market in Old Town."
            }
        ];

        const markerIcon = L.divIcon({
            className: "custom-map-marker",
            html: `
                <div style="
                    width: 22px;
                    height: 22px;
                    background: #0eaaa4;
                    border: 4px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                "></div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11]
        });

        const markers = [];

        locations.forEach((location) => {
            const marker = L.marker(
                [location.lat, location.lng],
                { icon: markerIcon }
            ).addTo(map);

            marker.bindPopup(`
                <strong>${location.name}</strong>
                <p>${location.description}</p>
            `);

            markers.push(marker);
        });

        const locationButtons = document.querySelectorAll(".map-location");

        locationButtons.forEach((button, index) => {
            button.addEventListener("click", () => {
                locationButtons.forEach((item) => {
                    item.classList.remove("active");
                });

                button.classList.add("active");

                const latitude = Number(button.dataset.lat);
                const longitude = Number(button.dataset.lng);

                map.flyTo(
                    [latitude, longitude],
                    15,
                    { duration: 1.3 }
                );

                map.once("moveend", () => {
                    markers[index].openPopup();
                });
            });
        });

        window.addEventListener("resize", () => {
            map.invalidateSize();
        });
    } else {
        console.warn("Leaflet was not loaded.");
    }


    /* LIBRARY 3: CHART.JS */

    if (typeof Chart !== "undefined") {
        const weatherCanvas = document.getElementById("weather-chart");

        new Chart(weatherCanvas, {
            type: "bar",

            data: {
                labels: [
                    "Jan", "Feb", "Mar", "Apr",
                    "May", "Jun", "Jul", "Aug",
                    "Sep", "Oct", "Nov", "Dec"
                ],

                datasets: [{
                    label: "Average Temperature (°C)",

                    data: [
                        -3.5, -2.8, 1.2, 7.6,
                        13.8, 19.1, 22.1, 21.3,
                        17.2, 10.8, 5.0, 0.1
                    ],

                    backgroundColor: [
                        "#8bcbd7",
                        "#8bcbd7",
                        "#8bcbd7",
                        "#4cc8be",
                        "#4cc8be",
                        "#0eaaa4",
                        "#0eaaa4",
                        "#0eaaa4",
                        "#4cc8be",
                        "#4cc8be",
                        "#8bcbd7",
                        "#8bcbd7"
                    ],

                    borderRadius: 5,
                    borderSkipped: false,
                    maxBarThickness: 35
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        display: false
                    },

                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.parsed.y}°C`;
                            }
                        }
                    }
                },

                scales: {
                    x: {
                        grid: {
                            display: false
                        },

                        ticks: {
                            color: "#657784"
                        }
                    },

                    y: {
                        min: -5,
                        max: 25,

                        ticks: {
                            stepSize: 5,
                            color: "#657784",

                            callback: (value) => {
                                return `${value}°`;
                            }
                        },

                        grid: {
                            color: "#edf1f2"
                        }
                    }
                }
            }
        });
    } else {
        console.warn("Chart.js was not loaded.");
    }


    /* LIBRARY 4: AOS */

    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            easing: "ease-out-cubic",
            once: true,
            offset: 80,

            disable: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        });
    } else {
        console.warn("AOS was not loaded.");
    }


    /* LIBRARY 5: GRANIM.JS */

    if (typeof Granim !== "undefined") {
        new Granim({
            element: "#hero-gradient",
            direction: "diagonal",
            isPausedWhenNotInView: true,

            states: {
                "default-state": {
                    gradients: [
                        ["#112b3c", "#087d83"],
                        ["#123f60", "#0eaaa4"],
                        ["#102b48", "#226c88"],
                        ["#112b3c", "#087d83"]
                    ],

                    transitionSpeed: 5000,
                    loop: true
                }
            }
        });
    } else {
        console.warn("Granim.js was not loaded.");
    }


    /* LIBRARY 6: CLEAVE.JS */

    if (typeof Cleave !== "undefined") {
        new Cleave("#trip-date", {
            date: true,
            delimiter: "-",
            datePattern: ["Y", "m", "d"]
        });
    } else {
        console.warn("Cleave.js was not loaded.");
    }


    /* TRIP FORM VALIDATION */

    const tripForm = document.getElementById("trip-form");
    const formMessage = document.getElementById("form-message");

    tripForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("visitor-name").value.trim();
        const date = document.getElementById("trip-date").value.trim();
        const interest = document.getElementById("travel-interest").value;

        const dateParts = date.split("-");

        const year = Number(dateParts[0]);
        const month = Number(dateParts[1]);
        const day = Number(dateParts[2]);

        const parsedDate = new Date(year, month - 1, day);

        const validDate =
            /^\d{4}-\d{2}-\d{2}$/.test(date) &&
            parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day;

        if (!validDate) {
            formMessage.textContent =
                "Please enter a valid date in YYYY-MM-DD format.";

            formMessage.style.color = "#d9534f";
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (parsedDate < today) {
            formMessage.textContent =
                "Please select a future travel date.";

            formMessage.style.color = "#d9534f";
            return;
        }

        formMessage.textContent =
            `Thanks, ${name}! Your ${interest.toLowerCase()} trip preview for ${date} is ready. No booking or email has been sent.`;

        formMessage.style.color = "#078e88";
    });

    console.log("Explore Toronto initialized successfully.");
});
