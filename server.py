"""Server for news app."""

from flask import Flask, render_template, request, flash, session, redirect, jsonify
from model import connect_to_db
import json
import os
from newsapi import NewsApiClient
import pprint
import requests
import crud

from jinja2 import StrictUndefined

API_SECRET_KEY = os.environ.get('API_KEY')

newsapi = NewsApiClient(api_key=API_SECRET_KEY)

app = Flask(__name__)
app.secret_key = 'dev'
app.jinja_env.undefined = StrictUndefined


@app.route("/v2")
def root():
    return render_template("root.html")

@app.route("/v2/api/top-posts")
def get_news_articles():
    pass



@app.route("/login", methods = ["GET", "POST"])
def user_login():
    """Allow user to log in or option to create new account"""

    username = request.form.get("username")
    
    password = request.form.get("password")

    user = crud.get_user(username, password)

    if user:
        session["logged_in"] = True
        return render_template("homepage.html")
    else:
        flash("Please enter a valid username and password")    
        return render_template("login.html")
        


def create_account(): 
    """Allow a new user to create an account""" 
    pass


@app.route("/")
def fetch_home():
    """View Homepage"""

    return render_template("homepage.html")

@app.route("/stories")
def fetch_stories():
    """Return news stories as JSON"""

    #decide whether to use q (keyword in any part of the article) or qInTitle (keyword search in title)
    
    url = ('http://newsapi.org/v2/everything?'
       'qInTitle=mountains&'
       'from=2020-08-16&'
       'sortBy=popularity&'
       'apiKey=' + API_SECRET_KEY)
       
    response = requests.get(url) 
    
    response_json = response.json()
    
    articles = response_json['articles']

    return jsonify(articles)   


@app.route("/search", methods=["GET", "POST"])
def topic_search():
    """Search for articles that include a specific keyword"""
    topic_keyword = request.args["topic_keyword"]

    url = ('http://newsapi.org/v2/everything?'
        'q=' + topic_keyword + '&' +
        'from=2020-08-16&'
        'sortBy=popularity&'
        'apiKey=' + API_SECRET_KEY)

    response = requests.get(url) 
    
    response_json = response.json()
    
    articles = response_json['articles'] 
    
    return jsonify(articles)


@app.route("/profile")
def show_user_profile():
    """View user's profile and saved articles"""

    return render_template("profile.html")




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

    # client.run(os.environ['API_KEY'])
