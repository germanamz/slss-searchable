locals {
  lambdaName = "indexr"
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

variable "prefix" {
  type = string
  default = "slss-s"
}

variable "fields" {
  type = string
  description = "The fields to index separated by comma"
}

variable "keywordFields" {
  type = string
  description = "The keywords fields (dont need the stemmer to run) separated by comma"
}

variable "artifactsBucket" {
  type = string
}

variable "artifactKey" {
  type = string
}

variable "backFillQueueArn" {
  type = string
}

variable "dataBucket" {
  type = string
}

variable "dataBucketArn" {
  type = string
}

variable "dataIdKey" {
  type = string
}

output "indexrArn" {
  value = aws_lambda_function.lambda.arn
}
