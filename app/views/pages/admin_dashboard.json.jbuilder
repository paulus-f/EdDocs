json.foundations Foundation.all.to_json(include: %i[managers students])
json.users User.all.to_json
json.current_user current_user