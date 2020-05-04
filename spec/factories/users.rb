FactoryBot.define do
  factory :admin, class: User do
    email { Faker::Internet.unique.email }
    password { 'password' }
    role { 'admin' }
    approve { true }
    confirmed_at { DateTime.now }
  end

  factory :manager, class: User do
    email { Faker::Internet.unique.email }
    password { 'password' }
    role { 'manager' }
    approve { true }
    confirmed_at { DateTime.now }
  end

  factory :parent, class: User do
    email { Faker::Internet.unique.email }
    password { 'password' }
    role { 'parent' }
    confirmed_at { DateTime.now }
  end

  factory :student, class: User do
    email { Faker::Internet.unique.email }
    password { 'password' }
    role { 'student' }
    confirmed_at { DateTime.now }
  end
end