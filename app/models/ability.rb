class Ability
  include CanCan::Ability

  def initialize(user)
    can [:list_foundations], [Foundation]
    if user.nil?
      can :read, Foundation
      can :read, PagesController
      return
    end

    if user.nil?
      return 
    end 
    if user.present?
      can :manage, User, id: user.id
    end
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
    if user.parent? 
      return
    end
    if user.student?
      can :read, Certificate, profiles: { id: user.profile.id }
      return
    end
  end
end
