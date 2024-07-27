// Service Worker Register 
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt Event fired'); // Log for debugging
    e.preventDefault();
    deferredPrompt = e;
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.style.display = 'block';
    }
});

window.addEventListener('load', () => {
    const installButton = document.getElementById('installButton');
    if (installButton) {
        installButton.addEventListener('click', (e) => {
            console.log('Install button clicked'); // Log for debugging
            installButton.style.display = 'none';
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                });
            }
        });
    }

    // Cambia el color del tema a blanco cuando la página ha cargado
    document.querySelector('meta[name="theme-color"]').setAttribute('content', '#1D4289');
});

function isIOS() {
    return /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
}

function isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
}

if (isIOS() && !isInStandaloneMode()) {
    const installInstructions = document.createElement('div');
    installInstructions.innerHTML = `
        <div id="installInstructions" style="position: fixed; bottom: 10px; left: 10px; right: 10px; background-color: #ebd795; border: 1px solid #FCC100; padding: 10px; text-align: center; z-index: 1000;">
            <p>Para instalar esta aplicación, pulsa el botón de <strong>Compartir</strong> y luego <strong>Añadir a la pantalla de inicio</strong>.</p>
            <button id="closeInstructions">Cerrar</button>
        </div>
        `;
    document.body.appendChild(installInstructions);

    document.getElementById('closeInstructions').addEventListener('click', () => {
        document.getElementById('installInstructions').style.display = 'none';
    });
}