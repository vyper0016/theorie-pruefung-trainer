import eel
from filters import AVAILABLE_FILTERS, filter_questions
import json

eel.init('web')  # Set the web folder path (containing index.html, style.css, and script.js)


def on_close(page, sockets):
    # Perform any cleanup or termination tasks here
    print("Browser window is closed. Terminating Eel process.")
    quit()


@eel.expose
def called_page(page):
    print('called', page)
    if page.startswith('training_'):
        filters = eel.getCurrentFilters()()
        filtered_auesitons = 
        if page == 'training_30random':
            ...
            

@eel.expose
def get_filter_keys_json():
    return json.dumps(AVAILABLE_FILTERS)


@eel.expose
def get_filters():
    filters = eel.getCurrentFilters()()
    print(filters)
    

eel.start('index.html', size=(1280, 720))  # Open the GUI window
