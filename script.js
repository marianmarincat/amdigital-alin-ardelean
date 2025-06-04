// script.js

// --- Configurații specifice angajatului ---
const numeImagineQR = "alin_ardelean.jpg"; // MODIFICAȚI ACEST NUME PENTRU FIECARE ANGAJAT
// ------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const qrImageElement = document.getElementById('qrImage');
    if (qrImageElement) {
        qrImageElement.src = numeImagineQR;
        qrImageElement.alt = `Cod QR ${document.title}`; // Actualizează alt textul
    } else {
        console.error("Elementul imagine QR nu a fost găsit!");
        return;
    }

    let pressTimer;
    const longPressDuration = 3000; // 3 secunde

    function handleInteractionStart(event) {
        // Previne comportamentul implicit care ar putea interfera (ex. context menu pe desktop)
        // if (event.type === 'mousedown') { // Doar pentru mousedown, nu și pentru touchstart
             // event.preventDefault(); // Poate fi necesar în funcție de testare
        // }

        pressTimer = window.setTimeout(() => {
            console.log("Apăsare lungă detectată. Se încearcă închiderea.");
            // Aceasta este cea mai bună încercare de a închide o fereastră web/PWA.
            // Funcționalitatea depinde de cum a fost lansată aplicația (standalone PWA vs tab browser).
            // Într-un APK generat de PWABuilder (care folosește WebView), acest lucru ar trebui să fie gestionat de wrapper-ul nativ.
            // Pentru testare directă în browser, s-ar putea să nu se închidă.
            window.close();

            // Ca alternativă, dacă window.close() nu este suficient:
            // document.body.innerHTML = "<div style='font-size:20px; text-align:center; padding-top: 40vh; color: black;'>Puteți închide aplicația.</div>";
            // setTimeout(() => { history.back(); }, 500); // Încearcă să navigheze înapoi
        }, longPressDuration);
    }

    function handleInteractionEnd(event) {
        clearTimeout(pressTimer);
    }

    // Adaugă event listeners pentru touch și mouse
    // Folosim { passive: true } unde nu apelăm preventDefault() pentru a îmbunătăți performanța scroll-ului (deși aici nu avem scroll)
    document.body.addEventListener('touchstart', handleInteractionStart, { passive: true });
    document.body.addEventListener('touchend', handleInteractionEnd);
    document.body.addEventListener('touchcancel', handleInteractionEnd);

    document.body.addEventListener('mousedown', handleInteractionStart);
    document.body.addEventListener('mouseup', handleInteractionEnd);
    document.body.addEventListener('mouseleave', handleInteractionEnd); // Anulează dacă mouse-ul părăsește

    // Înregistrează Service Worker-ul
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Calea către sw.js trebuie să fie relativă la domeniul site-ului,
        // și să includă numele repository-ului dacă este servit dintr-un subdirector pe GitHub Pages.
        // URL-ul site-ului este: https://marianmarincat.github.io/amdigital-alin-ardelean/
        // Deci, sw.js se va afla la /amdigital-alin-ardelean/sw.js
        navigator.serviceWorker.register('/amdigital-alin-ardelean/sw.js')
          .then(registration => {
            console.log('ServiceWorker: Registration successful with scope: ', registration.scope);
          })
          .catch(registrationError => {
            console.log('ServiceWorker: Registration failed: ', registrationError);
          });
      });
    } else {
        console.log('Service Worker is not supported by this browser.');
    }
});

