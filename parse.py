def parse_dialogue_file(file_path):
    parsed_dialogues = []

    with open(file_path, 'r') as file:
        for line in file:
            turns = line.strip().split('__eou__')
            turns = [turn.strip() for turn in turns if turn.strip()]
            parsed_dialogues.append(turns)

    return parsed_dialogues

file_path = 'dialogues.txt'
parsed_dialogues = parse_dialogue_file(file_path)

for i, dialogue in enumerate(parsed_dialogues):
    print(f"Dialogue {i+1}:")
    for j, turn in enumerate(dialogue):
        print(f"  Turn {j+1}: {turn}")
    print()
