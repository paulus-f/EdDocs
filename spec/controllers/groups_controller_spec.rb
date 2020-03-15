require 'rails_helper'

RSpec.describe GroupsController, type: :controller do
  before(:each) do
    @foundation = FactoryBot.create(:foundation)
    @level = @foundation.levels.create(name: 'Test')
  end
  
  describe 'POST #create' do
    context 'When params is valid' do
      it 'increase count of groups by 1 and render group like a json' do
        expect {
          post(:create, params: { level_id: @level.id, group: { name: 'Test' } })
          expect(JSON.parse(response.body)['name']).to eq('Test')
          expect(JSON.parse(response.body)['level_id']).to eq(@level.id)
          expect(JSON.parse(response.body)['students']).to eq([])
        }.to change(Level.find(@level.id).groups, :count).by(1)
      end
    end
    context 'When params is invalid' do
      it 'increase count of groups by 0 and render nothing' do
        expect {
            post(:create, params: { level_id: @level.id, group: { name: '' } })
            expect(response).to have_http_status(204)
          }.to change(Level.find(@level.id).groups, :count).by(0)
      end
    end
  end

  describe 'PUT #update' do
    before(:each) do
      @group = @level.groups.create(name: 'Test')
    end
    context 'When params is valid' do
      it 'update level name and render level name like a json' do
        put(:update, params: { id: @group.id, level_id: @level.id, group: { name: 'Test42' } })
        expect(response.body).to eq('Test42')
      end
    end
    context 'When params is invalid' do
      it 'render nothing' do
        put(:update, params: { id: @group.id, level_id: @level.id, group: { name: '' } })
        expect(response).to have_http_status(204)
      end
    end
  end
  describe 'DELETE #destroy' do
    before(:each) do
      @group = @level.groups.create(name: 'Test')
      5.times do
        @group.students << FactoryBot.create(:student)
      end
      @group.save
    end
    it 'destroy group name and render students without groups' do
      expect {
        delete(:destroy, params: { level_id: @level.id, id: @group.id })
        expect(response.body).to eq(@foundation.students.includes(:profile).where(group_id: nil).to_json(include: :profile))
      }.to change(@group.students, :count).by(-5)
    end
  end

  describe 'POST #enroll' do
    before(:each) do
      @group = @level.groups.create(name: 'Test')
      @student = FactoryBot.create(:student)
    end
    context 'When enroll one student' do
      it 'increase count of group students by 1 and render template enroll.json' do
        expect {
          post(:enroll, params: { group_id: @group.id, level_id: @level.id, students: [@student.id] })
          expect(response).to render_template 'groups/enroll.json'
        }.to change(@group.students, :count).by(1)
      end
    end
    context 'When enroll 5 students' do
      before(:each) do
        @students = []
        5.times do 
          @students << FactoryBot.create(:student).id
        end
      end
      it 'increase count of group students by 5 and render template enroll.json' do
        expect {
          post(:enroll, params: { group_id: @group.id, level_id: @level.id, students: @students })
          expect(response).to render_template 'groups/enroll.json'
        }.to change(@group.students, :count).by(5)
      end
    end
  end

  describe 'POST #kick_from_group' do
    before(:each) do
      @group = @level.groups.create(name: 'Test')
      @student = FactoryBot.create(:student)
      @group.students << @student
    end
    it 'kick student from group and render nothing' do
      expect {
        post(:kick_from_group, params: { student_id: @student.id })
        expect(response).to have_http_status(204)
      }.to change(@group.students, :count).by(-1)
    end
  end
end
