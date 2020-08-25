$.get('/profile_stories', (response) => {
    $('#news').html(buildArticles(response));
});
