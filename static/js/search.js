"use strict";

// for the search bar, upon submitting the keyword, use that keyword as the new relative url 

$('#search_form').on('submit', (evt) => {
  evt.preventDefault();

  const search_args = {
    topic_keyword: $('#topic_keyword').val()
  };

  $.get('/search', search_args, (response) => {
    $('#news').html(response);
  });
});

