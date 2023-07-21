import eel
import filters
import json
import random
from scrape import get_json

eel.init('web')  # Set the web folder path (containing index.html, style.css, and script.js)

progress = get_json('progress.json')

def on_close(page, sockets):
    # Perform any cleanup or termination tasks here
    print("Browser window is closed. Terminating Eel process.")
    quit()


def questions_generator_yielder(questions):
    global progress
    for c, q in enumerate(questions):
        dic = {'number': q,
               'total': len(questions),
               'current': c+1}
        
        for i in questions[q]:
            dic[i] = questions[q][i]
        
        for i in progress[q]:
            dic[i] = progress[q][i]
            
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
    

eel.start('index.html', size=(1280, 720))  # Open the GUI window
