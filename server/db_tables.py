import os
from time import time
from typing import final
from sqlalchemy import *
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.dialects import postgresql

db_path = 'postgresql://anniezheng@localhost/test'

# noinspection PyBroadException
try:
    db_path = os.environ['postgresql://anniezheng@localhost/test']
except:
    print("except db_tables.py")
    #n f = open('secrets', 'r')
    # db_path = f.read()

eng = create_engine(db_path)
Base = declarative_base()

class Survey(Base):
    __tablename__ = "Survey"
    id = Column(String, primary_key=True)
    def __init__(self,id):
        self.id = id

class Annotation(Base):
    __tablename__ = "Annotation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    survey_id = Column(String)
    recording_id = Column(Integer)
    source_count = Column(Integer)

    def __init__(self,survey_id,recording_id,source_count):
        self.survey_id = survey_id
        self.recording_id = recording_id
        self.source_count = source_count

class Interaction(Base):
    __tablename__ = "Interaction"

    id = Column(Integer, primary_key=True, autoincrement=True)
    annotation_id = Column(Integer)
    action_type = Column(String)
    value = Column(Integer)
    timestamp = Column(TIMESTAMP)

    def __init__(self,annotation_id,action_type,value,timestamp):
        self.annotation_id = annotation_id
        self.action_type = action_type
        self.value = value
        self.timestamp = timestamp

class Location(Base):
    __tablename__ = "Location"

    id = Column(Integer, primary_key=True, autoincrement=True)
    annotation_id = Column(Integer)
    azimuth = Column(Integer)
    elevation = Column(Integer)

    def __init__(self,annotation_id,azimuth,elevation):
        self.annotation_id = annotation_id
        self.azimuth = azimuth
        self.elevation = elevation

Base.metadata.bind = eng
Session = sessionmaker(bind=eng)
ses = Session()

if __name__ == "__main__":
    print("Wipe & reset database?")
    if input("Y/n: ") == "Y":
        print("recreating database...")
        Base.metadata.drop_all()

Base.metadata.create_all()