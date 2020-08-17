import os
from flask import Flask, flash, request, redirect, url_for
from newsapi import NewsApiClient

API_SECRET_KEY = os.environ.get('API_KEY')

newsapi = NewsApiClient(api_key=os.environ.get('API_KEY'))

app = Flask(__name__)
app.secret_key = 'dev'

newsapi = NewsApiClient(api_key=os.environ.get('API_KEY'))

data = newsapi.get_everything




if __name__ == '__main__':
    connect_to_db(app)
    app.run(host='0.0.0.0', debug=True)

    # client.run(os.environ['API_KEY'])
