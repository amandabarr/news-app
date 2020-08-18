"""Data model file"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


def connect_to_db(flask_app, db_uri='postgresql:///news', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


class User(db.Model):
    """A user."""
   
    __tablename__ = "users"

    user_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                 
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<User username={self.username} email={self.email}>' 


class Story(db.Model):
    """A story."""

    __tablename__ = "stories"

    story_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                                   
    source = db.Column(db.String, nullable=False)
    title = db.Column(db.String, unique=True, nullable=False)
    author = db.Column(db.String)
    description = db.Column(db.Text, nullable=False)
    story_link = db.Column(db.String, unique=True, nullable=False)
    image = db.Column(db.String, nullable=False)
    content = db.Column(db.Text)
    published = db.Column(db.DateTime, nullable=False)

    # story_topics = db.relationship("StoryTopic", secondary="story_stopics")

    def __repr__(self):
        return f'<Story source={self.source} title={self.title}>' 


class Topic(db.Model):
    """A topic of a story."""

    __tablename__ = "topics"

    topic_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                                    
    topic_category = db.Column(db.String, nullable=False)
    
    

    def __repr__(self):
        return f'<Topic category={self.topic_category}>'



class StoryTopic(db.Model):
    """A topic of a story."""

    __tablename__ = "story_topics"

    story_topic_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                 
    story_id = db.Column(db.Integer, db.ForeignKey('stories.story_id'))
    topic_id = db.Column(db.Integer, db.ForeignKey('topics.topic_id'))

    story = db.relationship('Story', backref='story_topics')
    topic = db.relationship('Topic', backref='story_topics')
    

    def __repr__(self):
        return f'<StoryTopic story_topic_id={self.story_topic_id} story_id={self.story_id} topic_id={self.topic_id}>'



class SavedStory(db.Model):
    """A story saved by the user."""

    __tablename__ = "saved_stories"

    saved_story_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                 
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    story_id = db.Column(db.Integer, db.ForeignKey('stories.story_id'))
    # saved_story_tag_id = db.Column(db.Integer, db.ForeignKey('saved_story_tags.saved_story_tag_id'))
    user_comment = db.Column(db.Text)


    user_save = db.relationship('User', backref='saved_stories')
    story_info = db.relationship('Story', backref='saved_stories')
    # saved_tag = db.relationship('SavedStory', backref='saved_stories')
    

    def __repr__(self):
        return f'<SavedStory saved_story_id={self.saved_story_id} user_id={self.user_id} story_id={self.story_id}>'


class SavedStoryTag(db.Model):
    """User tag for a saved story."""

    __tablename__ = "saved_story_tags"

    saved_story_tag_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                 
    saved_story_id = db.Column(db.Integer, db.ForeignKey('saved_stories.saved_story_id'))
    # user_tag = db.Column(db.String, db.ForeignKey('saved_stories.user_tag'))
    user_tag = db.Column(db.String)
    
    
    tag = db.relationship('SavedStory', backref='saved_story_tags')
    

    def __repr__(self):
        return f'<SavedStoryTag saved_story_tag_id={self.saved_story_tag_id}>'


if __name__ == '__main__':
    from server import app

    connect_to_db(app)