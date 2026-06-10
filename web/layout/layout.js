// Cargar navbar, contenido y footer cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const layoutBase = new URL('.', window.location.href);

    // Cargar navbar
    fetch(new URL('navbar.html', layoutBase).href)
        .then(response => response.text())
        .then(html => {
            const navContainer = document.getElementById('navbar-container');
            if (navContainer) {
                navContainer.innerHTML = html;
                updateNavbar();
                updateAuthVisibility();
            }
        })
        .catch(error => console.error('Error cargando navbar:', error));

    // Obtener la página actual desde los parámetros de URL o usar por defecto
    const params = new URLSearchParams(window.location.search);
    const pageName = params.get('page') || 'menu';

    const authKey = 'senceWalletUser';
    const isAuthenticated = () => localStorage.getItem(authKey) === 'admin';

    if (!isAuthenticated() && pageName !== 'login') {
        window.location.href = 'master.html?page=login';
        return;
    }

    if (isAuthenticated() && pageName === 'login') {
        window.location.href = 'master.html?page=menu';
        return;
    }

    const updateNavbar = () => {
        const loginLink = document.querySelector('a.nav-link[href*="page=login"]');
        if (!loginLink) return;

        if (isAuthenticated()) {
            loginLink.textContent = 'Cerrar sesión';
            loginLink.href = '#';
            loginLink.addEventListener('click', function(event) {
                event.preventDefault();
                localStorage.removeItem(authKey);
                window.location.href = 'master.html?page=login';
            });
        } else {
            loginLink.textContent = 'Login';
            loginLink.href = 'master.html?page=login';
        }
    };

    const updateAuthVisibility = () => {
        const authElements = document.querySelectorAll('.auth-only');
        authElements.forEach(el => {
            el.style.display = isAuthenticated() ? '' : 'none';
        });
    };

    const pageScripts = {
        menu: ['../../js/page-redirect.js', '../../js/wallet.js', '../../js/menu.js'],
        login: ['../../js/page-redirect.js', '../../js/validation.js', '../../js/login.js'],
        deposit: ['../../js/page-redirect.js', '../../js/validation.js', '../../js/wallet.js', '../../js/deposit.js'],
        sendmoney: ['../../js/page-redirect.js', '../../js/validation.js', '../../js/wallet.js', '../../js/sendmoney.js'],
        transactions: ['../../js/page-redirect.js', '../../js/wallet.js', '../../js/transactions.js']
    };

    const loadPageScripts = (scripts, index = 0) => {
        if (index >= scripts.length) {
            return;
        }

        const script = document.createElement('script');
        script.src = new URL(scripts[index], layoutBase).href;
        script.onload = () => loadPageScripts(scripts, index + 1);
        document.body.appendChild(script);
    };

    // Cargar contenido de la página
    fetch(new URL('../' + pageName + '.html', layoutBase).href)
        .then(response => response.text())
        .then(html => {
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
                pageContent.innerHTML = html;
                updateAuthVisibility();

                if (pageScripts[pageName]) {
                    loadPageScripts(pageScripts[pageName]);
                }
            }
        })
        .catch(error => console.error('Error cargando página:', error));

    // Cargar footer
    fetch(new URL('footer.html', layoutBase).href)
        .then(response => response.text())
        .then(html => {
            const footerContainer = document.getElementById('footer-container');
            if (footerContainer) {
                footerContainer.innerHTML = html;
            }
        })
        .catch(error => console.error('Error cargando footer:', error));
});
