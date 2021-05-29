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
          "dynamodb:BatchGetItem"
        ],
        "Resource": [
          "${data.aws_dynamodb_table.data-table.arn}",
          "${data.aws_dynamodb_table.idx-table.arn}"
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

  environment {
    variables = {
      IDX_TABLE = data.aws_dynamodb_table.idx-table.id
      DATA_TABLE = data.aws_dynamodb_table.data-table.id
      TOTAL_SEGMENTS = var.totalSegments
    }
  }
}
