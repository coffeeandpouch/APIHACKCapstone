"use strict";

const leagueUrl = "https://www.thesportsdb.com/api/v1/json/1/all_leagues.php";
const allTeamsUrl =
  "https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php";
const searchUrl = "https://www.thesportsdb.com/api/v1/json/1/eventsnext.php";

function displayLeaguesInput(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  // iterate through the leagues array
  for (let i = 0; i < responseJson.leagues.length; i++) {
    // for each league in the leagues array,add a list item to options list with the league name
    $("#allLeagues").append(
      `<option value="${responseJson.leagues[i].idLeague}">${responseJson.leagues[i].strLeague}</option>`
    );
  }
  //display the league results
  $("#allLeagues").show();
}
//fetch all leagues and display at page load
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

function displayTeamsInput(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
  $("#selectedLeague").empty();
  //iterate through the teams array
  for (let i = 0; i < responseJson.teams.length; i++) {
    // for each teams in the teams array, add a option item to options list with team name
    $("#selectedLeague").append(
      `<option value="${responseJson.teams[i].idTeam}">${responseJson.teams[i].strTeam}</option>`
    );
  }
  //display team results
  $("#selectedTeam").show();
}

function displayTeamResults(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
  $("#teamId").empty();
  //iterate through the teams array
  for (let i = o; i < response.json.teams.length; i++) {
    //for the chosen team in the teams array, add an option item team id list with id number
    $("#teamId").append(
      `<option value="${responseJson.teams[i].strTeam}">${responseJson.teams[i].idTeam}</option>`
    );
  }
  //display team id results
  $("#teamId").show();
}

$();
//fetch the teams that are members of selected league
function getTeams(leagueId) {
  fetch(`${allTeamsUrl}?${formatQueryParams({ id: leagueId })}`)
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

function tconvert(time) {
  //check the correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    //if time format correct
    time = time.slice(1); // Remove full string match value
    time(5) = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; //Adjust hours
  }
  return Time.join(""); // return adjusted time or original string
}
tconvert(time);

function displayEventResults(responseJson) {
  //if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  //iterate through the events array
  for (let i = 0; i < responseJson.events.length; i++) {
    //for each game in the events array, add a list item to the results list
    //with  the opponent, date of the event, and start time
    $("#results-list").append(
      `<div class="card">
      <div class="card-body"><h3>${responseJson.events[i].strEvent}</h3>
        <p>Date: ${responseJson.events[i].dateEvent}</p>
        <p>Start Time: ${responseJson.events[i].strTime}</p>
        </div>
        </div>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}
//fetch the next 5 scheduled games on selected team schedule
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
//
function watchLeagueChange() {
  $("#allLeagues").on("change", function () {
    const selectedLeague = $(this).val();
    console.log(selectedLeague);
    getTeams(selectedLeague);
  });
}

function watchTeamChange() {
  $("#selectedLeague, #allLeagues").on("change", function () {
    const idTeam = $(this).val();
    console.log(idTeam);
    $("#teamId").val(idTeam);
  });
}
function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const teamId = $("#selectedLeague").val();
    console.log(teamId);
    tconvert(time);
    getGames(teamId);
  });
}

$(function () {
  console.log("App loaded! Waiting for submit!");
  watchForm();
  watchLeagueChange();
  watchTeamChange();
  getLeagues();
});
