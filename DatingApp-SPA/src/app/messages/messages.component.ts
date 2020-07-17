import { AlertifyService } from './../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { Message } from './../_models/message';
import { Pagination, PaginatedResults } from './../_models/pagination';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';

  constructor(private userService: UserService,
              private authService: AuthService, private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      // tslint:disable-next-line: no-string-literal
      this.messages = data['messages'].result;
      // tslint:disable-next-line: no-string-literal
      this.pagination = data['messages'].pagination;
    })
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.nameid,
       this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
       .subscribe((res: PaginatedResults<Message[]>) => {
         this.messages = res.result;
         this.pagination = res.pagination;
       }, error => {
         this.alertify.error(error);
       });
  }

  deleteMessage(id: number) {
    this.alertify.confirm('Are you sure you want to delete message', () => {
      this.userService.deleteMessage(id, this.authService.decodedToken.nameid).subscribe(() => {
        this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
        this.alertify.success('message has been deleted')
      }, error => {
        this.alertify.error('Failed to delete the message');
      });
      });
    }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
