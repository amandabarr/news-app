"""Server for news app."""

from flask import Flask, render_template, request, flash, session, redirect, jsonify
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
       'q=mindfulness&'
       'from=' + TODAY +'&'
       'sortBy=publishedAt&'
       'apiKey=' + API_SECRET_KEY)

    response = requests.get(url)

    response_json = response.json()

    articles = response_json['articles']

    articles = save_article_to_db(articles)

    return jsonify(articles)




# @app.route("/")
# def fetch_home():
#     """View Homepage"""

#     if "user" in session:
#         username = session["user"]
#         return render_template("homepage.html")
#     else:
#         return redirect("/login")

@app.route("/stories")
def fetch_stories():
    """Return news stories as JSON"""

    url = ('http://newsapi.org/v2/everything?'
       'q=mindfulness&'
       'from=' + TODAY +'&'
       'sortBy=publishedAt&'
       'apiKey=' + API_SECRET_KEY)

    response = requests.get(url)

    response_json = response.json()

    articles = response_json['articles']

    articles = save_article_to_db(articles)

    return jsonify(articles)


@app.route("/search", methods=["GET", "POST"])
def topic_search():
    """Search for articles that include a specific keyword"""

    topic_keyword = request.args["topic_keyword"]

    url = ('http://newsapi.org/v2/everything?'
        'q=' + topic_keyword + '&' +
        'from=' + TODAY +'&'
        'sortBy=publishedAt&'
        'apiKey=' + API_SECRET_KEY)

    response = requests.get(url)

    response_json = response.json()

    articles = response_json['articles']

    articles = save_article_to_db(articles)

    return jsonify(articles)

def save_article_to_db(articles):
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

        if not story:
            story = crud.create_story(source, title, author, description, story_link, image, content, published)

        article["storyId"] = story.story_id

    return articles

@app.route("/save_article", methods = ["GET", "POST"])
def save_article_to_favorites():
    # crud function to save article under specific user.  Need to get primary keys user_id and story_id and option to comment/tag
    story_id = request.form.get("storyId")
    # session["user_id"]

    crud.save_story(session["user_id"], story_id)

    return jsonify({"success": True})

    # return jsonify({"response": "ok"})
    # on front end, event listener or re-use existing, test that event listener is working by printing, make network request, check that
    # server is getting response, form.get vs params,


@app.route("/login", methods = ["GET", "POST"])
def user_login():
    """Allow user to log in or option to create new account"""

    username = request.form.get("username")

    password = request.form.get("password")

    user = crud.get_user(username, password)


    if user:
        session["user"] = username
        session["password"] = password
        session["user_id"] = user.user_id
        print(session)
        print(session['user_id'])
        return redirect("/")
    else:
        flash("Please enter a valid username and password")
        return render_template("login.html")

# @app.route("/api/user", methods = ["GET"])
# def user_api():
#     """Allow user to log in or option to create new account"""
#     # { name: 'Amanda', topics: ['Cats', 'Dogs', 'Business'] }
#     return session

# @app.route("/logout")
# def user_logout():
#     session.pop("username", None)
#     return redirect(url_for("login"))


# def create_account():
#     """Allow a new user to create an account"""

#     username = request.form.get('username')
#     password = request.form.get('password')

#     user = crud.get_user(username, password)

#     if user:
#         flash('This username already exists! Try again.')
#     else:
#         crud.create_user(email, password)
#         flash('Account created! Please log in.')
#     pass

@app.route("/profile")
def show_user_profile():

    return render_template("profile.html")


@app.route("/profile_stories")
def user_profile_data():
    """View user's profile and saved articles"""

    user_id = session["user_id"]

    profile_stories = crud.get_saved_stories_by_user(user_id)
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



if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

