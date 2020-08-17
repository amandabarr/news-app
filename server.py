"""Server for news app."""

from flask import Flask, render_template, request, flash, session, redirect
from model import connect_to_db
import json
import os
from newsapi import NewsApiClient
import pprint
import requests

from jinja2 import StrictUndefined

API_SECRET_KEY = os.environ.get('API_KEY')

newsapi = NewsApiClient(api_key=API_SECRET_KEY)

app = Flask(__name__)
app.secret_key = 'dev'
app.jinja_env.undefined = StrictUndefined

# url = "http://newsapi.org/v2/everything?q=sharks&from=2020-08-11&to=2020-08-11&sortBy=popularity&apiKey=" + API_SECRET_KEY
# response = requests.get(url)
# response_json = response.json()
# pprint.pprint(response_json)

@app.route("/login")
def user_login():
    """Allow user to log in or create new account"""

    return render_template("login.html")


@app.route("/")
def fetch_stories():
    """View News Homepage"""

    
    url = ('http://newsapi.org/v2/everything?'
       'q=mountains&'
       'from=2020-08-16&'
       'sortBy=popularity&'
       'apiKey=' + API_SECRET_KEY)
       

  
    response = requests.get(url) 
    
    response_json = response.json()
    
    articles = response_json['articles']  
   

    return render_template("homepage.html", articles=articles)


@app.route("/", methods=["GET", "POST"])
def topic_search():

    topic_keyword = request.form["topic_keyword"]
    

    url = ('http://newsapi.org/v2/everything?'
        'q=' + topic_keyword + '&' +
        'from=2020-08-16&'
        'sortBy=popularity&'
        'apiKey=' + API_SECRET_KEY)

    response = requests.get(url) 
    
    response_json = response.json()
    
    articles = response_json['articles'] 

    with open("./data/stories.json", "w") as outfile:
        json.dump(articles, outfile)

    return render_template("homepage.html", topic_keyword=topic_keyword, articles=articles)
 

@app.route("/profile")
def show_user_profile():
    """View user's profile and saved articles"""

    return render_template("profile.html")




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

    # client.run(os.environ['API_KEY'])
