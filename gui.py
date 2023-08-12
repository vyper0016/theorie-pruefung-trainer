import eel
import filters
import json
import random
from scrape import get_json, dump_dict
import requests
from setup_db import VID_PATH
import progress

eel.init('web')  # Set the web folder path (containing index.html, style.css, and script.js)

all_questions = get_json('questions.json')
sets = get_json('sets.json')
vids = get_json('vids.json')
sub_cats = get_json('sub_categories.json')

def questions_generator_yielder(questions):
    current_progress = get_json('progress.json')
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
        current_filters = current_filters or {'mastered': False}        
        filtered_quesitons = filters.filter_questions(**current_filters)        
            
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
            current_sid = int(page.replace('set', ''))
        
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
    

def download_video(vid):
    global vids    
    
    if vids[vid]['downloaded']:
        print(vid, 'already downloaded')
        return
    
    print('downloading', vid, '...')
    response = requests.get(vids[vid]['url'])
    if response.status_code == 200:
        with open(VID_PATH + '/' + vid, 'wb') as f:
            f.write(response.content)
        vids[vid]['downloaded'] = True
        dump_dict(vids, 'vids.json')
        print(f"{vid} downloaded successfully.")
    else:
        print(f"Failed to download {vid} Status code: {response.status_code}")


def get_all_videos_set():
    global vids, current_sid, sets, all_questions
    for q in sets[current_sid]:
        qdata = all_questions[q]
        if qdata['type'] == 'video':
            get_video(qdata['picture'])
            

@eel.expose
def get_video(video):
    download_video(video)


@eel.expose
def mark_question(qid, mark:bool):
    progress.mark_question(qid, mark)


@eel.expose
def submitted_question(qdata, correct: bool):
    progress.submitted_question(qdata['number'], correct)
    
    
@eel.expose
def get_sets():
    sets_progress = get_json('progress_sets.json')
    return sets_progress


@eel.expose
def get_set_questions():
    global current_sid, sets, all_questions
    current_progress = get_json('progress.json')
    print('set', current_sid)
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
    progress.update_set(success, current_sid)


@eel.expose
def get_unseen():
    current_progress = get_json('progress.json')
    s = 0
    for i in current_progress:
        if current_progress[i]['times_seen'] == 0:
            s += 1
    return s


@eel.expose
def get_category_stats():
    return progress.get_stats()


if __name__ == '__main__':
    eel.start('index.html', mode='default')  # Open the GUI window
