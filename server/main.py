import uuid
from sqlalchemy import *
from sqlalchemy.sql import *
from datetime import datetime
from flask import *
from db_tables import ses,eng,Annotation,Survey,Location,Interaction,Confirmation
from random import randrange
app = Flask(__name__,static_folder="../templates",template_folder="..")

# server side ajaxes
@app.route('/')
def home():
    result = eng.execute('''select num_annotation from "Recording" order by num_annotation asc limit 1''')
    least_annotation = ''
    for r in result:
        least_annotation = int(dict(r)['num_annotation'])
    if (least_annotation == 5):
        return render_template('/templates/interface/finish.html')
    else:
        return render_template('/templates/index.html')


@app.route('/annotation_interface', methods=['GET', 'POST'])
def start():
    survey_id = uuid.uuid4()
    entry = Survey(survey_id)
    ses.add(entry)
    ses.commit()
    return str(survey_id)


@app.route('/interaction', methods=['GET', 'POST'])
def interaction():
    if request.method == 'POST':
        data = request.json
        action_type = data['action_type']
        value = data['value']
        survey_id = data['survey_id']
        practice = bool(int(data['practice']))
        timestamp = datetime.fromtimestamp(data['timestamp'] / 1000)
        entry = Interaction(survey_id,action_type,value,timestamp,practice)
        ses.add(entry)
        ses.commit()
    return 'success'


@app.route('/next', methods=['GET', 'POST'])
def next():
    if request.method == 'POST':
        data = request.json

        survey_id = data['survey_id']
        recording_id = int(data['recording_id']) + 1
        source_count = data['source_count']
        user_note = data['user_note']
        practice = bool(int(data['practice']))

        # update number of annotation in Recording table
        eng.execute('''update "Recording" set num_annotation= num_annotation + 1 where id='''+ str(recording_id))


        # insert into Interaction table
        timestamp= datetime.fromtimestamp(data['timestamp'] / 1000)
        entry = Interaction(survey_id,"submit",None,timestamp,practice)
        ses.add(entry)
        ses.commit()


        # insert into Annotation table
        entry1 = Annotation(survey_id,recording_id,source_count,user_note,practice)
        ses.add(entry1)
        ses.commit()


        azimuth_list = data['azimuth']
        elevation_list = data['elevation']


        json_index = 0
        index = 0
        while (index < len(azimuth_list)):
            if (azimuth_list[index] != None):
                # insert into Location table
                entry2 = Location(survey_id,azimuth_list[index],elevation_list[index],index+1,practice)
                ses.add(entry2)
                ses.commit()
                json_index += 1
            index += 1


        result = eng.execute('''select id from "Annotation" where survey_id = ''' + "'" + survey_id + "'")
        for r in result:
            annotation_id = str(dict(r)['id'])

        
        eng.execute('''update "Interaction" set annotation_id='''+annotation_id+'''where annotation_id = '''  + "'" + survey_id + "'")
        eng.execute('''update "Location" set annotation_id='''+annotation_id+'''where annotation_id = '''  + "'" + survey_id + "'")
        
        return 'success'

@app.route('/select_recording', methods=['GET', 'POST'])
def select_recording():
    while (True):
        recording = randrange(30)
        result = eng.execute('''select num_annotation from "Recording" where id='''+str(recording+1))
        for r in result:
            if (int(dict(r)['num_annotation']) < 5):
                return str(recording)


@app.route('/submit_confirmation', methods=['GET', 'POST'])
def submit_confirmation():
    if (request.method == 'POST'):
        data = request.json
        recording_id = data['recording_id']
        source_id = data['source_id'].split(',')
        location_id = data['location_id'].split(',')
        
        for i in range (len(source_id)):
            if (i < len(location_id)):
                entry = Confirmation(int(recording_id), source_id[i], location_id[i])
            else:
                entry = Confirmation(int(recording_id), source_id[i], None)
            ses.add(entry)
            ses.commit()

        return 'success'


@app.route('/confirm_annotation', methods=['GET', 'POST'])
def confirm_annotation():
    if (request.method == 'POST'):
        data = request.json
        recording_id = data['recording_id']
        survey_id = data['survey_id']


    annotation_id = ''
    result_get_recording = eng.execute('''select id from "Annotation" where survey_id = ''' + "'" + survey_id + "'")
    for r1 in result_get_recording:
        annotation_id = str(dict(r1)['id'])
    

    file_name = '''"file_name":{'''
    source_id = '''"source_id":{'''
    filename_json_index = 0
    result_file_name = eng.execute( '''with cte as (select "Recording".id as recording_id, "Recording_Joint_Source".source_id as source_id from "Recording" inner join "Recording_Joint_Source" on "Recording".id = "Recording_Joint_Source".recording_id) select "Source".id as source_id, "Source".file_name as file_name from "Source" inner join cte on "Source".id = cte.source_id where recording_id ='''+ str(int(recording_id)+1) )


    for r in result_file_name:
        file_name = file_name + '"' + str(filename_json_index) + '":' + '"' + dict(r)['file_name'] + '",'
        source_id = source_id + '"' + str(filename_json_index) + '":' + '"' + str(dict(r)['source_id']) + '",'
        filename_json_index += 1
    

    file_name = file_name[:len(file_name)-1] + "}"
    source_id = source_id[:len(source_id)-1] + "}"
    actual_num_source = '''"actual_num_source":{"0":"''' + str(filename_json_index) + '"}'


    azimuth = '''"azimuth":{'''
    elevation = '''"elevation":{'''
    color = '''"color":{'''
    location_id = '''"location_id":{'''
    json_index = 0
    result_get_location = eng.execute('''select id, azimuth, elevation, color from "Location" where annotation_id = '''+ "'" + annotation_id + "'")

    for r2 in result_get_location:
        azimuth = azimuth + '"' + str(json_index) + '":"' + str(dict(r2)['azimuth']) + '",'
        elevation = elevation + '"' + str(json_index) + '":"' + str(dict(r2)['elevation']) + '",'
        color = color + '"' + str(json_index) + '":"' + str(dict(r2)['color']) + '",'
        location_id = location_id + '"' + str(json_index) + '":"' + str(dict(r2)['id']) + '",'
        json_index += 1
    
    azimuth = azimuth[:len(azimuth)-1] + "}"
    elevation = elevation[:len(elevation)-1] + "}"
    color = color[:len(color)-1] + "}"
    location_id = location_id[:len(location_id)-1] + "}"
    user_num_source = '''"user_num_source":{"0":"''' + str(json_index) + '"}'

    return "{" + file_name + "," + azimuth + "," + elevation + "," + color + "," + user_num_source + "," + actual_num_source + "," + source_id + "," + location_id + "}"


if __name__ =='__main__':
    app.run(debug=True)