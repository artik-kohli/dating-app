import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterCreds } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected creds = {} as RegisterCreds;
  protected confirmPassword = signal<string>('');
  private accountService = inject(AccountService);
  cancelRegister = output<boolean>();

  register() {
    console.log('Registration Initiated 🔐');
    console.log(this.creds);
    this.accountService.register(this.creds).subscribe({
      next: response => {
        console.log(response);
        this.cancel();
      },
      error: error => console.log(error),
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
