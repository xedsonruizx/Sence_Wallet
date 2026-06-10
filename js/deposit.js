// Módulo para la pantalla de depósitos.
// Este archivo gestiona la interacción con el formulario de depósito
// y aplica validaciones antes de actualizar el saldo global.
window.SenceWalletDeposit = (function() {
    var validation = window.SenceWalletValidation;

    // Configura el formulario de depósito y su evento submit.
    function setupDepositForm() {
        var form = document.getElementById('deposit-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            validation.hideMessage('deposit-message');
            validation.setFieldError('depositAmount', false);

            var amountInput = document.getElementById('depositAmount');
            var amount = parseFloat(amountInput.value);

            // Validar que el monto sea un número positivo.
            if (!validation.validateAmount(amountInput.value)) {
                validation.setFieldError('depositAmount', true);
                validation.showMessage('deposit-message', 'Ingresa un monto válido mayor a cero.', true);
                return;
            }

            // Actualizar saldo usando el módulo global de wallet.
            window.SenceWalletBalance.deposit(amount);
            validation.showMessage(
                'deposit-message',
                'Depósito de ' + window.SenceWalletBalance.formatCurrency(amount) + ' realizado. Redirigiendo al menú...',
                false
            );

            // Pequeña pausa visual antes de redirigir al menú principal.
            setTimeout(function() {
                window.location.href = 'master.html?page=menu';
            }, 1500);
        });
    }

    function init() {
        // Garantiza la navegación correcta cuando se carga directamente en deposit.html.
        window.SenceWalletPageRedirect('deposit');
        setupDepositForm();
    }

    return { init: init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.SenceWalletDeposit.init);
} else {
    window.SenceWalletDeposit.init();
}
