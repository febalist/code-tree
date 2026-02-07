pub struct Point {
    x: i32,
    y: i32,
}

pub enum Color {
    Red,
    Green,
    Blue,
}

pub trait Drawable {
    fn draw(&self);
}

impl Drawable for Point {
    fn draw(&self) {
        println!("Point at ({}, {})", self.x, self.y);
    }
}

pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
