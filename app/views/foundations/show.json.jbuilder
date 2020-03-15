json.levels @foundation.levels do |level|
  json.name level.name
  json.id level.id
  json.courses level.courses do |course|
    json.name course.name
    json.id course.id
  end
end
json.current_user current_user
json.foundation @foundation
json.managersCount @foundation.managers.count
json.studentsCount @foundation.students.count
json.foundationImage @foundation.image.attached? ? url_for(@foundation.image) : asset_url('not_found_foundation_image')