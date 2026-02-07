package com.example;

interface Drawable {
    void draw();
}

enum Status {
    ACTIVE,
    INACTIVE
}

public class Shape implements Drawable {
    private String name;

    public Shape(String name) {
        this.name = name;
    }

    @Override
    public void draw() {
        System.out.println("Drawing " + name);
    }
}
