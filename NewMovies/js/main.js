(function() {
  'use strict';
  var app = WinJS.Application;
  var activation = Windows.ApplicationModel.Activation;
  app.onactivated = function (args) {
    if (args.detail.kind === activation.ActivationKind.launch) {
      if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
        // TODO: This application has been newly launched. Initialize your application here.
      } else {
        // TODO: This application has been reactivated from suspension.
        // Restore application state here.
      }
      args.setPromise(WinJS.UI.processAll().then(function() {
        // TODO: Your code here.
      }));
    }
  };
  app.oncheckpoint = function (args) {
    // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
    // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
    // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
  };
  app.start();

  document.addEventListener("DOMContentLoaded", loadInitialPage, false);
}());

function loadInitialPage() {
    target = document.querySelector("body");
    WinJS.UI.Fragments.renderCopy("/homePage.html", target).done(

        function completed(r) {
            handleLoadedPage();
        }
    );
}

function handleLoadedPage() {
    var circleButton = document.querySelector("#circleButton");
    circleButton.addEventListener("click", loadResultsPage);
}

function loadResultsPage() {
    clearChildren(target);

    WinJS.UI.Fragments.render("/movieDisplay.html", target).done(
		function completed(r) {
		    getMovieData();
		}
	);
}

function clearChildren(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
}

var movieData;

function getMovieData() {
    var movieArray = new Array();
    var apikey = "5tuv6dzxmch9qn2vjvve29g8";
    var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
    var moviesSearchUrl = baseUrl + '/lists/movies/box_office.json?apikey=' + apikey;

    WinJS.xhr({
        url: moviesSearchUrl, dataType: "jsonp"
    }).then(function (xhr) {
        var response = JSON.parse(xhr.response);

        response.movies.forEach(function (i) {
            movieArray.push({
                title: i.title,
                summary: i.synopsis,
                boxart: i.posters.detailed
            });
        });
        movieData = new WinJS.Binding.List(movieArray);

        WinJS.UI.processAll();
    });

    alert(movieData);
}