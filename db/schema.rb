# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_04_13_214851) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "allergies", force: :cascade do |t|
    t.string "source"
    t.string "cause"
    t.bigint "profile_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["profile_id"], name: "index_allergies_on_profile_id"
  end

  create_table "certificates", force: :cascade do |t|
    t.bigint "profile_id"
    t.string "header", default: "Certificate"
    t.string "message", default: "Congratulation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "level_id"
    t.index ["level_id"], name: "index_certificates_on_level_id"
    t.index ["profile_id"], name: "index_certificates_on_profile_id"
  end

  create_table "certificates_profiles", id: false, force: :cascade do |t|
    t.bigint "profile_id"
    t.bigint "certificate_id"
    t.index ["certificate_id"], name: "index_certificates_profiles_on_certificate_id"
    t.index ["profile_id"], name: "index_certificates_profiles_on_profile_id"
  end

  create_table "conversations", force: :cascade do |t|
    t.integer "recipient_id"
    t.integer "sender_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "recipient_type", default: "User"
    t.index ["recipient_id", "sender_id"], name: "index_conversations_on_recipient_id_and_sender_id", unique: true
    t.index ["recipient_id"], name: "index_conversations_on_recipient_id"
    t.index ["sender_id"], name: "index_conversations_on_sender_id"
  end

  create_table "courses", force: :cascade do |t|
    t.string "name", null: false
    t.integer "hours", null: false
    t.datetime "start", null: false
    t.datetime "finish", null: false
    t.bigint "level_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.string "photo_file_name"
    t.string "photo_content_type"
    t.integer "photo_file_size"
    t.datetime "photo_updated_at"
    t.index ["level_id"], name: "index_courses_on_level_id"
  end

  create_table "emergency_conns", force: :cascade do |t|
    t.string "first_name"
    t.string "second_name"
    t.string "third_name"
    t.string "phone_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "profile_id"
    t.index ["profile_id"], name: "index_emergency_conns_on_profile_id"
  end

  create_table "foundations", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.bigint "user_id"
    t.string "type_foundation"
    t.string "address"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "end_academic_year"
    t.date "begin_academic_year"
    t.index ["user_id"], name: "index_foundations_on_user_id"
  end

  create_table "foundations_users", id: false, force: :cascade do |t|
    t.bigint "foundation_id"
    t.bigint "user_id"
    t.index ["foundation_id"], name: "index_foundations_users_on_foundation_id"
    t.index ["user_id"], name: "index_foundations_users_on_user_id"
  end

  create_table "general_infos", force: :cascade do |t|
    t.string "first_name"
    t.string "second_name"
    t.string "third_name"
    t.datetime "birth_date"
    t.string "hobbie"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "profile_id"
    t.index ["profile_id"], name: "index_general_infos_on_profile_id"
  end

  create_table "groups", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "level_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["level_id"], name: "index_groups_on_level_id"
  end

  create_table "jwt_tokens", force: :cascade do |t|
    t.bigint "user_id"
    t.string "token"
    t.index ["user_id"], name: "index_jwt_tokens_on_user_id"
  end

  create_table "levels", force: :cascade do |t|
    t.string "name", null: false
    t.bigint "foundation_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["foundation_id"], name: "index_levels_on_foundation_id"
  end

  create_table "medications", force: :cascade do |t|
    t.string "name"
    t.datetime "time"
    t.float "dose"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "profile_id"
    t.index ["profile_id"], name: "index_medications_on_profile_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "body"
    t.bigint "user_id"
    t.bigint "conversation_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["conversation_id"], name: "index_messages_on_conversation_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "parent_contacts", force: :cascade do |t|
    t.string "first_name"
    t.string "second_name"
    t.string "third_name"
    t.string "phone_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "profile_id"
    t.index ["profile_id"], name: "index_parent_contacts_on_profile_id"
  end

  create_table "profiles", force: :cascade do |t|
    t.bigint "user_id"
    t.string "first_name"
    t.string "last_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "certificate_id"
    t.index ["certificate_id"], name: "index_profiles_on_certificate_id"
    t.index ["user_id"], name: "index_profiles_on_user_id"
  end

  create_table "questionnaires", force: :cascade do |t|
    t.boolean "sportF"
    t.boolean "glasses"
    t.boolean "hearing"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "profile_id"
    t.index ["profile_id"], name: "index_questionnaires_on_profile_id"
  end

  create_table "quiz_asnwers", force: :cascade do |t|
    t.string "input"
    t.string "asnwer"
    t.bigint "quiz_question_id"
    t.bigint "quiz_results_id"
    t.index ["quiz_question_id"], name: "index_quiz_asnwers_on_quiz_question_id"
    t.index ["quiz_results_id"], name: "index_quiz_asnwers_on_quiz_results_id"
  end

  create_table "quiz_questions", force: :cascade do |t|
    t.string "prompt"
    t.boolean "quiz_type", default: false
    t.string "a"
    t.string "b"
    t.string "c"
    t.string "d"
    t.string "input"
    t.string "asnwer"
    t.bigint "quiz_id"
    t.index ["quiz_id"], name: "index_quiz_questions_on_quiz_id"
  end

  create_table "quiz_results", force: :cascade do |t|
    t.float "result"
    t.boolean "finished", default: false
    t.bigint "quiz_id"
    t.bigint "user_id"
    t.index ["quiz_id"], name: "index_quiz_results_on_quiz_id"
    t.index ["user_id"], name: "index_quiz_results_on_user_id"
  end

  create_table "quizzes", force: :cascade do |t|
    t.string "name"
    t.bigint "user_id"
    t.bigint "course_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["course_id"], name: "index_quizzes_on_course_id"
    t.index ["user_id"], name: "index_quizzes_on_user_id"
  end

  create_table "requests", force: :cascade do |t|
    t.bigint "parent_id"
    t.bigint "student_id"
    t.bigint "level_id"
    t.bigint "group_id"
    t.bigint "foundation_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["foundation_id"], name: "index_requests_on_foundation_id"
    t.index ["group_id"], name: "index_requests_on_group_id"
    t.index ["level_id"], name: "index_requests_on_level_id"
    t.index ["parent_id"], name: "index_requests_on_parent_id"
    t.index ["student_id"], name: "index_requests_on_student_id"
  end

  create_table "signatures", force: :cascade do |t|
    t.bigint "profile_id"
    t.string "signature_file_name"
    t.string "signature_content_type"
    t.integer "signature_file_size"
    t.datetime "signature_updated_at"
    t.index ["profile_id"], name: "index_signatures_on_profile_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "role", null: false
    t.boolean "approve", default: false
    t.bigint "foundation_id"
    t.bigint "group_id"
    t.boolean "enrollment_form", default: false
    t.string "parent_type"
    t.bigint "parent_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["foundation_id"], name: "index_users_on_foundation_id"
    t.index ["group_id"], name: "index_users_on_group_id"
    t.index ["parent_type", "parent_id"], name: "index_users_on_parent_type_and_parent_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "video_channels", force: :cascade do |t|
    t.string "name"
    t.boolean "open"
    t.bigint "creator_id"
    t.bigint "group_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "conversation_id"
    t.bigint "course_id"
    t.index ["conversation_id"], name: "index_video_channels_on_conversation_id"
    t.index ["course_id"], name: "index_video_channels_on_course_id"
    t.index ["creator_id"], name: "index_video_channels_on_creator_id"
    t.index ["group_id"], name: "index_video_channels_on_group_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "allergies", "profiles"
  add_foreign_key "foundations", "users"
  add_foreign_key "messages", "conversations"
  add_foreign_key "messages", "users"
end
