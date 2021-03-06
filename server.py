"""Server for news app."""

from flask import Flask, render_template, request, flash, session, redirect, jsonify, escape
from model import connect_to_db
from datetime import date, datetime
import json
import os
from newsapi import NewsApiClient
import pprint
import requests
import crud

from jinja2 import StrictUndefined

API_SECRET_KEY = os.environ.get('API_KEY')
TODAY = date.today().strftime("%Y-/%m-/%d")

newsapi = NewsApiClient(api_key=API_SECRET_KEY)



app = Flask(__name__)
app.secret_key = 'dev'
app.jinja_env.undefined = StrictUndefined


@app.route("/")
def root():

    return render_template("root.html")

@app.route("/api/top-news")
def get_news_articles():
    url = ('http://newsapi.org/v2/everything?'
       'q=meditation&'
       'from=' + TODAY +'&'
       'language=en&'
       'pageSize=25&'
       'sortBy=publishedAt&'
       'sortBy=relevancy&'
       'apiKey=' + API_SECRET_KEY)

    response = requests.get(url)

    response_json = response.json()

    articles = response_json['articles']

    user = session.get("user_id", 0)
    save_article_to_db(articles, user)

    if 'user_id' in session:
        print('Hey, {}!'.format(escape(session['user_id'])))
    else:
        print('You are not signed in!')

    return jsonify(articles)

@app.route("/api/login", methods = ["POST", "GET"])
def user_login():
    """Allow user to log in to their existing account"""

    # username = request.args["username"]

    # password = request.args["password"]

    username = request.form.get("username")

    password = request.form.get("password")

    user = crud.get_user(username, password)

    if user:
        session["logged_in"] = True
        session["user"] = username
        session["password"] = password
        session["user_id"] = user.user_id

        return jsonify({
            'user': username,
            'password': password,
            'user_id': user.user_id,
            'logged_in': True,
            "favoriteTopics": ['Wellness', 'Yoga']
        })


@app.route("/api/search", methods=["GET", "POST"])
def topic_search():
    """Search for articles that include a specific keyword"""
    print("This is a test")

    topic_keyword = request.args["topic_keyword"]

    url = ('http://newsapi.org/v2/everything?'
        'q=' + topic_keyword + '&' +
        'from=' + TODAY +'&'
        'pageSize=25&'
        'sortBy=publishedAt&'
        'apiKey=' + API_SECRET_KEY)

    response = requests.get(url)

    response_json = response.json()

    articles = response_json['articles']

    user = session.get("user_id", 0)

    articles = save_article_to_db(articles, user)


    return jsonify(articles)

def save_article_to_db(articles, userId):
    for article in articles:
        source = article["source"]["name"]
        title= article["title"]
        author = article["author"]
        description = article["description"]
        story_link = article["url"]
        image = article["urlToImage"]
        content = article["content"]
        published = article["publishedAt"]

        story = crud.get_story(source, title, author, description)

        print(story)

        if not story:
            print(f"creating story {story}")
            story = crud.create_story(source, title, author, description, story_link, image, content, published)

        article["storyId"] = story.story_id

        saved_story = crud.get_saved_stories_by_user_and_story(userId, story.story_id)

        article["favorite"] = saved_story != None

    return articles

@app.route("/topicCategory", methods=["GET", "POST"])
def category_article_search():

    topicCategory = request.args["topicCategory"]

    url = ('https://newsapi.org/v2/top-headlines?country=us&category=' + topicCategory + '&pageSize=25&apiKey=' + API_SECRET_KEY)

    response = requests.get(url)

    response_json = response.json()

    articles = response_json['articles']

    user = session.get("user_id", None)

    articles = save_article_to_db(articles, user)


    return jsonify(articles)


@app.route("/api/save_article", methods = ["GET", "POST"])
def save_article_to_favorites():

    story_id = request.args["storyId"]
    print(story_id)
    user = session.get("user_id", 0)

    if user:
        crud.save_story(user, story_id)

    return jsonify({"success": True})




@app.route("/api/profile_stories")
def user_profile_data():
    """View user's profile and saved articles"""

    user = session.get("user_id", None)

    profile_stories = crud.get_saved_stories_by_user(user)
    print(profile_stories)

    story_list = [story_db_to_json(story, True) for story in profile_stories]

    return jsonify(story_list)


def story_db_to_json(story, favorite):

    return {
            "author": story.author,
            "content": story.content,
            "description": story.description,
            "favorite": favorite,
            "publishedAt": story.published,
            "source": {
                "id": None,
                "name": story.source
            },
            "storyId": story.story_id,
            "title": story.title,
            "url": story.story_link,
            "urlToImage": story.image
            }

    return jsonify({})

@app.route("/api/remove_article")
def remove_from_favorites():

    story_id = request.args["storyId"]

    user = session.get("user_id")
    print(f"The User trying to remove the story is {user}")
    # user = session["user_id"]
    crud.remove_from_favorites(user, story_id)

    return jsonify({"success": True})


@app.route("/api/logout")
def user_logout():
    user = session.get("user_id")
    logged_in = session.get("logged_in")
    favorite_topics = session.get("favoriteTopics")
    print(f"The current user information is: {session.keys()}")

    if user:
        session.pop("user_id")
        session.pop("logged_in")
        print(f"Now The current user information is: {session.keys()}")


    return jsonify({
            "success": True})

@app.route("/create_account", methods = ["GET", "POST"])
def create_account():
    """Allow a new user to create an account"""

    username = request.args["username"]

    password = request.args["password"]


    user = crud.get_user(username, password)

    if user:
        flash('This username already exists! Try again.')
    else:
        crud.create_user(email, password)
        flash('Account created! Please log in.')

    return jsonify({
            'username': username,
            'password': password,
            'user_id': user.user_id,
            'logged_in': True,
            "favoriteTopics": ['Wellness', 'Yoga']
        })



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

