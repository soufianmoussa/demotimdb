import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface ForumReply {
  id: number;
  author: string;
  content: string;
  date: Date;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  date: Date;
  likes: number;
  replies: number;
  replyList?: ForumReply[];
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
  replyForms: { [postId: number]: FormGroup } = {};

  constructor(
    private fb: FormBuilder,
    public auth: AuthService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(20)]]
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    const storedPosts = localStorage.getItem('forum_posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts).map((post: any) => ({
        ...post,
        date: new Date(post.date),
        replyList: post.replyList ? post.replyList.map((r: any) => ({ ...r, date: new Date(r.date) })) : [],
      }));
    } else {
      // Initialize with some sample posts
      this.posts = [
        {
          id: 1,
          title: 'What\'s your favorite movie of 2024 so far?',
          content: 'I\'ve watched several great movies this year, but I\'m curious to hear your opinions. What\'s been your standout favorite?',
          author: 'MovieBuff',
          date: new Date(),
          likes: 15,
          replies: 0,
          replyList: []
        },
        {
          id: 2,
          title: 'Upcoming superhero movies discussion',
          content: 'Let\'s discuss the upcoming superhero movie releases. Which ones are you most excited about?',
          author: 'ComicFan',
          date: new Date(Date.now() - 86400000), // 1 day ago
          likes: 32,
          replies: 0,
          replyList: []
        }
      ];
      this.savePosts();
    }
    // Initialize reply forms for each post
    this.posts.forEach(post => {
      this.replyForms[post.id] = this.fb.group({
        content: ['', [Validators.required, Validators.minLength(2)]]
      });
    });
  }

  savePosts() {
    localStorage.setItem('forum_posts', JSON.stringify(this.posts));
  }

  onSubmitPost() {
    if (this.postForm.valid) {
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser) {
        this.error = 'Please log in to create a post.';
        return;
      }

      const newPost: ForumPost = {
        id: Date.now(), // Use timestamp as unique ID
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        author: currentUser,
        date: new Date(),
        likes: 0,
        replies: 0
      };

      this.posts.unshift(newPost);
      this.savePosts();
      this.postForm.reset();
      this.error = null;
    }
  }

  likePost(post: ForumPost) {
    post.likes++;
    this.savePosts();
  }

  onSubmitReply(post: ForumPost) {
    const form = this.replyForms[post.id];
    if (form.valid) {
      const currentUser = this.auth.getCurrentUser();
      if (!currentUser) {
        this.error = 'Please log in to reply.';
        return;
      }
      const newReply: ForumReply = {
        id: Date.now(),
        author: currentUser,
        content: form.value.content,
        date: new Date()
      };
      post.replyList = post.replyList || [];
      post.replyList.push(newReply);
      post.replies = post.replyList.length;
      this.savePosts();
      form.reset();
      this.error = null;
    }
  }
} 