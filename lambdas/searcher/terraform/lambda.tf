resource "aws_iam_role" "lambda" {
  name = "${var.prefix}${local.lambdaName}-l-${var.suffix}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "lambda-role-policy" {
  name = "${var.prefix}${local.lambdaName}-l-${var.suffix}"
  role = aws_iam_role.lambda.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:Query"
        ],
        "Resource": [
          "${var.idxTableArn}/*"
        ]
      },
      {
        "Effect": "Allow",
        "Action": [
          "s3:GetObject",
          "s3:ListBucket"
        ],
        "Resource": [
          "${var.dataBucketArn}/*",
          "${var.dataBucketArn}"
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
  function_name = "${var.prefix}${local.lambdaName}-l-${var.suffix}"
  handler = "index.handler"
  role = aws_iam_role.lambda.arn
  runtime = "nodejs14.x"
  memory_size = local.lambdaMemory
  publish = true
  timeout = 900

  environment {
    variables = {
//      SCANNER_ARN = var.scannerArn
      TOTAL_SEGMENTS = var.totalSegments
      DATA_BUCKET = var.dataBucket
      DATA_TABLE = var.dataTable
      IDX_TABLE = var.idxTable
    }
  }
}
