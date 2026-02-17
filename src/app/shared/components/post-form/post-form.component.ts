import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Ipost } from '../../models/post';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {
  postForm !: FormGroup
  isInEditMode : boolean = false
  postId !: string

  constructor(
    private _postService : PostService,
    private _router : Router,
    private _routes : ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.createPostForm()
    this.patchPostData()
  }

  createPostForm(){
    this.postForm = new FormGroup({
      title : new FormControl(null, [Validators.required]),
      content : new FormControl(null, [Validators.required]),
    })
  }

  get title(){
    return this.postForm.get(['title']) as FormControl
  }

  get content(){
    return this.postForm.get(['content']) as FormControl
  }

  onAddPost(){
    if(this.postForm.valid){
      let postObj : Ipost = {...this.postForm.value}
      this._postService.createPost(postObj).subscribe({
        next : data => {
          console.log(data)
          this.postForm.reset()
          this._router.navigate(['posts'])
        },error : err => {
          console.log(err);
          
        }
      })
    }
  }

  patchPostData(){
    this.postId = this._routes.snapshot.paramMap.get('postId')!
    console.log(this.postId)
    if(this.postId){
      this.isInEditMode = true
      this._postService.fetchPostById(this.postId).subscribe({
        next: data => {
          this.postForm.patchValue(data)
        }
      })
    }
  }

  onUpdate(){
    if(this.postForm.valid){
      let updatedObj : Ipost = {...this.postForm.value, postId : this.postId}
      this._postService.updatePost(updatedObj).subscribe({
        next: data => {
          console.log(data);
          this._router.navigate(['posts'])
        },error : err => {
          console.log(err);
          
        }
      })
    }
  }

}
