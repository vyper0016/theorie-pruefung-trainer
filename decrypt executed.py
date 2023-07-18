import json
import codecs

with open('executed.json', 'r') as f:
    data = json.load(f)

data_decrypted = []
for i in data:
    if i:
        if i['info']:
            i['info'] = codecs.decode(i['info'], 'rot_13')
        i['text'] = codecs.decode(i['text'], 'rot_13')

        data_decrypted.append(i)

with open('executed_decrypted.json', 'w') as f:
    json.dump(data_decrypted, f, indent=3)
        