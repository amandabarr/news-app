
$.get('/stories', (response) => {
    $('#news').html(buildArticles(response));
});

function buildArticles(articlesJson) {
    let articlesHtml = '';
    for (article of articlesJson) {
        articlesHtml += buildArticle(article);
    }
    return articlesHtml;
}

function buildArticle(articleJson) {
    return `
    <a href='${article["url"]}'>
    <h2>${article["title"]}</h2>
    </a>
    <h3>${article["source"]["name"]}</h3>
    <h3> Written by:  ${article["author"]} </h3>
    <h4> Published: ${article["publishedAt"]} </h4>
    <img src="${article["urlToImage"]}"/>
    <p>${article["description"]}</p>
    <button action="/save_article" class="favorite" onclick="toggleFavorite(this)">Save to Favorites</button>
    `;
}
