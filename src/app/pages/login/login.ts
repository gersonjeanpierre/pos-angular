import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GalleryService } from '@core/services/locations/gallery-service';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { SelectModule } from 'primeng/select';
import { Gallery } from '@core/models/interfaces/gallery.model';
import { CardModule } from 'primeng/card';
import { LoginForm } from '@core/models/interfaces/login-form.model';
import { FormModulesImport } from '@shared/modules/import-form';
import { AuthService } from '@core/services/auth/auth-service';

@Component({
  selector: 'app-login',
  imports: [
    ButtonModule,
    IftaLabelModule,
    InputTextModule,
    TreeSelectModule,
    SelectModule,
    CardModule,
    FormModulesImport,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})


export class Login {
  // I N J E C C I O N E S
  private router = inject(Router);
  private authService = inject<AuthService>(AuthService);
  private galleryService = inject<GalleryService>(GalleryService);

  private formBuilder = inject<FormBuilder>(FormBuilder);
  private cdr = inject(ChangeDetectorRef)

  groupedGalleries: any[] = [];
  selectedStand: string | undefined;

  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
    standId: ['']
  });

  ngOnInit() {
    this.galleryService.getAllGalleries().subscribe((data) => {
      this.groupedGalleries = this.groupedDataForSelect(data as Gallery[]);
      this.cdr.detectChanges();
    });
  }

  loginUser() {
    const formLoginValue = this.loginForm.value;
    const loginPayload: LoginForm = {
      email: formLoginValue.email ?? '',
      password: formLoginValue.password ?? '',
      standId: formLoginValue.standId ?? ''
    }

    this.authService.login(loginPayload).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
        this.router.navigate(['/productos']);
      },
      error: (error) => {
        console.error('Login failed', error.statusText);
        alert(error.statusText)
      }
    })

  }

  groupedDataForSelect(data: Gallery[]) {
    return data.map(gallery => ({
      label: gallery.name,
      value: gallery.name,
      id: gallery.id,
      items: gallery.stands.map(stand => ({
        label: stand.name,
        value: stand.id
      }))
    }))
  }

}
