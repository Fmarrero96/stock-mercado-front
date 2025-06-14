import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IAuthService } from '../interfaces/auth.interface';
import { MockAuthService } from '../services/mock-auth.service';
import { RealAuthService } from '../services/real-auth.service';
import { AuthService } from '../auth.service';

export const AUTH_SERVICE_PROVIDER: Provider = {
  provide: 'AuthService',
  useClass: AuthService
}; 