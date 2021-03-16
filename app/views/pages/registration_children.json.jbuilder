json.current_user do
  json.id current_user.id
  json.email current_user.email
  json.role current_user.role
  json.created_at current_user.created_at
end

json.data do
  json.first_name profile.first_name
  json.last_name profile.last_name
end

json.parent_contact profile.parent_contact
json.student_id profile.user.id
json.medication profile.medication
json.general_info profile.general_info
json.emergency profile.emergency_conn 
json.questionnaire profile.questionnaire
json.allergy profile.allergy
json.signature profile.signature
