resource "aws_dynamodb_table" "idx-table" {
  name = "${var.prefix}-idx-${var.dataTable}"
  hash_key = local.tokenIdKey
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = local.tokenIdKey
    type = "S"
  }

  attribute {
    name = local.tokenIndexKey
    type = "S"
  }

  attribute {
    name = local.instanceIndexKey
    type = "S"
  }

  global_secondary_index {
    name = local.tokenIndex
    hash_key = local.tokenIndexKey
    projection_type = "ALL"
  }

  global_secondary_index {
    name = local.instanceIndex
    hash_key = local.instanceIndexKey
    projection_type = "ALL"
  }
}
