import { Component, OnInit } from '@angular/core';
import { TodosService } from 'src/app/service/todos.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {
  todoForm: FormGroup;
  todos: any;
  editMode: boolean;
  selected = [];
  isSelected: boolean;
  min: Date;
  dt1: Date;
  todoId: number;

  constructor(private todoService: TodosService, private datePipe: DatePipe) {
    this.todoForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      timeOfTheEvent: new FormControl('', [Validators.required])
    });
    this.editMode = false;
    this.isSelected = false;
  }

  ngOnInit() {
    this.getTodosList();
    this.isSelected = false;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    this.min = new Date(currentDate);
  }

  // Get All Todo List
  getTodosList() {
    this.todoService.getAllTodos().subscribe((result: any) => {
      this.todos = result.result;
    });
  }

  // Add new Todo
  addTodo() {
    const todo = {
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      timeOfTheEvent: this.datePipe.transform(new Date(this.todoForm.value.timeOfTheEvent), 'yyyy-MM-dd hh:mm:ss a')
    };
    this.todoService.saveTodos(todo).subscribe((data: any) => {
      if (data.status === 'SUCCESS') {
        Swal.fire({
          type: 'success',
          title: 'Successfuly Save...',
          timer: 1500,
          showConfirmButton: false
        });
        this.getTodosList();
      } else {
        Swal.fire({
          type: 'error',
          title: 'Failed',
          timer: 1500,
          showConfirmButton: false
        });
      }
      this.todoForm.reset();
    });
  }

  // Edit Todo
  editTodo(todoId: number) {
    this.editMode = true;
    this.todos.filter((todo) => todo.todoId === todoId).map((todoDetails) => {
      this.todoId = todoDetails.todoId;
      this.todoForm = new FormGroup({
        title: new FormControl(todoDetails.title, [Validators.required]),
        description: new FormControl(todoDetails.description, [Validators.required]),
        timeOfTheEvent: new FormControl(new Date(todoDetails.timeOfTheEvent), Validators.required)
      });
    });
  }

  // Update Todo
  updateTodo() {
    const todo = {
      todoId: this.todoId,
      title: this.todoForm.value.title,
      description: this.todoForm.value.description,
      timeOfTheEvent: this.datePipe.transform(new Date(this.todoForm.value.timeOfTheEvent), 'yyyy-MM-dd hh:mm:ss a')
    };
    this.todoService.updateTodos(todo).subscribe((updated: any) => {
      if (updated.status === 'SUCCESS') {
        Swal.fire({
          type: 'success',
          title: 'Successfuly Updated...',
          timer: 1500,
          showConfirmButton: false
        });
        this.getTodosList();
      } else {
        Swal.fire({
          type: 'error',
          title: 'Failed',
          timer: 1500,
          showConfirmButton: false
        });
      }
      this.editMode = false;
      this.getTodosList();
      this.todoForm.reset();
    });
  }

  // Delete Todo
  deleteTodo(todoId: number) {
    this.todoService.deleteTodos(todoId).subscribe((data: any) => {
      Swal.fire({
        type: 'success',
        title: 'Successfuly Deleted...',
        timer: 1500,
        showConfirmButton: false
      });
      this.getTodosList();
    });
  }

  // Checker
  checkout(todoId, event) {
    if (event.target.checked) {
      this.selected.push(todoId);
      if (this.selected.length > 0) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    } else {
      this.selected.splice(this.selected.findIndex((i) => i == todoId), 1);
      if (this.selected.length > 0) {
        this.isSelected = true;
      } else {
        this.isSelected = false;
      }
    }
  }

  // Multiple Delete
  multipleDelete() {
    const multipleDelete = {
      deleteMultiple: this.selected
    }

    this.todoService.deleteMultiple(multipleDelete).subscribe((deleteTodos: any) => {
      if (deleteTodos.status === 'SUCCESS') {
        Swal.fire({
          type: 'success',
          title: 'Successfuly Deleted...',
          timer: 1500,
          showConfirmButton: false
        });
        this.selected = [];
        this.getTodosList();
      } else {
        Swal.fire({
          type: 'error',
          title: 'Failed',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }

  // Reset Form
  reset() {
    this.editMode = false;
  }

}
