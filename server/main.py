import uuid, sys, json
from sqlalchemy.sql import annotation
from sqlalchemy.sql.sqltypes import TIMESTAMP
from datetime import datetime
from flask import *
from db_tables import ses, Annotation,Survey,Location,Interaction

app = Flask(__name__,
            static_folder="../templates",
            template_folder="../templates") # template_folder="../docs"

BATCH_SIZE = 12
PAY_PER_ANNOTATION_NORMAL = 0.24
PAY_PER_ANNOTATION_LOTTERY = 0.20

NORMAL_TASK = 1
LOTTERY_TASK = 2
NEW_TASK = 3

AUDIO_NUMBER = 3

survey_id = uuid.uuid4()

@app.route('/', methods=['Get','POST']) 
def home():
    entry = Survey(survey_id)
    ses.add(entry)
    # ses.commit()
    try:
        return render_template('index.html')
    except:
        print ("find a way to refresh everything")

'''

1. json send message via headphone check
2. change default pass = false to pass = true
3. once pass = true, users are allowed to redirect to the page
4. if user directly enters, then, since the global value of pass is false, 
the user will not be entering in and will be prompted an error message

@app.route('/question', methods=['GET','POST'])

'''

@app.route('/interaction', methods=['POST'])
def interaction():
    if request.method == 'POST':
        data = request.json
        annotaion_id = int(data['annotation_id'])
        action_type = data['action_type']
        value = data['value']
        timestamp= datetime.fromtimestamp(data['timestamp']/1000)
        entry = Interaction(annotaion_id,action_type,value,timestamp)
        ses.add(entry)
        print([annotaion_id, action_type, value])
        # ses.commit()
    return "success"

@app.route('/next', methods=['POST'])
def next():
    if request.method == 'POST':
        data = request.json
        annotaion_id = int(data['annotation_id'])
        source_count = data['source_count']
        entry1 = Annotation(survey_id,annotaion_id,source_count)
        ses.add(entry1)
        # ses.commit()

        annotaion_id = int(data['annotation_id'])
        azimuth_list = data['azimuth']
        elevation_list = data['elevation']
        source_count = data['source_count']
        index = 0
        while (index < len(azimuth_list)):
            if (azimuth_list[index] != None):
                entry2 = Location(annotaion_id,azimuth_list[index],elevation_list[index])
                ses.add(entry2)
                # ses.commit()
            index += 1
    return "success"

app.run(port=5000, debug=True)