from filters import get_questions
import os

def test_images():

    questions = get_questions()
    not_found = []
    for q in questions:
        
        if questions[q]['picture'] and not questions[q]['picture'].endswith('.m4v'):
            path = './web/assets/img/' + questions[q]['picture']
            if not os.path.isfile(path):
                not_found.append((q, questions[q]['picture']))
            else:
                pass
    return not_found

print(test_images())