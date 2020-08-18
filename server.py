"""Server for news app."""

from flask import Flask, render_template, request, flash, session, redirect
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


@app.route("/login")
def user_login():
    """Allow user to log in or option to create new account"""

    return render_template("login.html")


@app.route("/")
def fetch_stories():
    """View News Homepage"""

    #decide whether to use q (keyword in any part of the article) or qInTitle (keyword search in title)
    
    url = ('http://newsapi.org/v2/everything?'
       'qInTitle=mountains&'
       'from=2020-08-16&'
       'sortBy=popularity&'
       'apiKey=' + API_SECRET_KEY)
       

  
    response = requests.get(url) 
    
    response_json = response.json()
    
    articles = response_json['articles']  

    # for article in articles:
    #     source = article["source"]["name"]
    #     title = article["title"]
    #     author = article["author"]
    #     description = article["description"]
    #     story_link = article["url"]
    #     image = article["urlToImage"]
    #     content = article["content"]
    #     published = article["publishedAt"]

    #     new_story = crud.create_story(source, title, author, description, story_link, image, content, published)

    return render_template("homepage.html", articles=articles)


@app.route("/search", methods=["GET", "POST"])
def topic_search():
    topic_keyword = request.args["topic_keyword"]

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
    
    return render_template("articles.html", topic_keyword=topic_keyword, articles=articles)

# @app.route("/save")
# def save_article():

    


@app.route("/profile")
def show_user_profile():
    """View user's profile and saved articles"""

    return render_template("profile.html")




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

    # client.run(os.environ['API_KEY'])
