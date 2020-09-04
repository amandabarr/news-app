"""CRUD operations. """

from model import db, User, SavedStory, Story, connect_to_db, Topic, StoryTopic
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

def get_saved_stories_by_user(user_id):

    return db.session.query(Story).filter(SavedStory.user_id == user_id).join(SavedStory).all()


def get_saved_stories_by_user_and_story(user_id, story_id):

    saved_story = db.session.query(SavedStory).filter(SavedStory.user_id == user_id, SavedStory.story_id == story_id).first()
    print(f"Saved Story {saved_story}")
    return saved_story

    # return SavedStory.query.filter(SavedStory.user_id, SavedStory.story_id, Story.source, Story.title, Story.author, Story.description, Story.story_link, Story.image, Story.content, Story.published).join(Story).all()


def get_saved_story_by_story_id(story_id):

    saved_story = db.session.query(Story).filter(SavedStory.story_id == story_id).join(SavedStory).first()
    print(f"Saved Story {saved_story}")
    return saved_story

def remove_from_favorites(user_id, story_id):

    saved_story = db.session.query(SavedStory).filter(SavedStory.user_id == user_id, SavedStory.story_id == story_id).first()

    db.session.delete(saved_story)
    db.session.commit()

def create_topic(topic_category):

    """Create and return a topic by the topic name."""

    topic = Topic(topic_category=topic_category)

    db.session.add(topic)
    db.session.commit()

def get_topic(topic_category):

    return Topic.query.filter(Topic.topic_category == topic_category).first()

def save_topic(user_id, topic_id):
    """Save a topic to user's favorites topics"""

    saved_topic = StoryTopic(user_id=user_id, topic_id=topic_id)

    db.session.add(saved_topic)
    db.session.commit()

def get_saved_topics_by_user(user_id):

    saved_topics = db.session.query(StoryTopic).filter(StoryTopic.user_id == user_id).join(Topic).all()
    return saved_topics



if __name__ == '__main__':
    from server import app
    connect_to_db(app)
