from flask import Flask, render_template, redirect, request, jsonify
from flask import session as b_session
import model
import json
import ast

app = Flask(__name__)

app.secret_key = 'a4c96d59-57a8-11e4-8b97-80e6501ee2f6'

@app.route("/")
def welcome():
    # render the welcome html, which offers log in or sign up buttons
    return render_template("welcome.html")

@app.route("/index.html")
def index():
    return render_template("index.html")

#function to create new user
@app.route("/new-user", methods=['POST'])
def create_new_user():

    email = request.form.get("new-user-email")
    pw = request.form.get("new-user-pw")
    age = request.form.get("new-user-age")
    zipcode = request.form.get("new-user-zipcode")
    ## check for validity of information passed into the form
    print 'new user:', email, pw, zipcode, age
    ## updating the database
    user = model.User(email=email, password=pw, age=age, zipcode=zipcode)
    model.session.add(user)
    model.session.commit()

    return "/index.html"

@app.route("/log-in", methods=['POST'])
def log_in():

    email = request.form.get("user-email")
    pw = request.form.get("user-pw")
    print 'log in request for:', email, pw

    query = model.session.query(model.User).filter_by(email=email).one()
    if query.password == pw:
        b_session.setdefault("user", {}) #if there is no user key yet, add one
        if query.id not in b_session["user"]: #if name is not in session already
            b_session["user"] = query.id #puts in the session
        return json.dumps({ "result": "/index.html" })

    return json.dumps({ "error": "try again"})

@app.route("/get-user-ratings")
def get_user_ratings(id = None):
    id = request.args.get("id")
    if id == None:
        id = b_session["user"]

    rating_object = model.session.query(model.Rating).filter_by(user_id=id).all()
    ratings_list = {}

    for rating in rating_object:
        ratings_list[rating.movie.name] = rating.rating

    return jsonify(**ratings_list) ## JSONIFY!!!

@app.route("/get-user-list")
def get_user_list():

    user_list = model.session.query(model.User).limit(20).all()
    user_dict = {'users': []}

    for user in user_list:
        # user_dict[str(user.id)] = "name"
        user_dict['users'].append(user.id)

    print user_dict
    return jsonify(**user_dict)

@app.route("/update_ratings", methods=['POST'])
def update_ratings():
    # key = movie id   value = updated rating
    updates_dict = request.form.get("updates")
    updates_dict = ast.literal_eval("{'code1':1,'code2':1}")
    # get user object for the viewer (i.e. 5)
    print "this is what was returned: ", updates_dict
    # print dir(updates_dict)
    print "this is its type:", type(updates_dict)
    for movie_id, updated_rating in updates_dict.iteritems():
        # key = movie
        query = model.session.query(model.Rating).filter_by(user_id="5", movie_id=movie_id).all()
        print query

    # rating_obj_list = model.session.query(model.Rating).filter_by(user_id=5).all()
    # print rating_obj_list, "*****"
    # # iterate through the dictionary keys, update the user attributes
    # for rating in rating_obj_list:
    #     print rating.movie_id, "-------"
    # model.session.commit()

    # print updates_dict
    return  json.dumps({ "success": "try again"})

if __name__ == "__main__":
    app.run(debug=True)

