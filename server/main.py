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

@app.route('/')
def home():
    result = eng.execute('''select number from "Recording" order by number asc limit 1''')
    least_annotation = ''
    for r in result:
        least_annotation = int(dict(r)['number'])
    if (least_annotation == 5): 
        return render_template('/templates/finish.html')
    else:
        return render_template('/templates/index.html')

@app.route('/annotation_interface', methods=['GET', 'POST'])
def start():
    survey_id = uuid.uuid4()
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
        entry = Interaction(-1,action_type,value,timestamp)
        ses.add(entry)
        ses.commit()
    return 'success'

@app.route('/next', methods=['GET', 'POST'])
def next():
    if request.method == 'POST':
        data = request.json
        recording_id = int(data['recording_id'])+1
        source_count = data['source_count']

        survey_res = eng.execute('''select id from "Survey" order by id asc limit 1''')
        survey_id = ''
        for r in survey_res:
            survey_id = str(dict(r)['id'])
        
        entry1 = Annotation(survey_id,recording_id,source_count)
        ses.add(entry1)
        ses.commit()

        azimuth_list = data['azimuth']
        elevation_list = data['elevation']

        index = 0
        while (index < len(azimuth_list)):
            if (azimuth_list[index] != None):
                entry2 = Location(-1,azimuth_list[index],elevation_list[index])
                ses.add(entry2)
                ses.commit()
            index += 1

        result = eng.execute('''select id from "Annotation" order by id desc limit 1''')
        annotation_id = -1
        for r in result:
            annotation_id = int(dict(r)['id'])
        eng.execute('''update "Interaction" set annotation_id='''+str(annotation_id)+'''where annotation_id = -1''')
        eng.execute('''update "Location" set annotation_id='''+str(annotation_id)+'''where annotation_id = -1''')
        
        return 'success'

@app.route('/get_survey', methods=['GET', 'POST'])
def get_survey():
    survey_res = eng.execute('''select id from "Survey" order by id asc limit 1''')
    survey_id = ''
    for r in survey_res:
        survey_id = str(dict(r)['id'])
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