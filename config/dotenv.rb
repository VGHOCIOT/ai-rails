require 'dotenv/load'

if Rails.env.development?
  Dotenv.load(".env", ".env.#{Rails.env}", "env.dev")
end