"""Server for news app."""

from flask import Flask, render_template, request, flash, session, redirect
from model import connect_to_db
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


@app.route("/")
def fetch_stories():
    """View News Homepage"""

    
    url = ('http://newsapi.org/v2/everything?'
       'q=crocodile&'
       'from=2020-08-13&'
       'sortBy=popularity&'
       'apiKey=' + API_SECRET_KEY)
       

  
    response = requests.get(url) 
    print(response)
    response_json = response.json()
    print(response_json)
    articles = response_json['articles']  
    print(articles)

    # title = []
    # author = []
    # description = []
    # story_link = []
    # image = []
    # content = []
    # published = []
   

    # for article in articles:
    #     # source = articles.get('source')

    #     title.append(article['title'])
    #     print(title)
    #     author.append(article['author'])
    #     print(author)
    #     description.append(article['description'])
    #     print(description)
    #     story_link.append(article['url'])
    #     image.append(article['urlToImage'])
    #     content.append(article['content'])
    #     published.append(article['publishedAt'])

    return render_template("homepage.html", articles=articles)
    # ,articles=articles, title=title, author=author, description=description, story_link=story_link, image=image, content=content, published=published)    



    

# @app.route("/")
# def homepage():
#     """View Homepage"""

#     return render_template("homepage.html")







if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

    # client.run(os.environ['API_KEY'])
