import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class HeroService {

  private heroesUrl = "http://localhost:8080/hero/api/heroes";

  httpOptions = {
    headers: new HttpHeaders({"Content-Type": "application/json"})
  };

  constructor(
    private httpClient: HttpClient,
    private messageService: MessageService) {
  }

  getHeroes(): Observable<Hero[]> {
    return this.httpClient.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.httpClient.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id =${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.httpClient.put<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_ => this.log(`updated hero id = ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  addHero(hero: Hero) {
    return this.httpClient.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap( (hero: Hero) => this.log(`added hero with id=${hero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }

  deleteHero(hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}/${hero.id}`;
    return this.httpClient.delete<Hero>(url, this.httpOptions)
      .pipe(
        tap((hero: Hero) => this.log(`deleted hero id = ${hero.id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if(!term.trim()) {
      return of([]);
    }
    const url = `http://localhost:8080/hero/api/searchHeroes?name=${term}`;
    return this.httpClient.get<Hero[]>(url)
      .pipe(
        tap( _ => this.log(`found heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
