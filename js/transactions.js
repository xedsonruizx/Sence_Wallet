// Módulo de historial de transacciones.
// Se encarga de listar los movimientos registrados en el wallet local.
window.SenceWalletTransactions = (function() {
    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function renderMovements() {
        var list = document.getElementById('movements-list');
        if (!list || !window.SenceWalletBalance) {
            return;
        }

        var movements = window.SenceWalletBalance.getMovements();
        list.innerHTML = '';

        if (movements.length === 0) {
            list.innerHTML = '<li class="list-group-item text-muted">No hay movimientos registrados.</li>';
            return;
        }

        movements.forEach(function(movement) {
            var item = document.createElement('li');
            var isDeposit = movement.type === 'deposit';
            item.className = 'list-group-item movement-item';

            // Cada movimiento se muestra con descripción, fecha y monto.
            item.innerHTML =
                '<div class="d-flex justify-content-between align-items-start">' +
                    '<div>' +
                        '<div class="font-weight-bold">' + escapeHtml(movement.description) + '</div>' +
                        '<div class="text-muted small">' + window.SenceWalletBalance.formatDate(movement.date) + '</div>' +
                    '</div>' +
                    '<div class="movement-amount ' + (isDeposit ? 'movement-amount-in' : 'movement-amount-out') + '">' +
                        (isDeposit ? '+' : '-') + window.SenceWalletBalance.formatCurrency(movement.amount) +
                    '</div>' +
                '</div>';

            list.appendChild(item);
        });
    }

    function init() {
        window.SenceWalletPageRedirect('transactions');
        renderMovements();
    }

    return { init: init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.SenceWalletTransactions.init);
} else {
    window.SenceWalletTransactions.init();
}
