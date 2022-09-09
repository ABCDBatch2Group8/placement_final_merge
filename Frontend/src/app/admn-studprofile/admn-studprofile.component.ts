import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdmnAuthService } from '../admn-auth.service';
import { Router } from '@angular/router';
import { HeaderService } from '../header.service';
import Swal from 'sweetalert2'
export class Offers{
  constructor(
      public company: String,
      public designation: String,
      public offer_date: String,
      public ctc_per_annum: String
  ){}
}

@Component({
  selector: 'app-admn-studprofile',
  templateUrl: './admn-studprofile.component.html',
  styleUrls: ['./admn-studprofile.component.css']
})
export class AdmnStudprofileComponent implements OnInit {

  servermessage="";
  selectmessage="";

  offers:Offers[]=[];
  studentView:any;
  offerView:any;
  title = 'Employers';
  emp:any;

  offer={
    company:'',
     designation:'',
     offer_date:'',
     ctc_per_annum:''
  }
     company!: String
     designation!: String
     offer_date!: String
     ctc_per_annum!: String
  
     
  
  constructor(
    private http:HttpClient,
    private admn:AdmnAuthService,
    private router:Router,
    private headservice : HeaderService
  ) { }

  ngOnInit(): void {
    this.headservice.setMenu("general");
    let studid=localStorage.getItem('candidateID');
    this.admn.getCandidate(studid).subscribe((data)=>{
      this.studentView=JSON.parse(JSON.stringify(data));

      this.admn.getEmployers().subscribe(data=>{
        this.emp=JSON.parse(JSON.stringify(data))

        this.admn.getoffers(studid).subscribe((values)=>{
          this.offerView=JSON.parse(JSON.stringify(values))
        })
      })
    })
  }
  
  AddOffer(){
   const submitedoffer={
      candidateid:this.studentView._id,
      company:this.offer.company,
      designation:this.offer.designation,
      offer_date:this.offer.offer_date,
      ctc_per_annum:this.offer.ctc_per_annum
    }
    if(submitedoffer.company=='Select a Company'){

alert('enter')
      this.selectmessage="Please select title of company"
    }
    else{
      alert(submitedoffer.company)
      alert('success')
      this.admn.newOffer(submitedoffer).subscribe(res=>{
        let data=JSON.parse(JSON.stringify(res));
        if(JSON.parse(JSON.stringify(data.status)) ==="succes")
        {
          Swal.fire({
            toast: true,
            color: 'green',
            background: 'white',
            icon: 'success',
            title: 'Offer send Successfully.',
            position: 'center',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mousecenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
        }
        else{
          this.servermessage=JSON.parse( JSON.stringify(data.message)) ;
        }

    })
    
    }
      
    }

}
