import { Injectable } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
 
import { map } from 'rxjs/operators';  
   
@Injectable({ 
  providedIn: 'root' 
}) 
export class UserService {  
    apiRest = 'https://localhost:4000/api/auth';  
   
    constructor(private http: HttpClient) {  
    }  
   
    signIn(userLogin: any) {  
        return this.http.post<any>(`${this.apiRest}`, userLogin)  
            .pipe(map(res => res));  
    }  
 
    setToken(token: string) { 
      // this.cookies.set("token", token); 
      sessionStorage.setItem('token', token); 
    } 
 
    getToken() { 
        // return this.cookies.get("token"); 
        return sessionStorage.getItem('token'); 
    } 
 
    getUser() { 
        return this.http.get<any>(`${this.apiRest}/me`) 
            .pipe(map(res => res)); 
    } 
 
}