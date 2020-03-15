json.studentsWithoutGroup @foundation.students.includes(:profile).where(group_id: nil) do |student|
  json.profile student.profile
  json.id student.id
end
json.enrollStudents @group.students.includes(:profile) do |student|
  json.profile student.profile
  json.id student.id
end
