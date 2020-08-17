"""Script to seed database."""

import os
import json
from random import choice, randint
from datetime import datetime
from faker import Faker

# import crud
# import model
# import server

# os.system('dropdb users')
# os.system('createdb users')

# model.connect_to_db(server.app)
# model.db.create_all()

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

print(f"source = {source}, title = {title}, author = {author}, description = {description}, story_link = {story_link}, image = {image}, content = {content}, published = {published}")

