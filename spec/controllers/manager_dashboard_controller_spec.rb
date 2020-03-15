require 'rails_helper'
require 'fileutils'

RSpec.describe ManagerDashboardController, type: :controller do
  include Devise::Test::ControllerHelpers
  fixtures :all

  before(:each) do
    signed_in_as_a_manager
  end
  after(:all) do
    FileUtils.rm(Rails.root.to_s + '/emails.csv')
    FileUtils.rm(Rails.root.to_s + '/emails_with_error.csv')
  end

  describe 'POST #invite_student' do
    context 'When user exist' do
      before(:each) do
        @student = FactoryBot.create :student
      end
      it 'increase count of jobs by 1 and render student information' do
        expect {
            post(:invite_student, params: { invite: { email: @student.email }, foundation_id: @foundation.id })
            expect(JSON.parse(response.body)['profile']).to eq(JSON.parse(@student.profile.to_json))
            expect(JSON.parse(response.body)['email']).to eq(JSON.parse(@student.email.to_json))
          }.to change(User.students, :count).by(0).and change(InviteWorker.jobs, :size).by(1)
      end
    end
    context 'When user not exist' do
      before(:each) do
        @student = FactoryBot.build :student
      end
      it 'increase count of jobs by 1 and render student information, but also create new student' do
        expect {
          post(:invite_student, params: { invite: { email: @student.email, first_name: 'Foo', last_name: 'Bar' }, foundation_id: @foundation.id } )
          expect(JSON.parse(response.body)['profile']['first_name']).to eq('Foo')
          expect(JSON.parse(response.body)['profile']['last_name']).to eq('Bar')
        }.to change(User.students, :count).by(1).and change(InviteWorker.jobs, :size).by(1)
      end
    end
    context 'When user was invited again' do
      before(:each) do
        @student = FactoryBot.create :student
        @foundation.invites << @student
      end
      it 'increase count of jobs by 1 and render no content(204)' do
        expect {
          post(:invite_student, params: { invite: { email: @student.email }, foundation_id: @foundation.id })
          expect(response).to have_http_status(204)
        }.to change(User.students, :count).by(0).and change(InviteWorker.jobs, :size).by(1)
      end
    end
  end

  describe 'POST #delete_invite' do
    context 'When selected only one invite' do
      before(:each) do
        @student = FactoryBot.create :student
        @foundation.invites << @student
      end
      it 'delete student form invites list' do
        expect {
          post(:delete_invite, params: { selected: [@student.id], foundation_id: @foundation.id })
          expect(JSON.parse(response.body)).to eq(JSON.parse(Foundation.last.invites.to_json(include: :profile)))
        }.to change(@foundation.invites, :count).by(-1)
      end
    end
    context 'When selected more then one invite' do
      before(:each) do
        @selected = []
        5.times do 
          @student = FactoryBot.create :student
          @selected << @student.id
          @foundation.invites << @student
        end
      end
      it 'delete all selected invites and render empty data' do
        expect {
          post(:delete_invite, params: { selected: [@selected], foundation_id: @foundation.id })
          expect(response.body).to eq('[]') 
        }.to change(@foundation.invites, :size).by(-5)
      end
    end
  end

  describe 'POST #upload' do
    context 'when csv file with right format and data' do
      before(:each) do
        CSV.open("emails.csv", "w") do |csv|
          csv << ["email", "first_name", "last_name"]
          20.times do
            csv << [Faker::Internet.email, Faker::Name.first_name, Faker::Name.last_name]
          end
        end
        @csv = Base64.encode64(open(Rails.root.to_s + '/emails.csv') { |io| io.read })
        @csv = 'data:text/csv;base64,'+@csv.chop!
      end
      it 'Add all students from file to invites excluding repetitive, send to all mails and render foundation invites with alert succes' do
        expect {
          post(:upload, params: { file: @csv, foundation_id: @foundation.id })
          expect(JSON.parse(response.body)).to eq(JSON.parse(
          {
            students: Foundation.last.invites.to_json(include: :profile),
            alertType: 'success',
            alertMessage: 'Import from file succesfully done!'
          }.to_json))
          }.to change(@foundation.invites, :count).by(20).and change(InviteWorker.jobs, :size).by(20)
      end
    end
    context 'when upload file is empty' do
      before(:each) do
        @wrongcsv = 'data:text/csv;base64,'
      end
      it 'add nothing and send alert success' do
        expect {
          post(:upload, params: { file: @wrongcsv, foundation_id: @foundation.id })
          expect(JSON.parse(response.body)).to eq(JSON.parse(
          {
            students: "[]",
            alertType: 'success',
            alertMessage: 'Import from file succesfully done!'
          }.to_json))
        }.to change(@foundation.invites, :count).by(0).and change(InviteWorker.jobs, :size).by(0)
      end
    end
    context 'when upload file have wrong format' do
      before(:each) do
        @image = Base64.encode64(open(Rails.root.to_s + '/Schooldogs.xml') { |io| io.read })
        @image = 'data:image/jpeg;base64,'+@image.chop!
      end
      it 'cathe error, render alert error and empty data' do
        expect {
          post(:upload, params: { file: @image, foundation_id: @foundation.id })
          expect(JSON.parse(response.body)).to eq(JSON.parse(
          {
            students: "[]",
            alertType: 'error',
            alertMessage: 'File error! Wrong format...'
          }.to_json))
        }.to change(@foundation.invites, :count).by(0).and change(InviteWorker.jobs, :size).by(0)
      end
    end
    context 'when upload file have right format but wrong data' do
      before(:each) do
        CSV.open("emails_with_error.csv", "w") do |csv|
          csv << ["email", "first_name", "last_name"]
          csv << [Faker::Name.first_name, Faker::Name.first_name, Faker::Name.last_name]
          19.times do
            csv << [Faker::Internet.email, Faker::Name.first_name, Faker::Name.last_name]
          end
        end
        @csv = Base64.encode64(open(Rails.root.to_s + '/emails_with_error.csv') { |io| io.read })
        @csv = 'data:text/csv;base64,'+@csv.chop!
      end
      it 'cathe error, render studetn that have time to upload and send alert with error-string' do
        expect {
          post(:upload, params: { file: @csv, foundation_id: @foundation.id })
          expect(JSON.parse(response.body)).to eq(JSON.parse(
          {
            students: Foundation.last.invites.to_json(include: :profile),
            alertType: 'warning',
            alertMessage: 'Invalid data error - string 2'
          }.to_json))
        }.to change(@foundation.invites, :count).by(0).and change(InviteWorker.jobs, :size).by(0)
      end
    end
  end

  describe 'POST #student_approve' do
    context 'Token is valid and student has been invited' do
      before(:each) do
        @student = FactoryBot.create :student
        Foundation.last.invites << @student
        jwt_token = @student.jwt_tokens.create!(token: SecureRandom.uuid)
        @JWT = JsonWebToken.encode({student_id: @student.id, foundation_id: @foundation.id, token: jwt_token.token})
      end
      it 'delete token and add student to foundation' do
        expect {
          get(:student_approve, params: { jwt: @JWT })
          expect(User.students.last.foundation).to eq(Foundation.last)
          expect(response).to redirect_to root_path
        }.to change(@foundation.students, :count).by(1)
      end
    end
  end
  describe 'POST #filter_invites' do
    before(:each) do
      @student1 = FactoryBot.create :student
      @student2 = FactoryBot.create :student
      @foundation.invites << @student1
      @foundation.invites << @student2
      @foundation.students << @student2
    end
    context 'when filter select all' do
      it 'render all invites' do
        post(:filter_invites, params: { foundation_id: @foundation.id, selectOnly: 'all' })
        expect(response.body).to eq(@foundation.invites.to_json(include: :profile))
      end
    end
    context 'when filter select only accepted' do
      it 'render only invites that were accepted' do
        post(:filter_invites, params: { foundation_id: @foundation.id, selectOnly: 'accepted' })
        expect(response.body).to eq([@student2].to_json(include: :profile))
      end
    end
    context 'when filter select only not accepted' do
      it "render only invites that hasn't been accepted yet" do
        post(:filter_invites, params: { foundation_id: @foundation.id, selectOnly: 'notaccepted' })
        expect(response.body).to eq([@student1].to_json(include: :profile))
      end
    end
  end
end
