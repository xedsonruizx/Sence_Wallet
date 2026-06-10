// Función de ayuda para redirigir páginas a la plantilla maestra.
// Cuando se accede directamente a un HTML de contenido, cambia la URL
// hacia layout/master.html con el parámetro correspondiente.
window.SenceWalletPageRedirect = function(pageName) {
    if (window.location.pathname.endsWith('/' + pageName + '.html') && !window.location.search.includes('page=')) {
        window.location.href = window.location.pathname.replace(
            new RegExp('/' + pageName + '\\.html$'),
            '/layout/master.html?page=' + pageName
        );
    }
};
