import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  likes: number;
  replies: number;
}

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css'],
  standalone: false
})
export class ForumComponent implements OnInit {
  posts: ForumPost[] = [];
  postForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit() {
    // TODO: Fetch forum posts from backend
    // For now, using dummy data
    this.posts = [
      {
        id: 1,
        title: 'What\'s your favorite movie of 2024 so far?',
        content: 'I\'ve watched several great movies this year, but I\'m curious to hear your opinions. What\'s been your standout favorite?',
        author: 'MovieBuff',
        date: new Date(),
        likes: 15,
        replies: 23
      },
      {
        id: 2,
        title: 'Upcoming superhero movies discussion',
        content: 'Let\'s discuss the upcoming superhero movie releases. Which ones are you most excited about?',
        author: 'ComicFan',
        date: new Date(Date.now() - 86400000), // 1 day ago
        likes: 32,
        replies: 45
      }
    ];
  }

  onSubmitPost() {
    if (this.postForm.valid) {
      const newPost: ForumPost = {
        id: this.posts.length + 1,
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        author: 'CurrentUser', // TODO: Get from auth service
        date: new Date(),
        likes: 0,
        replies: 0
      };

      this.posts.unshift(newPost);
      this.postForm.reset();
    }
  }

  likePost(post: ForumPost) {
    post.likes++;
  }
} 