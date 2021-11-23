import random

from db_tables import Annotation
# from server.db_tables import Annotation

TYPE_YOUR_ANSWER = 1


def bonus_type_two(ann: Annotation):
	rand_choice = random.randint(0, 4)
	ann.lotto_choice = rand_choice
	response = {}
	type_choice = ann.choices[rand_choice]
	if type_choice != TYPE_YOUR_ANSWER:
		percent = (rand_choice + 5) * 10
		response['chance'] = percent
	response['type'] = type_choice
	response['chose'] = rand_choice
	return response


def bonus_type_one():
	return {'type': TYPE_YOUR_ANSWER}
