json.levels @foundation.levels do |level|
  json.name level.name
  json.id level.id
  json.groups level.groups do |group|
    json.name group.name
    json.id group.id
  end
end
