from datetime import datetime
from os import times
import random, uuid, sys, json
from datetime import datetime
from flask import *
from sqlalchemy.sql import annotation
from sqlalchemy.sql.sqltypes import TIMESTAMP
# from server.db_tables import ses, Recording, Annotation, Survey, RecordingGroup
from db_tables import ses, Annotation,Survey,Location,Interaction
# server.process_wins import bonus_type_one, bonus_type_two
from process_wins import bonus_type_one, bonus_type_two

app = Flask(__name__,
            static_folder="../templates",
            template_folder="../templates") # template_folder="../docs"

BATCH_SIZE = 12
# print(BATCH_SIZE)
PAY_PER_ANNOTATION_NORMAL = 0.24
PAY_PER_ANNOTATION_LOTTERY = 0.20

NORMAL_TASK = 1
LOTTERY_TASK = 2
NEW_TASK = 3

AUDIO_NUMBER = 3

uuid = uuid.uuid4()
@app.route('/', methods=['Get','POST']) 
def home():
    entry = Survey(uuid)
    ses.add(entry)
    # ses.commit()
    return render_template('index.html')

@app.route('/annotation', methods=['POST'])
def annotation():
    if request.method == 'POST':
        data = request.json
        index = 0
        source_count_list = data['source_count']
        while (index < AUDIO_NUMBER):
            recording_id = index+1
            source_count = int(source_count_list[index])

            print("annotation:",source_count)

            entry = Annotation(uuid,recording_id,source_count)
            ses.add(entry)
            index += 1
            # ses.commit()
    return "success"

@app.route('/interaction', methods=['POST'])
def interaction():
    if request.method == 'POST':
        data = request.json
        annotaion_id = int(data['currentAnnotation'])
        action_type = data['action_type']
        value = int(data['value'])
        timestamp= datetime.fromtimestamp(data['timestamp']/1000)

        print("interaction: ",action_type,value,timestamp)

        entry = Interaction(annotaion_id,action_type,value,timestamp)
        ses.add(entry)
        # ses.commit()
    return "success"

@app.route('/location', methods=['POST'])
def location():
    if request.method == 'POST':
        data = request.json
        annotaion_id = int(data['currentAnnotation'])
        azimuth = data['azimuth']
        elevation = data['elevation']

        print(azimuth)
        print(elevation)

        entry = Location(annotaion_id,azimuth,elevation)
        ses.add(entry)
        # ses.commit()
    return "success"   

app.run(port=5000, debug=True)