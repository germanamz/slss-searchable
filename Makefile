TF := docker run\
	-v `pwd`/terraform:/app\
	-v `pwd`/lambdas:/lambdas\
	-v ~/.aws:/root/.aws\
	-e AWS_PROFILE=feprisa\
	-e AWS_DEFAULT_REGION=us-east-1\
	-w /app\
	--rm\
	-it\
	hashicorp/terraform:0.14.7

.PHONY: init
init:
	${TF} init
