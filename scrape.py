import urllib.request
import bs4 as bs
import pickle
import os
import shortuuid
import json


CACHE_FOLDER = "cache"
DBS_FOLDER = "data"

webpage_test_sample = 'https://www.ifuhrerscheintest.de/test.aspx'
MAIN_URL = 'https://www.clickclickdrive.de/fragenkatalog/en'

#examples for question types
example_text = 'https://www.clickclickdrive.de/fragenkatalog/en/1.1.-danger-teaching/1.1.01-basic-forms-of-traffic-behavior/1.1.01-001'
example_video = 'https://www.clickclickdrive.de/fragenkatalog/en/1.1.-danger-teaching/1.1.02-behavior-towards-pedestrians/1.1.02-137-M'
example_image = 'https://www.clickclickdrive.de/fragenkatalog/en/1.1.-danger-teaching/1.1.07-special-traffic-situations/1.1.07-020-M'
example_number = 'https://www.clickclickdrive.de/fragenkatalog/en/1.2.-behaviour-in-traffic/1.2.03-speed/1.2.03-101'
example_number_image = 'https://www.clickclickdrive.de/fragenkatalog/en/2.4.-traffic-sign/2.4.41-regulatory-sign/2.4.41-103'



os.makedirs(CACHE_FOLDER, exist_ok=True)
os.makedirs(DBS_FOLDER, exist_ok=True)


def generate_pickle_filename():
    unique_id = shortuuid.uuid()
    return f"{unique_id}.pkl"


def is_url_cached(url):
    cache_file = os.path.join(CACHE_FOLDER, "urls.json")
    if not os.path.exists(cache_file):
        return False

    with open(cache_file, "r") as file:
        cached_urls = json.load(file)
        return url in cached_urls


def store_url_in_cache(url, soup):
    cache_file = os.path.join(CACHE_FOLDER, "urls.json")
    cache_data = {}

    if os.path.exists(cache_file):
        with open(cache_file, "r") as file:
            cache_data = json.load(file)

    filename = generate_pickle_filename()
    cache_data[url] = filename

    with open(cache_file, "w") as file:
        json.dump(cache_data, file, indent=3)

    with open(os.path.join(CACHE_FOLDER, filename), "wb") as file:
        pickle.dump(soup, file)


def get_soup(url):
    if is_url_cached(url):
        cache_file = os.path.join(CACHE_FOLDER, "urls.json")
        with open(cache_file, "r") as file:
            cache_data = json.load(file)
            filename = cache_data[url]
            with open(os.path.join(CACHE_FOLDER, filename), "rb") as soup_file:
                soup = pickle.load(soup_file)
                return soup

    headers = {'User-Agent': 'Your Mom'}
    req = urllib.request.Request(url, headers=headers)
    source = urllib.request.urlopen(req).read()
    soup = bs.BeautifulSoup(source, 'html.parser')

    store_url_in_cache(url, soup)

    return soup


#gets a dict from the json file
def get_json(filename):
    try:
        with open(os.path.join(DBS_FOLDER, filename), 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


#dumps a dictionary into the json file
def dump_dict(dic: dict, filename):
    assert filename.endswith('.json')
    with open(os.path.join(DBS_FOLDER, filename), 'w') as f:
        json.dump(dic, f, indent=3)


def get_categories():
    db_name = 'categories.json'
    categories = {}
    soup = get_soup(MAIN_URL)
    cat_divs = soup.find_all('div', class_='theoryWorld')
    for d in cat_divs:
        cid = d.find('span', class_='number').text.split(' ')[-1]
        name = d.find('span', class_='title').text.strip()
        link = d.find('a')['href']
        count = d.find('span', class_='info').text.strip().split(' ')[0]
        count = int(count)
        if count == 0:
            continue
        subs = scrape_category(link, name)
        assert len(subs) == count
        
        categories[cid] = {'name': name, 'link': link, 'count': count, 'subs': subs}
    
    dump_dict(categories, db_name)
    remove_unused_questions()


def scrape_category(url, parent):
    db_name = 'sub_categories.json'
    soup = get_soup(url)
    cat_divs = soup.find_all('div', class_='theoryLevel')
    subs = get_json(db_name)
    cids = []
    for d in cat_divs:
        cid = d.find('span', class_='number').text.split(' ')[0]
        cids.append(cid)
        name = d.find('span', class_='title').text.strip()
        link = d.find('a')['href']    
        count = d.find('span', class_='info').text.strip().split(' ')[0]
        count = int(count)
        if count == 0:
            continue
        questions = scrape_sub(link)
        assert count == len(questions)
        subs[cid] = {'name': name, "parent": parent, 'link': link, 'count': count, 'questions': questions}

    dump_dict(subs, db_name)
    return cids
    
    
def scrape_sub(url):
    soup = get_soup(url)
    qs_divs = soup.find_all('div', class_='theoryQuestion')
    qids = []
    for d in qs_divs:
        qid = d.find('span', class_='number').text.strip()
        qids.append(qid)
    
    return qids


def get_video_from_qs(link):
    soup = get_soup(link)
    vid = soup.find('video')
    source = vid.find('source')
    vid_link = source['src']
    return vid_link


def find_qs_in_sub(sub_link, qid):
    soup = get_soup(sub_link)
    divs = soup.find_all('div', class_='theoryQuestion')
    for d in divs:
        number = d.find('span', class_='number').text.strip()
        if number == qid:
            link = d.find('a')['href']
            return link


def get_video_link_qid(qid):
    subs = get_json('sub_categories.json')
    for i in subs:
        if qid in subs[i]['questions']:
            q_link = find_qs_in_sub(subs[i]['link'], qid)
            vid = get_video_from_qs(q_link)
            assert vid
            return vid
        
    print('could not find', qid)


def add_lacking_questions():
    subs = get_json('sub_categories.json')
    questions = get_json('questions.json')
    a = 0
    t = 0
    for q in questions:
        t+=1
        qs = subs[questions[q]['category']]['questions']
        if q not in qs:
            qs.append(q)
            a += 1
    dump_dict(subs, 'sub_categories.json')
    print('added', a, 'questions')
    print(t, 'total')
    


def remove_unused_questions(again=True):
    subs = get_json('sub_categories.json')
    questions = get_json('questions.json')
    r = 0
    t = 0
    for s in subs:
        for q in subs[s]['questions']:
            if q not in questions:
                r += 1
                subs[s]['questions'].remove(q)
            else:
                t += 1
    dump_dict(subs, 'sub_categories.json')
    print('removed', r, 'unused questions from scrape data')
    print(t, 'Scraped questions total left')
    if again:
        remove_unused_questions(False)
        add_lacking_questions()
        remove_unused_cats()
    

def remove_unused_cats():
    subs = get_json('sub_categories.json')
    cats = get_json('categories.json')    
    cout = {}
    for c in cats:
        for s in cats[c]['subs']:
            if s not in subs:
                print('removed', c)
                pass
            else:
                cout[c] = cats[c]
    dump_dict(cout, 'categories.json')


if __name__ == '__main__':
    add_lacking_questions()
    remove_unused_questions()