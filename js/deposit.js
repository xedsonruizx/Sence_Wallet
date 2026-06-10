window.SenceWalletDeposit = (function() {
    var validation = window.SenceWalletValidation;

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

            if (!validation.validateAmount(amountInput.value)) {
                validation.setFieldError('depositAmount', true);
                validation.showMessage('deposit-message', 'Ingresa un monto válido mayor a cero.', true);
                return;
            }

            window.SenceWalletBalance.deposit(amount);
            validation.showMessage(
                'deposit-message',
                'Depósito de ' + window.SenceWalletBalance.formatCurrency(amount) + ' realizado. Redirigiendo al menú...',
                false
            );

            setTimeout(function() {
                window.location.href = 'master.html?page=menu';
            }, 1500);
        });
    }

    function init() {
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
