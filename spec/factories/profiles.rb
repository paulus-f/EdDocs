FactoryBot.define do
  factory :only_profile do
    first_name { Faker::Name.first_name }
    last_name  { Faker::Name.last_name }
    user_id    { User.last.id }
  end
end
