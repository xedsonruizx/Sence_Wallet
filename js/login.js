// Módulo de autenticación para la pantalla de login.
// Valida credenciales de usuario y controla la navegación al menú principal.
window.SenceWalletAuth = (function() {
    var authKey = 'senceWalletUser';
    var validUser = 'admin';
    var validPass = 'admin';
    var validation = window.SenceWalletValidation;

    function init() {
        // Redirige a la página principal si se accede directamente a login.html.
        window.SenceWalletPageRedirect('login');
        setupLoginForm();
    }

    function setupLoginForm() {
        var loginForm = document.getElementById('login-form');
        if (!loginForm) {
            return;
        }

        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            validation.hideMessage('login-message');
            validation.clearFieldErrors(['username', 'password']);

            var user = document.getElementById('username').value.trim();
            var pass = document.getElementById('password').value.trim();
            var hasError = false;

            // Validaciones básicas: campos obligatorios.
            if (!validation.validateRequired(user)) {
                validation.setFieldError('username', true);
                hasError = true;
            }

            if (!validation.validateRequired(pass)) {
                validation.setFieldError('password', true);
                hasError = true;
            }

            if (hasError) {
                validation.showMessage('login-message', 'Completa usuario y contraseña.', true);
                return;
            }

            // Autenticación simulada con valores fijos para demo.
            if (user === validUser && pass === validPass) {
                localStorage.setItem(authKey, validUser);
                validation.showMessage('login-message', 'Bienvenido admin. Redirigiendo al menú...', false);
                setTimeout(function() {
                    window.location.href = 'master.html?page=menu';
                }, 1000);
            } else {
                validation.setFieldError('username', true);
                validation.setFieldError('password', true);
                validation.showMessage('login-message', 'Usuario o contraseña incorrectos.', true);
            }
        });
    }

    return {
        init: init,
        setupLoginForm: setupLoginForm
    };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.SenceWalletAuth.init);
} else {
    window.SenceWalletAuth.init();
}
