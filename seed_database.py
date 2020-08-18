"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime
from faker import Faker

import crud
import model
import server

os.system('dropdb news')
os.system('createdb news')

model.connect_to_db(server.app)
model.db.create_all()

# # for num in range(10):
#     username = f'testuser{num}'
#     email = f'testuser{num}@test.com'
#     password = f'test{num}'

#     user = crud.create_user(username, email, password)

# fake = Faker()
# print(fake.name())

# for person in range(5):
#     fake_info = [fake.user_name(), fake.safe_email(), fake.password()]
    
#     print(fake_info)


with open('./data/stories.json') as file:
   articles = json.loads(file.read())

   for article in articles:
      source = article["source"]["name"]
      title = article["title"]
      author = article["author"]
      description = article["description"]
      story_link = article["url"]
      image = article["urlToImage"]
      content = article["content"]
      published = article["publishedAt"]

      new_story = crud.create_story(source, title, author, description, story_link, image, content, published)

      