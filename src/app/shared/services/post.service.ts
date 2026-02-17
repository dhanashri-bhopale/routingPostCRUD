import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ipost } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private _httpClient : HttpClient
  ) { }

  BASE_URL : string = environment.BASE_URL
  POST_URL : string = `${this.BASE_URL}/posts.json`

  fetchPosts() : Observable<any>{
    return this._httpClient.get<any>(this.POST_URL).pipe(
      map(obj => {
        let postArr = []
        for (const key in obj) {
          postArr.unshift({...obj[key], postId : key})
        }
        return postArr
      })
    )
  }

  createPost(post: Ipost) : Observable<{name : string}>{
    return this._httpClient.post<any>(this.POST_URL, post)
  }

  fetchPostById(id : string) : Observable<Ipost>{
    let POST_URL = `${this.BASE_URL}/posts/${id}.json`
    return this._httpClient.get<Ipost>(POST_URL)
  }

  removePost(id : string) : Observable<any>{
    let REMOVE_URL = `${this.BASE_URL}/posts/${id}.json`
    return this._httpClient.delete(REMOVE_URL)
  }

  updatePost(post : Ipost) : Observable<Ipost>{
    let UPDATED_URL = `${this.BASE_URL}/posts/${post.postId}.json`
    return this._httpClient.patch<Ipost>(UPDATED_URL, post)
  }
}
