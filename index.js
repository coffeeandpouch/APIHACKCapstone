"use strict";

const api_key = "";

const searchUrl = "https://www.thesportsdb.com/api/v1/json/1/eventsnext.php";
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayResults(responseJson) {
    //if there are previous results, remove them
    console.log(responseJson);
    $("#results-list").empty();
    //iterate through the items array
    for (let i = 0; i < responseJson.events.length; i++) {
      //for each park in the items array, add a list item to the results list
      //with  the park full name, description, and url
      $("#results-list").append(
        `<li><p>${responseJson.events[i].strEvent}</p></li>`
      );
    }
    //display the results section
    $("#results").removeClass("hidden");
  }

function getGames(query) {
  const params = {
    id: query,
  };
  const queryString = formatQueryParams(params);
  const url = searchUrl + "?" + queryString;

  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayResults(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong:${err.message}`);
    });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const searchTerm = $(".js-team").val();
    getGames(searchTerm);
  });
}

$(function () {
  console.log("App loaded! Waiting for submit!");
  watchForm();
});
