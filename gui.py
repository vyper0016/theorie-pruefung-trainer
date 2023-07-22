import eel
import filters
import json
import random
from scrape import get_json, dump_dict
import requests
from setup_db import VID_PATH
from progress import update_progress
import progress

eel.init('web')  # Set the web folder path (containing index.html, style.css, and script.js)

current_progress = get_json('progress.json')

def on_close(page, sockets):
    # Perform any cleanup or termination tasks here
    print("Browser window is closed. Terminating Eel process.")
    quit()


def questions_generator_yielder(questions):
    global current_progress
    for c, q in enumerate(questions):
        dic = {'number': q,
               'total': len(questions),
               'current': c+1}
        
        for i in questions[q]:
            dic[i] = questions[q][i]
        
        for i in current_progress[q]:
            dic[i] = current_progress[q][i]
            
        yield dic


@eel.expose
def called_page(page):
    global generator
    print('called', page)
    if page.startswith('training_'):
        current_filters = eel.getCurrentFilters()()
        
        if current_filters:
            filtered_quesitons = filters.filter_questions(**current_filters)
        else:
            filtered_quesitons = filters.get_questions()
        
            
        if not filtered_quesitons:
            eel.alertMsg('could not find any questions with the current filters')
            return
        
        keys_list = list(filtered_quesitons.keys())

        # Shuffle the keys list
        random.shuffle(keys_list)

        # Create a new dictionary with shuffled keys
        shuffled_dict = {key: filtered_quesitons[key] for key in keys_list}
        
        if page == 'training_30random':
            if len(filtered_quesitons) >= 30:
                # get first 30 from shuffled dict
                questions = {key: shuffled_dict[key] for key in list(shuffled_dict)[:30]}
            else:
                questions = shuffled_dict
        
        elif page == 'training_infinite':
            questions = shuffled_dict
        
        eel.redirect('/questions.html')
        
        generator = questions_generator_yielder(questions)
        

@eel.expose
def get_next_question():
    global generator
    return next(generator)


@eel.expose
def get_filter_keys_json():
    return json.dumps(filters.AVAILABLE_FILTERS)


@eel.expose
def get_filters():
    filters = eel.getCurrentFilters()()
    print(filters)
    

def download_video(url, filename):
    print('downloading', filename, '...')
    response = requests.get(url)
    if response.status_code == 200:
        with open(VID_PATH + '/' + filename, 'wb') as f:
            f.write(response.content)
        print(f"{filename} downloaded successfully.")
    else:
        print(f"Failed to download {filename} Status code: {response.status_code}")



@eel.expose
def get_video(video):
    vids = get_json('vids.json')
    if vids[video]['downloaded']:
        return

    download_video(vids[video]['url'], video)
    vids[video]['downloaded'] = True
    dump_dict(vids, 'vids.json')


@eel.expose
def update_question(qdata):
    update_progress(qdata)


@eel.expose
def submitted_question(qdata, correct: bool):
    return
    progress.submitted_question(qdata, correct)

eel.start('index.html', size=(1280, 720))  # Open the GUI window
