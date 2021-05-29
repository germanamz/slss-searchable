resource "aws_s3_bucket" "data" {
  bucket = "${var.prefix}${var.dataBucket}"
}

resource "aws_s3_bucket_policy" "data" {
  bucket = aws_s3_bucket.data.id
  policy = <<-EOF
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": [
            "s3:GetObject",
            "s3:ListBucket"
          ],
          "Effect": "Allow",
          "Resource": [
            "${aws_s3_bucket.data.arn}/*",
            "${aws_s3_bucket.data.arn}"
          ],
          "Principal": {
            "AWS": [
              "${module.backFiller.backFillerRoleArn}"
            ]
          }
        },
        {
          "Action": [
            "s3:GetObject",
            "s3:ListBucket"
          ],
          "Effect": "Allow",
          "Resource": [
            "${aws_s3_bucket.data.arn}/*",
            "${aws_s3_bucket.data.arn}"
          ],
          "Principal": {
            "AWS": [
              "${module.searcher.searcherRoleArn}"
            ]
          }
        }
      ]
    }
  EOF

  depends_on = [
    module.searcher.searcherRoleArn,
    module.backFiller.backFillerRoleArn,
  ]
}
