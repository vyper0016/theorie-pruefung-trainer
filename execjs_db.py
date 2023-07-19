from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import json
import codecs


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


def filter_qs_class6(data, output_filename=None):
    filtered = []
    for i in data:
        if ',6,' in i['classes']:
            filtered.append(i)
    
    if output_filename:
        with open(output_filename, 'w') as f:
            json.dump(filtered, f, indent=3)
    
    return filtered
    

def filter_qs_basic(data, output_filename=None):
    filtered = []
    for i in data:
        if i['basic'] == 1:
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
    new_img_path = "./assets/img"

def exec_and_filter():
    output_file = merge_files()
    qs = execute_js(output_file, 'dbTblQ', 'js/dbs/questions_table1.json')
    sets = execute_js(output_file, 'dbTableSets', 'js/dbs/sets_table1.json')
    qs = decrypt_qs(qs, 'js/dbs/questions_table2.json')
    qs_basic = filter_qs_basic(qs, 'js/dbs/questions_basic1.json')
    qs_class6 = filter_qs_class6(qs, 'js/dbs/questions_class6_1.json')
    sets_class6 = filter_sets_class6(sets, 'js/dbs/sets_class6_1.json')
    

    for i, s in zip([qs_basic, qs_class6, sets_class6], ['Grundstoff questions', 'class B questions', 'class B sets']):
        print(len(i), s)


if __name__ == '__main__':
    exec_and_filter()
