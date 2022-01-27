import uuid
from sqlalchemy import *
from sqlalchemy.sql import *
from datetime import datetime
from flask import *
from db_tables import ses,eng,Annotation,Survey,Location,Interaction
from random import randrange

# global variables
app = Flask(__name__,static_folder="../templates",template_folder="..")
recording = -1
json_index = 0
user_azimuth = '''"azimuth":{'''
user_elevation = '''"elevation":{'''
user_color = '''"color":{'''

# server side ajaxes
@app.route('/')
def home():
    result = eng.execute('''select num_annotation from "Recording" order by num_annotation asc limit 1''')
    least_annotation = ''
    for r in result:
        least_annotation = int(dict(r)['num_annotation'])
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
        timestamp= datetime.fromtimestamp(data['timestamp'] / 1000)
        entry = Interaction(-1,action_type,value,timestamp)
        ses.add(entry)
        ses.commit()
    return 'success'

@app.route('/next', methods=['GET', 'POST'])
def next():
    if request.method == 'POST':
        data = request.json

        timestamp= datetime.fromtimestamp(data['timestamp'] / 1000)
        entry = Interaction(-1,"submit",None,timestamp)
        ses.add(entry)
        ses.commit()

        recording_id = int(data['recording_id']) + 1
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
        global json_index 
        json_index = 0

        while (index < len(azimuth_list)):
            if (azimuth_list[index] != None):
                entry2 = Location(-1,azimuth_list[index],elevation_list[index])
                ses.add(entry2)
                ses.commit()
                
                global user_azimuth
                user_azimuth = user_azimuth + '"' + str(json_index) + '":"' + str(azimuth_list[index]) + '",'
                global user_elevation
                user_elevation = user_elevation + '"' + str(json_index) + '":"' + str(elevation_list[index]) + '",'
                global user_color
                user_color = user_color + '"' + str(json_index) + '":"' + str(index+1) + '",'

                json_index += 1
                
            index += 1

        user_azimuth = user_azimuth[:len(user_azimuth)-1] + "}"
        user_elevation = user_elevation[:len(user_elevation)-1] + "}"
        user_color = user_color[:len(user_color)-1] + "}"

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
        global recording
        recording = randrange(30)
        result = eng.execute('''select num_annotation from "Recording" where id='''+str(recording+1))
        for r in result:
            if (int(dict(r)['num_annotation']) < 5):
                eng.execute('''update "Recording" set num_annotation='''+str(int(dict(r)['num_annotation'])+1)+'''where id='''+str(recording+1))
                return str(recording)

@app.route('/confirm_annotation', methods=['GET', 'POST'])
def confirm_annotation():

    global user_azimuth
    global user_elevation
    global user_color
    global recording
    global json_index

    result_file_name = eng.execute(
        '''with cte as (select "Recording".id as recording_id, "Recording_Joint_Source".source_id as source_id from "Recording" inner join "Recording_Joint_Source" on "Recording".id = "Recording_Joint_Source".recording_id) select "Source".file_name as file_name from "Source" inner join cte on "Source".id = cte.source_id where recording_id ='''+str(recording+1)
    )

    filename_json_index = 0
    user_file_name = '''"file_name":{'''

    for r in result_file_name:
        user_file_name = user_file_name + '"' + str(filename_json_index) + '":' + '"' + dict(r)['file_name'] + '",'
        filename_json_index += 1

    user_file_name = user_file_name[:len(user_file_name)-1] + "}"

    user_num_source = '''"user_num_source":{"0":"''' + str(json_index) + '"}'
    actual_num_source = '''"actual_num_source":{"0":"''' + str(filename_json_index) + '"}'

    return "{" + '''"recording":{"0":"''' + str(recording) + ".wav" + '"}' + "," + user_file_name + "," + user_azimuth + "," + user_elevation + "," + user_color + "," + user_num_source + "," + actual_num_source + "}"

if __name__ =='__main__':
    app.run(debug=True)