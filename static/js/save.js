"use strict";

// create a variable for all the favorite buttons on the page, then loop over each button adding an event listner to each button
// if the article has been clicked (saved to favorites) there should be an option to remove from favorites and vice versa

function toggleFavorite(favoriteButton, storyId) {

    if (favoriteButton.innerText === 'Save to Favorites') {
        favoriteButton.innerText = 'Remove from Favorites';
        const savedStory = {
            storyId: storyId
        }
        $.post('/save_article', savedStory, (articleJson) => {
          });
    } else {
        favoriteButton.innerText = 'Save to Favorites';
    }

}

// ajax call
