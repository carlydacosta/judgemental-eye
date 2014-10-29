function loadDashboard(){
    $.get(
        "/get-user-ratings",
        function(result) {
            console.log(result);
            var ratings = [];
            $('.result-list').html("<table id='movie-list'><th>Title</th><th>Rating</th><th><button id='update-button'>Update?</button></th></table>");
            Object.keys(result).forEach(function(movie_title) {
                // console.log(movie_title, result[movie_title]);
                ratings.push(result[movie_title]);
                var movie_id = 6;
                $('#movie-list').append("<tr><td>"+
                    movie_title+"</td><td>"+
                    result[movie_title]+
                    "</td><td><input type='text' class='update-box' id="+movie_id+" style='width:25px'></td></tr>");
            });

            //CLICK HANDLER FOR UPDATE
            $('#update-button').click(function(evt){
                var updates = {};
                // est an object
                $('.update-box').each(function(index){
                    console.log(index + ":" + $(this).val() + ":" + $(this).attr("id"));
                    var ratingUpdate = $(this).val();
                    var movieId = $(this).attr("id");
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
                        // update rating tag with new values
                    });
            });

            // console.log(ratings);
            var sum = ratings.reduce(function(a, b) { return a + b; });
            var avg = (sum /ratings.length).toFixed(2);
            // console.log(avg);
            $('#list-heading').html('Dashboard: Your average rating is ' + avg.toString());
    });
}

$(document).ready(function(e) {
    loadDashboard();
});

$('#get-dashboard').click(function(evt){
    loadDashboard();
});
    
$('#get-users').click(function(evt){
    $.get(
        "/get-user-list",
        function(result){
            console.log(result);
            $('.result-list').html("<table id='users-list'><th>User ID</th></table>");
            console.log(result["users"]);
            result["users"].forEach(function(user_id){
                $('#users-list').append("<tr><td><button class='user-button' value="+user_id+">"+user_id+"</button></td></tr>");
            });

            $('.user-button').click(function(evt) {
                console.log(typeof($(this).val()));
                $.get(
                    "/get-user-ratings",
                    {"id": $(this).val()},
                    function(result) {
                        console.log(result);
                        var ratings = [];
                        $('.result-list').html("<table id='movie-list'><th>Title</th><th>Rating</th><table>");
                        Object.keys(result).forEach(function(movie_title) {
                            // console.log(movie_title, result[movie_title]);
                            ratings.push(result[movie_title]);
                            $('#movie-list').append("<tr><td>"+movie_title+"</td><td>"+result[movie_title]+"</td></tr>");
                        });
            // console.log(ratings);
            var sum = ratings.reduce(function(a, b) { return a + b; });
            var avg = (sum /ratings.length).toFixed(2);
            // console.log(avg);
            $('#list-heading').html('The average rating for this user: ' + avg.toString());
                        });
            });
    });
    // console.log($('.user-button'));
    
    $('#list-heading').html('Click on User ID for a list of their ratings!');


    });
