json.levels @foundation.levels.eager_load(:groups) do |level|
  json.groups level.groups.eager_load(:students) do |group|
    json.name group.name
    json.id group.id
    json.students group.students.eager_load(:profile) do |student|
      json.profile student.profile
      json.id student.id
    end
  end
  json.name level.name
  json.id level.id
end
  