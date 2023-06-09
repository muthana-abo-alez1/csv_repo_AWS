import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Auth } from 'aws-amplify';
import { FileListComponent } from '../files-list/file-list.component';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Output() fileUploaded = new EventEmitter<File>();
  selectedFile!: File;

  constructor(private snackBar: MatSnackBar) {
  }
 
  permissions:string | undefined ;
  hasAddPermission: boolean = false;
  async checkpermissions(){
    const user = await Auth.currentAuthenticatedUser();
      this.permissions = user.signInUserSession.accessToken.payload['cognito:groups'];
    if(this.permissions=="FullPermissions" || this.permissions=="read&add")
    this.hasAddPermission = true;
  }
  ngOnInit() {
    this.checkpermissions();

  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit() {
  if (this.permissions == "reader") {
    console.log("You don't have permission!!");
    this.snackBar.open("You don't have permission!!", 'Close', { duration: 2000 });
    throw new Error("User does not have permission");
  }
    const fileReader = new FileReader();
    fileReader.readAsText(this.selectedFile, 'UTF-8');
    fileReader.onload = () => {
      const apiUrl = 'https://wughuqbplc.execute-api.eu-west-2.amazonaws.com/upload_file_csv_mu?key=' + this.selectedFile.name;
      fetch(apiUrl, {
        method: 'POST',
        body: fileReader.result
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          this.fileUploaded.emit(this.selectedFile)
          this.snackBar.open('File uploaded successfully', 'Close', {duration: 2000});
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
          this.snackBar.open('Error while uploading file', 'Close', {
            duration: 2000,
          });
        });
    };
    fileReader.onerror = (error) => {
      console.error('There was an error reading the file:', error);
      this.snackBar.open('Error while reading file', 'Close', {
        duration: 2000,
      });
    }

  }
  
  
  
  
}