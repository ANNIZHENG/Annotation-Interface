import uuid
from sqlalchemy import *
from sqlalchemy.sql import *
from datetime import datetime
from flask import *
from db_tables import ses,eng,Survey,Interaction,Confirmation,Annotation,Location
from random import randrange
app = Flask(__name__,static_folder="../templates",template_folder="..")


# home() directs user to the starter frontend page (the consent form page)
# it also checks if enough annotations are collected

@app.route('/')
def home():
    result = eng.execute('''select num_annotation from "Recording" order by num_annotation asc limit 1''')
    for r in result:
        least_annotation = int(dict(r)['num_annotation'])
        if (least_annotation == 3):
            return render_template('/templates/interface/finish.html')
        else:
            return render_template('/templates/index.html')

# start() receives AJAX request from the frontend to give each user a survey id
# if that user agrees the consent form

@app.route('/annotation_interface', methods=['GET', 'POST'])
def start():
    survey_id = uuid.uuid4()
    entry = Survey(survey_id)
    ses.add(entry)
    ses.commit()
    return str(survey_id)

# interaction() receives AJAX request from the frontend to record the user interaction
# e.g. "agree consent", "play audio", "azimuth", "elevation"

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

# interaction() receives AJAX request from the frontend to record the annotated azimuths and elevations
# to the Location Table and Annotation table
# and record "submit annotation" action to the Interaction Table
# This method is triggered when the "SUBMIT" button is clicked, which directs one to the Confirmation page

@app.route('/next', methods=['GET', 'POST'])
def next():
    if request.method == 'POST':
        data = request.json
        recording_name = data['recording_name']
        survey_id = data['survey_id']

        if (data['vertical'] == 2):
            vertical = None
            exec = '''select id from "Recording" where recording_name = ''' + "'" + recording_name + "' and vertical is null"
        else:
            vertical = bool(data['vertical'])
            exec = '''select id from "Recording" where recording_name = ''' + "'" + recording_name + "' and vertical is " + str(vertical)

        recording_id = -1
        result_recording_id = eng.execute(exec)
        for r in result_recording_id:
            recording_id = int(dict(r)['id'])

        source_count = data['source_count']
        user_note = data['user_note']
        practice = bool(int(data['practice']))

        timestamp = datetime.fromtimestamp(data['timestamp'] / 1000)
        entry = Interaction(survey_id,"submit annotation", None,timestamp,practice)
        ses.add(entry)
        ses.commit()

        entry1 = Annotation(survey_id,recording_id,source_count,user_note,practice,vertical)
        ses.add(entry1)
        ses.commit()

        azimuth_list = data['azimuth']
        elevation_list = data['elevation']

        json_index = 0
        index = 0
        while (index < len(azimuth_list)):
            if (azimuth_list[index] != None):
                entry2 = Location(survey_id, azimuth_list[index], elevation_list[index], index+1, practice)
                ses.add(entry2)
                ses.commit()
                json_index += 1
            index += 1
        
        result = eng.execute('''select id from "Annotation" where survey_id = ''' + "'" + survey_id + "' order by id desc limit 1")

        for r in result:
            annotation_id = str(dict(r)['id'])
        
        eng.execute('''update "Interaction" set annotation_id = ''' + "'" + annotation_id + "' where annotation_id = '" + survey_id + "'")
        eng.execute('''update "Location" set annotation_id = ''' + "'" + annotation_id + "' where annotation_id = '" + survey_id + "'")

    return 'success'

# select_recording() receives AJAX request from the frontend to randomly select a recording
# from either horizontal or horizontal_vertical folder for the Annotation page
# This method is triggered when Annotation page is loaded

@app.route('/select_recording', methods=['GET', 'POST'])
def select_recording():
    while (True):
        all_ids = [1,2,3,4,5,6,7,8,9,12,14,15,17,18,19,20,23,24,25,28,31,32,33,34,35,36,37,38,39,40,41,42,43,44,47,50,51,52,53,55,58,59,62,63,64,66,67,70,71,73,74,79,80,82,84,87,88,92,95,97,98,99,100,101,102,103,104,105,108,110,112,113,114,115,116,118,119,120,121,124,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,143,144,146,147,148,149,151,154,155,158,159,160,162,166,167,169,170,175,176,178,180,182,183,184,188,191,2000,2002,2003,2004,2005,2006,2007,2009,2011,2012,2013,2014,2015,2016,2018,2019,2020,2021,2022,2023,2024,2025,2026,2028,2029,2030]

        ## previous code: recording = randrange(192) + 1 ## this is just a note for me
        recording = all_ids[randrange(len(all_ids))]
        
        result = eng.execute('''select num_annotation, recording_name from "Recording" where id = ''' + str(recording))

        for r in result:
            if (int(dict(r)['num_annotation']) < 3):
                if (recording <= 96):
                    vertical = 1
                elif (recording >= 97 and recording <= 192):
                    vertical = 0
                elif (recording >= 2000 and recording <= 2049):
                    vertical = 1
                else:
                    vertical = 0 # including the practice and recording > 2031
                return "{" + '''"recording_name":{"0":''' + '"' + str(dict(r)['recording_name']) + '"' + "}," + '''"vertical":{"0":''' + str(vertical) + "}" + "}"
            else:
                break

