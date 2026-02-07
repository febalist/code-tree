module Geometry
  class Point
    def initialize(x, y)
      @x = x
      @y = y
    end

    def distance
      Math.sqrt(@x**2 + @y**2)
    end

    def self.origin
      Point.new(0, 0)
    end
  end
end

def greet(name)
  "Hello, #{name}"
end
