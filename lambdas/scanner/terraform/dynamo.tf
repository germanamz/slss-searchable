data "aws_dynamodb_table" "data-table" {
  name = var.dataTable
}

data "aws_dynamodb_table" "idx-table" {
  name = var.idxTable
}
