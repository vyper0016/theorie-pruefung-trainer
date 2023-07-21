from time import sleep
from scrape import get_json

progress = get_json('progress.json')


def questions_generator_yielder(questions):
    global progress
    for c, q in enumerate(questions):
        dic = {'number': q,
               'total': len(questions),
               'current': c+1}
        
        for i in questions[q]:
            dic[i] = questions[q][i]
        
        for i in progress[q]:
            dic[i] = progress[q][i]
            
        yield dic
qs = {   "1.2.03-001": {
      "asw_1": "Towing a trailer not fitted with brakes",
      "asw_2": "A wet or slippery roadway",
      "asw_3": "Driving down slopes",
      "asw_corr1": 1,
      "asw_corr2": 1,
      "asw_corr3": 1,
      "asw_pretext": "",
      "asw_type_1": "1",
      "asw_type_2": "1",
      "asw_type_3": "1",
      "basic": 1,
      "info": "<p>Moisture and slipperiness result in reduced traction and thus increase braking distance. On a slope, the car accelerates due to the downforce of the slope, which extends the braking distance. A trailer increases the mass of the vehicle, which results in a longer braking distance with the same braking force.</p>",
      "mq_flag": 0,
      "picture": "",
      "points": 4,
      "stvo": "",
      "text": "Which factors lengthen your braking distance?",
      "asw_hint": "",
      "category": "1.2.03",
      "type": "text_only"
   },
   "1.2.03-002": {
      "asw_1": "- tyres",
      "asw_2": "- braking system",
      "asw_3": "- road surface",
      "asw_corr1": 1,
      "asw_corr2": 1,
      "asw_corr3": 1,
      "asw_pretext": "The condition of the",
      "asw_type_1": "1",
      "asw_type_2": "1",
      "asw_type_3": "1",
      "basic": 1,
      "info": "<p>The condition of a braking system influences the braking distance. New brakes with good discs and full brake pads work best. The road surface has a large influence. For example, slipperiness can significantly increase braking distance. The type of tyres and tread depth influence the braking distance.</p>",
      "mq_flag": 0,
      "picture": "",
      "points": 3,
      "stvo": "",
      "text": "What does the braking distance depend on?",
      "asw_hint": "",
      "category": "1.2.03",
      "type": "text_only"
   },
   "1.2.03-101": {
      "asw_corr1": 50.0,
      "asw_pretext": "Answer:",
      "asw_type_1": "2",
      "basic": 1,
      "info": "<p>Unless there are other restrictions, a maximum speed of 50 km/h applies to all motor vehicles in built-up areas.</p>",
      "mq_flag": 0,
      "picture": "",
      "points": 3,
      "stvo": "",
      "text": "What is the permissible top speed generally in built-up areas?",
      "asw_hint": "km/h",
      "category": "1.2.03",
      "type": "number"
   },
   "1.2.03-102": {
      "asw_corr1": 4.0,
      "asw_pretext": "Answer: It is",
      "asw_type_1": "2",
      "basic": 1,
      "info": "<p>A doubling of the speed results in a quadrupling of the braking distance. The rule of thumb for braking distance is as follows: (speed / 10) x (speed / 10).</p>",
      "mq_flag": 0,
      "picture": "",
      "points": 4,
      "stvo": "",
      "text": "You double the speed at which you are travelling. How does this affect the braking distance?",
      "asw_hint": "times as long",
      "category": "1.2.03",
      "type": "number"
   },}


question_generator = questions_generator_yielder(qs)

for i in range(len(qs)):
    for j in next(question_generator):
        print(j+': ')
    print()
    break