function average(list) {
    var sum = list.reduce(function(a, b) { return a + b; });
    var avg = (sum /list.length).toFixed(2);
    return avg;
}

function displayJudging() {
    $(".title").click(function(evt) {
    $('#list-heading').html($(this).text());
    $('.result-list').html("Be patient while the Eye deliberates.");
    var td_id = $(this).attr("id");
    var movie_id = td_id.substr(5, td_id.length); // hacking the string, fix later
    $.get(
        "/movie",
        {'id': movie_id},
        function(result){
            console.log(result);
            // var movieId = result['movie_id'];
            var beratement = result['beratement'];
            // var movieTitle = result['movie_title'];
            var prediction = result['prediction'];
            var userRating = result['user rating'];
            console.log(userRating);
            if (userRating !== null) {
                $('.result-list').html("You rated this movie as: "+userRating);
            } else {
                console.log("no user rating");
                $('.result-list').html("The eye predicts your rating to be  "+prediction.toFixed(2));
            }
            
            $('.result-list').append('<p>'+beratement+'</p>');

        });
    });
}

function loadDashboard(){
    $.get(
        "/get-user-ratings",
        function(result) {
            console.log(result);
            var ratings = [];
            $('.result-list').html("<table id='movie-list'><th>Title</th><th>Rating</th><th><button id='update-button'>Update?</button></th></table>");
            Object.keys(result).forEach(function(movie_title) {
                var movie_rating = result[movie_title][0];
                var movie_id = result[movie_title][1];
                
                ratings.push(movie_rating);
                $('#movie-list').append("<tr><td class='title' id=title"+movie_id+">"+
                    movie_title+"</td><td id=rating"+movie_id+">"+
                    movie_rating+
                    "</td><td><input type='text' class='update-box' id="+movie_id+" style='width:25px'></td></tr>");
            });

            displayJudging();

            $('#update-button').click(function(evt){
                var updates = {};
                $('.update-box').each(function(index){
                    console.log(index + ":" + $(this).val() + ":" + $(this).attr("id"));
                    var ratingUpdate = $(this).val();
                    var movieId = $(this).attr("id");
                    $(this).val("");
                    if (ratingUpdate !== ""){
                        updates[movieId] = ratingUpdate;
                    }

                });
                console.log(updates);
                $.post(
                    "/update_ratings",
                    {"updates": JSON.stringify(updates)},
                    function(result){
                        console.log(result);
                        Object.keys(updates).forEach(function(movie_id){
                            var rating = updates[movie_id];
                            $('#rating'+movie_id.toString()).html(rating);
                            loadDashboard();
                        });
                        });
            });
            avg = average(ratings);
            $('#list-heading').html('Dashboard: Your average rating is ' + avg.toString());
    });
}

$(document).ready(function(e) {
    loadDashboard();
});

$('#get-dashboard').click(function(evt) {
    loadDashboard();
});

$('#log-out').click(function(evt) {
    $.post(
        "/log-out",
        function(result) {
            // this request asks judgement.py to clear the user's session id
            console.log(result);
            window.location = result;
        });
});
    
$('#get-users').click(function(evt) {
    $.get(
        "/get-user-list",
        function(result) {
            // console.log(result);
            $('.result-list').html("<table id='users-list'><th>User ID</th></table>");
            result["users"].forEach(function(user_id){
                $('#users-list').append("<tr><td><button class='user-button' value="+user_id+">"+user_id+"</button></td></tr>");
            });


            $('.user-button').click(function(evt) {
                $.get(
                    "/get-user-ratings",
                    {"id": $(this).val()},
                    function(result) {
                        // console.log(result);
                        var ratings = [];
                        $('.result-list').html("<table id='movie-list'><th>Title</th><th>Rating</th><table>");
                        Object.keys(result).forEach(function(movie_title) {
                            console.log(movie_title, result[movie_title]);
                            var rating = result[movie_title][0];
                            var movie_id = result[movie_title][1];
                            ratings.push(rating);
                            $('#movie-list').append("<tr><td class='title' id=title"+movie_id+">"+movie_title+"</td><td>"+rating+"</td></tr>");
                        });
                        avg = average(ratings);
                        $('#list-heading').html('The average rating for this user: ' + avg.toString());
                displayJudging();
                });
                
            });
    });
    $('#list-heading').html('Click on User ID for a list of their ratings!');
});
