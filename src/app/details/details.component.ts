import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { AppService } from '../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  rating: any;
  value: string;
  fav: string;
  data: any;

  constructor(private route: ActivatedRoute, private appService: AppService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    console.log("teste");

    this.route.paramMap.subscribe((params: ParamMap) => {   
      this.value = params.get('value');
      this.fav = params.get('fav');
      this.refresh();
    });

    this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/2.Logos/logo.svg'));
    this.matIconRegistry.addSvgIcon('arrow-grey', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/1.Icons/icon-arrow-grey.svg'));
    this.matIconRegistry.addSvgIcon('logo-imdb', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/2.Logos/logo-imdb.svg'));
    this.matIconRegistry.addSvgIcon('logo-rotten-tomatoes', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/2.Logos/logo-rotten-tomatoes.svg'));
    this.matIconRegistry.addSvgIcon('heart-grey', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/1.Icons/icon-heart-grey.svg'));
    this.matIconRegistry.addSvgIcon('heart-full', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/1.Icons/icon-heart-full.svg'));
  }

  addFav(data, value){
    data.isFav = value;  
  }

  refresh() {
    this.appService.getDetails(this.value).subscribe(data => {      
      this.data = data;
      this.data.isFav = this.fav
      this.rating = data.Ratings.slice();
      this.rating.imdb = this.rating[0];
      this.rating.rotten = this.rating[1]          
    })
  }

}
