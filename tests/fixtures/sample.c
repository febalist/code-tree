typedef struct {
    int x;
    int y;
} Point;

enum Status {
    ACTIVE,
    INACTIVE
};

Point create_point(int x, int y) {
    Point p = {x, y};
    return p;
}

int add(int a, int b) {
    return a + b;
}
