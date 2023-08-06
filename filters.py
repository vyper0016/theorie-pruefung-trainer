import json
from scrape import get_json

FILTERS1 = ['type', 'points', 'category', 'mq_flag']

all_questions = get_json('questions.json')
progress = get_json('progress.json')
q1 = progress[list(progress)[0]]
FILTERS2 = list(q1.keys())
FILTERS2.append('mastered')
AVAILABLE_FILTERS = FILTERS1 + FILTERS2
del progress
del q1

def find_qs(term:str):

    filtered = []

    questions = get_questions()
    
    for q in questions:
        question = questions[q]
        for i in ['text', 'info', 'asw_pretext', 'asw_1', 'asw_2', 'asw_3']:
            try:
                if term.upper() in question[i].upper():
                    filtered.append(q)
            except KeyError:
                pass
    
    return filtered


def filter_question_properties(**kwargs):
    for i in list(kwargs):
        assert i in FILTERS1
    
    questions = all_questions
    filtered = {}
    for q in questions:
        qdata = questions[q]
        
        filter_ok = True
        for key, value in kwargs.items():           
            if qdata[key] != value:
                filter_ok = False
                break
        if filter_ok:
            filtered[q] = qdata
    
    return filtered
                    

def filter_questions_proggress(**kwargs):
    progress = get_json('progress.json')
    for i in list(kwargs):
        assert i in FILTERS2
    
    filtered = {}
    for q in progress:
        qdata = progress[q]
        
        filter_ok = True
        for key, value in kwargs.items():
            
            if key == 'mastered':
                filter_ok = (value == (qdata['times_right_iar'] > 1 and qdata['last_was_right']))
                if not filter_ok:
                    break
                continue
            
            if qdata[key] != value:
                filter_ok = False
                break
        if filter_ok:
            filtered[q] = qdata
            for i in all_questions[q]:
                progress[q][i] = all_questions[q][i]

    return filtered


def filter_questions(**kwargs):
    filters1 = {}
    filters2 = {}
    for i in kwargs:
        if i in FILTERS1:
            filters1[i] = kwargs[i]
        elif i in FILTERS2:
            filters2[i] = kwargs[i]
        else:
            raise AttributeError(f'{i} not a valid filter key')

    if filters1:
        filtered1 = filter_question_properties(**filters1)
        if not filters2:
            return filtered1
        
    if filters2:
        filtered2 = filter_questions_proggress(**filters2)
        if not filters1:
            return filtered2

    filtered = {}
    # get filtered twice
    for i in filtered1:
        if i in filtered2:
            filtered[i] = filtered1[i]
    return filtered


def filter_undone_sets():
    sets = get_json('progress_sets.json')
    sets_out = []
    for c, s in enumerate(sets):
        add = True
        for i in sets[s]['last_sessions']:
            if i != 0:
                add = False
                break
        if add:
            sets_out.append(c)
    return sets_out
    

if __name__ == '__main__':
    print(filter_questions(mastered=False))
    
