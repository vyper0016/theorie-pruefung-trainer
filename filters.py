import json


def get_all_questions():
    with open('data/questions_6.json') as f:
        questions1 = json.load(f)    
    
    with open('data/questions_b.json') as f:
        questions2 = json.load(f)

    return (questions1, questions2)


def find_qs(term:str):

    filtered = []

    for questions in get_all_questions():
        for q in questions:
            question = questions[q]
            for i in ['text', 'info', 'asw_pretext', 'asw_1', 'asw_2', 'asw_3']:
                try:
                    if term.upper() in question[i].upper():
                        filtered.append(q)
                except KeyError:
                    pass
    
    return filtered


def get_question_type(qdata):
    if isinstance(qdata['asw_corr1'], float):
        return 'number'
    
    if qdata['picture'] and qdata['picture'].endswith('.m4v'):
        return 'video'
    
    if not qdata['picture']:
        return 'text_only'
    
    return 'text_image'


def filter_questions(**kwargs):
    available_filters = ['type', 'points', 'category', 'mq_flag']
    for i in list(kwargs):
        assert i in available_filters
    
    filtered = []
    for questions in get_all_questions():
        for q in questions:
            qdata = questions[q]
            if 'type' in list(kwargs):
                qtype = get_question_type(qdata)
                qdata['type'] = qtype
            
            filter_ok = True
            for key, value in kwargs.items():
                if qdata[key] != value:
                    filter_ok = False
                    break
            if filter_ok:
                filtered.append(q)
    
    return filtered
                    

if __name__ == '__main__':
    print(len(filter_questions(type='number')))
