locals {
  lambdaName = "searcher"
  lambdaMemory = 1024
}

variable "dataTable" {
  type = string
}

variable "idxTable" {
  type = string
}

variable "idxTableArn" {
  type = string
}

variable "totalSegments" {
  type = number
  default = 5
}

variable "prefix" {
  type = string
  default = "slsss"
}

variable "artifactsBucket" {
  type = string
}

variable "artifactKey" {
  type = string
}

variable "suffix" {
  type = string
}

variable "dataBucket" {
  type = string
}

variable "dataBucketArn" {
  type = string
}

output "searcherArn" {
  value = aws_lambda_function.lambda.arn
}
output "searcherRoleArn" {
  value = aws_iam_role.lambda.arn
}
