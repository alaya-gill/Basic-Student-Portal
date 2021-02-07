grades=[
    {'low': 85, 'high': 100, 'gpa': 4.0},
    {'low': 80, 'high': 84, 'gpa': 3.7},
    {'low': 75, 'high': 79, 'gpa': 3.3},
    {'low': 70, 'high': 74, 'gpa': 3.0},
    {'low': 65, 'high': 69, 'gpa': 2.7},
    {'low': 60, 'high': 64, 'gpa': 2.3},
    {'low': 55, 'high': 59, 'gpa': 2.0},
    {'low': 53, 'high': 54, 'gpa': 1.7},
    {'low': 50, 'high': 52, 'gpa': 1.0},
    ]
def gpa(marks):
    global grades
    if marks<50:
        return 0.0
    for doc in grades:
        if doc['low']<=marks<=doc['high']:
            return doc['gpa']

def cgpa(marks):
    global grades
    total=sum([gpa(i) for i in marks])
    return float("{:.2f}".format(total/len(marks)))

