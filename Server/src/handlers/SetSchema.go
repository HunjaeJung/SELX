package handlers

import (
	"../../src"
	"fmt"
)

func HttpErr(code int, err string) (int, map[string]interface{}) {

	return code, map[string]interface{}{"code": code, "err": err}

}
