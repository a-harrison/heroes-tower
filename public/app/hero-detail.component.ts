import { Component, OnInit } from 'angular2/core';
import { Hero } from './hero';
import { RouteParams } from 'angular2/router';
import { HeroService } from './hero.service';

@Component({
  selector: 'my-hero-detail',
  templateUrl: 'app/hero-detail.component.html'
})

export class HeroDetailComponent{
  hero : Hero;

  constructor(
    private _heroService : HeroService,
    private _routeParams : RouteParams) {
  }

  ngOnInit() {
    let _id = +this._routeParams.get('_id');
    this._heroService.getHero(_id)
      .then(hero => this.hero = hero);
  }

  goBack() {
    window.history.back();
  }
}
