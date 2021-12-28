from sqlalchemy import *
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# database should be created before hand
db_path = 'postgresql://anniezheng@localhost/test'

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
    survey_id = Column(String, ForeignKey("Survey.id"))
    action_type = Column(String)
    value = Column(String)
    timestamp = Column(TIMESTAMP)

    def __init__(self,survey_id,action_type,value,timestamp):
        self.survey_id = survey_id
        self.action_type = action_type
        self.value = value
        self.timestamp = timestamp


class Location(Base):
    __tablename__ = "Location"

    id = Column(Integer, primary_key=True, autoincrement=True)
    survey_id = Column(String, ForeignKey("Survey.id"))
    azimuth = Column(Integer)
    elevation = Column(Integer)

    def __init__(self,survey_id,azimuth,elevation):
        self.survey_id = survey_id
        self.azimuth = azimuth
        self.elevation = elevation

Base.metadata.bind = eng
Session = sessionmaker(bind=eng)
ses = Session()

'''
class Recording(Base):
    __tablename__ = "Recording"

    id = Column(Integer, primary_key=True, autoincrement=True)
    file_name = Column(String)
    number = Column(Integer)

    def __init__(self,file_name,number):
        self.file_name = file_name
        self.number = number
'''

Base.metadata.bind = eng
Session = sessionmaker(bind=eng)
ses = Session()

if __name__ == "__main__":
    print("Wipe & reset database?")
    if input("Y/n: ") == "Y":
        print("recreating database...")
        Base.metadata.drop_all()

Base.metadata.create_all()