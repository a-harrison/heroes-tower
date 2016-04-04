import { Injectable } from 'angular2/core';
import { Http, Response, Headers, RequestOptions } from 'angular2/http';
import { HEROES } from './mock-heroes';
import { Hero } from './hero';
import { Observable } from 'rxjs/Observable';

@Injectable()

export class HeroService{
  constructor(private http: Http) {}

  private _heroesUrl = '/api/heroes';
  private _heroUrl = '/api/hero/';

  // Using REST API
  getHero(id : number) {
    return this.http.get(this._heroUrl + id)
              .toPromise()
              .then( res => <Hero> res.json(), this.handleError)
              .then( data => { console.log(data); return data;});
  }

  getHeroes() {
    return this.http.get(this._heroesUrl)
                    .toPromise()
                    .then( res => <Hero[]> res.json(), this.handleError);
  }

  addHero(name:string) : Promise<Hero> {
    let body = JSON.stringify({name});
    let headers = new Headers({ 'Content-type' : 'application/json'});
    let options = new RequestOptions({ headers : headers });

    return this.http.post(this._heroesUrl, body, options)
                    .toPromise()
                    .then( res => <Hero> res.json())
                    .catch(this.handleError);
  }


  private handleError(error:any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    return Promise.reject(error.message || error.json().error || 'Server error');
  }

  // Using Mock heroes.
  // getHero(id : number) {
  //   return Promise.resolve(HEROES).then(
  //     heroes => heroes.filter(hero => hero.id == id)[0]
  //   );
  // }
  //
  // getHeroes() {
  //   return Promise.resolve(HEROES);
  // }
  //
  // getHeroesSlowly() {
  //   return new Promise<Hero[]>(resolve =>
  //     setTimeout(()=>resolve(HEROES), 2000) // 2 seconds
  //   );
  // }
}
