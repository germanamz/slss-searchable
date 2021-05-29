locals {
  lambdaName = "scanner"
  lambdaMemory = 1024
}

variable "dataTable" {
  type = string
}

variable "batchSize" {
  type = number
  default = 10
}

variable "idxTable" {
  type = string
}

variable "totalSegments" {
  type = number
  default = 5
}

variable "prefix" {
  type = string
  default = "slss-s"
}

variable "artifactsBucket" {
  type = string
}

variable "artifactKey" {
  type = string
}

output "scannerArn" {
  value = aws_lambda_function.lambda.arn
}
