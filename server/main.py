import uuid
from sqlalchemy import *
from sqlalchemy.sql import *
from datetime import datetime
from flask import *
from db_tables import ses,eng,Annotation,Survey,Location,Interaction
from random import randrange

app = Flask(__name__,static_folder="../templates",template_folder="..")

BATCH_SIZE = 12
PAY_PER_ANNOTATION_NORMAL = 0.24
PAY_PER_ANNOTATION_LOTTERY = 0.20
NORMAL_TASK = 1
LOTTERY_TASK = 2
NEW_TASK = 3
AUDIO_NUMBER = 3

survey_id = uuid.uuid4()

@app.route('/')
def home():
    return render_template('/templates/index.html')

@app.route('/annotation_interface', methods=['GET', 'POST'])
def start():
    entry = Survey(survey_id)
    ses.add(entry)
    ses.commit()
    return 'success'

@app.route('/interaction', methods=['GET', 'POST'])
def interaction():
    if request.method == 'POST':
        data = request.json
        action_type = data['action_type']
        value = data['value']
        timestamp= datetime.fromtimestamp(data['timestamp']/1000)
        print([action_type, value]) # debug
        entry = Interaction(survey_id,action_type,value,timestamp)
        ses.add(entry)
        ses.commit()
    return 'success'

@app.route('/next', methods=['GET', 'POST'])
def next():
    if request.method == 'POST':
        data = request.json
        recording_id = int(data['recording_id'])
        source_count = data['source_count']
        entry1 = Annotation(survey_id,recording_id,source_count)
        ses.add(entry1)
        ses.commit()

        azimuth_list = data['azimuth']
        elevation_list = data['elevation']

        index = 0
        while (index < len(azimuth_list)):
            if (azimuth_list[index] != None):
                entry2 = Location(survey_id,azimuth_list[index],elevation_list[index])
                ses.add(entry2)
                ses.commit()
            index += 1
        return 'success'

@app.route('/get_survey', methods=['GET', 'POST'])
def get_survey():
    return str(survey_id)

@app.route('/select_recording', methods=['GET', 'POST'])
def select_recording():
    while (True):
        recording = randrange(15)
        result = eng.execute('''select number from "Recording" where id='''+str(recording+1))

        for r in result:
            if (int(dict(r)['number']) < 5):
                eng.execute('''update "Recording" set number='''+str(int(dict(r)['number'])+1)+'''where id='''+str(recording+1))
                return str(recording)

if __name__ =='__main__':
    app.run(debug=True)