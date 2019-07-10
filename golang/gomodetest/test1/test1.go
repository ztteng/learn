package test1

import "github.com/shopspring/decimal"

func Test1GoMod1() *decimal.Decimal {
	price, err := decimal.NewFromString("136.02")
	if err != nil {
		return nil
	}
	return &price
}
