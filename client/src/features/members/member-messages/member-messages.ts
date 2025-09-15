import { Component, effect, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../core/services/message-service';
import { MemberService } from '../../../core/services/member-service';
import { Message } from '../../../types/message';
import { DatePipe } from '@angular/common';
import { TimeAgoPipe } from '../../../core/pipes/time-ago-pipe';
import { FormsModule } from '@angular/forms';
import { PresenceService } from '../../../core/services/presence-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe, TimeAgoPipe, FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit, OnDestroy {
  @ViewChild('messageEndRef') messageEndRef!: ElementRef;
  protected messageService = inject(MessageService);
  private memberService = inject(MemberService);
  protected presenceService = inject(PresenceService);
  private router = inject(ActivatedRoute);
  protected messageContent = signal('');

  constructor() {
    effect(() => {
      const currentMessages = this.messageService.messageThread();
      if (currentMessages.length > 0) {
        this.scrollToBottom();
      }
    })
  }

  ngOnInit(): void {
    this.router.parent?.paramMap.subscribe({
      next: params => {
        const otherUserId = params.get('id');
        if (!otherUserId) throw new Error('Cannot connect to Hub');
        this.messageService.createHubConnection(otherUserId);
      }
    })
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  sendMessage() {
    const recipientId = this.memberService.member()?.id;
    if (!recipientId) return;
    this.messageService.sendMessage(recipientId, this.messageContent())?.then(() => {
      this.messageContent.set('');
    })
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageEndRef) {
        this.messageEndRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
      }
    })

  }
}
