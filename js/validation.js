// Utilidades de validación y mensajes de formulario.
// Centraliza el control de errores y la presentación de feedback en pantalla.
window.SenceWalletValidation = (function() {
    function showMessage(elementId, message, isError) {
        var element = document.getElementById(elementId);
        if (!element) {
            return;
        }

        element.textContent = message;
        element.className = 'form-feedback' + (isError ? ' form-feedback-error' : ' form-feedback-success');
        element.hidden = false;
    }

    function hideMessage(elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.hidden = true;
        }
    }

    function setFieldError(fieldId, hasError) {
        var field = document.getElementById(fieldId);
        if (field) {
            field.classList.toggle('is-invalid', hasError);
        }
    }

    function clearFieldErrors(fieldIds) {
        fieldIds.forEach(function(fieldId) {
            setFieldError(fieldId, false);
        });
    }

    function validateRequired(value) {
        // Comprueba que exista texto distinto de espacios en blanco.
        return String(value || '').trim().length > 0;
    }

    function validateAmount(value) {
        // Acepta solo números mayores que cero.
        var amount = parseFloat(value);
        return !isNaN(amount) && amount > 0;
    }

    function validateCbu(value) {
        // CBU válido entre 10 y 22 dígitos numéricos.
        return /^\d{10,22}$/.test(String(value || '').trim());
    }

    return {
        showMessage: showMessage,
        hideMessage: hideMessage,
        setFieldError: setFieldError,
        clearFieldErrors: clearFieldErrors,
        validateRequired: validateRequired,
        validateAmount: validateAmount,
        validateCbu: validateCbu
    };
})();
