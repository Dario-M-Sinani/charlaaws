variable "aws_region" {
  type        = string
  description = "AWS region to deploy resources"
  default     = "us-east-1"
}

variable "bucket_name" {
  type        = string
  description = "Unique name for the S3 bucket hosting the portfolio website"
  default     = "dario-portfolio-feedback-charla-aws"
}
