
from filters import FILTERS2
from scrape import dump_dict, get_json
from datetime import datetime, timedelta
from math import ceil

DATE_FORMAT = '%d-%m-%Y %H:%M'
TEST_DATE = '22-08-2023'
TEST_DATE = datetime.strptime(TEST_DATE, '%d-%m-%Y')

all_questions = get_json('questions.json')
TOTAL = len(all_questions)

STAT_DAYS = 12  #number of days to get stats for


# allows spoofing the date for testing
def now_date():
    # return datetime.now()
    return datetime(2023, 8, 21, 12, 52)
    
def init_progress():
    init_progress_sets()
    progress = {}
    
    for q in all_questions:
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
    log = {
            "04-08-2000 16:41": {
                "mastered": 0,
                "wrong": 0,
                "practiced": 0,
                'not_seen': TOTAL
            }
                }
    dump_dict(log, 'progress_log.json')


def init_progress_sets():
    progress = {}
    t = len(get_json('sets.json'))
    for c in range(t):
        progress[c] = {
            'last_sessions': [0, 0, 0]      # 0 not seen, 1 success, 2 fail
        }
    
    dump_dict(progress, 'progress_sets.json')


def log_progress():
    progress = get_json('progress_log.json')
    progress[datetime.strftime(now_date(), DATE_FORMAT)] = get_total_stats()
    dump_dict(progress, 'progress_log.json')
    

def mark_question(qid, mark: bool):
    progress = get_json('progress.json')
    progress[qid]['marked'] = mark
    dump_dict(progress, 'progress.json')
    

def submitted_question(qid, correct:bool):
    progress = get_json('progress.json')
    progress[qid]['times_seen'] += 1
    progress[qid]['last_seen'] = datetime.strftime(now_date(), DATE_FORMAT)
    if correct:
        progress[qid]['times_right'] += 1
        progress[qid]['times_right_iar'] += 1
        progress[qid]['last_was_right'] = True
    else:
        progress[qid]['last_was_right'] = False
        progress[qid]['times_right_iar'] = 0
        progress[qid]['times_wrong'] += 1
    
    dump_dict(progress, 'progress.json')
    log_progress()


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


def get_total_stats():
    total_stats = {'mastered': 0, 'wrong': 0, 'not_seen': 0, 'practiced': 0}
    progress = get_json('progress.json')
    for q in progress:
        if progress[q]['times_seen'] == 0:
            total_stats['not_seen'] += 1
        elif progress[q]['times_wrong'] > 0 and not progress[q]['last_was_right']:
            total_stats['wrong'] += 1
        elif progress[q]['times_right_iar'] > 1:
            total_stats['mastered'] += 1
        else:
            total_stats['practiced'] += 1
    
    return total_stats


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
    
    d = last_days_progress()
    return {'total': total_stats, 'category_stats': stats, 
            'last_hour': last_hour_progress(), 'days': d,
            'seen_today': seen_today(d), 'goal': daily_goal(d)}
   

# return how many questions seen during the last hour
def last_hour_progress():
    now = now_date()
    logs = get_json('progress_log.json')
    keys = logs.keys()
    last_key = list(keys)[-1]
    date_last = datetime.strptime(last_key, DATE_FORMAT)
    if (now - date_last).total_seconds() > 3600:
        return 0
    not_seen1 = logs[last_key]['not_seen']
    reversed_keys = reversed(keys)
    for i in reversed_keys:
        date = datetime.strptime(i, DATE_FORMAT)
        delta = now - date
        if delta.total_seconds() > 3600:
            return logs[i]['not_seen'] - not_seen1


def compare_days(date1: datetime, date2: datetime):
    return [date1.day, date1.month, date1.year] == [date2.day, date2.month, date2.year]


def daily_goal(progress_days):
    keys = list(progress_days.keys())
    qleft = progress_days[keys[-2]]['not_seen']
    days_left = (TEST_DATE - now_date()).days
    return ceil(qleft / (days_left+2))
    

def seen_today(progress_days:dict):
    keys = list(progress_days.keys())
    return progress_days[keys[-2]]['not_seen'] - progress_days[keys[-1]]['not_seen']


def format_date(date_string):
    parsed_date = datetime.strptime(date_string, '%d/%m/%Y')
    return parsed_date.strftime('%d/%m')

def last_days_progress():
    # Get today's date
    today = now_date().date()
    
    logs = get_json('progress_log.json')
    keys = list(logs.keys()) 
    days = {}

    # Generate the last days (including the current day)
    for _ in range(STAT_DAYS):
        day = today
        day_s = day.strftime('%d/%m/%Y')
        today -= timedelta(days=1)
        days[day_s] = {}
    days_list = list(days.keys())
       
    cl = len(keys) - 1  # counter logs
    for day in range(STAT_DAYS):
        current_day = datetime.strptime(days_list[day], '%d/%m/%Y')
        log_date = keys[cl]
        log_datetime = datetime.strptime(log_date, DATE_FORMAT)
        if compare_days(log_datetime, current_day):
            days[days_list[day]] = logs[log_date]
            while compare_days(log_datetime, current_day):
                cl -= 1
                log_date = keys[cl]
                log_datetime = datetime.strptime(log_date, DATE_FORMAT)
        else:
            days[days_list[day]] = logs[log_date]
    
    return {format_date(key): value for key, value in reversed(days.items())}
        
        
if __name__ == '__main__':
    t = get_stats()
    pass