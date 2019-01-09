// spinner during api call
// destructure api results
// html templates for the gif elements variables

var movies = ["The Matrix", "The Notebook", "Mr. Nobody", "The Lion King"];

function renderButtons() {
    $("#buttons-container").empty();
    for (var i = 0; i < movies.length; i++) {
        let btn = `
                <button class="btn btn-success" type="button" data-name="${movies[i]}">${movies[i]}</button>
            `;
        $("#buttons-container").append(btn);
    }
}

function displayGifs() {
    let movie = $(this).attr("data-name"),
        api_key = "2waeg1EgKzge3SHpASXilZ93joi92FC2",
        queryURL = "https://api.giphy.com/v1/gifs/search?q=" + movie + "&api_key=" + api_key + "&limit=10";

    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .done(function(results) {
        let data = results.data;
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            let { rating, images: {fixed_width} } = data[i];
            let gifDiv = `
                    <div class="card border-0">
                        <img class="card-img-top" src="${fixed_width.url}">
                        <div class="card-body">
                            <p class="card-text">Rating: ${rating}</p>
                        </div>
                    </div>
                `;
            $("#gifs-container").prepend(gifDiv);
        }
    })
    .fail(function(err) {
        throw err;
    });
}
// trigger to display the gifs
$('#buttons-container').on('click', 'button', displayGifs);

// function to add more buttons
$("#add-button").on("click", function(event) {
    event.preventDefault();
    let movie = $("#search-input").val().trim();
    // checking if the movie is already in the array, prevent adding if it already exist
    if (movie !== '' && movies.indexOf(movie) < 0) {
        movies.push(movie);
        renderButtons();
    }
});

renderButtons();
