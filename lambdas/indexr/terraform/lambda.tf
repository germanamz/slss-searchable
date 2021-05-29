resource "aws_iam_role" "lambda" {
  name = "${var.prefix}-${local.lambdaName}-lambda-${var.dataTable}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda-role-policy" {
  name = "${var.prefix}-${local.lambdaName}-lambda-${var.dataTable}"
  role = aws_iam_role.lambda.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:Scan",
          "dynamodb:PutItem",
          "dynamodb:DeleteItem"
        ],
        "Resource": [
          "${data.aws_dynamodb_table.idx-table.arn}"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "sqs:ReceiveMessage",
          "sqs:DeleteMessage",
          "sqs:GetQueueAttributes"
        ],
        "Resource": [
          "${var.backFillQueueArn}"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:GetRecords",
          "dynamodb:GetShardIterator",
          "dynamodb:DescribeStream",
          "dynamodb:ListStreams"
        ],
        "Resource": [
          "${data.aws_dynamodb_table.data-table.stream_arn}"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:BatchWriteItem"
        ],
        "Resource": [
          "${data.aws_dynamodb_table.idx-table.arn}"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "s3:PutObject"
        ],
        "Resource": [
          "${var.dataBucketArn}/*"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "logs:*"
        ],
        "Resource": [
          "${aws_cloudwatch_log_group.lambda.arn}:*"
        ]
      }
    ]
  }
  EOF
}

resource "aws_cloudwatch_log_group" "lambda" {
  name = "/aws/lambda/${aws_lambda_function.lambda.function_name}"
  retention_in_days = 14
}

resource "aws_lambda_function" "lambda" {
  s3_bucket = data.aws_s3_bucket.bucket.id
  s3_key = data.aws_s3_bucket_object.artifact.key
  source_code_hash = data.aws_s3_bucket_object.checksum.body
  function_name = "${var.prefix}-${local.lambdaName}-lambda-${var.dataTable}"
  handler = "index.handler"
  role = aws_iam_role.lambda.arn
  runtime = "nodejs14.x"
  memory_size = local.lambdaMemory
  publish = true
  timeout = 900

  environment {
    variables = {
      IDX_TABLE = var.idxTable
      DATA_TABLE = var.dataTable
      FIELDS = var.fields
      KEYWORD_FIELDS = var.keywordFields
      DATA_BUCKET = var.dataBucket
      DATA_ID_KEY = var.dataIdKey
    }
  }
}

resource "aws_lambda_event_source_mapping" "lambda-even-source" {
  event_source_arn = data.aws_dynamodb_table.data-table.stream_arn
  function_name = aws_lambda_function.lambda.arn
  batch_size = var.batchSize
  starting_position = "LATEST"
}

resource "aws_lambda_event_source_mapping" "back-fill" {
  event_source_arn = var.backFillQueueArn
  function_name = aws_lambda_function.lambda.arn
}
