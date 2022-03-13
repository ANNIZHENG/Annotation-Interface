from sqlalchemy import *
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# db_path = 'postgresql://eqpytyddkgzpje:589827916509690e9baa1abd869d99bd85ac3c9902c361d04c1e560c2befd624@ec2-52-54-38-229.compute-1.amazonaws.com:5432/dap64di8scvd9n'
db_path = 'postgresql://aakmjoytyjhbfy:5cfbd31217c6e99b77965b46b3073aab1fb3abd8063f24b76934a568d6704f97@ec2-34-205-209-14.compute-1.amazonaws.com:5432/df3puddh5kr6vv'
db_path = 'postgresql://anniezheng@localhost/test'

eng = create_engine(db_path)
Base = declarative_base()

class Survey(Base):
    __tablename__ = "Survey"
    id = Column(Integer, primary_key=True, autoincrement=True)
    survey_id = Column(String)
    approved = Column(Boolean)
    completed = Column(Boolean)
    recording_id = Column(Integer)
    horizontal_or_vertical = Column(VARCHAR)

    def __init__(self,survey_id):
        self.survey_id = survey_id


class Annotation(Base):
    __tablename__ = "Annotation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    survey_id = Column(String)
    recording_id = Column(Integer)
    source_count = Column(Integer)
    user_note = Column(String)
    practice_round = Column(Boolean)
    vertical = Column(Boolean)

    def __init__(self,survey_id,recording_id,source_count,user_note,practice_round,vertical):
        self.survey_id = survey_id
        self.recording_id = recording_id
        self.source_count = source_count
        self.user_note = user_note
        self.practice_round = practice_round
        self.vertical = vertical


class Interaction(Base):
    __tablename__ = "Interaction"

    id = Column(Integer, primary_key=True, autoincrement=True)
    annotation_id = Column(String)
    action_type = Column(String)
    value = Column(String)
    timestamp = Column(TIMESTAMP)
    practice_round = Column(Boolean)

    def __init__(self,annotation_id,action_type,value,timestamp,practice_round):
        self.annotation_id = annotation_id
        self.action_type = action_type
        self.value = value
        self.timestamp = timestamp
        self.practice_round = practice_round


class Location(Base):
    __tablename__ = "Location"

    id = Column(Integer, primary_key=True, autoincrement=True)
    annotation_id = Column(String)
    azimuth = Column(Integer)
    elevation = Column(Integer)
    color = Column(Integer)
    practice_round = Column(Boolean)

    def __init__(self,annotation_id,azimuth,elevation,color,practice_round):
        self.annotation_id = annotation_id
        self.azimuth = azimuth
        self.elevation = elevation
        self.color = color
        self.practice_round = practice_round


class Confirmation(Base):
    __tablename__ = "Confirmation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recording_id = Column(Integer)
    source_id = Column(Integer)
    location_id = Column(Integer)
    practice_round = Column(Boolean)
    annotation_id = Column(String)

    def __init__(self,recording_id,source_id,location_id,annotation_id,practice_round):
        self.recording_id = recording_id
        self.source_id = source_id
        self.location_id = location_id
        self.annotation_id = annotation_id
        self.practice_round = practice_round


Base.metadata.bind = eng
Session = sessionmaker(bind=eng)
ses = Session()

Base.metadata.bind = eng
Session = sessionmaker(bind=eng)
ses = Session()

Base.metadata.create_all()
