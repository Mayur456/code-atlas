pub struct Price { pub cents: u64 }

impl Price {
    pub fn new(cents: u64) -> Self { Price { cents } }

    pub fn discounted(&self, pct: u64) -> Price {
        Price::new(apply(self.cents, pct))
    }
}

fn apply(cents: u64, pct: u64) -> u64 {
    cents - cents * pct / 100
}
