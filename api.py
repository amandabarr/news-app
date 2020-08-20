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

newsapi = NewsApiClient(api_key=API_SECRET_KEY)

app = Flask(__name__)
app.secret_key = 'dev'
app.jinja_env.undefined = StrictUndefined

today = date.today().strftime("%Y-/%m-/%d")

print(today)

def update_articles():

    url = ('http://newsapi.org/v2/everything?'
        'qInTitle=mindfulness&'
        'from=' + today + '&'
        'sortBy=popularity&'
        'apiKey=' + API_SECRET_KEY)

    response = requests.get(url)

    response_json = response.json()

    articles = response_json['articles']

    print(articles)




if __name__ == '__main__':
    connect_to_db(app)
    # app.run(host='0.0.0.0', debug=True)

