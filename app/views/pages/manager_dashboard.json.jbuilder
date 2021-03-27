json.invites @foundation.invites.eager_load(:profile) do |invite|
  json.email invite.email
  json.id invite.id
  json.profile invite.profile
end

json.foundation @foundation
json.foundationImage @foundation.image.attached? ? url_for(@foundation.image) : asset_url('not_found_foundation_image')
json.foundationImageNotFound asset_url('not_found_foundation_image')
json.manager @foundation.managers.include?(current_user)
json.managers_count @foundation.managers.count
json.current_user current_user
json.levels @foundation.levels.eager_load(:courses, :groups) do |level|
  json.groups level.groups.eager_load(:students) do |group|
    json.name group.name
    json.id group.id
    json.level_id group.level_id
    json.students group.students.eager_load(:profile) do |student|
      json.profile student.profile
      json.id student.id
      json.certificates student.profile.certificates
    end
  end
  json.courses level.courses do |course|
    json.name course.name
    json.id course.id
    json.level_id course.level_id
    json.hours course.hours
    json.start course.start.to_date
    json.finish course.finish.to_date
    json.description course.description
    json.image_url asset_url(course.photo)
  end
  json.name level.name
  json.id level.id
end

json.requests @foundation.requests.includes(:level, :group, :parent, :student) do |request|
  json.parent request&.parent&.email
  json.student request&.student&.email
  json.id request&.id
  json.student_id request&.student&.id
  json.level request&.level&.name
  json.group request&.group&.name
end

json.students @foundation.students.includes(:profile, :group) do |student|
  json.email student.email
  json.id student.id
  json.profile student.profile
  json.certificates student.profile.certificates
  if student.group
    json.group student.group
    json.level Level.find_by(id: student.group.level_id)
  else
    json.group ''
    json.level ''
  end
end

json.courses @foundation.courses do |course|
  json.name course.name
  json.id course.id
  json.hours course.hours
  json.start course.start.to_date
  json.finish course.finish.to_date
  json.description course.description
  json.level_id course.level_id
  json.image_url asset_url(course.photo)
end

json.studentsWithoutGroup @foundation.students.where(group_id: nil) do |student|
  json.profile student.profile
  json.id student.id
end

json.channels VideoChannel.where(creator_id: current_user.id) do |channel|
  json.id channel.id
  json.name channel.name
  json.open channel.open || false
  json.creator_id channel.creator_id
  json.group_id channel.group_id
  json.conversation_id channel.conversation_id
  json.course_id channel.course_id
end

json.imageNotFound asset_url('notfound.png')
