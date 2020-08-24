"""CRUD operations. """

from model import db, User, SavedStory, Story, connect_to_db
from datetime import datetime

def create_user(username, email, password):
    """Create and return a new user."""

    user = User(username=username, email=email, password=password)

    db.session.add(user)
    db.session.commit()

    return user

def get_user(username, password):
    """Return a user by username and password."""

    return User.query.filter(User.username == username, User.password == password).first()


def create_story(source, title, author, description, story_link, image, content, published):
    """Create and return a new story"""

    story = Story(source=source, title=title, author=author, description=description, story_link=story_link, image=image, content=content, published=published)

    db.session.add(story)
    db.session.commit()

    return story

def get_story(source, title, author, description):

    return Story.query.filter(Story.source == source, Story.title == title, Story.author == author, Story.description == description).first()

def get_story_by_id(story_id):

    return Story.query.filter(Story.story_id == story_id)

def save_story(user_id, story_id, user_comment = ""):
    """Save a story to user's favorites"""
    saved_story = SavedStory(user_id=user_id, story_id=story_id, user_comment=user_comment)

    db.session.add(saved_story)
    db.session.commit()


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
