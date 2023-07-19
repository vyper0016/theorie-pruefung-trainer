
import json

def count_sets():
    with open('executed_table_sets.json') as f:
        d = json.load(f)

    c = 0
    for i in d:
        if i['class_id'] == 6:
            c += 1
            print(len(i['question_ids']))

    return c

print(count_sets())