window.SenceWalletPageRedirect = function(pageName) {
    if (window.location.pathname.endsWith('/' + pageName + '.html') && !window.location.search.includes('page=')) {
        window.location.href = window.location.pathname.replace(
            new RegExp('/' + pageName + '\\.html$'),
            '/layout/master.html?page=' + pageName
        );
    }
};
