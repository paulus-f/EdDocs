require 'sidekiq/web'

Rails.application.routes.draw do
  devise_for :users, controllers: { registrations: 'registrations', sessions: "sessions" }
  root 'pages#index'
  resources :certificates, only: [:show]
  resources :foundations, only: %i[edit create new show destroy update]
  get '/get_levels', to: 'levels#get_levels'
  get '/list_foundations', to: 'foundations#list_foundations'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  #pages routes
  post '/support', to: 'pages#support'
  get '/new_foundation', to: 'pages#foundation_form', as: :foundation_form
  get '/manager_dashboard', to: 'pages#manager_dashboard'

  resources :profiles

  resources :video_channels do
    post '/create_connection', to: 'video_channels#create_connection'
  end

  resources :certificates do
  end

  devise_scope :user do
    post '/approve_users', to: 'registrations#approve_users'
    post '/delete_users', to: 'registrations#delete_users'
  end

  #Admin dashboard routes
  get '/user_table/filter/', to: 'admin_dashboard#user_table_filter'
  get '/get_manager_dashboard/', param: :id , to: 'admin_dashboard#get_manager_dashboard'
  get '/free_managers', to: 'admin_dashboard#get_free_managers'
  delete '/admin/delete_foundation', to: 'admin_dashboard#delete_foundation'
  post '/admin/add_manager', to: 'admin_dashboard#add_manager'
  delete '/admin/delete_manager', to: 'admin_dashboard#delete_manager'
  get '/foundation_managers', to: 'admin_dashboard#foundation_managers'
  # Manager dashboard routes
  get '/reports', to: 'manager_dashboard#reports'
  get '/foundation_id', to: 'foundations#get_foundation'
  post '/invite', to: 'manager_dashboard#invite_student'
  post '/delete_invite', to: 'manager_dashboard#delete_invite'
  post '/upload', to: 'manager_dashboard#upload'
  get '/join_to_foundation/*jwt', to: 'manager_dashboard#student_approve', constraints: { jwt: /.*/ }, as: :student_approve
  post'/invites_table/filter', to: 'manager_dashboard#filter_invites'
  post '/foundation/preload', to: 'foundations#preload'
  post '/foundation/purge', to: 'foundations#image_purge'
  post '/manager_dashboard/delete_requests', to: 'requests#destroy'
  post '/manager_dashboard/approve_requests', to: 'requests#approve'
  # Enrollment Form routes
  get '/confirm_parent', to: 'enrollment_save#student_confirm_parent'
  get '/enrollment/update/student/', to: 'enrollment_save#get_children'
  get '/free_children/', to: 'enrollment_save#get_free_children'
  post '/enrollment/save', to: 'enrollment_save#update'
  post '/enrollment/children/new/', to: 'enrollment_save#new_children'
  get '/user/children', to: 'parents#index'
  get '/user/children/edit', to: 'parents#edit'
  post '/enroll_child', to: 'requests#create'

  ### ---------- WARNING ---------------_###
  # idk what route it should be, mby like a /foundation/students or smthing else
  # *Should be changed, also should change for it controller
  get '/children/show', to: 'parents#show'

  post '/levels/generate_by_template', to: 'levels#generate_by_template'
  post '/groups/kick_from_group/:student_id', to: 'groups#kick_from_group'
  post '/students_table/kick', to: 'students_table#kick_student'
  post '/students_table/filter', to: 'students_table#filter_students'
  post '/manager_dashboard/reload', to: 'manager_dashboard#reload_data'
  resources :levels do
    get '/certificate', to: 'levels#get_info_certificate'
    put '/certificate/add_profile', to: 'levels#certificate_add_profile'
    resources :groups do
      get '/foundation/end_academic_year', to: 'groups#get_foundation_end_year'
      post '/students/enroll', to: 'groups#enroll'
    end
    resources :courses
  end

  resources :profiles
  mount Sidekiq::Web => '/sidekiq'

  resources :conversations, only: [:index, :create] do
  	member do
  		post :close
    end
    
  	resources :messages, only: [:create]
  end
end
