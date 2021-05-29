resource "aws_sqs_queue" "back-fill" {
  name = "${var.prefix}-back-fill-${var.dataTable}.fifo"
  fifo_queue = true
  content_based_deduplication = true
  visibility_timeout_seconds = 900
}
