from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import json
import codecs
import scrape
import os
import zipfile
from copy import deepcopy
from progress import init_progress, init_progress_sets


IMG_PATH = "./web/assets/img"
VID_PATH = './web/assets/vid'
APK_PATH = './apk/'
DB_1_OR_2 = '1'


def get_files_from_apk():
    print('extracting from apk...')
    apks = [file for file in os.listdir(APK_PATH) if file.endswith('.apk')]
    if not apks:
        print('no apks found in', APK_PATH)
        quit()
    apk = APK_PATH + apks[0]
    os.makedirs(IMG_PATH, exist_ok=True)
    os.makedirs(VID_PATH, exist_ok=True)
    os.makedirs('js/en', exist_ok=True)
    os.makedirs('js/dbs', exist_ok=True)

    print('extracting javascript...')
    js_path = f'assets/www/data/{DB_1_OR_2}/'
    js_files = ["tblQuestions.js", "tblQuestionInfos.js", "tblSets.js"]

    for f in js_files:
        fpath = js_path + f
        extract_from_zip(apk, 'js', fpath)

    extract_from_zip(apk, 'js/en', js_path+'ext/GB/tblQuestions.js')
    print('done extracting')
    return apk


def extract_from_zip(apk, output_folder, file_to_extract):
    with zipfile.ZipFile(apk, 'r') as zip_ref:
        # Extract the file directly into the output folder
        with zip_ref.open(file_to_extract) as file_in_zip, \
                open(os.path.join(output_folder, os.path.basename(file_to_extract)), 'wb') as output_file:
            output_file.write(file_in_zip.read())


def extract_files_from_zip_folder(apk, output_folder, folder_to_extract):
    with zipfile.ZipFile(apk, 'r') as zip_ref:
        # Iterate through all files in the zip archive
        for file_info in zip_ref.infolist():
            # Check if the file belongs to the specified folder
            if file_info.filename.startswith(folder_to_extract) and not file_info.is_dir():
                # Extract the file directly into the output folder
                file_contents = zip_ref.read(file_info)
                output_file_path = os.path.join(output_folder, os.path.basename(file_info.filename))
                with open(output_file_path, 'wb') as output_file:
                    output_file.write(file_contents)


def extract_imgs(questions):
    print('extracting images...')
    apks = [file for file in os.listdir(APK_PATH) if file.endswith('.apk')]
    if not apks:
        print('no apks found in', APK_PATH)
        quit()
    apk = APK_PATH + apks[0]

    imgs_used = []

    for i in questions:
        if not questions[i]['picture']:
            continue
        if questions[i]['picture'].endswith('.jpg') or questions[i]['picture'].endswith('.png'):
            imgs_used.append(questions[i]['picture'])
    imgs_in_apk = 'assets/www/assets/img/images/'

    for i in imgs_used:
        img_path = imgs_in_apk + i
        extract_from_zip(apk, IMG_PATH, img_path)
    
    extract_files_from_zip_folder(apk, IMG_PATH, 'assets/www/assets/img/etc/gb')
    print('done')
     

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


#also removes classes
def filter_qs_class6(data, output_filename=None):
    filtered = []
    for i in data:
        try:
            i['classes']
        except KeyError:
            continue

        if ',6,' in i['classes']:
            i.pop('classes')
            filtered.append(i)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(filtered, f, indent=3)
    
    return filtered
    

def filter_qs_basic(data, output_filename=None):
    filtered = []
    for i in data:
        if i['basic'] == 1:
            i.pop('classes')
            filtered.append(i)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(filtered, f, indent=3)
    
    return filtered


def filter_sets_class6(data, output_filename=None):
    filtered = []
    for i in data:
        if i['class_id'] == 6:
            i.pop('class_id')
            filtered.append(i)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(filtered, f, indent=3)
    
    return filtered


def change_etc_imgs(data, output_filename=None):
    to_replace = "./assets/img/etc/gb/"
    new_img_path = IMG_PATH.replace('web/', '') + '/'

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
            i['type'] = 'number'

    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(data, f, indent=3)
    
    return data


#adds a db 'vids.json' with video names as the keys and a link to the video and 'downloaded' set to False by default, only if its basic or class 6
def sort_videos(data, output_filename='data/vids.json'):
    
    vids = {}
    for i in data:
        if i['type'] == 'video':
            vids[i['picture']] = {
                'downloaded': False,
                'url': scrape.get_video_link_qid(i['number'])
            }
    
    with open(output_filename, 'w') as f:
        json.dump(vids, f, indent=3)
    
    return vids

# adds a type for each question and removes the asw_type_{n} keys 
def add_question_types(data):
    for i in data:
        try:
            i['type']
            continue
        except KeyError:
            pass
        
        if i['picture'] and i['picture'].endswith('.m4v'):
            type_ = 'video'
        
        elif not i['picture']:
            type_ = 'text_only'
        
        else:
            type_ = 'text_image'
        
        i['type'] = type_
        i.pop('asw_type_1')
        i.pop('asw_type_2')
        try:
            i.pop('asw_type_3')
        except KeyError:
            pass
    return data


#makes a dict with the 'number' as the key
def final_qs(data, output_filename):
    questions = {}
    for i in data:
        questions[i.pop('number')] = i
    
    
    with open(output_filename, 'w') as f:
        json.dump(questions, f, indent=3)   
    
    return questions


#makes a dict with the 'rank' as the key
def final_sets(sets, output_filename):
    sets_out = []
    for i in sets:
        sets_out.append(i['question_ids'])
    
    
    with open(output_filename, 'w') as f:
        json.dump(sets_out, f, indent=3)   
    
    return sets_out


def exec_and_filter(dump=False):
    output_file = merge_files()
    print('merged files')
    print('executing javascript')
    qs = execute_js(output_file, 'dbTblQ', dump*'js/dbs/questions_table1.json')
    sets = execute_js(output_file, 'dbTableSets', dump*'js/dbs/sets_table1.json')
    print('done')
    print('decrypting...')
    qs = decrypt_qs(qs, dump*'js/dbs/questions_table2.json')
    print('sorting database')
    qs = change_etc_imgs(qs)
    qs = remove_unn(qs)
    qs = replace_categories(qs)
    qs = number_qs(qs)
    qs = add_question_types(qs)
    print('getting video links...')
    v = sort_videos(qs)
    print('done')
    print('final sort...')
    qs_basic = filter_qs_basic(qs, dump*'js/dbs/questions_basic.json')
    qs_class6 = filter_qs_class6(qs, dump*'js/dbs/questions_class6.json')
    
    qs1 = deepcopy(qs)
    sets_class6 = filter_sets_class6(sets)
    sets = final_sets(sets_class6, 'data/sets.json')
    final_qs(qs_basic, 'data/questions_b.json')
    final_qs(qs_class6, 'data/questions_6.json')
    f = final_qs(qs1, 'data/questions.json')
    extract_imgs(f)
    

    for i, s in zip([qs_basic, qs_class6, sets_class6, f, v], ['Grundstoff questions', 'class B questions', 'class B sets', 'total questions', 'videos']):
        print(len(i), s)


if __name__ == '__main__':
    # scrape.get_categories()
    #get_files_from_apk()
    exec_and_filter(dump=False)
    # init_progress()
    # init_progress_sets()
    
