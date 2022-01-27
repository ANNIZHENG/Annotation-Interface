from sqlalchemy import *
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# database path
db_path = 'postgresql://eqpytyddkgzpje:589827916509690e9baa1abd869d99bd85ac3c9902c361d04c1e560c2befd624@ec2-52-54-38-229.compute-1.amazonaws.com:5432/dap64di8scvd9n'
# db_path = 'postgresql://anniezheng@localhost/test'

eng = create_engine(db_path)
Base = declarative_base()

class Survey(Base):
    __tablename__ = "Survey"
    id = Column(Integer, primary_key=True, autoincrement=True)
    survey_id = Column(String)
    def __init__(self,survey_id):
        self.survey_id = survey_id


class Annotation(Base):
    __tablename__ = "Annotation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    survey_id = Column(String)
    recordings_id = Column(Integer)
    source_count = Column(Integer)

    def __init__(self,survey_id,recordings_id,source_count):
        self.survey_id = survey_id
        self.recordings_id = recordings_id
        self.source_count = source_count


class Interaction(Base):
    __tablename__ = "Interaction"

    id = Column(Integer, primary_key=True, autoincrement=True)
    annotation_id = Column(Integer)
    action_type = Column(String)
    value = Column(String)
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

Base.metadata.bind = eng
Session = sessionmaker(bind=eng)
ses = Session()

Base.metadata.create_all()
