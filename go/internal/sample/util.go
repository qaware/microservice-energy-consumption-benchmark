package sample

func min(x int, y int) int {
	if x > y {
		return y
	}
	return x
}

func mapSlice[T any, U any](ts []T, f func(T) U) (result []U) {
	result = make([]U, 0)

	for _, t := range ts {
		result = append(result, f(t))
	}
	return
}
