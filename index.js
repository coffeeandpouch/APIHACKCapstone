"use strict";

const leagueUrl = "https://www.thesportsdb.com/api/v1/json/1/all_leagues.php";
const allTeamsUrl =
  "https://www.thesportsdb.com/api/v1/json/1/lookup_all_teams.php";
const searchUrl = "https://www.thesportsdb.com/api/v1/json/1/eventsnext.php";
const apiKey = "AIzaSyCftPUQqZxBItKv-g-0HAOWNbMuT47BdMM";
const mapUrl =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyCftPUQqZxBItKv-g-0HAOWNbMuT47BdMM&callback=initMap";
let map, geocoder;

function displayLeaguesInput(responseJson) {
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
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; //Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

// Initialize and add the map
function initMap() {
  // The map, centered on the venue
  geocoder = new google.maps.Geocoder();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
  });
}

function getVenue() {
  fetch(`mapUrl`)
    .then((response) => {
      if (response.ok) {
        console.log(response);
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then((responseJson) => displayMapsInput(repsonseJson))
    .catch((err) => {
      $("#map").text(`Something went wrong: ${err.message}`);
    });
}

function displayEventResults(responseJson) {
  //if there are previous results, remove them
  $("#results-list").empty();

  if (responseJson.events == null) {
    $("#results-list").html(`<p>There are no games scheduled</p>`);
  } else {
    const venueEvents = {};
    //iterate through the events array
    for (let i = 0; i < responseJson.events.length; i++) {
      //for each game in the events array, add list item to the card
      //with  the opponent, date of the event,start time, and the venue
      $("#results-list").append(
        `<div class="card">
         <div class="card-body"><h3>${responseJson.events[i].strEvent}</h3>
        <p>Date: ${responseJson.events[i].dateEvent}</p>
        <p>Start Time: ${tconvert(responseJson.events[i].strTime)}</p>
        <p> Event venue: ${responseJson.events[i].strVenue}</p>
        </div>
        </div>`
      );
      if (responseJson.events[i].strVenue in venueEvents) {
        venueEvents[responseJson.events[i].strVenue].push(`<h3>${
          responseJson.events[i].strEvent
        }</h3>
          <p>Date: ${responseJson.events[i].dateEvent}</p>
          <p>Start Time: ${tconvert(responseJson.events[i].strTime)}</p>
          <p> Event venue: ${responseJson.events[i].strVenue}</p>`);
      } else {
        venueEvents[responseJson.events[i].strVenue] = [
          `<h3>${responseJson.events[i].strEvent}</h3>
        <p>Date: ${responseJson.events[i].dateEvent}</p>
        <p>Start Time: ${tconvert(responseJson.events[i].strTime)}</p>
        <p> Event venue: ${responseJson.events[i].strVenue}</p`,
        ];
      }
    }
    for (let [venue, value] of Object.entries(venueEvents)) {
      // add marker to the map
      geocoder.geocode({ address: venue }, function (results, status) {
        if (status == "OK") {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location,
          });
          var infoWindow = new google.maps.InfoWindow({
            content: value.join(""),
          });

          marker.addListener("click", function () {
            infoWindow.open(map, marker);
          });
        } else {
          alert(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    }
    // display the map
    $("#map").show();
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
  //fetches api from events url
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
//watch for league change  in league dropdown menu
function watchLeagueChange() {
  $("#allLeagues").on("change", function () {
    const selectedLeague = $(this).val();
    getTeams(selectedLeague);
  });
}
//watch for team change in team dropdown menu
function watchTeamChange() {
  $("#selectedLeague, #allLeagues").on("change", function () {
    const idTeam = $(this).val();
    $("#teamId").val(idTeam);
  });
}

function watchForm() {
  $("form").submit((event) => {
    event.preventDefault();
    const teamId = $("#selectedLeague").val();
    // tconvert(time);
    getGames(teamId);
    initMap();
  });
}

$(function () {
  watchForm();
  watchLeagueChange();
  watchTeamChange();
  getLeagues();
});
