from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import json
import codecs
from scrape import get_video_link_qid
import os


IMG_PATH = "./assets/img"


def concatenate_js_files(input_files, output_file, function_calls):
    merged_code = ""

    # function to replace ids of the questions in the sets with actual numbers (qid)
    replace_func = '''function replaceQuestionIdsWithNumbers() {
  for (let setId in dbTableSets) {
    const set = dbTableSets[setId];
    const { question_ids } = set;

    for (let i = 0; i < question_ids.length; i++) {
      const questionId = question_ids[i];
      const question = dbTblQ[questionId];

      if (question) {
        question_ids[i] = question.number;
      }
    }
  }
}

'''

    for file_path in input_files:
        with open(file_path, "r") as f:
            merged_code += f.read().replace('fsapp.extDataInitializationComplete();', '') + "\n"

    with open(output_file, "w") as f:
        f.write(merged_code)
        f.write("\n")
        f.write(replace_func)
        f.write("\n")
        for function_call in function_calls:
            f.write(f"{function_call};\n")
            

        f.write(f"replaceQuestionIdsWithNumbers();\n")



def wrap_code_in_function(input_file, output_file, function_name="translateDB"):
    with open(input_file, "r") as f:
        original_content = f.read()

    wrapped_content = f"function {function_name}() {{\n{original_content}\n}}"

    with open(output_file, "w") as f:
        f.write(wrapped_content)


def merge_files():
    # Replace these paths with the actual paths to your JavaScript files
    wrap_code_in_function('js/en/tblQuestions.js', 'js/translateDB.js')
    input_files = ["js/tblQuestions.js", 'js/translateDB.js',"js/tblQuestionInfos.js", "js/tblSets.js"]
    functions_to_call = ['initDb1TableQuestions()', 'translateDB()', 'initQuestionInfoDb1("gb")', 'initDb1TableSets()']
    output_file = "js/merged.js"

    concatenate_js_files(input_files, output_file, functions_to_call)
    return output_file


def execute_js(filename, variable_name, output_filename=None):
    # Set up the WebDriver service
    webdriver_service = Service('C:\\Users\\boon\\Documents\\python\\chromedriver_win32\\chromedriver.exe')
    webdriver_options = Options()
    webdriver_options.headless = True  # Run the browser in headless mode
    driver = webdriver.Chrome(service=webdriver_service, options=webdriver_options)

    # Read the JavaScript code from a file
    with open(filename, 'r') as file:
        js_code = file.read()

    # Modify the JavaScript code to return the function output
    modified_js_code = f'{js_code}\n return {variable_name};'

    # Execute the modified JavaScript code
    output = driver.execute_script(modified_js_code)

    output_without_nulls = [i for i in output if i]

    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(output_without_nulls, f, indent=3)

    driver.quit()

    return output_without_nulls


def decrypt_rot13(s):
    return codecs.decode(s, 'rot_13')


def decrypt_qs(data, output_filename=None):

    for i in data:
        i['text'] = decrypt_rot13(i['text'])
        i['info'] = decrypt_rot13(i['info'])

    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(data, f, indent=3)

    return data


#also removes basic and classes
def filter_qs_class6(data, output_filename=None):
    filtered = []
    for i in data:
        try:
            i['classes']
        except KeyError:
            continue

        if ',6,' in i['classes']:
            i.pop('classes')
            i.pop('basic')
            filtered.append(i)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(filtered, f, indent=3)
    
    return filtered
    

#also removes basic and classes
def filter_qs_basic(data, output_filename=None):
    filtered = []
    for i in data:
        if i['basic'] == 1:
            i.pop('classes')
            i.pop('basic')
            filtered.append(i)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(filtered, f, indent=3)
    
    return filtered


def filter_sets_class6(data, output_filename=None):
    filtered = []
    for i in data:
        if i['class_id'] == 6:
            filtered.append(i)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(filtered, f, indent=3)
    
    return filtered


def change_etc_imgs(data, output_filename=None):
    to_replace = "./assets/img/etc/gb/"
    new_img_path = IMG_PATH

    for i in data:
        if to_replace in i['asw_1']:
            i['asw_1'] = i['asw_1'].replace(to_replace, new_img_path)
            i['asw_2'] = i['asw_2'].replace(to_replace, new_img_path)
            i['asw_3'] = i['asw_3'].replace(to_replace, new_img_path)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(data, f, indent=3)
    
    return data


