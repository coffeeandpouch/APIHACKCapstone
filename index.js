"use strict";

// const api_key = "";
// const sportUrl = "https://www.thesportsdb.com/api/v1/json/1/all_sports.php";
const leagueUrl = "https://www.thesportsdb.com/api/v1/json/1/all_leagues.php";
const allTeamsUrl =
  "https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php";
const searchUrl = "https://www.thesportsdb.com/api/v1/json/1/eventsnext.php";

function displayLeaguesInput(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  // $("#allLeagues").empty();
  // iterate through the leagues array
  for (let i = 0; i < responseJson.leagues.length; i++) {
    // for each league in the leagues array,add a list item to options list with the league name
    $("#allLeagues").append(
      `<option>${responseJson.leagues[i].strLeague}</option>`
    );
  }
  //display the league results
  $("#allLeagues").show();
}

function getLeagues() {
  fetch(leagueUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayLeaguesInput(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong:${err.message}`);
    });
}
// add a select tag in your index.html with some id attribute
// add a displayLeaguesInput function
// iterate over all the leagues
// append option tag to the select tag that you added earlier (hint: use jquery to do this)

function displayTeamsInput(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
//   $("#allTeams").empty();
  //iterate through the teams array
  for (let i = 0; i < responseJson.teams.length; i++) {
    // for each teams in the teams array, add a option item to options list with team name
    $("#allTeams").append(
      `<option>${responseJson.teams[i].strTeam}</option>
        <option>${responseJson.teams[i].idTeam}</option>`
    );
  }
  //display team results
  $("#allTeams").show();
}

function getTeams() {
  fetch(allTeamsUrl)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayTeamsInput(responseJson))
    .catch((err) => {
      $("#js-error-message").text(`Something went wrong:${err.message}`);
    });
}
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join("&");
}

function displayEventResults(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  //iterate through the events array
  for (let i = 0; i < responseJson.events.length; i++) {
    //for each game in the events array, add a list item to the results list
    //with  the opponent, date of the event, and start time
    $("#results-list").append(
      `<li><h3>${responseJson.events[i].strEvent}</h3>
        <p>Date:${responseJson.events[i].dateEvent}</p>
        <p>Start Time:${responseJson.events[i].strTime}</p>
        </li>`
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
    .then((responseJson) => displayEventResults(responseJson))
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
  getLeagues();
  getTeams();
});
