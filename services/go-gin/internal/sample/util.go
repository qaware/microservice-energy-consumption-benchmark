package sample

import (
	"sort"
	"strings"
)

func defaultInt(v *int) int {
	if v == nil {
		return 0
	}
	return *v
}

func defaultString(v *string) string {
	if v == nil {
		return ""
	}
	return *v
}

func min(x int, y int) int {
	if x > y {
		return y
	}
	return x
}

func lt(a, b string) bool {
	return strings.Compare(a, b) < 0
}

func sortSlice[T any, U any](slice []T, s func(T) U, lt func(a, b U) bool) {
	sort.Slice(slice, func(i, j int) bool { return lt(s(slice[i]), s(slice[j])) })
}

func copySlice[T any](ts []T) (result []T) {
	result = make([]T, len(ts))
	copy(result, ts)
	return result
}

func mapSlice[T any, U any](ts []T, f func(T) U) (result []U) {
	result = make([]U, 0)

	for _, t := range ts {
		result = append(result, f(t))
	}
	return
}
