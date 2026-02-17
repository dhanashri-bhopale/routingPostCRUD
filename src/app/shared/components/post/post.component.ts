import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Ipost } from '../../models/post';
import { PostService } from '../../services/post.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GetConfirmComponent } from '../get-confirm/get-confirm.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postId !: string
  postObj !: Ipost

  constructor(
    private _routes : ActivatedRoute,
    private _postService : PostService,
    private _matDialog : MatDialog,
    private _router : Router,
    private _snackBar : SnackbarService
  ) { }

  ngOnInit(): void {
    // console.log(this._routes.snapshot.params['postId']);
    this.getSinglePost()
    
  }

  getSinglePost(){
    this.postId = this._routes.snapshot.params['postId']
    if(this.postId){
      this._postService.fetchPostById(this.postId).subscribe({
        next : data => {
          console.log(data)
          this.postObj = data
        }
      })
    }
  }

  onRemove(){
    let matConfig = new MatDialogConfig()
    matConfig.width = '350px'
    matConfig.data = `Are you Sure You Want to Remove This Post with id <strong>${this.postId}</strong>?`
    matConfig.disableClose =true

    this._matDialog.open(GetConfirmComponent, matConfig).afterClosed().subscribe(res => {
      if(res){
        this._postService.removePost(this.postId).subscribe({
          next : data => {
            this._router.navigate(['posts'])
            this._snackBar.openSnackBar(`The Post Removed Successfully!!!`)
          }
        })
      }
    })
  }

}
