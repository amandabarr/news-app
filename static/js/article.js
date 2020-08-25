function buildArticles(articlesJson) {
    let articlesHtml = '';
    for (article of articlesJson) {
        articlesHtml += buildArticle(article);
    }
    return articlesHtml;
}

function buildArticle(articleJson) {
    let favoriteButtonLabel = articleJson['favorite'] ? 'Remove from Favorites' : 'Save to Favorites';
    return `
    <a href='${articleJson["url"]}'>
    <h2>${articleJson["title"]}</h2>
    </a>
    <h3>${articleJson["source"]["name"]}</h3>
    <h3> Written by:  ${articleJson["author"]} </h3>
    <h4> Published: ${articleJson["publishedAt"]} </h4>
    <img src="${articleJson["urlToImage"]}"/>
    <p>${articleJson["description"]}</p>
    <button class="favorite" onclick="toggleFavorite(this, ${articleJson["storyId"]})">${favoriteButtonLabel}</button>
    `;
}
