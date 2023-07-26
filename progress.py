
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
    return progress


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
        
    return update_progress(qdata)


def update_set(success:bool, set_index: int):
    sets_progress = get_json('progress_sets.json')
    progress = sets_progress[str(set_index)]
    new_session = 1 if success else 2
    slist = progress['last_sessions']
    
    if 0 in slist:
        slist[slist.index(0)] = new_session
        
    else:
        slist[0] = slist[1]
        slist[1] = slist[2]
        slist[2] = new_session          

    dump_dict(sets_progress, 'progress_sets.json')


def get_stats():
    stats = []
    total_stats = {'mastered': 0, 'wrong': 0, 'not_seen': 0, 'practiced': 0,'total': 0}
    cats = get_json('categories.json')
    subs = get_json('sub_categories.json')
    progress = get_json('progress.json')
    for c in cats:
        stats_c = {'category_name': cats[c]['name'], 'cid': c, 
                    'mastered': 0, 'not_seen':0, 'wrong': 0, 'practiced': 0, 'total': 0}
        for s in cats[c]['subs']:
            sub = subs[s]
            for q in sub['questions']:
                stats_c['total'] += 1
                total_stats['total'] += 1
                if progress[q]['times_seen'] == 0:
                    stats_c['not_seen'] += 1
                    total_stats['not_seen'] += 1
                elif progress[q]['times_wrong'] > 0 and not progress[q]['last_was_right']:
                    stats_c['wrong'] += 1
                    total_stats['wrong'] += 1
                elif progress[q]['times_right_iar'] > 1:
                    stats_c['mastered'] += 1
                    total_stats['mastered'] += 1
                else:
                    stats_c['practiced'] += 1
                    total_stats['practiced'] += 1
        stats.append(stats_c)
    
    return (total_stats, stats)
                


if __name__ == '__main__':
    get_stats()