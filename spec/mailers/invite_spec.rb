require 'rails_helper'

RSpec.describe InviteMailer, type: :mailer do
  before(:each) do
    @foundation = FactoryBot.build(:foundation)
    @student = FactoryBot.create(:student)
    @foundation.managers <<  FactoryBot.create(:manager)
    @foundation.managers.first.profile.update(first_name: 'Foo', last_name: 'Bar')
    @foundation.save
    @password = Devise.friendly_token
  end
  describe 'Invite mail when user exist and password is not in params' do
    let(:mail) { InviteMailer.invite(@student, @foundation) }
  
    it 'renders the headers' do
      expect(mail.to).to eq([@student.email])
      expect(mail.from).to eq(['deamteamrubylab@gmail.com'])
    end
  
    it 'renders the body' do
      expect(mail.body.encoded).to match('Follow the link for join us!')
      expect(mail.body.encoded).to have_link('Join us')
    end
  end
  describe 'Invite mail when user is new and password is in params' do
    let(:mail) { InviteMailer.invite(@student, @foundation, @password) }
  
    it 'renders the body' do
      expect(mail.body.encoded).to match(@password)
      expect(mail.body.encoded).to have_link('Join us')
    end
  end
end
