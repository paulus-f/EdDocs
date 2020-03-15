class User < ApplicationRecord
  after_create :create_profile

  scope :children, -> { where(role: 'student') }
  scope :students, -> { where(role: 'student') }
  scope :students_without_group, -> {where(role: 'student', group_id: nil)}
  extend Enumerize
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :confirmable
  enumerize :role, in: %i[admin manager student parent]
  has_one :profile, dependent: :destroy
  belongs_to :foundation, optional: true
  belongs_to :group, optional: true
  has_and_belongs_to_many :foundations
  has_many :jwt_tokens, dependent: :destroy
  belongs_to :parent, polymorphic: true, optional: true
  has_many :children, class_name: 'User', as: :parent, dependent: :nullify
  def manager?
    role == 'manager'
  end

  def student?
    role == 'student'
  end

  def parent?
    role == 'parent'
  end

  def admin?
    role == 'admin'
  end

  def create_profile
    create_profile!
  end

  has_many :messages
  has_many :conversations, foreign_key: :sender_id
end
