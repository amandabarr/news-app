$.get('/stories', (response) => {
    $('#news').html(buildArticles(response));
});
