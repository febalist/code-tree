<?php

namespace App;

interface Drawable {
    public function draw();
}

trait Logger {
    public function log($message) {
        echo $message;
    }
}

class Shape implements Drawable {
    use Logger;

    private $name;

    public function __construct($name) {
        $this->name = $name;
    }

    public function draw() {
        $this->log("Drawing " . $this->name);
    }
}

function add($a, $b) {
    return $a + $b;
}
