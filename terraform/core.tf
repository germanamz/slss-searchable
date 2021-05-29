terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "3.41.0"
    }
  }
}

provider "aws" {
}

locals {
  instanceIndex = "instance"
  instanceIndexKey = "instanceId"
  tokenIndex = "token"
  tokenIndexKey = "token"
  tokenIdKey = "id"
}

variable "tag" {
  type = string
}

variable "prefix" {
  type = string
  default = "slss-s"
}

variable "dataTable" {
  type = string
}

variable "batchSize" {
  type = number
  default = 5
}

variable "fields" {
  type = string
}

variable "keywordFields" {
  type = string
}

variable "artifactsBucket" {
  type = string
}

variable "totalSegments" {
  type = number
  default = 5
}

variable "dataIdKey" {
  type = string
  default = "id"
}

variable "dataBucket" {
  type = string
  default = "-data"
}

module "indexr" {
  source = "../lambdas/indexr/terraform"

  dataTable = var.dataTable
  idxTable = aws_dynamodb_table.idx-table.id
  batchSize = var.batchSize
  artifactsBucket = var.artifactsBucket
  artifactKey = "${var.prefix}/indexr-${var.tag}.zip"
  fields = var.fields
  keywordFields = var.keywordFields
  prefix = var.prefix
  backFillQueueArn = aws_sqs_queue.back-fill.arn
  dataIdKey = var.dataIdKey
  dataBucket = aws_s3_bucket.data.id
  dataBucketArn = aws_s3_bucket.data.arn

  depends_on = [
    aws_sqs_queue.back-fill,
    aws_s3_bucket.data
  ]
}

module "backFiller" {
  source = "../lambdas/back-filler/terraform"

  dataTable = var.dataTable
  artifactsBucket = var.artifactsBucket
  artifactKey = "${var.prefix}/back-filler-${var.tag}.zip"
  prefix = var.prefix
  indexrArn = module.indexr.indexrArn
  backFillQueueArn = aws_sqs_queue.back-fill.arn
  backFillQueueUrl = aws_sqs_queue.back-fill.id
  dataKeyId = var.dataIdKey
  dataBucket = aws_s3_bucket.data.id
  dataBucketArn = aws_s3_bucket.data.arn

  depends_on = [
    module.indexr,
    aws_s3_bucket.data,
    aws_sqs_queue.back-fill
  ]
}

module "scanner" {
  source = "../lambdas/scanner/terraform"

  dataTable = var.dataTable
  idxTable = aws_dynamodb_table.idx-table.id
  artifactsBucket = var.artifactsBucket
  artifactKey = "${var.prefix}/scanner-${var.tag}.zip"
  totalSegments = var.totalSegments
  prefix = var.prefix
}

module "searcher" {
  source = "../lambdas/searcher/terraform"

  dataTable = var.dataTable
  artifactsBucket = var.artifactsBucket
  artifactKey = "${var.prefix}/searcher-${var.tag}.zip"
  totalSegments = var.totalSegments
  scannerArn = module.scanner.scannerArn
  prefix = var.prefix
  dataBucket = aws_s3_bucket.data.id
  dataBucketArn = aws_s3_bucket.data.arn
  idxTable = aws_dynamodb_table.idx-table.id
  idxTableArn = aws_dynamodb_table.idx-table.arn

  depends_on = [
    module.scanner,
    aws_s3_bucket.data
  ]
}
