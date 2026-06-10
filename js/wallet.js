// Módulo de estado del wallet.
// Persistencia de saldo y movimientos usando localStorage,
// con formato de moneda y fecha para mostrar en la UI.
window.SenceWalletBalance = (function() {
    const balanceKey = 'senceWalletBalance';
    const movementsKey = 'senceWalletMovements';
    const initialBalance = 60000;

    function getBalance() {
        const stored = localStorage.getItem(balanceKey);
        if (stored === null) {
            localStorage.setItem(balanceKey, initialBalance.toString());
            return initialBalance;
        }
        return parseFloat(stored);
    }

    function getMovements() {
        const stored = localStorage.getItem(movementsKey);
        if (!stored) {
            return [];
        }
        return JSON.parse(stored);
    }

    function addMovement(movement) {
        const movements = getMovements();
        movements.unshift({
            id: Date.now().toString(),
            date: new Date().toISOString(),
            type: movement.type,
            description: movement.description,
            amount: movement.amount
        });
        localStorage.setItem(movementsKey, JSON.stringify(movements));
    }

    function deposit(amount) {
        // Aumenta saldo y guarda un registro de depósito.
        const newBalance = getBalance() + amount;
        localStorage.setItem(balanceKey, newBalance.toString());
        addMovement({
            type: 'deposit',
            description: 'Depósito',
            amount: amount
        });
        return newBalance;
    }

    function withdraw(amount, description) {
        // Resta dinero solo si hay saldo suficiente.
        const current = getBalance();
        if (amount > current) {
            return null;
        }
        const newBalance = current - amount;
        localStorage.setItem(balanceKey, newBalance.toString());
        addMovement({
            type: 'transfer',
            description: description || 'Transferencia enviada',
            amount: amount
        });
        return newBalance;
    }

    function formatCurrency(amount) {
        return '$' + amount.toLocaleString('es-CL');
    }

    function formatDate(isoDate) {
        return new Date(isoDate).toLocaleString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return {
        getBalance: getBalance,
        getMovements: getMovements,
        deposit: deposit,
        withdraw: withdraw,
        formatCurrency: formatCurrency,
        formatDate: formatDate
    };
})();
