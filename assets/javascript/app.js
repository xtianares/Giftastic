// spinner during api call
// destructure api results
// html templates for the gif elements variables

var heroes = ["Superman", "Batman", "Deadpool", "Black Panther", "Iron Man", "Captain America", "Wonder Woman", "Aquaman"];

function renderButtons() {
    $("#buttons-container").empty();
    for (var i = 0; i < heroes.length; i++) {
        let btn = `
                <button class="btn btn-success" type="button" data-name="${heroes[i]}">${heroes[i]}</button>
            `;
        $("#buttons-container").append(btn);
    }
}
function displayGifs(more) {
    let hero = $(this).attr("data-name"),
        api_key = "2waeg1EgKzge3SHpASXilZ93joi92FC2",
        offset = Math.floor(Math.random() * 25),
        limit = 10
        queryURL = "https://api.giphy.com/v1/gifs/search?q=" + hero + "&api_key=" + api_key + "&offset=" + offset + "&limit=" + limit;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .done(function(results) {
        let data = results.data;
        let gifDiv = '';
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            let { rating, embed_url, images: {fixed_width_still, fixed_width} } = data[i];
            gifDiv += `
                    <div class="card border-0">
                        <img class="card-img-top gif" src="${fixed_width_still.url}" data-paused="${fixed_width_still.url}"  data-play="${fixed_width.url}" data-state="paused">
                        <div class="card-body">
                            <p class="card-text">Rating: <span class="rating-value">${rating}</span></p>
                            <p class="card-text">Embed URL: <a class="embed-url" href="${embed_url}" target="_blank">${embed_url}</a></p>
                        </div>
                    </div>
                `;
        }
        // $("#gifs-container").empty();
        $("#gifs-container").empty().prepend(gifDiv);
        $("#show-more").show();
    })
    .fail(function(err) {
        throw err;
    });
}

// trigger to display the gifs
$('#buttons-container').on('click', 'button', displayGifs);

// triggger to play/pause Gifs
$("#gifs-container").on("click", "img.gif", function() {
    var state = $(this).data("state");
    if (state === "paused") {
        $(this).attr("src", $(this).data("play"));
        $(this).data("state", "play");
    } else {
        $(this).attr("src", $(this).data("paused"));
        $(this).data("state", "paused");
    }
});

// function to add more buttons
$("#add-button").on("click", function(event) {
    event.preventDefault();
    let hero = $("#search-input").val().trim();
    // checking if the hero is already in the array, prevent adding if it already exist
    if (hero !== '' && heroes.indexOf(hero) < 0) {
        heroes.push(hero);
        renderButtons();
    }
});

renderButtons();