# select_recording() receives AJAX request from the frontend to update the Confirmation table
# It also updates the recording id, the folder name, and the completed status of the Survey table
# which indicates what recording have the user done, and if the user completes the task
# This method is triggered when the "SUBMIT" button is clicked on Confirmation page

@app.route('/submit_confirmation', methods=['GET', 'POST'])
def submit_confirmation():
    if (request.method == 'POST'):
        data = request.json
        practice = bool(int(data['practice']))
        if (data['vertical'] == 2):
            vertical = None
            vertical_exec = "null"
        else:
            vertical = bool(data['vertical'])
            vertical_exec = str(vertical)
        
        recording_name = data['recording_name']
        source_id = data['source_id'].split(',')
        location_id = data['location_id'].split(',')
        survey_id = str(data['survey_id'])

        recording_id = -1
        recording_name = data['recording_name']
        result_recording_id = eng.execute('''select id from "Recording" where recording_name = ''' + "'" + recording_name + "' and vertical is " + vertical_exec)

        for r in result_recording_id:
            recording_id = int(dict(r)['id'])

        for i in range (len(source_id)):
            if (i >= len(location_id)):
                entry = Confirmation(recording_id, source_id[i], None, survey_id, practice)
            else:
                if (location_id[i] != 'undefined'):
                    entry = Confirmation(recording_id, source_id[i], location_id[i], survey_id, practice)
                else:
                    entry = Confirmation(recording_id, source_id[i], None, survey_id, practice)
            ses.add(entry)
            ses.commit()

        result = eng.execute('''select id from "Annotation" where survey_id = ''' + "'" + survey_id + "' order by id desc limit 1")

        for r in result:
            annotation_id = str(dict(r)['id'])
        
        eng.execute('''update "Confirmation" set annotation_id = ''' + "'" + annotation_id + "' where annotation_id = '" + survey_id + "'")

        timestamp = datetime.fromtimestamp(data['timestamp'] / 1000)
        entry1 = Interaction(survey_id,"submit confirmation", None, timestamp, practice)
        ses.add(entry1)
        ses.commit()

        eng.execute('''update "Interaction" set annotation_id = ''' + "'" + annotation_id + "' where annotation_id = '" + survey_id + "'")

        if (not practice):
            eng.execute('''update "Recording" set num_annotation = num_annotation + 1 where id = '''+ str(recording_id))
            eng.execute('''update "Survey" set completed = true where survey_id = ''' + "'" + survey_id + "'")

            if (recording_id > 96):
                place_folder = "horizontal"
            else:
                place_folder = "horizontal_vertical"
            
            eng.execute('''update "Survey" set recording_id = ''' + str(recording_id) + " where survey_id = '" + survey_id + "' and recording_id is null")
            eng.execute('''update "Survey" set horizontal_or_vertical = ''' + "'" + place_folder + "'" + ''' where survey_id = ''' + "'" + survey_id + "' and recording_id < 193")

        return 'success'

# select_recording() receives AJAX request from the frontend to retrieve color / sub-audios (of the full audio) / full audio
# and the location of the annotations and send them back to the frontend for Confirmation page set up

@app.route('/confirm_annotation', methods=['GET', 'POST'])
def confirm_annotation():
    if (request.method == 'POST'):
        data = request.json
        survey_id = data['survey_id']

        if (data['vertical'] == 2):
            vertical = None
            vertical_exec = "null"
        else:
            vertical = bool(data['vertical'])
            vertical_exec = str(vertical)

        recording_id = -1
        recording_name = data['recording_name']
        result_recording_id = eng.execute('''select id from "Recording" where recording_name = ''' + "'" + recording_name + "' and vertical is " + vertical_exec)

        for r in result_recording_id:
            recording_id = int(dict(r)['id'])

        annotation_id = ''
        result_get_recording = eng.execute('''select id from "Annotation" where survey_id = ''' + "'" + survey_id + "' order by id desc limit 1")

        for r1 in result_get_recording:
            annotation_id = str(dict(r1)['id'])
    
        file_name = '''"file_name":{'''
        source_id = '''"source_id":{'''
        filename_json_index = 0
        result_file_name = eng.execute( '''with cte as (select "Recording".id as recording_id, "Recording_Joint_Source".source_id as source_id from "Recording" inner join "Recording_Joint_Source" on "Recording".id = "Recording_Joint_Source".recording_id) select "Source".id as source_id, "Source".file_name as file_name from "Source" inner join cte on "Source".id = cte.source_id where recording_id = '''+ str(recording_id))

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