import { Component, TemplateRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {HttpClient} from "@angular/common/http";
import { FormControl, FormGroup } from '@angular/forms'
import Swal from 'sweetalert2';
 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular_API_CRUD';
  menuList:any=[];
  selectedIndex='';
  selectedID='';
  menuForm:FormGroup;

  modalRef?: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private formBuider: FormBuilder,
    private http:HttpClient
    ) {
      this.menuForm = this.formBuider.group({
        menuName:[''],
        menuPrice:[''],
        //menuQuantity:[''],
        menuType:[''],
        menuCategory:[''],
      });
    }

  ngOnInit(): void{
   this.getAllMenu();
  }

  getAllMenu(){
    this.http.get('https://api-server-y9bh.onrender.com/api/menu/getAllMenus').subscribe(
      (response:any)=>{
        console.log('response',response.data);
        this.menuList = response.data;
      },
      (error)=>{
       console.log('error',error);
      }
    )
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  openEditModal(template: TemplateRef<any>,editData:any,i:any,_id:any) {
    this.selectedIndex=i;
    this.selectedID=_id;
    this.modalRef = this.modalService.show(template);
     this.menuForm.patchValue({
      menuName:editData.menuName,
      menuPrice:editData.menuPrice,
      //menuQuantity:editData.menuQuantity,
      menuType:editData.menuType,
      menuCategory:editData.menuCategory
     });
  }
   
  submit(){
    // this.menuList.push(this.menuForm.value)
    // POST

    this.http.post('https://api-server-y9bh.onrender.com/api/menu/createMenu',this.menuForm.value).subscribe(
      (response)=>{
        console.log('response',response);
        this.getAllMenu();
      },
      (error)=>{
       console.log('error',error);
      }
    )

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500
    })

    this.modalRef?.hide()
  }
  
  update(){
    // this.menuList[this.selectedIndex]=this.menuForm.value;
    this.http.put('https://api-server-y9bh.onrender.com/api/menu/updateMenu/'+ this.selectedID,this.menuForm.value).subscribe(
      (response:any)=>{
        console.log('response',response);
        this.getAllMenu();
      },
      (error)=>{
       console.log('error',error);
      }
    )
     this.modalRef?.hide()
  }

  delete(i:any,_id:any){
     console.log('_id', _id)
     //this.menuList.splice(i,1);
     //DELETE

     Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )

        this.http.delete('https://api-server-y9bh.onrender.com/api/menu/deleteMenu/'+ _id).subscribe(
          (response:any)=>{
            console.log('response',response);
            this.getAllMenu();
          },
          (error)=>{
           console.log('error',error);
          }
        )
      }
    })

    
  }

}
