let heroes = ["Superman", "Batman", "Deadpool", "Black Panther", "Iron Man", "Captain America", "Wonder Woman", "Aquaman"];

let currentLimit = 0,
    lastQuery = '',
    liked = [];

if (localStorage.getItem('liked')) {
    liked = JSON.parse(localStorage.getItem('liked'));
}

function renderButtons() {
    $("#buttons-container").empty();
    for (var i = 0; i < heroes.length; i++) {
        let btn = `
                <button class="btn btn-success" type="button" data-name="${heroes[i]}">${heroes[i]}</button>
            `;
        $("#buttons-container").append(btn);
    }
}
function displayGifs(query, showMore) {
    let hero = query,
        api_key = "2waeg1EgKzge3SHpASXilZ93joi92FC2",
        // offset = Math.floor(Math.random() * 25),
        offset = 0,
        limit = showMore == true ? currentLimit + 10 : 10,
        queryURL = "https://api.giphy.com/v1/gifs/search?q=" + hero + "&api_key=" + api_key + "&offset=" + offset + "&limit=" + limit;

        currentLimit = lastQuery != query ? 0 : currentLimit,

    lastQuery = query;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .done(function(results) {
        let data = results.data;
        let gifDiv = '';
        console.log(data);
        for (var i = 0 + currentLimit; i < data.length; i++) {
            let { id, title, rating, embed_url, images: {fixed_width_still, fixed_width} } = data[i];
            gifDiv += `
                    <div class="card border-0">
                        <img class="card-img-top gif" src="${fixed_width_still.url}" data-paused="${fixed_width_still.url}"  data-play="${fixed_width.url}" data-state="paused">
                        <div class="card-body">
                `;
            if (liked.indexOf(id) > -1) {
                gifDiv += `<a href="#" class="fave-icon liked float-right" data-id="${id}"></a>`;
            }
            else {
                gifDiv += `<a href="#" class="fave-icon float-right" data-id="${id}"></a>`;
            }
            gifDiv += `
                            <p class="card-text">Rating: <span class="rating-value">${rating}</span></p>
                            <p class="card-text">Title:<br>${title}</p>
                            <p class="card-text">Embed URL:<br><a class="embed-url" href="${embed_url}" target="_blank">${embed_url}</a></p>
                        </div>
                    </div>
                `;
        }

        // setting current limit to the number of gifs displayed
        currentLimit  = limit;

        if (!showMore) {
            $("#gifs-container").empty().append(gifDiv);
        }
        else {
            $("#gifs-container").append(gifDiv);
        }
        $("#show-more").show();
        $("#show-more button").attr('data-name', lastQuery);
    })
    .fail(function(err) {
        throw err;
    });
}

// trigger to display the gifs
$('#buttons-container').on('click', 'button', function() {
    event.preventDefault();
    let query = $(this).attr("data-name");
    $("#buttons-container button").removeAttr("disabled");
    $(this).attr("disabled", "disabled");
    displayGifs(query);
});
$('#show-more').on('click', 'button', function() {
    event.preventDefault();
    let query = $(this).attr("data-name");
    displayGifs(query, true);
});

// triggger to play/pause Gifs
$("#gifs-container").on("click", "img.gif", function() {
    event.preventDefault();
    var state = $(this).data("state");
    if (state === "paused") {
        $(this).attr("src", $(this).data("play"));
        $(this).data("state", "play");
    } else {
        $(this).attr("src", $(this).data("paused"));
        $(this).data("state", "paused");
    }
});

// favorite icon
$('#gifs-container').on('click', '.fave-icon', function() {
    event.preventDefault();
    let gifID = $(this).data("id")
    if (liked.indexOf(gifID) < 0) {
        $(this).addClass('liked');
        liked.push(gifID);
    }
    else {
        $(this).removeClass('liked');
        var index = liked.indexOf(gifID);
        if (index > -1) {
            liked.splice(index, 1);
        }
    }
    localStorage.setItem('liked', JSON.stringify(liked));
});

// function to add more buttons
$("#add-button").on("click", function(event) {
    event.preventDefault();
    let hero = $("#search-input").val().trim();
    let heroCheck = false;
    for (let i = 0; i < heroes.length; i++) {
        let heroInArray = heroes[i];
        // console.log(heroInArray);
        // console.log(hero);
        if (heroInArray.toLowerCase() == hero.toLowerCase()) {
            console.log(heroCheck);
            heroCheck = true;
            console.log(heroCheck);
            break;
        }
    }
    // checking if the hero is already in the array, add button if it's not
    if (hero !== '' && !heroCheck) {
        heroes.push(hero);
        renderButtons();
    }
});

renderButtons();
