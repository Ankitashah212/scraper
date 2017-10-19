function displayResults(data) {
  console.log(data);
  var article = '';
  $("tbody").empty();

  data.forEach(function (element) {
    // console.log("called");
    article += '<form action="/save/' + element.counter  + '" method="post">';
    article += '<div class="myArticle"> <p>' + element.title + "</p><p>" + element.link +
      '</p> <p><button id="add" type= "submit">Save Article</button>' + '</p></div>';
    article += '</form>';
  }, this);
  console.log(article);
  $(".result").append(article);
}

$(document).ready(function () {
  console.log("ready!");
  $.getJSON("/scrape", function (data) {
    // Call our function to generate a table body
    //console.log(data);
    displayResults(data);
  });

});


