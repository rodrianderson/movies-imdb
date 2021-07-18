import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

import { AppService } from '../app.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  history_key = 'search_history';
  movies: any[] = [];
  searchFormControl = new FormControl();
  value: any;
  imdbID: any;
  fav: any;
  empty = null;
  isDone = true;

  constructor(private route: ActivatedRoute, private router: Router, private appService: AppService, private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {  
     this.imdbID = params.get('imdbID');
     this.fav = params.get('fav'); 
     this.refreshData(this.imdbID, this.fav);
    });

    this.showFavorite();
  
    // Event for change new values input
    this.searchFormControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(newValue => {
        this.isDone = false;
        this.value = newValue;
        this.refresh();
      }
    );

    this.matIconRegistry.addSvgIcon('logo', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/2.Logos/logo.svg'));
    this.matIconRegistry.addSvgIcon('magnifier-grey', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/1.Icons/icon-magnifier-grey.svg'));
    this.matIconRegistry.addSvgIcon('empty', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/2.Illustrations/empty.svg'));  
    this.matIconRegistry.addSvgIcon('heart-white', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/1.Icons/icon-heart-white.svg'));  
    this.matIconRegistry.addSvgIcon('heart-full', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/1.Icons/icon-heart-full.svg'));  
  }  

  getMyStyles(addfavorite) {
    let myStyles = {
      'background-image': addfavorite ? 'url(assets/1.Icons/icon-heart-full.svg)' : 'url(assets/1.Icons/icon-heart-white.svg)' ,
      'width': '25px',
       'height': '25px',
       'position':'absolute',
        'top': '7px',
        'left': '129px'
   };
   return myStyles;
  }

  refresh() {
    if(this.value.length > 3) {
      this.appService.getMovies(this.value).subscribe(data => {
        if (data.Response !== 'False') {
          const items = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) { 
              if(data[key].length < 0){
                data[key].forEach(function(item, index, object) {              
                  object[index].isFav = false;              
                });       
              }                
              items.push(data[key]);            
            }
          }
          this.empty = false;
          this.movies = items[0];
          this.isDone = true;
        } else {
          this.isDone = true;
          this.movies.length = null;
          this.empty = true;
          if (this.value === '') {
            this.empty = true;
          }
        }
      })
    } 

    if(this.value.length == 0) {
      location.reload()
    }
  }

  showFavorite() {
    try {
      const history = JSON.parse(localStorage.getItem(this.history_key))
      this.movies = history;
    } catch (e) {
      console.log(e)
    }
  }

  gotoDetails(data) {
    var isFav = data.isFav ? data.isFav : false;
    this.router.navigate(['/details', data.imdbID, isFav]);
  }

  addFavorite(data, index) {
    try {    
      let history = JSON.parse(localStorage.getItem(this.history_key))      
      if(data.isFav == true){
        history.push(data);
      } else {
        history.splice(index, 1);
        location.reload();
      }
      localStorage.setItem(this.history_key, JSON.stringify(history));           
    } catch (e) {
      if(data.isFav = true){
        localStorage.setItem(this.history_key, JSON.stringify([data]));
      } else {
        location.reload();
      }      
      console.log(e)
    }
  }
  
  // Compare for item of details 
  refreshData(imdb, fav) {
    try {    
      let history = JSON.parse(localStorage.getItem(this.history_key))      
      history.forEach(function(item, i){
        if(history[i].imdbID == imdb){
          if(fav == "false")   {
            history.splice(i, 1);
          } else{
            history[i].isFav = fav;
          }          
        }        
      });     
      
      localStorage.setItem(this.history_key, JSON.stringify(history));           
    } catch (e) {      
      console.log(e)
    }
  }
}
