"""Data model file"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# app = Flask(__name__)
# app.secret_key = 'dev'


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
    author = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=False)
    story_link = db.Column(db.String, unique=True, nullable=False)
    image = db.Column(db.String, nullable=False)
    content = db.Column(db.Text, nullable=False)
    published = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f'<Story source={self.source} title={self.title}>' 


class Topic(db.Model):
    """A topic of a story."""

    __tablename__ = "topics"

    topic_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                                    
    topic_category = db.Column(db.String, nullable=False)
    topic_keyword = db.Column(db.String, nullable=False)
    

    def __repr__(self):
        return f'<Topic category={self.topic_category} keyword={self.topic_keyword}>'




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


# class StorySource(db.Model):
#     """A source of a story."""

#     __tablename__ = "story_sources"

#     story_source_id = db.Column(db.Integer,
#                         autoincrement=True,
#                         primary_key=True)                 
#     source = db.Column(db.String, db.ForeignKey('stories.source'))
#     story_id = db.Column(db.Integer, db.ForeignKey('stories.story_id'))

#     story_id = db.relationship('Story', backref='story_id')
#     source = db.relationship('Story', backref='story_id')
    

#     def __repr__(self):
#         return f'<StorySource story_source_id={self.story_source_id} source={self.source} story_id={self.story_id}>'


class SavedStory(db.Model):
    """A topic of a story."""

    __tablename__ = "saved_stories"

    saved_story_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                 
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    story_id = db.Column(db.Integer, db.ForeignKey('stories.story_id'))
    user_tag = db.Column(db.String)
    user_comment = db.Column(db.Text)

    user_save = db.relationship('User', backref='saved_stories')
    story_info = db.relationship('Story', backref='saved_stories')
    

    def __repr__(self):
        return f'<SavedStory saved_story_id={self.saved_story_id} user_id={self.user_id} story_id={self.story_id}>'


class SavedStoryTag(db.Model):
    """A topic of a story."""

    __tablename__ = "saved_story_tags"

    saved_story_tag_id = db.Column(db.Integer,
                        autoincrement=True,
                        primary_key=True)                 
    saved_story_id = db.Column(db.Integer, db.ForeignKey('saved_stories.saved_story_id'))
    # user_tag = db.Column(db.String, db.ForeignKey('saved_stories.user_tag'))


    saved_id = db.relationship('SavedStory', backref='saved_story_tags')
    # saved_tag = db.relationship('SavedStory')
    # double check the connection with this table
    

    def __repr__(self):
        return f'<SavedStoryTag saved_story_tag_id={self.saved_story_tag_id} saved_story_id={self.source}>'


if __name__ == '__main__':
    from server import app

    connect_to_db(app)