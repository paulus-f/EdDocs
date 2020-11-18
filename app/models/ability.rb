class Ability
  include CanCan::Ability

  def initialize(user)
    can [:list_foundations], [Foundation]

    if user.nil?
      can :read, Foundation
      can :read, PagesController
      return
    end

    can :manage, User, id: user.id if user.present?

    if user.admin?
      can :manage, :all
      return
    end

    if user.manager?
      can :read, Certificate, level: { foundation: {managers: { id: user.id }} }
      can :manage, Certificate, foundation: { managers: { id: user.id } }
      can :manage, Foundation, managers: { id: user.id }
      return
    end

    can :read, Certificate, profiles: { id: user.profile.id } if user.student?
  end
end
