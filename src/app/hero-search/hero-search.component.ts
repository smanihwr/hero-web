import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/internal/Observable";
import { Hero } from "../hero";
import { Subject } from "rxjs/internal/Subject";
import { HeroService } from "../hero.service";
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;

  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  // Push a serach term into the Observable stream
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }


  logger(value: string): void  {
    console.log(value);
  }

}
