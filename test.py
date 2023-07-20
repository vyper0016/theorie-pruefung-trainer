
filters = ['type', 'points', 'category', 'mq_flag', 'times_seen', 'times_wrong', 'times_right', 'times_right_iar', 'last_was_right', 'last_seen', 'ease', 
'marked']

for i in filters:
    print(i,': ')
'''
the types of the input for each key:
type : string
points: int between 2 and 5
category: string
mq_flag: bool (use check box)
times_seen : int
times_wrong : int
times_right : int
times_right_iar : int
last_was_right : bool (use check box)
last_seen : string
ease : int between 0 and 2
marked : bool (use check box)

visible text for each key:
type : type
points : points
category : catrgory
mq_flag : Mother Questions
times_seen : times seen
times_wrong : times wrong
times_right : times right
times_right_iar : times right in a row
last_was_right : last time was right
last_seen : last seen (date)
ease : ease
marked : marked
'''

