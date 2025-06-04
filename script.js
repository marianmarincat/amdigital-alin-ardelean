// --- Configurații specifice angajatului ---
const numeImagineQR = "alin_ardelean.jpg"; // MODIFICAȚI ACEST NUME PENTRU FIECARE ANGAJAT
// ------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const qrImageElement = document.getElementById('qrImage');
    if (qrImageElement) {
        qrImageElement.src = numeImagineQR;
        qrImageElement.alt = `Cod QR ${document.title}`;
    } else {
        console.error("Elementul imagine QR nu a fost găsit!");
        return;
    }

    let pressTimer;
    const longPressDuration = 3000; // 3 secunde

    function handleInteractionStart(event) {
        // Previne comportamentul implicit care ar putea interfera (ex. context menu pe desktop)
        if (event.type === 'mousedown') { // Doar pentru mousedown, nu și pentru touchstart
             // event.preventDefault(); // Poate fi necesar în funcție de testare
        }

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
});

// Înregistrează Service Worker-ul dacă este prezent (pentru funcționalități PWA offline)
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }
// Nota: Pentru un simplu APK wrapper, un Service Worker (sw.js) s-ar putea să nu fie strict necesar
// dacă nu aveți nevoie de funcționalități offline avansate, dar PWABuilder îl poate genera.
