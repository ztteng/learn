

package errcode

import (
	"errors"
)

// Common errors.
var (
	ErrReleased    = errors.New("leveldb: resource already relesed")
	ErrHasReleaser = errors.New("leveldb: releaser already defined")
)

