json.name @course.name
json.id @course.id
json.start @course.start.to_date
json.finish @course.finish.to_date
json.level_id @course.level_id
json.hours @course.hours
json.description @course.description
json.image_url asset_url(@course.photo)