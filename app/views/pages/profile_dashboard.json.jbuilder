json.current_user do
  json.id current_user.id
  json.email current_user.email
  json.role current_user.role
  json.created_at current_user.created_at
end

json.foundation current_user.foundation
json.students_count current_user.foundation.students.count if current_user.foundation
json.managers_count current_user.foundation.managers.count if current_user.foundation
json.profile current_user.profile

if current_user.parent?
  json.typeUser 'parent'
  json.children current_user.children do |child|
    json.child_profile child.profile
    json.email child.email
    json.id child.id
  end
end

if current_user.student?
  json.typeUser 'student'
  json.group current_user.group
  if current_user.group
    json.students current_user.group.students.eager_load(:profile) do |student|
      json.profile student.profile
      json.id student.id
    end
    json.level current_user.group.level

    json.courses current_user.group.level.courses do |course|
      json.name course.name
      json.hours course.hours
      json.start course.start.to_date
      json.finish course.finish.to_date
      json.description course.description
      json.level_id course.level_id
      json.image_url course.photo.url == 'notfound.png' ? asset_url(course.photo.url) : course.photo.url
    end

    json.channels current_user.group.video_channels do |channel|
      json.id channel.id
      json.name channel.name
      json.open channel.open || false
      json.creator_id channel.creator_id
      json.group_id channel.group_id
      json.conversation_id channel.conversation_id
      json.course_id channel.course_id
    end
    json.quizResults QuizResult.where(user_id: current_user.id).as_json(include: :user)
    json.quizzes Quiz.where(course_id: current_user.group.level.courses.pluck(:id))
  end

  json.levels current_user.foundation.levels do |level|
    json.name level.name
    json.id level.id
    json.courses level.courses do |course|
      json.name course.name
      json.id course.id
    end
  end

  json.managersCount current_user.foundation.managers.count
  json.studentsCount current_user.foundation.students.count
  json.foundationImage current_user.foundation.image.attached? ? url_for(current_user.foundation.image) : asset_url('not_found_foundation_image')

  json.certificates current_user.profile.certificates do |certificate|
    json.id certificate.id
    json.foundationName certificate.foundation.name
    json.levelName certificate.level.name
  end
end
