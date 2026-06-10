window.SenceWalletMenu = (function() {
    function setupMenuLinks() {
        var messageEl = document.getElementById('redirect-message');

        document.querySelectorAll('.menu-link').forEach(function(link) {
            link.addEventListener('click', function(event) {
                event.preventDefault();
                var screenName = link.dataset.screen || link.textContent.trim();

                if (messageEl) {
                    messageEl.textContent = 'Redirigiendo a ' + screenName.toLowerCase() + '.';
                    messageEl.hidden = false;
                }

                setTimeout(function() {
                    window.location.href = link.href;
                }, 1000);
            });
        });
    }

    function displayBalance() {
        var balanceEl = document.getElementById('account-balance');
        if (balanceEl && window.SenceWalletBalance) {
            balanceEl.textContent = window.SenceWalletBalance.formatCurrency(
                window.SenceWalletBalance.getBalance()
            );
        }
    }

    function displaySummary() {
        if (!window.SenceWalletBalance) {
            return;
        }

        var movements = window.SenceWalletBalance.getMovements();
        var countEl = document.getElementById('movements-count');
        var lastOpEl = document.getElementById('last-operation');

        if (countEl) {
            countEl.textContent = movements.length;
        }

        if (!lastOpEl) {
            return;
        }

        if (movements.length === 0) {
            lastOpEl.textContent = 'Sin operaciones recientes.';
            return;
        }

        var last = movements[0];
        var sign = last.type === 'deposit' ? '+' : '-';
        lastOpEl.innerHTML =
            '<span class="font-weight-bold">' + last.description + '</span> — ' +
            sign + window.SenceWalletBalance.formatCurrency(last.amount) +
            ' <span class="text-muted small">(' + window.SenceWalletBalance.formatDate(last.date) + ')</span>';
    }

    function refreshDashboard() {
        displayBalance();
        displaySummary();
    }

    function init() {
        window.SenceWalletPageRedirect('menu');
        refreshDashboard();
        setupMenuLinks();
    }

    return { init: init, refreshDashboard: refreshDashboard };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.SenceWalletMenu.init);
} else {
    window.SenceWalletMenu.init();
}
