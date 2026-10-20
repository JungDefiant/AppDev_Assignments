# Registers the Discourse → notifier webhook inside a running Discourse container.
# Run as: docker exec app su discourse -c \
#   "cd /var/www/discourse && RAILS_ENV=production bin/rails runner /shared/setup_notifier_webhook.rb"
#
# Notes:
# - The notifier runs on the Docker HOST (systemd service), so the payload URL
#   must use the docker bridge gateway (172.17.0.1), NOT 127.0.0.1.
# - allowed_internal_hosts bypasses Discourse's SSRF guard for that target.
# - Event types must be full event names ("post_created"), and the association
#   must be attached before save! (see validations on WebHook).

SiteSetting.allowed_internal_hosts = "172.17.0.1"

url = "http://172.17.0.1:3000/webhooks/discourse"
secret = "AD371-local-test-secret"
post_event = WebHookEventType.find_by!(name: "post_created")

hook = WebHook.where(payload_url: url).first
if hook
  hook.secret = secret
  hook.active = true
  hook.content_type = 1
  hook.web_hook_event_types << post_event unless hook.web_hook_event_types.include?(post_event)
  hook.save!
else
  hook = WebHook.new(payload_url: url, secret: secret, active: true, content_type: 1)
  hook.web_hook_event_types = [post_event]
  hook.save!
end

admin = User.find_by_email("admin@example.com")
key = ApiKey.where(user: admin, description: "notifier-test").first || ApiKey.create!(user: admin, description: "notifier-test")

puts "WEBHOOK_ID=#{hook.id}"
puts "EVENTS=#{hook.web_hook_event_types.map(&:name).to_a.inspect}"
puts "API_KEY=#{key.key}"
