data "aws_s3_bucket" "bucket" {
  bucket = var.artifactsBucket
}

data "aws_s3_bucket_object" "artifact" {
  bucket = data.aws_s3_bucket.bucket.id
  key = var.artifactKey
}

data "aws_s3_bucket_object" "checksum" {
  bucket = data.aws_s3_bucket.bucket.id
  key = "${data.aws_s3_bucket_object.artifact.key}.checksum"
}
