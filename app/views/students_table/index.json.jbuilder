json.students @students.includes(:group, :profile) do |student|
  json.email student.email
  json.id student.id
  json.profile student.profile
  if student.group
    json.group student.group
    json.level Level.find_by(id: student.group.level_id)
  else
    json.group ''
    json.level ''
  end
end