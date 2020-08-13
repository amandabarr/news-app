"""Server for news app."""

from flask import Flask, render_template, request, flash, session, redirect
from model import connect_to_db
import os
from newsapi import NewsApiClient
import pprint
import requests

from jinja2 import StrictUndefined

API_SECRET_KEY = os.environ.get('API_KEY')

# newsapi = NewsApiClient(api_key=os.environ.get('API_KEY'))

app = Flask(__name__)
app.secret_key = 'dev'
app.jinja_env.undefined = StrictUndefined



# def fetch_stories():

#     url = "http://newsapi.org/v2/everything?q=crocodile&from=2020-08-11&to=2020-08-11&sortBy=popularity&apiKey=" + API_SECRET_KEY
#     response = requests.get(url)
#     response_json = response.json()
#     pprint.pprint(response_json)

@app.route("/")
def homepage():
    """View Homepage"""

    return render_template("homepage.html")







if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)