#asw_index and basic_mofa and valid_from and asw_hint_2, asw_hint_3, replaces asw_hint_1 with asw_hint
def remove_unn(data, output_filename=None):
    for i in data:
        i.pop('asw_index_1')
        i.pop('asw_index_2')
        i.pop('asw_index_3')
        i.pop('basic_mofa')
        i['asw_hint'] = i.pop('asw_hint_1')
        i.pop('asw_hint_2')
        i.pop('asw_hint_3')
        try:
            i.pop('valid_from')
        except KeyError:
            pass
        
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(data, f, indent=3)
    
    return data


def replace_categories(data, output_filename=None):
    with open('data/sub_categories.json') as f:
        subs = json.load(f)
    
    for i in data:
        i.pop('category_id')
        for s in subs:
            if i['number'] in subs[s]['questions']:
                i['category'] = s
                continue
        assert i['category']
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(data, f, indent=3)
    
    return data


# replaces asw_corr1 with a float if the asw_type_1 == 2
def number_qs(data, output_filename=None):
    for i in data:
        if i['asw_type_1'] == '2':
            i['asw_corr1'] = float(i.pop('asw_1').replace(',', '.'))

    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(data, f, indent=3)
    
    return data


#adds a db 'vids.json' with video names as the keys and a link to the video and 'downloaded' set to False by default, only if its basic or class 6
def sort_videos(data, output_filename='data/vids.json'):
    
    vids = {}
    for i in data:
        if (i['basic'] == 1 or ',6,' in i['classes']) and i['picture'].endswith('.m4v'):
            vids[i['picture']] = {
                'downloaded': False,
                'url': get_video_link_qid(i['number'])
            }
    
    with open(output_filename, 'w') as f:
        json.dump(vids, f, indent=3)
    
    return vids


#makes a dict with the 'number' as the key
def final_qs(data, output_filename):
    questions = {}
    for i in data:
        questions[i.pop('number')] = i
    
    
    with open(output_filename, 'w') as f:
        json.dump(questions, f, indent=3)   


def exec_and_filter():
    output_file = merge_files()
    print('merged files')
    qs = execute_js(output_file, 'dbTblQ', 'js/dbs/questions_table1.json')
    sets = execute_js(output_file, 'dbTableSets', 'js/dbs/sets_table1.json')
    print('executed javascript')
    qs = decrypt_qs(qs, 'js/dbs/questions_table2.json')
    qs = change_etc_imgs(qs)
    qs = remove_unn(qs)
    qs = replace_categories(qs)
    qs = number_qs(qs)
    print('getting video links...')
    v = sort_videos(qs)
    print('done')
    print('finals sort...')
    qs_basic = filter_qs_basic(qs, 'js/dbs/questions_basic.json')
    qs_class6 = filter_qs_class6(qs, 'js/dbs/questions_class6.json')
    sets_class6 = filter_sets_class6(sets, 'js/dbs/sets.json')
    final_qs(qs_basic, 'data/questions_b.json')
    final_qs(qs_class6, 'data/questions_6.json')
    

    for i, s in zip([qs_basic, qs_class6, sets_class6, v], ['Grundstoff questions', 'class B questions', 'class B sets', 'videos']):
        print(len(i), s)


def remove_unn_imgs():
    with open('data/questions_6.json') as f:
        questions1 = json.load(f)    
    
    with open('data/questions_b.json') as f:
        questions2 = json.load(f)

    imgs_used = []

    for questions in [questions1, questions2]:
        for i in questions:
            if not questions[i]['picture']:
                continue
            if questions[i]['picture'].endswith('.jpg'):
                imgs_used.append(questions[i]['picture'])

    removed = 0
    size_removed = 0
    imgs = [file for file in os.listdir(IMG_PATH) if os.path.isfile(os.path.join(IMG_PATH, file))]
    for i in imgs:
        if i not in imgs_used:
            img_path = os.path.join(IMG_PATH, i)
            removed += 1
            size_removed += os.path.getsize(img_path)
            os.remove(img_path)
    
    print(f'removed {removed} images')
    print(round(size_removed / (1024*1024), 3), 'Mbs')




if __name__ == '__main__':
    #exec_and_filter()
    remove_unn_imgs()
