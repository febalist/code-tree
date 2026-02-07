package com.example

interface Drawable {
    fun draw()
}

enum class Status {
    ACTIVE,
    INACTIVE
}

class Shape(private val name: String) : Drawable {
    override fun draw() {
        println("Drawing $name")
    }
}

object Utils {
    fun add(a: Int, b: Int): Int = a + b
}

fun greet(name: String): String = "Hello, $name"
