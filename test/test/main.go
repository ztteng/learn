package main

import (
"fmt"
"learn/golang/errcode"
)

func testErr() error{
	return 	errcode.ErrReleased
}
func main() {
	a := 10
	b := 20

	if a < b {
		fmt.Println(testErr())
	}
}
