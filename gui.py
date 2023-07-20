import eel
from filters import AVAILABLE_FILTERS
import json

eel.init('web')  # Set the web folder path (containing index.html, style.css, and script.js)


def on_close(page, sockets):
    # Perform any cleanup or termination tasks here
    print("Browser window is closed. Terminating Eel process.")
    quit()


@eel.expose
def called_page(page):
    print('called', page)

@eel.expose
def get_filter_keys_json():
    return json.dumps(AVAILABLE_FILTERS)

eel.start('index.html', size=(1280, 720))  # Open the GUI window
