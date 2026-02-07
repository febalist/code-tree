protocol Drawable {
    func draw()
}

enum Status {
    case active
    case inactive
}

struct Point {
    let x: Int
    let y: Int
}

class Shape: Drawable {
    private let name: String

    init(name: String) {
        self.name = name
    }

    func draw() {
        print("Drawing \(name)")
    }
}

func add(a: Int, b: Int) -> Int {
    return a + b
}
