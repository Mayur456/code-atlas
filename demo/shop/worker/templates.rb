module Templates
  def self.receipt(order)
    "Thanks for order #{order[:id]}"
  end
end
