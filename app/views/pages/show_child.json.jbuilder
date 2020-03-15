json.child do
  json.first_name @children_profile.first_name
  json.last_name @children_profile.last_name
end
json.parent_contact @children_profile.parent_contact
json.student_id @children_profile.user.id
json.medication @children_profile.medication
json.general_info @children_profile.general_info
json.emergency @children_profile.emergency_conn
json.questionnaire @children_profile.questionnaire
json.allergy @children_profile.allergy
json.signature @children_profile.signature.signature ? @children_profile.signature.signature.url : asset_url('missing_signature.png')