package main

type User struct {
	Name string
	Age  int
}

type Stringer interface {
	String() string
}

func (u *User) String() string {
	return u.Name
}

func Add(a, b int) int {
	return a + b
}
