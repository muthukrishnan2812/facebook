declare var google: any;
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '581692212008-8i4un90its3h23phtegpftvfvis3qqdi.apps.googleusercontent.com', // Replace with your actual Client ID
      callback: (response: any) => {
        this.handleGoogleResponse(response); // You'll define this function later
        console.log(response);
        
      }
    });
  }

  handleGoogleResponse(response: any) {
    // Access user information from the response object
    const accessToken = response.credential; // Assuming the access token is in 'credential'
    const profileObj = response.profileObj; // Assuming user profile info is in 'profileObj'
  }

  signInWithGoogle() {
    google.accounts.id.prompt().then(()=>{              // Trigger the Google Sign-In popup
      google.accounts.id.renderButton(document.getElementById('google-btn'), {
        theme: 'filled_blue',
        size: 'large',
        shape: 'rectangele', // Should be 'rectangle' instead of 'rectangele'
        width: 500
      });
    }) 
  }

}

