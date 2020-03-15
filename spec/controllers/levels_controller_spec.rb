require 'rails_helper'

RSpec.describe LevelsController, type: :controller do
  before(:each) do
    @foundation = FactoryBot.create(:foundation)
  end
  describe 'POST #create' do
    context 'When params is valid' do
      it 'increase count of levels by 1 and render level like a json' do
        expect {
          post(:create, params: { foundation_id: @foundation.id, level: { name: 'Test' } })
          expect(JSON.parse(response.body)['name']).to eq('Test')
          expect(JSON.parse(response.body)['foundation_id']).to eq(@foundation.id)
          expect(JSON.parse(response.body)['groups']).to eq([])
        }.to change(Foundation.find(@foundation.id).levels, :count).by(1)
      end
    end
    context 'When params is invalid' do
      it 'increase count of levels by 0 and render nothing' do
        expect {
            post(:create, params: { foundation_id: @foundation.id, level: { name: '' } })
            expect(response).to have_http_status(204)
          }.to change(Foundation.find(@foundation.id).levels, :count).by(0)
      end
    end
  end
  describe 'PUT #update' do
    before(:each) do
      @level = @foundation.levels.create(name: 'Test')
    end
    context 'When params is valid' do
      it 'update level name and render level name like a json' do
        put(:update, params: { id: @level.id, level: { name: 'Test42' } })
        expect(response.body).to eq('Test42')
      end
    end
    context 'When params is invalid' do
      it 'render nothing' do
        put(:update, params: { id: @level.id, level: { name: '' } })
        expect(response).to have_http_status(204)
      end
    end
  end
  describe 'DELETE #destroy' do
    before(:each) do
      @level = @foundation.levels.create(name: 'Test')
      5.times do
        @foundation.students << FactoryBot.create(:student)
      end
      @foundation.students.last.update(group_id: 3)
      @foundation.save
    end
    it 'destroy level name and render students without groups' do
      expect {
        delete(:destroy, params: { id: @level.id })
        expect(response.body).to eq(@foundation.students.includes(:profile).where(group_id: nil).to_json(include: :profile))
      }.to change(Foundation.find(@foundation.id).levels, :count).by(-1)
    end
  end
  describe 'POST #generate_by_template' do
    context 'When need to generate 5 levels by 3 groups' do
      it 'generate 5 levels by 3 groups and render template levels/generate_by_template' do
        post(:generate_by_template, params: { foundation_id: @foundation.id,
                                              levels_number: 5,
                                              groups_number: 3,
                                              level_name: 'Level',
                                              group_name: 'Group' })
        expect(@foundation.levels.count).to eq(5)
        expect(@foundation.levels.first.groups.count).to eq(3)
        expect(@foundation.levels.last.name).to eq('Level 5')
        expect(@foundation.levels.first.groups.last.name).to eq('Group 3')
        expect(response).to render_template 'levels/generate_by_template.json'
      end
    end
    context 'When send number levels = 0' do
      it 'generate nothing and render template pages/manager_dashboard' do
        post(:generate_by_template, params: { foundation_id: @foundation.id,
                                              levels_number: 0,
                                              groups_number: 3,
                                              level_name: 'Level',
                                              group_name: 'Group' })
        expect(@foundation.levels.count).to eq(0)
        expect(@foundation.groups.count).to eq(0)
        expect(response).to render_template 'levels/generate_by_template.json'
      end
    end
    context 'When some levels names that need to generate already exist' do
      before(:each) do
        @foundation.levels.create(name: 'Level 1')
        @foundation.levels.first.groups.create(name: 'Group 1')
      end
      it 'generate those, that not exist' do
        expect {
          post(:generate_by_template, params: { foundation_id: @foundation.id,
                                                levels_number: 5,
                                                groups_number: 3,
                                                level_name: 'Level',
                                                group_name: 'Group' })
          expect(response).to render_template 'levels/generate_by_template.json'
        }.to change(Foundation.find(@foundation.id).levels, :count)
          .by(4)
          .and change(Foundation.find(@foundation.id).levels.first.groups, :count).by(0)
      end
    end
  end
end
