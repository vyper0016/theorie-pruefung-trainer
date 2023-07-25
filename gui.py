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
all_questions = get_json('questions.json')
sets = get_json('sets.json')
vids = get_json('vids.json')
sub_cats = get_json('sub_categories.json')

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
def called_page(page:str):
    global generator, current_sid
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
    
    elif page.startswith('set'):
        if page == 'set_random':
            filtered_sets = filters.filter_undone_sets()
            if not filtered_sets:
                current_sid = random.randrange(0, 99, 1)
            else:
                current_sid = random.choice(filtered_sets)
        else:
            current_sid = int(page.replace('set', '')) - 1
        
        eel.redirect('/questions_test.html')
        

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


def get_all_videos_set():
    global vids, current_sid, sets, all_questions
    print('here')
    for q in sets[current_sid]:
        qdata = all_questions[q]
        if qdata['type'] == 'video':
            get_video(qdata['picture'])
            

@eel.expose
def get_video(video):
    global vids
    if vids[video]['downloaded']:
        print(video, 'already downloaded')
        return

    download_video(vids[video]['url'], video)
    vids[video]['downloaded'] = True
    dump_dict(vids, 'vids.json')


@eel.expose
def update_question(qdata):
    return
    current_progress = update_progress(qdata)


@eel.expose
def submitted_question(qdata, correct: bool):
    return
    current_progress = progress.submitted_question(qdata, correct)
    
    
@eel.expose
def get_sets():
    sets_progress = get_json('progress_sets.json')
    return sets_progress


@eel.expose
def get_set_questions():
    global current_sid, sets, all_questions
    questions = []
    
    for q in sets[current_sid]:
        question_dic = all_questions[q]
        question_dic['number'] = q
        question_dic['category_name'] = sub_cats[question_dic['category']]['parent']
        
        for i in current_progress[q]:
            question_dic[i] = current_progress[q][i]
        
        if question_dic['type'] != 'number':
            question_dic['state_asw1'] = False
            question_dic['state_asw2'] = False
        if 'asw_3' in question_dic:
            question_dic['state_asw3'] = False
        else:
            question_dic['state_asw1'] = ''
        
        question_dic['done'] = False
        questions.append(question_dic)
    
    return questions


@eel.expose
def update_set_progress(success:bool):
    return
    progress.update_set(success, current_sid)


eel.start('index.html', mode='default')  # Open the GUI window
