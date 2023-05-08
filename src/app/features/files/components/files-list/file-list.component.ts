import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FilesService, MyFile} from "../../files.service";
import { Auth } from 'aws-amplify';


@Component({
  selector: 'app-files-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  files: MyFile[] = [];
  @Output() uploadedFiles = new EventEmitter<MyFile[]>();
  displayedColumns: string[] = ['name', 'size', 'actions'];
  isLoading:boolean = false;

  constructor(private fileService: FilesService) {
    
  }
  
  hasDeletePermission: boolean = false;
  permissions:string | undefined ;
  async chickpermissions(){
    const user = await Auth.currentAuthenticatedUser();
      this.permissions = user.signInUserSession.accessToken.payload['cognito:groups'];
    if(this.permissions=="FullPermissions")
    this.hasDeletePermission = true;
  }
  ngOnInit(): void {
    this.getFiles();
    this.chickpermissions();
  }
   getFiles(): void {
    this.isLoading = true;
    this.fileService.getFiles().subscribe({
      next: (files: any[]) => {
        if (files && files.length > 0) {
          this.files = files.map(file => ({
            id: file.id,
            name: file.name,
            size: file.size,
            content:file.body
          }));
        }
        this.uploadedFiles.emit(this.files);
      },
      error: error => console.error(error),
      complete: () => this.isLoading = false
    });
  }
  

  downloadFile(file: MyFile): void {
    this.isLoading = true;
    this.fileService.downloadFile(file).subscribe({
        next: data => {
          const link = document.createElement('a');
          link.href = data.downloadUrl;
          link.download = file.name;
          link.click();
        },
        error: error => console.error(error),
        complete: () => this.isLoading = false
      });
  }

  deleteFile(file: MyFile): void {
    if(this.permissions!="FullPermissions"){
      console.log("You don't have a perimation!!");
      return;
    }
    this.isLoading = true;
    console.log(file.name);
    this.fileService.deleteFile(file.name).subscribe(
      {
        next: () => this.getFiles(),
        error: error => console.error(error),
        complete: () => this.isLoading = false
      }
    );
  }
  convertToJson(file: MyFile): void {
    this.isLoading = true;
    this.fileService.convertToJson(file).subscribe({
      next: (jsonData: any[]) => {
        const jsonStr = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name.split('.')[0] + '.txt';
  
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      },
      error: error => console.error(error),
      complete: () => this.isLoading = false
    });
  }
  
  
  
  

}
