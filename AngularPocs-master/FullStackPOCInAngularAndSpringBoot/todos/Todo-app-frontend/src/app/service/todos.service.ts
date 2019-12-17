import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TodosService {

  constructor(private http: HttpClient) { }
  // Get All Todos
  getAllTodos() {
    return this.http.get(`${environment.baseUrl}getAllTodos`);
  }

  // To save the Todo Object
  saveTodos(todo: any) {
    return this.http.post(`${environment.baseUrl}saveTodos`, todo);
  }

  // Update Todo
  updateTodos(todo: any) {
    return this.http.put(`${environment.baseUrl}updateTodos`, todo);
  }

  // Delete Todo
  deleteTodos(todoId: number) {
    return this.http.delete(`${environment.baseUrl}deleteTodos/${todoId}`);
  }

  // Delete Multiple
  deleteMultiple(deleteTodos) {
    return this.http.post(`${environment.baseUrl}deleteMultipleTodos`, deleteTodos);
  }

}

