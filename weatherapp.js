$(document).ready(function () {
  $("#citySearch").click(function () {
    if ($("#cityName").val().length > 0) {
      $(".table tbody").prepend(
        '<tr><td class="selectedRow">' + $("#cityName").val() + "</td></tr>"
      );
      localStorage.setItem("searchVal", $("#cityName").val());
      //console.log(localStorage.getItem("searchVal"));
      getWeatherDetials($("#cityName").val());
    }
  });

  //console.log(localStorage.getItem("searchVal"), "on page load");
  console.log(localStorage, "localStorage");

  if (
    localStorage &&
    localStorage.getItem("searchVal") &&
    localStorage.getItem("searchVal") != null
  ) {
    getWeatherDetials(localStorage.getItem("searchVal"));
  }

  function getWeatherDetials(searchData) {
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        searchData +
        "&units=imperial&appid=bc03e144d9331b6b02515ddaaa77e5a0",
      method: "get",
    })
      .done(function (data) {
        console.log("data", data);
        var cityname = data.city.name;
        var currentDate = data.list[0].dt_txt;
        var tempArr = [];
        var momentFormattedDate = moment(currentDate).format("MM/DD/YYYY");
        var todaysDate = new Date();
        var todaysDate = moment(todaysDate).format("YYYY-MM-DD");
        console.log("todaysDate", todaysDate);
        var icon = data.list[0].weather[0].icon;
        var temp = data.list[0].main.temp;
        var humidity = data.list[0].main.humidity;
        var windSpeed = data.list[0].wind.speed;
        var latitude = data.city.coord.lat;
        var longitude = data.city.coord.lon;
        $("#cityTemp").text(temp).append("&deg; F");
        $("#cityHumidity").text(humidity + "%");
        $("#citywindSpeed").text(windSpeed);
        console.log(cityname);
        $("#placeName").text(cityname + " (" + momentFormattedDate + ")");
        $("#weathericonImg").attr(
          "src",
          "https://openweathermap.org/img/wn/" + icon + "@2x.png"
        );
        $("#weathericonImg").show();
        for (var i = 0; i < data.list.length; i++) {
          if (data.list[i].dt_txt.indexOf("12:00:00") != -1) {
            //&& (data.list[i].dt_txt).indexOf(todaysDate) == -1
            tempArr.push(data.list[i]);
          }
        }
        $("#carddivContainer").empty();
        $.each(tempArr, function (i, val) {
          var dateFormatForArray = moment(val.dt_txt).format("MM/DD/YYYY");
          $("#carddivContainer").append(
            '<div class="card col-12 col-sm-3 col-md-4 col-lg-2 col-xl-2">' +
              '<div class="card-body">' +
              "<div class=card-title>" +
              dateFormatForArray +
              "</div>" +
              '<img id=forecast-img src="https://openweathermap.org/img/wn/' +
              val.weather[0].icon +
              '@2x.png"/>' +
              "<p class=card-text>Temp: " +
              val.main.temp +
              "&deg; F</p>" +
              "<p class=card-text>Humidity: " +
              val.main.humidity +
              "%</p>" +
              "</div>" +
              "</div>"
          );
        });
        console.log(tempArr);
        // $("#events").html(prepareEvents(data));
        // for(var v=0;v<data.length;v++) {

        // }
        $.ajax({
          url:
            "https://api.openweathermap.org/data/2.5/uvi?appid=bc03e144d9331b6b02515ddaaa77e5a0&lat=" +
            latitude +
            "&lon=" +
            longitude +
            "",
          method: "get",
        })

          .done(function (data) {
            console.log("uv data", data);
            var uvValue = data.value;
            $("#cityuvIndex").text(uvValue);
            if (uvValue < 3) {
              document.getElementById("uvContainerDiv").style.backgroundColor =
                "Green";
            } else if (uvValue < 6) {
              document.getElementById("uvContainerDiv").style.backgroundColor =
                "Yellow";
            } else if (uvValue < 8) {
              document.getElementById("uvContainerDiv").style.backgroundColor =
                "Orange";
            } else if (uvValue < 11) {
              document.getElementById("uvContainerDiv").style.backgroundColor =
                "Red";
            } else {
              document.getElementById("uvContainerDiv").style.backgroundColor =
                "Violet";
            }
          })
          .fail(function (data) {
            alert("events api call failed");
          });
      })
      .fail(function (data) {
        alert("events api call failed");
      });
    $("#cityName").val(localStorage.getItem("searchVal"));
  }

  $(document).on("click", ".selectedRow", function (e) {
    console.log(e.target.textContent);
    $("#cityName").val(e.target.textContent);
    localStorage.setItem("searchVal", e.target.textContent);
    getWeatherDetials(e.target.textContent);
  });
});
