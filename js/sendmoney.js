window.SenceWalletSendMoney = (function() {
    var contactsKey = 'senceWalletContacts';
    var selectedContactId = null;
    var validation = window.SenceWalletValidation;

    var defaultContacts = [
        { id: '1', name: 'John Doe', cbu: '123456789', alias: 'john.doe', bank: 'ABC Bank' },
        { id: '2', name: 'Jane Smith', cbu: '987654321', alias: 'jane.smith', bank: 'XYZ Bank' }
    ];

    function getContacts() {
        var stored = localStorage.getItem(contactsKey);
        if (!stored) {
            localStorage.setItem(contactsKey, JSON.stringify(defaultContacts));
            return defaultContacts.slice();
        }
        return JSON.parse(stored);
    }

    function saveContacts(contacts) {
        localStorage.setItem(contactsKey, JSON.stringify(contacts));
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getSelectedContact() {
        return getContacts().find(function(contact) {
            return contact.id === selectedContactId;
        });
    }

    function showMessage(text, isError) {
        validation.showMessage('send-message', text, isError);
    }

    function renderContacts(filter) {
        var list = document.getElementById('contactList');
        if (!list) {
            return;
        }

        var contacts = getContacts().filter(function(contact) {
            if (!filter) {
                return true;
            }

            var term = filter.toLowerCase();
            return contact.name.toLowerCase().includes(term) ||
                contact.alias.toLowerCase().includes(term) ||
                contact.cbu.includes(term) ||
                contact.bank.toLowerCase().includes(term);
        });

        list.innerHTML = '';

        if (contacts.length === 0) {
            list.innerHTML = '<li class="list-group-item text-muted">No se encontraron contactos.</li>';
            return;
        }

        contacts.forEach(function(contact) {
            var item = document.createElement('li');
            item.className = 'list-group-item contact-item';
            if (selectedContactId === contact.id) {
                item.classList.add('contact-item-selected');
            }
            item.dataset.contactId = contact.id;
            item.innerHTML =
                '<div class="font-weight-bold">' + escapeHtml(contact.name) + '</div>' +
                '<div class="text-muted">CBU: ' + escapeHtml(contact.cbu) +
                ' | Alias: ' + escapeHtml(contact.alias) +
                ' | Banco: ' + escapeHtml(contact.bank) + '</div>';

            item.addEventListener('click', function() {
                selectedContactId = contact.id;
                renderContacts(document.getElementById('searchContact').value.trim());
            });

            list.appendChild(item);
        });
    }

    function openContactModal() {
        var modal = document.getElementById('addContactModal');
        if (modal && window.jQuery) {
            validation.hideMessage('contact-modal-message');
            validation.clearFieldErrors(['contactName', 'contactCbu', 'contactAlias', 'contactBank']);
            window.jQuery(modal).modal('show');
        }
    }

    function setupAddContactButton() {
        var button = document.getElementById('add-contact-btn');
        if (!button) {
            return;
        }

        button.addEventListener('click', function() {
            openContactModal();
        });
    }

    function setupContactForm() {
        var form = document.getElementById('add-contact-form');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            validation.hideMessage('contact-modal-message');
            validation.clearFieldErrors(['contactName', 'contactCbu', 'contactAlias', 'contactBank']);

            var name = document.getElementById('contactName').value.trim();
            var cbu = document.getElementById('contactCbu').value.trim();
            var alias = document.getElementById('contactAlias').value.trim();
            var bank = document.getElementById('contactBank').value.trim();
            var hasError = false;

            if (!validation.validateRequired(name)) {
                validation.setFieldError('contactName', true);
                hasError = true;
            }

            if (!validation.validateCbu(cbu)) {
                validation.setFieldError('contactCbu', true);
                hasError = true;
            }

            if (!validation.validateRequired(alias)) {
                validation.setFieldError('contactAlias', true);
                hasError = true;
            }

            if (!validation.validateRequired(bank)) {
                validation.setFieldError('contactBank', true);
                hasError = true;
            }

            if (hasError) {
                validation.showMessage('contact-modal-message', 'Completa todos los campos correctamente. El CBU debe tener entre 10 y 22 dígitos.', true);
                return;
            }

            var contacts = getContacts();
            contacts.push({
                id: Date.now().toString(),
                name: name,
                cbu: cbu,
                alias: alias,
                bank: bank
            });
            saveContacts(contacts);
            form.reset();

            if (window.jQuery) {
                window.jQuery('#addContactModal').modal('hide');
            }

            showMessage('Contacto agregado correctamente.', false);
            renderContacts(document.getElementById('searchContact').value.trim());
        });
    }

    function setupSearch() {
        var searchInput = document.getElementById('searchContact');
        if (!searchInput) {
            return;
        }

        searchInput.addEventListener('input', function() {
            renderContacts(searchInput.value.trim());
        });
    }

    function setupSendMoney() {
        var button = document.getElementById('send-money-btn');
        if (!button) {
            return;
        }

        button.addEventListener('click', function() {
            validation.hideMessage('send-message');
            validation.setFieldError('transferAmount', false);

            var contact = getSelectedContact();
            var amountInput = document.getElementById('transferAmount');
            var amount = parseFloat(amountInput.value);
            var balance = window.SenceWalletBalance.getBalance();

            if (!contact) {
                showMessage('Selecciona un contacto para enviar dinero.', true);
                return;
            }

            if (!validation.validateAmount(amountInput.value)) {
                validation.setFieldError('transferAmount', true);
                showMessage('Ingresa un monto válido mayor a cero.', true);
                return;
            }

            if (amount > balance) {
                validation.setFieldError('transferAmount', true);
                showMessage(
                    'Saldo insuficiente. Disponible: ' + window.SenceWalletBalance.formatCurrency(balance),
                    true
                );
                return;
            }

            window.SenceWalletBalance.withdraw(amount, 'Transferencia enviada a ' + contact.name);
            showMessage(
                'Transferencia confirmada a ' + contact.name + ' por ' +
                window.SenceWalletBalance.formatCurrency(amount) + '. Redirigiendo al menú...',
                false
            );

            setTimeout(function() {
                window.location.href = 'master.html?page=menu';
            }, 1500);
        });
    }

    function init() {
        window.SenceWalletPageRedirect('sendmoney');
        renderContacts();
        setupAddContactButton();
        setupContactForm();
        setupSearch();
        setupSendMoney();
    }

    return { init: init };
})();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.SenceWalletSendMoney.init);
} else {
    window.SenceWalletSendMoney.init();
}
