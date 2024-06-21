import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../book.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  bookId: number = 0;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      publishedDate: ['', Validators.required],
      isbn: ['', Validators.required],
      summary: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookId = id ? +id : 0;
    if (this.bookId  || this.bookId!=0) {
      this.bookService.getBook(this.bookId).subscribe((data) => {
        this.bookForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      if (this.bookId) {
        console.log(this.bookId);
        const formData = { ...this.bookForm.value };
        this.bookService.updateBook(this.bookId, this.bookForm.value).subscribe(() => {
          formData.id = this.bookId;
          this.toastr.success('Book updated successfully', 'Success');
          this.router.navigate(['/books']);
        }, (error) => {
          this.toastr.error('Error updating book', 'Error');
          console.error('Error updating book:', error);
        });
      } else {
        this.bookService.createBook(this.bookForm.value).subscribe(() => {
          this.toastr.success('Book created successfully', 'Success');
          this.router.navigate(['/books']);
        }, (error) => {
          this.toastr.error('Error creating book', 'Error');
          console.error('Error creating book:', error);
        });
      }
    } else {
      this.toastr.warning('Please fill out all required fields', 'Warning');
    }
  }
}
