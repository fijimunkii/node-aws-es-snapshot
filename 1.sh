ACCOUNT_ID=123456789
MANUAL_SNAPSHOT_ROLENAME=Manual_Snapshot_Role
MANUAL_SNAPSHOT_IAM_POLICY_NAME=Manual_Snapshot_IAM_Policy
MANUAL_SNAPSHOT_S3_BUCKET=logs-snapshots
IAM_MANUAL_SNAPSHOT_ROLE_ARN=arn:aws:iam::$ACCOUNT_ID:role/$MANUAL_SNAPSHOT_ROLENAME    
aws iam create-role \
  --role-name "$MANUAL_SNAPSHOT_ROLENAME" \
  --output text \
  --query 'Role.Arn' \
  --assume-role-policy-document '{
        "Version": "2012-10-17",
        "Statement": [{
            "Effect": "Allow",
            "Principal": { "Service": "es.amazonaws.com"},
            "Action": "sts:AssumeRole"
          }
        ]
      }'

cat << EOF > /tmp/iam-policy_for_es_snapshot_to_s3.json
{
  "Version":"2012-10-17",
  "Statement":[{
      "Action":["s3:ListBucket"],
      "Effect":"Allow",
      "Resource":["arn:aws:s3:::$MANUAL_SNAPSHOT_S3_BUCKET"]
    },{
      "Action":[
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "iam:PassRole"
      ],
      "Effect":"Allow",
      "Resource":["arn:aws:s3:::$MANUAL_SNAPSHOT_S3_BUCKET/*"]
    }
  ]
}
EOF

aws iam put-role-policy \
        --role-name   "$MANUAL_SNAPSHOT_ROLENAME"   \
        --policy-name "$MANUAL_SNAPSHOT_IAM_POLICY_NAME" \
        --policy-document file:///tmp/iam-policy_for_es_snapshot_to_s3.json
