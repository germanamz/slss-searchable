locals {
  lambdaName = "back-filler"
  lambdaMemory = 1024
}

variable "dataTable" {
  type = string
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

variable "indexrArn" {
  type = string
}

variable "backFillQueueUrl" {
  type = string
}

variable "backFillQueueArn" {
  type = string
}

variable "dataKeyId" {
  type = string
}

variable "dataBucket" {
  type = string
}

variable "dataBucketArn" {
  type = string
}

output "backFillerArn" {
  value = aws_lambda_function.lambda.arn
}

output "backFillerRoleArn" {
  value = aws_iam_role.lambda.arn
}
