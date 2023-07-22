
from filters import get_questions, FILTERS2
from scrape import dump_dict, get_json
from datetime import datetime

DATE_FORMAT = '%d-%m-%Y %H:%M'

def init_progress():
    init_progress_sets()
    progress = {}
    
    for q in get_questions():
        progress[q] = {
            'times_seen': 0,
            'times_wrong': 0,
            'times_right': 0,
            'times_right_iar': 0,
            'last_was_right': False,
            'last_seen': 'never',
            'ease': 0,
            'marked': False
        }
    
    dump_dict(progress, 'progress.json')


def init_progress_sets():
    progress = {}
    sets = get_json('sets.json')
    for s in sets:
        progress[str(s['rank'])] = {
            'last_sessions': [0, 0, 0]      # 0 not seen, 1 success, 2 fail
        }
    
    dump_dict(progress, 'progress_sets.json')


def update_progress(qdata):
    progress = get_json('progress.json')
    for i in qdata:
        if i in FILTERS2:
            progress[qdata['number']][i] = qdata[i]
            
    dump_dict(progress, 'progress.json')


def submitted_question(qdata, correct:bool):
    qdata['times_seen'] += 1
    qdata['last_seen'] = datetime.strftime(datetime.now(), DATE_FORMAT)
    if correct:
        qdata['times_right'] += 1
        if qdata['last_was_right']:
            qdata['times_right_iar'] += 1
        qdata['last_was_right'] = True
    else:
        qdata['last_was_right'] = False
        qdata['times_wrong'] += 1
        
    update_progress(qdata)

if __name__ == '__main__':
    print()