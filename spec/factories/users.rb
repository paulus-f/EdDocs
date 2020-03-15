FactoryBot.define do
  factory :admin, class: User do
    email { Faker::Internet.unique.email }
    password { '11111111' }
    role { 'admin' }
    approve { true }
    confirmed_at { DateTime.now }
  end

  factory :manager, class: User do
    email { Faker::Internet.unique.email }
    password { '11111111' }
    role { 'manager' }
    approve { true }
    confirmed_at { DateTime.now }
  end

  factory :parent, class: User do
    email { Faker::Internet.unique.email }
    password { '11111111' }
    role { 'parent' }
    confirmed_at { DateTime.now }
  end

  factory :student, class: User do
    email { Faker::Internet.unique.email }
    password { '11111111' }
    role { 'student' }
    confirmed_at { DateTime.now }
  end
end