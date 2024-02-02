import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent {
  @Input() comment;

  formatDate(createdAt) {
    const currentDate = new Date();
    const createdAtDate = new Date(createdAt);

    if (isNaN(createdAtDate.getTime())) {
      // Handle invalid date string
      return 'Invalid date';
    }

    const diffMilliseconds: number = currentDate.getTime() - createdAtDate.getTime();
    const diffSeconds: number = Math.floor(diffMilliseconds / 1000);
    const diffMinutes: number = Math.floor(diffSeconds / 60);
    const diffHours: number = Math.floor(diffMinutes / 60);
    const diffDays: number = Math.floor(diffHours / 24);
    const diffMonths: number = Math.floor(diffDays / 30);

    if (diffMonths > 0) {
      return `${diffMonths}mo`;
    } else if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return `${diffSeconds}s`;
    }
  }

}
