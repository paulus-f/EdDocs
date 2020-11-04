class JsonWebToken
  def self.encode(payload)
    JWT.encode(payload, ENV['SECRET_KEY_BASE'])
  end

  def self.decode(token)
    HashWithIndifferentAccess.new(JWT.decode(token, ENV['SECRET_KEY_BASE'])[0])
  rescue e
    nil
  end
end
