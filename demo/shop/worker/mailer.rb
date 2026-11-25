require_relative 'templates'

class Mailer
  def initialize(to)
    @to = to
  end

  def send_receipt(order)
    body = Templates.receipt(order)
    deliver(body)
  end

  private

  def deliver(body)
    puts "to #{@to}: #{body}"
  end
end

Mailer.new('a@b.c').send_receipt({ id: 1 })
