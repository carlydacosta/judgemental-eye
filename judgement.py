from flask import Flask, render_template, redirect, request
from flask import session as b_session
import model
import json

app = Flask(__name__)

app.secret_key = 'a4c96d59-57a8-11e4-8b97-80e6501ee2f6'

# @app.route("/")
# def index():

#     user_list = model.session.query(model.User).limit(5).all()
#     # print user_list
#     return render_template("user_list.html", users=user_list)

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
    print 'new user:', email, pw, zipcode, age
    ## updating the database
    user = model.User(email=email, password=pw, age=age, zipcode=zipcode)
    model.session.add(user)
    model.session.commit()
    return redirect("/index.html")

@app.route("/log-in", methods=['POST'])
def log_in():
    email = request.form.get("user-email")
    pw = request.form.get("user-pw")
    print 'log in request for:', email, pw

    query = model.session.query(model.User).filter_by(email=email).one()
    if query.password == pw:
        b_session.setdefault("users", []) #if there is no users key yet, add one
        if query.id not in b_session["users"]: #if name is not in session already
            b_session["users"].append(query.id) #puts in the session
        return json.dumps({ "result": "/index.html" })
    # else:
        # please try another name or password
    # return "Please try another name or password."
    return json.dumps({ "error": "try again"})


if __name__ == "__main__":
    app.run(debug=True)