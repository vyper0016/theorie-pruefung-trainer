from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import json

# Set up the WebDriver service
webdriver_service = Service('C:\\Users\\boon\\Documents\\python\\chromedriver_win32\\chromedriver.exe')
webdriver_options = Options()
webdriver_options.headless = True  # Run the browser in headless mode
driver = webdriver.Chrome(service=webdriver_service, options=webdriver_options)

# Read the JavaScript code from a file
with open('js/tblQuestionInfos.js', 'r') as file:
    js_code = file.read()

# Modify the JavaScript code to return the function output
modified_js_code = f'return ({js_code})();'

# Execute the modified JavaScript code
output = driver.execute_script(modified_js_code)

with open('executed.json', 'w') as f:
    json.dump(output, f, indent=3)

# Quit the WebDriver
driver.quit()
