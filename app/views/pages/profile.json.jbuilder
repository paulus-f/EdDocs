if @user.role == 'student'
  unless @foundation.nil?
    json.foundation @foundation
  end
  unless @user.parent.nil?
    json.parent do
      json.email @user.parent.email
    end
  end
end
json.user do
  json.name @user.email
end

json.current_user current_user