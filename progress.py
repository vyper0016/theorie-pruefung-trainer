
from filters import get_questions
from scrape import dump_dict, get_json
from datetime import datetime

DATE_FORMAT = '%d-%m-%Y %H:%M'

def init_progress():
    init_progress_sets()
    progress = {}
    for questions in get_questions():
        for q in questions:
            progress[q] = {
                'times_seen': 0,
                'times_wrong': 0,
                'times_right': 0,
                'times_right_iar': 0,
                'last_was_right': False,
                'last_seen': 'never',
                'ease': None,
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


if __name__ == '__main__':
    init_progress()