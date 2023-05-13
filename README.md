# csv repo aws

## upload file : 
In the beginning, I created a function that sends a message to SNS containing the name of the file and the file, then SNS sends this message to two of the first function that uploads the file to s3 and the second function that uploads the file to DB  then I created an API and linked it with the function that  sending a message to SNS and does not forget also to add permissions for each function in the first function and also for encryption I used KMS to encrypt the data that is uploaded to s3 and the KMS decrypts by itself when doing any operation on s3 only we add the permissions to the function to decrypt the file

By the way, to create kms and sns, I created sns and made the first function to upload the file to s3 and the second to upload the file to DB. I made them subscribe IN  SNS to receive a message containing the file and the file name. As for KMS, I created it and linked it with S3 and created a ROLE, and linked it with any function. communicates with S3

## Delete file : 
The same idea of uploading the file

At first, I created a function that sends a message to SNS containing the file name and then SNS sends this message to two functions the first function deletes the file from s3 and the second function deletes the file from the database after making sure they exist after I and the API have linked it to the function which sends a message to SNS and also adds permissions to each function such as access to s3 and db and the ability to delete from them

## convert to JSON : 

I created an API that communicates with the lambda function, this function communicates with s3 and fetches the required file, then converts it to JSON and returns it to the API

## download file : 

I created an API that communicates with a lambda function, this function communicates with s3 and fetches the required file, and returns it to the API

## Cognito : 
 
 I created Cognito with 3 users including admin, reader and read&add
And I put all these users in the group of the first group that contains the admin who can do everything, add, delete, and read
As for the second group that contains the reader, it has validity only in reading, and the last group that contains the user read&add can add a file and read, and I used the names of the groups in the back end so that it checks each user according to the name of the group. What are the features that he can do


## AWS Amplify : 

I created my own application and linked it with GitHub. I also added some libraries to my application so that it works on Amplify.
such as :
npm install aws-amplify @aws-amplify/ui-angular 


## IAM : 

I created many ROLEs and connected them with functions such as writing to S3, deleting from it, KMS, and dealing with SNS



