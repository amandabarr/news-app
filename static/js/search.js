"use strict";

// for the search bar, upon submitting the keyword, use that keyword as the new relative url to show new articles with that
// specific keyword

$('#search_form').on('submit', (evt) => {
  evt.preventDefault();

  const search_args = {
    topic_keyword: $('#topic_keyword').val()
  };

  // search_args is the key-value pair used to make the Ajax request
  // by specifying which keyword to search for

  $.get('/search', search_args, (response) => {
    $('#news').html(buildArticles(response));
  });
});

